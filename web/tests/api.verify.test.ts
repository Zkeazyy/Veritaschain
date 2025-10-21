import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import * as verifyRoute from '@/app/api/verify/route';

// Helpers pour construire un NextRequest mock
function makeRequest(body: unknown) {
  const req = new NextRequest('http://localhost/api/verify', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  } as any);
  return req;
}

describe('/api/verify', () => {
  beforeEach(() => {
    process.env.SEPOLIA_RPC_URL = 'http://localhost:8545';
    process.env.CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000001';
  });

  it('retourne 400 si hash invalide', async () => {
    const req = makeRequest({ hash: '0x1234' });
    const res = await verifyRoute.POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Validation échouée|Hash invalide/i);
  });

  it('retourne exists:false si verify renvoie 0x0 et timestamp 0', async () => {
    // Mock viem publicClient.readContract en renvoyant auteur=0x0 et ts=0
    vi.mock('viem', async (orig) => {
      const actual = await orig();
      return {
        ...actual,
        createPublicClient: () => ({
          readContract: vi.fn().mockResolvedValue([
            '0x0000000000000000000000000000000000000000',
            0n,
          ]),
        }),
        http: actual.http,
        parseAbi: actual.parseAbi,
      } as any;
    });

    const mod = await import('@/app/api/verify/route');
    const req = makeRequest({ hash: '0x' + '0'.repeat(64) });
    const res = await mod.POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ exists: false });
  });
});






