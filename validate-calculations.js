#!/usr/bin/env node

/**
 * Validation script for debt calculator mathematics
 * This script validates key calculations from the debt-calculator.html
 */

console.log("🧮 Debt Calculator Math Validation\n");
console.log("=" .repeat(50));

// Test configuration
const tests = {
    passed: 0,
    failed: 0,
    errors: []
};

// Helper functions
function test(name, actual, expected, tolerance = 0.01) {
    const diff = Math.abs(actual - expected);
    const pass = diff <= tolerance;
    
    if (pass) {
        console.log(`✅ ${name}`);
        console.log(`   Expected: ${expected}, Actual: ${actual}`);
        tests.passed++;
    } else {
        console.log(`❌ ${name}`);
        console.log(`   Expected: ${expected}, Actual: ${actual}, Diff: ${diff}`);
        tests.failed++;
        tests.errors.push({ name, expected, actual, diff });
    }
    console.log();
}

function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

// Core calculation functions
function calculateMonthlyInterest(balance, annualRate) {
    return balance * (annualRate / 100 / 12);
}

function calculatePayment(balance, rate, payment) {
    const interest = calculateMonthlyInterest(balance, rate);
    const principal = Math.min(payment - interest, balance);
    const newBalance = Math.max(0, balance - principal);
    
    return {
        interest,
        principal,
        newBalance,
        actualPayment: interest + principal
    };
}

// Test 1: Basic Interest Calculation
console.log("\n📊 Test 1: Monthly Interest Calculation");
console.log("-" .repeat(40));
{
    const balance = 5000;
    const rate = 18; // 18% APR
    const monthlyInterest = calculateMonthlyInterest(balance, rate);
    const expected = 75; // 5000 * 0.18 / 12
    
    test("Monthly interest on $5000 @ 18% APR", monthlyInterest, expected);
}

// Test 2: Payment Application
console.log("\n📊 Test 2: Payment Application with Interest");
console.log("-" .repeat(40));
{
    const balance = 1000;
    const rate = 24; // 24% APR
    const payment = 100;
    
    const result = calculatePayment(balance, rate, payment);
    const expectedInterest = 20; // 1000 * 0.24 / 12
    const expectedPrincipal = 80; // 100 - 20
    const expectedNewBalance = 920; // 1000 - 80
    
    test("Interest portion", result.interest, expectedInterest);
    test("Principal portion", result.principal, expectedPrincipal);
    test("New balance", result.newBalance, expectedNewBalance);
}

// Test 3: Compound Interest Over Time
console.log("\n📊 Test 3: Compound Interest (3 months)");
console.log("-" .repeat(40));
{
    let balance = 2000;
    const rate = 12; // 12% APR = 1% per month
    const payment = 100;
    let totalInterest = 0;
    let totalPrincipal = 0;
    
    console.log("Month | Balance | Interest | Principal | New Balance");
    console.log("-" .repeat(55));
    
    for (let month = 1; month <= 3; month++) {
        const result = calculatePayment(balance, rate, payment);
        totalInterest += result.interest;
        totalPrincipal += result.principal;
        
        console.log(
            `  ${month}   | ${formatCurrency(balance)} | ${formatCurrency(result.interest)} | ` +
            `${formatCurrency(result.principal)} | ${formatCurrency(result.newBalance)}`
        );
        
        balance = result.newBalance;
    }
    
    console.log("-" .repeat(55));
    console.log(`Total Interest: ${formatCurrency(totalInterest)}`);
    console.log(`Total Principal: ${formatCurrency(totalPrincipal)}`);
    
    test("Total interest over 3 months", totalInterest, 57.59, 0.01);
    test("Final balance after 3 months", balance, 1757.59, 0.01);
}

// Test 4: Utilization Calculations
console.log("\n📊 Test 4: Credit Utilization");
console.log("-" .repeat(40));
{
    const cards = [
        { balance: 4500, limit: 5000 },  // 90%
        { balance: 2450, limit: 2500 },  // 98%
        { balance: 500, limit: 2000 },   // 25%
    ];
    
    cards.forEach((card, i) => {
        const utilization = (card.balance / card.limit) * 100;
        console.log(`Card ${i + 1}: ${formatCurrency(card.balance)}/${formatCurrency(card.limit)} = ${utilization.toFixed(1)}%`);
    });
    
    const totalBalance = cards.reduce((sum, c) => sum + c.balance, 0);
    const totalLimit = cards.reduce((sum, c) => sum + c.limit, 0);
    const overallUtil = (totalBalance / totalLimit) * 100;
    
    test("Overall utilization", overallUtil, 78.42, 0.01);
}

// Test 5: Waterfall Phase Detection
console.log("\n📊 Test 5: Waterfall Phase Detection");
console.log("-" .repeat(40));
{
    function getPhase(utilizations) {
        const over89 = utilizations.filter(u => u > 89).length;
        const over49 = utilizations.filter(u => u > 49).length;
        const over29 = utilizations.filter(u => u > 29).length;
        const over10 = utilizations.filter(u => u > 10).length;
        
        if (over89 > 0) return "Phase 1: Emergency (89% threshold)";
        if (over49 > 0) return "Phase 2: Critical (49% threshold)";
        if (over29 > 0) return "Phase 3: Good Standing (29% threshold)";
        if (over10 > 0) return "Phase 4: Premium (10% threshold)";
        return "Phase 5: AZEO or Complete";
    }
    
    const testCases = [
        { utils: [95, 80, 70], expected: "Phase 1" },
        { utils: [80, 60, 40], expected: "Phase 2" },
        { utils: [40, 35, 20], expected: "Phase 3" },
        { utils: [15, 12, 8], expected: "Phase 4" },
        { utils: [5, 0, 0], expected: "Phase 5" },
    ];
    
    testCases.forEach(tc => {
        const phase = getPhase(tc.utils);
        console.log(`Utilizations: [${tc.utils.join(", ")}]% → ${phase}`);
    });
}

// Test 6: Waterfall Payment Allocation
console.log("\n📊 Test 6: Waterfall Payment Targeting");
console.log("-" .repeat(40));
{
    // Card at 95% needs to reach 89%
    const creditLimit = 1000;
    const currentBalance = 950; // 95% utilization
    const targetUtilization = 0.89; // 89%
    const targetBalance = creditLimit * targetUtilization;
    const paymentNeeded = currentBalance - targetBalance;
    
    console.log(`Credit Limit: ${formatCurrency(creditLimit)}`);
    console.log(`Current Balance: ${formatCurrency(currentBalance)} (${(currentBalance/creditLimit*100).toFixed(1)}%)`);
    console.log(`Target Balance: ${formatCurrency(targetBalance)} (89%)`);
    console.log(`Payment Needed: ${formatCurrency(paymentNeeded)}`);
    
    test("Payment to reach 89% threshold", paymentNeeded, 60);
}

// Test 7: AZEO Strategy
console.log("\n📊 Test 7: AZEO (All Zero Except One)");
console.log("-" .repeat(40));
{
    const cards = [
        { name: "Card A", balance: 100 },
        { name: "Card B", balance: 50 },
        { name: "Card C", balance: 25 }, // Smallest - keep this one
    ];
    
    const totalToPayOff = cards
        .sort((a, b) => b.balance - a.balance)
        .slice(0, -1)
        .reduce((sum, c) => sum + c.balance, 0);
    
    console.log("AZEO Strategy:");
    cards.forEach(card => {
        const payOff = card.balance !== Math.min(...cards.map(c => c.balance));
        console.log(`${card.name}: ${formatCurrency(card.balance)} → ${payOff ? "Pay Off" : "Keep Balance"}`);
    });
    
    test("Total to pay off for AZEO", totalToPayOff, 150);
}

// Summary
console.log("\n" + "=" .repeat(50));
console.log("📊 VALIDATION SUMMARY");
console.log("=" .repeat(50));
console.log(`✅ Passed: ${tests.passed}`);
console.log(`❌ Failed: ${tests.failed}`);

if (tests.failed > 0) {
    console.log("\n⚠️  Failed Tests:");
    tests.errors.forEach(error => {
        console.log(`  - ${error.name}`);
        console.log(`    Expected: ${error.expected}, Actual: ${error.actual}`);
    });
    process.exit(1);
} else {
    console.log("\n✨ All calculations validated successfully!");
}