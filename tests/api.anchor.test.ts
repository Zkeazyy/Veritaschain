import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Helpers
function makeRequest(body: unknown) {
  const req = new NextRequest('http://localhost/api/anchor', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  } as any);
  return req;
}

describe('/api/anchor', () => {
  beforeEach(() => {
    process.env.SEPOLIA_RPC_URL = 'http://localhost:8545';
    process.env.CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000001';
    process.env.PRIVATE_KEY = '0x' + '1'.repeat(64);
    vi.resetModules();
  });

  it('retourne 400 si hash invalide', async () => {
    const mod = await import('@/app/api/anchor/route');
    const req = makeRequest({ hash: '0x1234', fileName: 'a.pdf' });
    const res = await mod.POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Validation échouée|Hash/i);
  });

  it('succès avec mock writeContract + waitForTransactionReceipt + readContract', async () => {
    vi.mock('viem', async (orig) => {
      const actual = await orig();
      return {
        ...actual,
        createWalletClient: () => ({
          writeContract: vi.fn().mockResolvedValue('0x' + 'a'.repeat(64)),
        }),
        createPublicClient: () => ({
          waitForTransactionReceipt: vi.fn().mockResolvedValue({ blockNumber: 123n }),
          readContract: vi.fn().mockResolvedValue([
            '0x00000000000000000000000000000000000000ab',
            1710000000n,
          ]),
        }),
        http: actual.http,
        parseAbi: actual.parseAbi,
      } as any;
    });

    const mod = await import('@/app/api/anchor/route');
    const validHash = '0x' + 'b'.repeat(64);
    const req = makeRequest({ hash: validHash, fileName: 'doc.pdf' });
    const res = await mod.POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toMatchObject({ txHash: expect.stringMatching(/^0x[a-f0-9]{64}$/i), author: expect.any(String), timestamp: expect.any(Number) });
  });
});






