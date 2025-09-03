#!/usr/bin/env node

const fs = require('fs');
const vm = require('vm');

// Read the HTML file
const html = fs.readFileSync('test-debt-calculator.html', 'utf8');

// Extract the JavaScript code from the HTML
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
    console.error('No script found in HTML');
    process.exit(1);
}

const code = scriptMatch[1];

// Mock browser APIs
const mockDocument = {
    getElementById: () => ({ innerHTML: '', style: {} }),
    querySelector: () => ({ textContent: '' })
};

const mockWindow = {
    document: mockDocument,
    Intl: Intl,
    performance: {
        now: () => Date.now()
    },
    addEventListener: () => {}
};

// Create a context and run the code
const context = vm.createContext({
    document: mockDocument,
    window: mockWindow,
    Intl: Intl,
    performance: mockWindow.performance,
    console: console
});

// Run the script
try {
    vm.runInContext(code, context);
    
    // Get the tests array and run them
    const testCases = vm.runInContext('testCases', context);
    const runTest = vm.runInContext('runTest', context);
    
    console.log(`Running ${testCases.length} tests...\n`);
    
    let passed = 0;
    let failed = 0;
    const failures = [];
    
    testCases.forEach((test, index) => {
        const result = runTest(test);
        if (result.passed) {
            console.log(`✅ ${test.name}`);
            passed++;
        } else {
            console.log(`❌ ${test.name}`);
            console.log(`   Error: ${result.error}`);
            failed++;
            failures.push({ name: test.name, error: result.error });
        }
    });
    
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Results: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
    
    if (failed > 0) {
        console.log('\nFailed tests:');
        failures.forEach(f => {
            console.log(`\n${f.name}:`);
            console.log(`  ${f.error}`);
        });
    }
} catch (error) {
    console.error('Error running tests:', error);
}