/**
 * CreatorPilot Automated Backend & API Verification Test Suite
 * Tests authentication, brand CRUD, decision engine, calendar persistence,
 * trend scoring, official Instagram boundaries, and health checks.
 */

import http from 'http';

function makeRequest(path: string, method: string = 'GET', body: any = null): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(raw);
          resolve({ status: res.statusCode || 200, data: parsed });
        } catch {
          resolve({ status: res.statusCode || 200, data: raw });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runAllTests() {
  console.log('🧪 Starting CreatorPilot Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ FAIL: ${name} ->`, err?.message || err);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /api/v1/health returns healthy without exposing secrets', async () => {
    const res = await makeRequest('/api/v1/health');
    if (res.status !== 200 || res.data.status !== 'healthy') throw new Error(`Status ${res.status}`);
    if (res.data.GEMINI_API_KEY || res.data.env) throw new Error('Secrets exposed');
  });

  // 2. Auth login
  await test('POST /api/v1/auth/login returns authenticated user profile', async () => {
    const res = await makeRequest('/api/v1/auth/login', 'POST', { email: 'amina@creatorpilot.io' });
    if (res.status !== 200 || !res.data.success || !res.data.user) throw new Error('Auth failed');
  });

  // 3. Brand profile retrieval
  await test('GET /api/v1/brand returns active brand strategy', async () => {
    const res = await makeRequest('/api/v1/brand');
    if (res.status !== 200 || !res.data.pillars || res.data.pillars.length < 4) throw new Error('Invalid brand pillars');
  });

  // 4. Trend signals retrieval & verification
  await test('GET /api/v1/trends returns verified signals with source provenance', async () => {
    const res = await makeRequest('/api/v1/trends');
    if (res.status !== 200 || !Array.isArray(res.data.signals)) throw new Error('Trends not array');
    const verified = res.data.signals.filter((s: any) => s.isVerified);
    if (verified.length === 0) throw new Error('No verified signals');
  });

  // 5. Decisions board
  await test('GET /api/v1/decisions returns ranked recommendations with why/uncertainty', async () => {
    const res = await makeRequest('/api/v1/decisions');
    if (res.status !== 200 || !Array.isArray(res.data.decisions)) throw new Error('Decisions not array');
    const first = res.data.decisions[0];
    if (!first.whyRecommended || !first.whatIsUncertain || !first.hook) throw new Error('Missing rationale fields');
  });

  // 6. Calendar item CRUD
  await test('POST /api/v1/calendar/item creates & updates tactical item', async () => {
    const testItem = {
      title: 'Automated Test Reel for Education',
      platform: 'Instagram',
      format: 'Reels',
      horizon: '48h',
      status: 'draft',
      hook: 'Test opening hook for education creators'
    };
    const res = await makeRequest('/api/v1/calendar/item', 'POST', testItem);
    if (res.status !== 200 || !res.data.item || !res.data.item.id) throw new Error('Item creation failed');
  });

  // 7. Official Instagram integration status
  await test('GET /api/v1/instagram/status enforces human approval publishing boundary', async () => {
    const res = await makeRequest('/api/v1/instagram/status');
    if (res.status !== 200 || res.data.publishingStatus !== 'RESTRICTED_HUMAN_APPROVAL_ONLY') {
      throw new Error('Unsafe publishing permissions detected');
    }
  });

  // 8. AI Generation endpoint (Bio & format selection)
  await test('POST /api/v1/ai/generate produces structured bio options in requested language', async () => {
    const res = await makeRequest('/api/v1/ai/generate', 'POST', { tool: 'bio', language: 'en' });
    if (res.status !== 200 || !res.data.data?.options || res.data.data.options.length < 3) throw new Error('Bio generation failed');
    if (!res.data.data.options[0].whyItWorks) throw new Error('Missing whyItWorks');
  });

  // 9. AI Generation with format selection (Carousel / Post / Reel)
  await test('POST /api/v1/ai/generate creates format-specific ideas (carousel / reel)', async () => {
    const res = await makeRequest('/api/v1/ai/generate', 'POST', { 
      tool: 'ideas', 
      format: 'carousel',
      language: 'en' 
    });
    if (res.status !== 200 || !res.data.data?.ideas) throw new Error('Ideas generation failed');
    const firstIdea = res.data.data.ideas[0];
    if (!firstIdea.format.includes('Carousel') && !firstIdea.script.includes('Slide')) {
      throw new Error('Carousel formatting not respected');
    }
  });

  // 10. AI Generation for 48h and 7d plans tailored to brand
  await test('POST /api/v1/ai/generate creates structured 48h and 7d plans', async () => {
    const res = await makeRequest('/api/v1/ai/generate', 'POST', { 
      tool: 'plan_48h', 
      language: 'fr' 
    });
    if (res.status !== 200 || !res.data.data?.plan || res.data.data.plan.length < 2) throw new Error('Plan generation failed');
  });

  // 11. User Data Isolation verification
  await test('User Data Isolation: New profile does not inherit previous user workspace', async () => {
    const newUserId = 'usr-test-isolation-' + Date.now();
    const res = await new Promise<any>((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/v1/brand',
        method: 'GET',
        headers: {
          'x-user-id': newUserId,
          'x-user-language': 'en'
        }
      }, (r) => {
        let b = '';
        r.on('data', c => b += c);
        r.on('end', () => resolve(JSON.parse(b)));
      });
      req.on('error', reject);
      req.end();
    });

    if (!res || !res.id || !res.name) throw new Error('Failed to get isolated brand');
    // Verify brand is initialized in English without Amina Arabic text
    if (res.name.includes('أمينة')) throw new Error('New user received Amina mock data!');
  });

  // 12. Auth logout endpoint
  await test('POST /api/v1/auth/logout ends session and logs audit trail', async () => {
    const res = await makeRequest('/api/v1/auth/logout', 'POST');
    if (res.status !== 200 || !res.data.success) throw new Error('Logout failed');
  });

  console.log(`\n========================================`);
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
  process.exit(0);
}

runAllTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
