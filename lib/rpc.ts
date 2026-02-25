import { unstable_cache } from 'next/cache';

type RpcCall = {
  method: string;
  params?: unknown[];
};

type BlockSummary = {
  time: number;
};

type NetworkInfo = {
  connections?: number;
  protocolversion?: number;
};

type StakingInfo = {
  weight?: number;
  netstakeweight?: number;
  stakeweight?: number;
  netstakeWeight?: number;
};

export type NetworkStatus = {
  blockHeight: number;
  avgBlockTimeLast60: number;
  connections: number;
  peersCount: number;
  lastBlockTime: string;
  difficulty: number | null;
  networkName: string;
  protocolVersion: number | null;
  stakingParticipationEstimate: number | null;
  nodeHealth: 'healthy' | 'degraded';
  recentBlockIntervals: number[];
  dataSource: 'rpc' | 'fallback';
  generatedAt: string;
};

const BLOCK_WINDOW = 60;
const TREND_WINDOW = 60;
const DEFAULT_STATUS_CACHE_SECONDS = 300;
const parsedStatusCacheSeconds = Number(process.env.XPCHAIN_STATUS_CACHE_SECONDS ?? DEFAULT_STATUS_CACHE_SECONDS);
export const NETWORK_STATUS_CACHE_SECONDS = Math.max(
  30,
  Number.isFinite(parsedStatusCacheSeconds) ? parsedStatusCacheSeconds : DEFAULT_STATUS_CACHE_SECONDS
);

const mockStatus: NetworkStatus = {
  blockHeight: 2105234,
  avgBlockTimeLast60: 61.4,
  connections: 23,
  peersCount: 23,
  lastBlockTime: new Date().toISOString(),
  difficulty: 12457.73,
  networkName: process.env.XPCHAIN_NETWORK_NAME ?? 'mainnet',
  protocolVersion: 70921,
  stakingParticipationEstimate: 0.34,
  nodeHealth: 'healthy',
  dataSource: 'fallback',
  generatedAt: new Date().toISOString(),
  recentBlockIntervals: Array.from({ length: TREND_WINDOW }, (_, index) => 55 + ((index * 7) % 26))
};

function computeStakingEstimate(stakingInfo: StakingInfo | null): number | null {
  if (!stakingInfo) {
    return null;
  }

  const walletWeight = stakingInfo.weight ?? stakingInfo.stakeweight;
  const networkWeight = stakingInfo.netstakeweight ?? stakingInfo.netstakeWeight;

  if (!walletWeight || !networkWeight || networkWeight <= 0) {
    return null;
  }

  const estimate = walletWeight / networkWeight;
  if (!Number.isFinite(estimate) || estimate < 0) {
    return null;
  }

  return Math.min(estimate, 1);
}

function calculateIntervals(blocks: BlockSummary[]): number[] {
  if (blocks.length < 2) {
    return mockStatus.recentBlockIntervals;
  }

  const intervals: number[] = [];
  for (let i = 1; i < blocks.length; i += 1) {
    const delta = blocks[i].time - blocks[i - 1].time;
    intervals.push(delta > 0 ? delta : 60);
  }

  return intervals;
}

async function rpcRequest<T>({ method, params = [] }: RpcCall): Promise<T> {
  const url = process.env.XPCHAIN_RPC_URL;
  const user = process.env.XPCHAIN_RPC_USER;
  const password = process.env.XPCHAIN_RPC_PASSWORD;

  if (!url || !user || !password) {
    throw new Error('Missing RPC environment variables.');
  }

  const timeoutMs = Number(process.env.XPCHAIN_RPC_TIMEOUT_MS ?? '5000');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const auth = Buffer.from(`${user}:${password}`).toString('base64');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`
      },
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: method,
        method,
        params
      }),
      cache: 'no-store',
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`RPC request failed: ${method}`);
    }

    const payload = (await response.json()) as { error: unknown; result: T };
    if (payload.error) {
      throw new Error(`RPC returned error for ${method}`);
    }

    return payload.result;
  } finally {
    clearTimeout(timeout);
  }
}

async function getBlockByHeight(height: number): Promise<BlockSummary> {
  const hash = await rpcRequest<string>({ method: 'getblockhash', params: [height] });
  return rpcRequest<BlockSummary>({ method: 'getblock', params: [hash, 1] });
}

async function getStatusFromRpc(): Promise<NetworkStatus> {
  const [blockHeight, networkInfo, peers, difficulty, stakingInfo] = await Promise.all([
    rpcRequest<number>({ method: 'getblockcount' }),
    rpcRequest<NetworkInfo>({ method: 'getnetworkinfo' }),
    rpcRequest<Array<unknown>>({ method: 'getpeerinfo' }),
    rpcRequest<number>({ method: 'getdifficulty' }).catch(() => null),
    rpcRequest<StakingInfo>({ method: 'getstakinginfo' }).catch(() => null)
  ]);

  const usableWindow = Math.max(1, Math.min(BLOCK_WINDOW, blockHeight));
  const startHeight = blockHeight - usableWindow;

  const [latestBlock, startBlock] = await Promise.all([
    getBlockByHeight(blockHeight),
    getBlockByHeight(startHeight)
  ]);

  const avgBlockTimeLast60 =
    latestBlock.time > startBlock.time
      ? Number(((latestBlock.time - startBlock.time) / usableWindow).toFixed(1))
      : 60;

  const trendStartHeight = Math.max(0, blockHeight - TREND_WINDOW);
  const trendHeights = Array.from(
    { length: blockHeight - trendStartHeight + 1 },
    (_, idx) => trendStartHeight + idx
  );
  const trendBlocks = await Promise.all(trendHeights.map((height) => getBlockByHeight(height)));
  const recentBlockIntervals = calculateIntervals(trendBlocks);

  const lastBlockTime = new Date(latestBlock.time * 1000).toISOString();
  const lagSeconds = Math.max(0, Math.floor(Date.now() / 1000) - latestBlock.time);
  const connections = networkInfo.connections ?? 0;
  const peersCount = peers.length;
  const healthThreshold = Math.max(180, avgBlockTimeLast60 * 4);

  return {
    blockHeight,
    avgBlockTimeLast60,
    connections,
    peersCount,
    lastBlockTime,
    difficulty,
    networkName: process.env.XPCHAIN_NETWORK_NAME ?? 'mainnet',
    protocolVersion: networkInfo.protocolversion ?? null,
    stakingParticipationEstimate: computeStakingEstimate(stakingInfo),
    nodeHealth: connections > 0 && lagSeconds <= healthThreshold ? 'healthy' : 'degraded',
    recentBlockIntervals,
    dataSource: 'rpc',
    generatedAt: new Date().toISOString()
  };
}

async function getNetworkStatusUncached(): Promise<NetworkStatus> {
  try {
    return await getStatusFromRpc();
  } catch {
    return {
      ...mockStatus,
      generatedAt: new Date().toISOString()
    };
  }
}

const getCachedNetworkStatus = unstable_cache(
  async () => getNetworkStatusUncached(),
  ['network-status'],
  { revalidate: NETWORK_STATUS_CACHE_SECONDS }
);

export async function getNetworkStatus(): Promise<NetworkStatus> {
  return getCachedNetworkStatus();
}

export async function getLiveNetworkStatus(): Promise<NetworkStatus> {
  return getNetworkStatusUncached();
}
