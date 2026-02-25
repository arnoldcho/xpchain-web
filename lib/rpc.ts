import { unstable_cache } from 'next/cache';
import fs from 'node:fs';
import path from 'node:path';

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
const DEFAULT_RPC_TIMEOUT_MS = 15000;
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

type RpcEnv = {
  url?: string;
  user?: string;
  password?: string;
};

let cachedRpcEnvFromFile: RpcEnv | null = null;

function loadRpcEnvFromDotEnvFile(): RpcEnv {
  if (cachedRpcEnvFromFile) {
    return cachedRpcEnvFromFile;
  }

  const candidateEnvPaths = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), 'xpchain-web', '.env'),
    path.join(process.cwd(), 'xpchain-web', '.env.local')
  ];
  const nextEnv: RpcEnv = {};

  for (const envPath of candidateEnvPaths) {
    try {
      if (!fs.existsSync(envPath)) {
        continue;
      }
      const raw = fs.readFileSync(envPath, 'utf8');
      for (const line of raw.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
          continue;
        }
        const eqIndex = trimmed.indexOf('=');
        const key = trimmed.slice(0, eqIndex).trim();
        const value = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, '');

        if (key === 'XPCHAIN_RPC_URL') nextEnv.url = value;
        if (key === 'XPCHAIN_RPC_USER') nextEnv.user = value;
        if (key === 'XPCHAIN_RPC_PASSWORD') nextEnv.password = value;
      }
      if (nextEnv.url && nextEnv.user && nextEnv.password) {
        break;
      }
    } catch {
      // try next candidate path
    }
  }

  cachedRpcEnvFromFile = nextEnv;
  return nextEnv;
}

function resolveRpcEnv(): RpcEnv {
  const fileEnv = loadRpcEnvFromDotEnvFile();
  return {
    url: process.env.XPCHAIN_RPC_URL ?? fileEnv.url,
    user: process.env.XPCHAIN_RPC_USER ?? fileEnv.user,
    password: process.env.XPCHAIN_RPC_PASSWORD ?? fileEnv.password
  };
}

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
  const { url, user, password } = resolveRpcEnv();

  if (!url || !user || !password) {
    throw new Error('Missing RPC environment variables.');
  }

  const timeoutMs = Number(process.env.XPCHAIN_RPC_TIMEOUT_MS ?? DEFAULT_RPC_TIMEOUT_MS);
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

function chunkArray<T>(items: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}

async function getBlockTimesByHeights(heights: number[]): Promise<number[]> {
  const hashByHeight = new Map<number, string>();
  const timeByHeight = new Map<number, number>();

  for (const chunk of chunkArray(heights, 12)) {
    const hashes = await Promise.all(chunk.map((height) => rpcRequest<string>({ method: 'getblockhash', params: [height] })));
    chunk.forEach((height, index) => {
      hashByHeight.set(height, hashes[index]);
    });
  }

  for (const chunk of chunkArray(heights, 12)) {
    const headers = await Promise.all(
      chunk.map((height) => {
        const hash = hashByHeight.get(height);
        if (!hash) {
          throw new Error(`Missing block hash at height=${height}`);
        }
        return rpcRequest<BlockSummary>({ method: 'getblockheader', params: [hash] });
      })
    );
    chunk.forEach((height, index) => {
      timeByHeight.set(height, headers[index].time);
    });
  }

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

function buildFallbackStatusWithLog(error: unknown): NetworkStatus {
  try {
    const message = error instanceof Error ? error.message : String(error);
    const { url, user, password } = resolveRpcEnv();
    console.error(
      `[network-status] fallback due to RPC error: ${message} | hasUrl=${Boolean(url)} hasUser=${Boolean(user)} hasPassword=${Boolean(password)} cwd=${process.cwd()}`
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
