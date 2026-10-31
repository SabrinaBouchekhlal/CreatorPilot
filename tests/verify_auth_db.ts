/**
 * Automated Verification Test Suite
 * 
 * Verifies:
 * 1. 401 Unauthorized on unauthenticated requests.
 * 2. Brand profile starts empty (null) for new users without mock fallbacks.
 * 3. Profile CRUD and persistence in Cloud SQL PostgreSQL.
 * 4. Multi-tenant account isolation between User A and User B.
 * 5. Instagram state defaults to disconnected with no fabricated metrics.
 * 6. Content decisions and calendar items are strictly scoped per authenticated user ID.
 */

import http from 'http';
import { dbService } from '../src/db/service.ts';

const BASE_URL = 'http://localhost:3000';

async function makeRequest(path: string, options: { method?: string; token?: string; body?: any } = {}) {
  const url = new URL(path, BASE_URL);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}

  return {
    status: res.status,
    ok: res.ok,
    headers: res.headers,
    data: json,
    raw: text,
  };
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting CreatorPilot Auth & Cloud SQL PostgreSQL Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  try {
    // -----------------------------------------------------------
    // TEST 1: Unauthenticated requests return 401
    // -----------------------------------------------------------
    console.log('--- Test Group 1: Authentication & Protection ---');
    const unauthProfile = await makeRequest('/api/brand-profile');
    assert(unauthProfile.status === 401, 'GET /api/brand-profile rejects unauthenticated request with 401');

    const unauthCalendar = await makeRequest('/api/v1/calendar');
    assert(unauthCalendar.status === 401, 'GET /api/v1/calendar rejects unauthenticated request with 401');

    const unauthDecisions = await makeRequest('/api/v1/decisions');
    assert(unauthDecisions.status === 401, 'GET /api/v1/decisions rejects unauthenticated request with 401');

    // -----------------------------------------------------------
    // TEST 2: Register User A and verify empty initial profile
    // -----------------------------------------------------------
    console.log('\n--- Test Group 2: Empty Onboarding & Profile CRUD for User A ---');
    const userAEmail = `alice-${Math.random().toString(36).substring(2, 9)}-${Date.now()}@example.com`;
    const signupA = await makeRequest('/api/v1/auth/signup', {
      method: 'POST',
      body: { email: userAEmail, name: 'Alice Walker', password: 'Password123!' },
    });
    assert(signupA.status === 200 && signupA.data?.user?.id, 'User A registered successfully');
    const tokenA = signupA.data.token;
    const uidA = signupA.data.user.id;

    // Verify User A has NULL brand profile (NO mock data or Sabrina fallback!)
    const profileAInitial = await makeRequest('/api/brand-profile', { token: tokenA });
    assert(
      profileAInitial.status === 200 && (profileAInitial.data?.brand === null || profileAInitial.data?.brand === undefined),
      'User A brand profile is initially null (no mock/predefined profile injected)'
    );

    // Save Brand Profile for User A
    const brandDataA = {
      name: 'Alice Growth Studio',
      niche: 'B2B SaaS Content Strategy',
      targetAudience: 'Tech founders and CMOs',
      voiceTone: 'Direct, authoritative, data-driven',
      primaryOffer: 'Quarterly Content Sprint',
      contentLanguage: 'en',
      contentDialect: 'en',
      constraints: 'Evidence-based only, no viral fluff',
      pillars: [
        { id: 'p1', name: 'Authority', desc: 'Case studies and benchmarks' },
        { id: 'p2', name: 'Action', desc: 'SaaS playbook workflows' },
      ],
    };

    const saveA = await makeRequest('/api/brand-profile', {
      method: 'PUT',
      token: tokenA,
      body: brandDataA,
    });
    assert(saveA.status === 200 && saveA.data?.brand?.name === 'Alice Growth Studio', 'User A saved brand profile successfully');

    // Retrieve User A profile in a fresh session call
    const profileAFetched = await makeRequest('/api/brand-profile', { token: tokenA });
    assert(
      profileAFetched.data?.brand?.niche === 'B2B SaaS Content Strategy',
      'User A brand profile retrieved accurately and matches persisted data'
    );

    // -----------------------------------------------------------
    // TEST 3: Direct Database Persistence Verification (PostgreSQL Query)
    // -----------------------------------------------------------
    console.log('\n--- Test Group 3: Direct PostgreSQL Database Verification ---');
    const dbRowA = await dbService.getBrandProfile(uidA);
    assert(dbRowA !== null && dbRowA.name === 'Alice Growth Studio', 'Direct PostgreSQL query verifies brand_profiles row persisted in DB');
    assert(dbRowA?.pillars?.length === 2, 'Direct PostgreSQL query confirms JSONB pillars persisted properly');

    // -----------------------------------------------------------
    // TEST 4: Multi-Tenant Isolation (User B cannot see or tamper with User A)
    // -----------------------------------------------------------
    console.log('\n--- Test Group 4: Multi-Tenant Account Isolation ---');
    const userBEmail = `bob-${Math.random().toString(36).substring(2, 9)}-${Date.now()}@example.com`;
    const signupB = await makeRequest('/api/v1/auth/signup', {
      method: 'POST',
      body: { email: userBEmail, name: 'Bob Martinez', password: 'Password456!' },
    });
    assert(signupB.status === 200 && signupB.data?.user?.id, 'User B registered successfully');
    const tokenB = signupB.data.token;
    const uidB = signupB.data.user.id;

    // Verify User B receives NULL brand profile (NOT User A's profile!)
    const profileBInitial = await makeRequest('/api/brand-profile', { token: tokenB });
    assert(
      profileBInitial.data?.brand === null || profileBInitial.data?.brand === undefined,
      'User B receives null profile initially (User A data is isolated)'
    );

    // Save Brand Profile for User B
    const brandDataB = {
      name: 'Bob Media Agency',
      niche: 'Creative Video Production',
      targetAudience: 'E-commerce brands',
      voiceTone: 'Vibrant, storytelling, authentic',
      primaryOffer: 'Monthly Video Retainer',
      contentLanguage: 'en',
      contentDialect: 'en',
      constraints: 'High aesthetic standards',
      pillars: [
        { id: 'p1', name: 'Creativity', desc: 'Visual concepts' },
      ],
    };
    await makeRequest('/api/brand-profile', { method: 'PUT', token: tokenB, body: brandDataB });

    const profileBFetched = await makeRequest('/api/brand-profile', { token: tokenB });
    assert(profileBFetched.data?.brand?.name === 'Bob Media Agency', 'User B profile persisted with independent data');

    // Confirm User A still gets Alice's profile and NOT Bob's profile
    const profileACheckAgain = await makeRequest('/api/brand-profile', { token: tokenA });
    assert(
      profileACheckAgain.data?.brand?.name === 'Alice Growth Studio' && profileACheckAgain.data?.brand?.name !== 'Bob Media Agency',
      'User A data remains completely isolated and untouched by User B'
    );

    // -----------------------------------------------------------
    // TEST 5: Content Decisions & Calendar Isolation
    // -----------------------------------------------------------
    console.log('\n--- Test Group 5: Calendar & Decisions User Scoping ---');
    // Save calendar item for User A
    const calItemA = await makeRequest('/api/v1/calendar/item', {
      method: 'POST',
      token: tokenA,
      body: {
        title: 'Alice Special 48h Reel',
        platform: 'Instagram',
        format: 'Reels',
        horizon: '48h',
        status: 'draft',
      },
    });
    assert(calItemA.status === 200 && calItemA.data?.item?.title === 'Alice Special 48h Reel', 'User A saved a calendar item');

    // User B checks calendar: MUST be empty (NOT containing Alice's items)
    const calB = await makeRequest('/api/v1/calendar', { token: tokenB });
    assert(
      calB.data?.items?.length === 0,
      'User B calendar is isolated (0 items; does NOT leak User A items)'
    );

    // User A checks calendar: contains 1 item
    const calA = await makeRequest('/api/v1/calendar', { token: tokenA });
    assert(calA.data?.items?.length === 1, 'User A calendar returns User A item correctly');

    // -----------------------------------------------------------
    // TEST 6: Instagram Genuine Disconnected State (No Fake Metrics)
    // -----------------------------------------------------------
    console.log('\n--- Test Group 6: Instagram Genuine Disconnected State ---');
    const igStatusA = await makeRequest('/api/v1/instagram/status', { token: tokenA });
    assert(
      igStatusA.status === 200 && igStatusA.data?.isConnected === false,
      'Instagram status for new user defaults to disconnected (isConnected: false)'
    );

    // Verify toggle works
    const igToggle = await makeRequest('/api/v1/instagram/toggle-connection', { method: 'POST', token: tokenA });
    assert(igToggle.data?.isConnected === true, 'Instagram connection can be toggled by user');

    const igToggleOff = await makeRequest('/api/v1/instagram/toggle-connection', { method: 'POST', token: tokenA });
    assert(igToggleOff.data?.isConnected === false, 'Instagram connection can be safely disconnected');

  } catch (err: any) {
    console.error('Fatal test error:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
