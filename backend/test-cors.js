#!/usr/bin/env node

/**
 * CORS Configuration Test Script
 * 
 * This script tests the CORS configuration of the Dash0 Times backend API
 * to ensure all endpoints properly handle cross-origin requests.
 */

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

const API_BASE = 'http://localhost:3001';
const ALLOWED_ORIGIN = 'http://localhost:5173';
const UNAUTHORIZED_ORIGIN = 'http://malicious-site.com';

// Test configuration
const tests = [
  {
    name: 'Health endpoint with allowed origin',
    url: `${API_BASE}/api/health`,
    origin: ALLOWED_ORIGIN,
    expectCors: true
  },
  {
    name: 'Articles endpoint with allowed origin',
    url: `${API_BASE}/api/articles`,
    origin: ALLOWED_ORIGIN,
    expectCors: true
  },
  {
    name: 'Search endpoint with allowed origin',
    url: `${API_BASE}/api/search?q=test`,
    origin: ALLOWED_ORIGIN,
    expectCors: true
  },
  {
    name: 'Recommendations endpoint with allowed origin',
    url: `${API_BASE}/api/recommendation`,
    origin: ALLOWED_ORIGIN,
    expectCors: true
  },
  {
    name: 'Health endpoint with unauthorized origin',
    url: `${API_BASE}/api/health`,
    origin: UNAUTHORIZED_ORIGIN,
    expectCors: false
  },
  {
    name: 'Preflight OPTIONS request',
    url: `${API_BASE}/api/articles`,
    origin: ALLOWED_ORIGIN,
    method: 'OPTIONS',
    headers: ['Access-Control-Request-Method: GET', 'Access-Control-Request-Headers: x-demo-user'],
    expectCors: true
  },
  {
    name: 'Request with x-demo-user header',
    url: `${API_BASE}/api/articles`,
    origin: ALLOWED_ORIGIN,
    headers: ['x-demo-user: pro-user'],
    expectCors: true,
    expectViewer: true
  }
];

async function runCurlCommand(args) {
  return new Promise((resolve, reject) => {
    const curl = spawn('curl', args);
    let stdout = '';
    let stderr = '';

    curl.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    curl.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    curl.on('close', (code) => {
      resolve({ stdout, stderr, code });
    });

    curl.on('error', (error) => {
      reject(error);
    });
  });
}

async function testCorsHeaders(test) {
  const args = ['-I', '-s'];
  
  if (test.origin) {
    args.push('-H', `Origin: ${test.origin}`);
  }
  
  if (test.headers) {
    test.headers.forEach(header => {
      args.push('-H', header);
    });
  }
  
  if (test.method) {
    args.push('-X', test.method);
  }
  
  args.push(test.url);
  
  try {
    const result = await runCurlCommand(args);
    
    if (result.code !== 0) {
      return { success: false, error: `Curl failed with code ${result.code}` };
    }
    
    const headers = result.stdout.toLowerCase();
    const hasCorsOrigin = headers.includes('access-control-allow-origin');
    const hasCredentials = headers.includes('access-control-allow-credentials: true');
    
    if (test.expectCors) {
      if (!hasCorsOrigin) {
        return { success: false, error: 'Missing Access-Control-Allow-Origin header' };
      }
      if (!hasCredentials) {
        return { success: false, error: 'Missing Access-Control-Allow-Credentials header' };
      }
    } else {
      if (hasCorsOrigin) {
        return { success: false, error: 'Unexpected Access-Control-Allow-Origin header for unauthorized origin' };
      }
    }
    
    return { success: true, headers: result.stdout };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testViewerContext(test) {
  if (!test.expectViewer) return { success: true };
  
  const args = ['-s'];
  
  if (test.origin) {
    args.push('-H', `Origin: ${test.origin}`);
  }
  
  if (test.headers) {
    test.headers.forEach(header => {
      args.push('-H', header);
    });
  }
  
  args.push(test.url);
  
  try {
    const result = await runCurlCommand(args);
    
    if (result.code !== 0) {
      return { success: false, error: `Curl failed with code ${result.code}` };
    }
    
    try {
      const response = JSON.parse(result.stdout);
      if (!response.viewer) {
        return { success: false, error: 'Missing viewer context in response' };
      }
      return { success: true, viewer: response.viewer };
    } catch (parseError) {
      return { success: false, error: 'Invalid JSON response' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Starting CORS Configuration Tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    process.stdout.write(`Testing: ${test.name}... `);
    
    const corsResult = await testCorsHeaders(test);
    
    if (!corsResult.success) {
      console.log(`❌ FAILED - ${corsResult.error}`);
      failed++;
      continue;
    }
    
    if (test.expectViewer) {
      const viewerResult = await testViewerContext(test);
      if (!viewerResult.success) {
        console.log(`❌ FAILED - ${viewerResult.error}`);
        failed++;
        continue;
      }
    }
    
    console.log('✅ PASSED');
    passed++;
  }
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All CORS tests passed! Configuration is working correctly.');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please check the CORS configuration.');
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const result = await runCurlCommand(['-s', '-f', `${API_BASE}/api/health`]);
    return result.code === 0;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking if backend server is running...');
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Backend server is not running on port 3001');
    console.log('Please start the server with: npm run dev');
    process.exit(1);
  }
  
  console.log('✅ Backend server is running\n');
  
  // Wait a moment for server to be fully ready
  await setTimeout(1000);
  
  await runTests();
}

main().catch(console.error);