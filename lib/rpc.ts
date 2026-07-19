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
const DEFAULT_STATUS_CACHE_SECONDS = 60;
const DEFAULT_RPC_TIMEOUT_MS = 15000;
const NODE_HEALTH_MIN_LAG_SECONDS = 300;
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

type RpcPayload<T> = { error: { message?: string } | null; result: T };

// One HTTP round trip per call list. A JSON-RPC batch (array body) lets the
// 60-block trend window cost 2 requests instead of 122 — the old fan-out
// overran the node's RPC work queue and blew past the fetch timeout.
async function rpcSend<T>(calls: RpcCall[]): Promise<T[]> {
  const url = process.env.XPCHAIN_RPC_URL;
  const user = process.env.XPCHAIN_RPC_USER;
  const password = process.env.XPCHAIN_RPC_PASSWORD;

  if (!url || !user || !password) {
    throw new Error('Missing RPC environment variables.');
  }

  if (calls.length === 0) {
    return [];
  }

  const timeoutMs = Number(process.env.XPCHAIN_RPC_TIMEOUT_MS ?? DEFAULT_RPC_TIMEOUT_MS);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const label = calls.length === 1 ? calls[0].method : `${calls[0].method} x${calls.length}`;
  const isBatch = calls.length > 1;

  try {
    const auth = Buffer.from(`${user}:${password}`).toString('base64');
    const body = calls.map((call, index) => ({
      jsonrpc: '1.0',
      id: index,
      method: call.method,
      params: call.params ?? []
    }));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`
      },
      body: JSON.stringify(isBatch ? body : body[0]),
      cache: 'no-store',
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`RPC request failed: ${label} (HTTP ${response.status})`);
    }

    const payload = (await response.json()) as RpcPayload<T> | RpcPayload<T>[];
    const entries = Array.isArray(payload) ? payload : [payload];
    if (entries.length !== calls.length) {
      throw new Error(`RPC returned ${entries.length} results for ${calls.length} calls (${label})`);
    }

    // A batch keeps request order, but ids are authoritative — reorder by them.
    const ordered = Array.isArray(payload)
      ? calls.map((_, index) => {
          const match = (payload as Array<RpcPayload<T> & { id?: number }>).find((entry) => entry.id === index);
          if (!match) {
            throw new Error(`RPC batch missing result id=${index} (${label})`);
          }
          return match;
        })
      : entries;

    return ordered.map((entry, index) => {
      if (entry.error) {
        throw new Error(`RPC returned error for ${calls[index].method}: ${entry.error.message ?? 'unknown'}`);
      }
      return entry.result;
    });
  } catch (error) {
    // AbortError is a DOMException whose default log dump is ~30 lines of
    // error-code constants. Collapse it to something readable.
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`RPC timeout after ${timeoutMs}ms: ${label}`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function rpcRequest<T>(call: RpcCall): Promise<T> {
  const [result] = await rpcSend<T>([call]);
  return result;
}

async function getBlockTimesByHeights(heights: number[]): Promise<number[]> {
  const timeByHeight = new Map<number, number>();

  const hashes = await rpcSend<string>(heights.map((height) => ({ method: 'getblockhash', params: [height] })));

  const headers = await rpcSend<BlockSummary>(hashes.map((hash) => ({ method: 'getblockheader', params: [hash] })));

  heights.forEach((height, index) => {
    timeByHeight.set(height, headers[index].time);
  });

  return heights.map((height) => {
    const time = timeByHeight.get(height);
    if (!time) {
      throw new Error(`Missing block time at height=${height}`);
    }
    return time;
  });
}

async function getStatusFromRpc(): Promise<NetworkStatus> {
  const [blockHeight, networkInfo, peers, difficulty, stakingInfo] = await Promise.all([
    rpcRequest<number>({ method: 'getblockcount' }),
    rpcRequest<NetworkInfo>({ method: 'getnetworkinfo' }),
    rpcRequest<Array<unknown>>({ method: 'getpeerinfo' }),
    rpcRequest<number>({ method: 'getdifficulty' }).catch(() => null),
    rpcRequest<StakingInfo>({ method: 'getstakinginfo' }).catch(() => null)
  ]);

  const trendStartHeight = Math.max(0, blockHeight - TREND_WINDOW);
  const trendHeights = Array.from({ length: blockHeight - trendStartHeight + 1 }, (_, idx) => trendStartHeight + idx);
  const blockTimes = await getBlockTimesByHeights(trendHeights);

  const trendBlocks: BlockSummary[] = blockTimes.map((time) => ({ time }));
  const recentBlockIntervals = calculateIntervals(trendBlocks);

  const usableWindow = Math.max(1, Math.min(BLOCK_WINDOW, recentBlockIntervals.length));
  const avgSlice = recentBlockIntervals.slice(-usableWindow);
  const avgBlockTimeLast60 = Number((avgSlice.reduce((sum, sec) => sum + sec, 0) / usableWindow).toFixed(1));

  const latestTime = blockTimes[blockTimes.length - 1];
  const lastBlockTime = new Date(latestTime * 1000).toISOString();
  const lagSeconds = Math.max(0, Math.floor(Date.now() / 1000) - latestTime);
  const connections = networkInfo.connections ?? 0;
  const peersCount = peers.length;
  const healthThreshold = Math.max(NODE_HEALTH_MIN_LAG_SECONDS, avgBlockTimeLast60 * 4);

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

function buildFallbackStatusWithLog(error: unknown): NetworkStatus {
  try {
    const message = error instanceof Error ? error.message : String(error);
    console.error(
      `[network-status] fallback due to RPC error: ${message} | hasUrl=${Boolean(process.env.XPCHAIN_RPC_URL)} hasUser=${Boolean(process.env.XPCHAIN_RPC_USER)} hasPassword=${Boolean(process.env.XPCHAIN_RPC_PASSWORD)} cwd=${process.cwd()}`
    );
  } catch {
    // keep fallback path resilient
  }

  return {
    ...mockStatus,
    generatedAt: new Date().toISOString()
  };
}

const getCachedRpcStatus = unstable_cache(
  async () => getStatusFromRpc(),
  ['network-status'],
  { revalidate: NETWORK_STATUS_CACHE_SECONDS }
);

export async function getNetworkStatus(): Promise<NetworkStatus> {
  try {
    return await getCachedRpcStatus();
  } catch (error) {
    return buildFallbackStatusWithLog(error);
  }
}

export async function getLiveNetworkStatus(): Promise<NetworkStatus> {
  try {
    return await getStatusFromRpc();
  } catch (error) {
    return buildFallbackStatusWithLog(error);
  }
}
