#!/usr/bin/env node

// Simple test runner to identify failing tests
console.log("Running debt calculator tests...\n");

const EPSILON = 0.01;

function assertEqual(actual, expected, message) {
    if (Math.abs(actual - expected) > EPSILON) {
        throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}\nDifference: ${actual - expected}`);
    }
}

function assertClose(actual, expected, tolerance, message) {
    if (Math.abs(actual - expected) > tolerance) {
        throw new Error(`${message}\nExpected: ${expected} ±${tolerance}\nActual: ${actual}\nDifference: ${actual - expected}`);
    }
}

// Core functions
function calculateMonthlyInterest(balance, annualRate) {
    return balance * (annualRate / 100 / 12);
}

function calculateUtilization(balance, creditLimit) {
    if (!creditLimit || creditLimit <= 0) return 0;
    return (balance / creditLimit) * 100;
}

function determineWaterfallPhase(debts) {
    const creditCards = debts.filter(d => d.creditLimit && d.creditLimit > 0);
    if (creditCards.length === 0) return { phase: 'No Credit Cards', threshold: 0 };
    
    const over89 = creditCards.filter(d => calculateUtilization(d.balance, d.creditLimit) > 89);
    if (over89.length > 0) {
        return { 
            phase: 'Phase 1: Emergency Recovery',
            threshold: 89,
            targetCards: over89.length,
            progress: ((creditCards.length - over89.length) / creditCards.length) * 100
        };
    }
    
    const over49 = creditCards.filter(d => calculateUtilization(d.balance, d.creditLimit) > 49);
    if (over49.length > 0) {
        return { 
            phase: 'Phase 2: Critical Threshold',
            threshold: 49,
            targetCards: over49.length,
            progress: ((creditCards.length - over49.length) / creditCards.length) * 100
        };
    }
    
    const over29 = creditCards.filter(d => calculateUtilization(d.balance, d.creditLimit) > 29);
    if (over29.length > 0) {
        return { 
            phase: 'Phase 3: Good Standing',
            threshold: 29,
            targetCards: over29.length,
            progress: ((creditCards.length - over29.length) / creditCards.length) * 100
        };
    }
    
    const totalBalance = creditCards.reduce((sum, d) => sum + d.balance, 0);
    const totalLimit = creditCards.reduce((sum, d) => sum + d.creditLimit, 0);
    const overallUtil = (totalBalance / totalLimit) * 100;
    
    if (overallUtil > 10) {
        return { 
            phase: 'Phase 4: Premium Qualification',
            threshold: 10,
            isOverall: true,
            currentUtilization: overallUtil,
            progress: Math.max(0, 100 - ((overallUtil - 10) * 10))
        };
    }
    
    const nonZeroCards = creditCards.filter(d => d.balance > 0);
    if (nonZeroCards.length > 1) {
        return { 
            phase: 'Phase 5: AZEO Optimization',
            isAZEO: true,
            cardsToPayOff: nonZeroCards.length - 1,
            progress: ((creditCards.length - nonZeroCards.length) / (creditCards.length - 1)) * 100
        };
    }
    
    return { phase: 'Complete', progress: 100 };
}

function allocateWaterfallPayment(debts, availableExtra) {
    const phase = determineWaterfallPhase(debts);
    const allocations = {};
    
    debts.forEach(debt => {
        allocations[debt.name] = 0;
    });
    
    if (availableExtra <= 0) return allocations;
    
    if (phase.isAZEO) {
        const creditCards = debts.filter(d => d.creditLimit > 0 && d.balance > 0);
        creditCards.sort((a, b) => a.balance - b.balance); // Sort ascending to find smallest
        
        // Pay off all except the smallest balance card
        for (let i = 1; i < creditCards.length; i++) {
            if (availableExtra <= 0) break;
            const card = creditCards[i];
            const payment = Math.min(card.balance, availableExtra);
            allocations[card.name] = payment;
            availableExtra -= payment;
        }
    } else if (phase.isOverall) {
        const creditCards = debts.filter(d => d.creditLimit > 0 && d.balance > 0);
        creditCards.sort((a, b) => b.balance - a.balance);
        
        for (let card of creditCards) {
            if (availableExtra <= 0) break;
            const payment = Math.min(card.balance, availableExtra);
            allocations[card.name] = payment;
            availableExtra -= payment;
        }
    } else if (phase.threshold) {
        const creditCards = debts.filter(d => d.creditLimit > 0);
        const targetUtil = phase.threshold / 100;
        
        creditCards.sort((a, b) => {
            const utilA = calculateUtilization(a.balance, a.creditLimit);
            const utilB = calculateUtilization(b.balance, b.creditLimit);
            return utilB - utilA;
        });
        
        for (let card of creditCards) {
            if (availableExtra <= 0) break;
            const currentUtil = calculateUtilization(card.balance, card.creditLimit);
            if (currentUtil <= phase.threshold) continue;
            
            const targetBalance = card.creditLimit * targetUtil;
            const paymentNeeded = card.balance - targetBalance;
            const payment = Math.min(paymentNeeded, availableExtra);
            
            allocations[card.name] = payment;
            availableExtra -= payment;
        }
        
        // After meeting threshold requirements, use avalanche for remaining funds
        if (availableExtra > 0) {
            const remainingDebts = debts.filter(d => d.balance > allocations[d.name]);
            remainingDebts.sort((a, b) => b.rate - a.rate);
            
            for (let debt of remainingDebts) {
                if (availableExtra <= 0) break;
                const remainingBalance = debt.balance - allocations[debt.name];
                const payment = Math.min(remainingBalance, availableExtra);
                allocations[debt.name] += payment;
                availableExtra -= payment;
            }
        }
    } else {
        // No specific phase, use avalanche
        const remainingDebts = debts.filter(d => d.balance > 0);
        remainingDebts.sort((a, b) => b.rate - a.rate);
        
        for (let debt of remainingDebts) {
            if (availableExtra <= 0) break;
            const payment = Math.min(debt.balance, availableExtra);
            allocations[debt.name] = payment;
            availableExtra -= payment;
        }
    }
    
    return allocations;
}

// Run specific tests that might be failing
const tests = [];
let passed = 0;
let failed = 0;

function runTest(name, testFn) {
    try {
        testFn();
        console.log(`✅ ${name}`);
        passed++;
        return true;
    } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   ${error.message}`);
        failed++;
        tests.push({name, error: error.message});
        return false;
    }
}

console.log("Testing Waterfall Payment Allocation...\n");

// Test 1: Basic allocation
runTest("Test 1: Waterfall Payment Basic", () => {
    const debts = [
        { name: "Card A", balance: 950, creditLimit: 1000, rate: 18 },
        { name: "Card B", balance: 900, creditLimit: 1000, rate: 20 },
        { name: "Card C", balance: 400, creditLimit: 500, rate: 15 },
    ];
    
    const allocations = allocateWaterfallPayment(debts, 100);
    
    // Card A needs 60 to reach 89% (950 -> 890)
    // Card B needs 10 to reach 89% (900 -> 890)
    // Total needed: 70, we have 100
    // Remaining $30 goes to highest rate card (Card B at 20% APR)
    
    console.log("   Allocations:", JSON.stringify(allocations, null, 2));
    
    assertClose(allocations["Card A"], 60, 1, "Card A should get $60");
    assertClose(allocations["Card B"], 40, 1, "Card B should get $40 (10 for threshold + 30 extra)");
    assertClose(allocations["Card C"], 0, 1, "Card C should get $0");
});

// Test 2: Insufficient funds
runTest("Test 2: Insufficient Funds", () => {
    const debts = [
        { name: "Card A", balance: 950, creditLimit: 1000, rate: 18 },
        { name: "Card B", balance: 900, creditLimit: 1000, rate: 20 },
    ];
    
    const allocations = allocateWaterfallPayment(debts, 30);
    
    console.log("   Allocations:", JSON.stringify(allocations, null, 2));
    
    // Should prioritize highest utilization (Card A at 95%)
    assertClose(allocations["Card A"], 30, 1, "Card A should get all $30");
    assertClose(allocations["Card B"], 0, 1, "Card B should get $0");
});

// Test 3: AZEO allocation
runTest("Test 3: AZEO Allocation", () => {
    const debts = [
        { name: "Card A", balance: 100, creditLimit: 5000, rate: 18 },
        { name: "Card B", balance: 50, creditLimit: 3000, rate: 20 },
        { name: "Card C", balance: 25, creditLimit: 2000, rate: 15 },
    ];
    
    const allocations = allocateWaterfallPayment(debts, 200);
    
    console.log("   Allocations:", JSON.stringify(allocations, null, 2));
    
    // Should pay off A and B, keep C
    assertEqual(allocations["Card A"], 100, "Card A should be paid in full");
    assertEqual(allocations["Card B"], 50, "Card B should be paid in full");
    assertEqual(allocations["Card C"], 0, "Card C should not receive payment");
});

// Test 4: Phase detection accuracy
runTest("Test 4: Phase Detection", () => {
    const scenarios = [
        {
            debts: [
                { balance: 950, creditLimit: 1000, rate: 18 },
                { balance: 450, creditLimit: 500, rate: 20 },
            ],
            expectedPhase: "Phase 1: Emergency Recovery"
        },
        {
            debts: [
                { balance: 400, creditLimit: 500, rate: 18 },
                { balance: 300, creditLimit: 500, rate: 20 },
            ],
            expectedPhase: "Phase 2: Critical Threshold"
        }
    ];
    
    scenarios.forEach((scenario, i) => {
        const phase = determineWaterfallPhase(scenario.debts);
        console.log(`   Scenario ${i + 1}: ${phase.phase}`);
        if (phase.phase !== scenario.expectedPhase) {
            throw new Error(`Expected ${scenario.expectedPhase}, got ${phase.phase}`);
        }
    });
});

// Test 5: Exact threshold targeting
runTest("Test 5: Single Card With Extra Funds", () => {
    const debts = [
        { name: "Card A", balance: 950, creditLimit: 1000, rate: 18 }
    ];
    
    const allocations = allocateWaterfallPayment(debts, 100);
    
    console.log("   Allocations:", JSON.stringify(allocations, null, 2));
    
    // With only one card, all available funds go to it (60 for threshold + 40 extra)
    assertEqual(allocations["Card A"], 100, "Single card should get all available funds");
});

console.log("\n" + "=".repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
    console.log("\nFailed tests details:");
    tests.forEach(t => {
        console.log(`\n${t.name}:`);
        console.log(t.error);
    });
}