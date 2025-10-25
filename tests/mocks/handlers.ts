// tests/mocks/handlers.ts
// MSW handlers pour mocker les API calls

import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock /api/anchor
  http.post('/api/anchor', async ({ request }) => {
    const body = (await request.json()) as any;
    
    if (!body?.hash || !body?.fileName) {
      return HttpResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }
    
    return HttpResponse.json({
      ok: true,
      txHash: '0x' + '0'.repeat(64),
      network: 'mock',
      author: '0x' + '0'.repeat(40),
      timestamp: Math.floor(Date.now() / 1000),
    }, {
      headers: { 'X-Mode': 'mock' },
    });
  }),
  
  // Mock /api/verify
  http.post('/api/verify', async ({ request }) => {
    const body = (await request.json()) as any;
    
    if (!body?.hash) {
      return HttpResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }
    
    return HttpResponse.json({
      ok: true,
      anchored: true,
      blockNumber: 123456,
      network: 'mock',
      author: '0x' + '0'.repeat(40),
      timestamp: Math.floor(Date.now() / 1000),
    }, {
      headers: { 'X-Mode': 'mock' },
    });
  }),
  
  // Mock /api/certificates
  http.post('/api/certificates', async ({ request }) => {
    const body = (await request.json()) as any;
    
    if (!body?.hash || !body?.txHash || !body?.network || !body?.contractAddress) {
      return HttpResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      );
    }
    
    // Retourner un PDF mock
    const mockPdfBuffer = Buffer.from('%PDF-1.4\nMock PDF\n');
    
    return new HttpResponse(mockPdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="VeritasCertificate_MOCK.pdf"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }),
];
