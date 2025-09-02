// Minimal unit tests for helper functions (Node runtime)

function calculateMonthlyInterest(balance, rate) {
  return balance * (rate / 100 / 12);
}

function calculateCFI(balance, minPayment, rate) {
  if (!minPayment || minPayment === 0) return Infinity;
  const monthlyInterest = calculateMonthlyInterest(balance, rate);
  const principal = minPayment - monthlyInterest;
  if (principal <= 0) return Infinity;
  return balance / principal;
}

function almostEqual(a, b, eps = 1e-6) { return Math.abs(a - b) <= eps; }

const results = [];
function test(name, fn) {
  try { fn(); results.push({ name, ok: true }); }
  catch (e) { results.push({ name, ok: false, msg: e.message }); }
}

// Tests

test('monthly interest basic', () => {
  if (!almostEqual(calculateMonthlyInterest(1200, 12), 12)) throw new Error('1200 @ 12% should be 12');
  if (!almostEqual(calculateMonthlyInterest(0, 20), 0)) throw new Error('0 balance should be 0');
});

test('CFI finite when principal positive', () => {
  const cfi = calculateCFI(1000, 50, 12);
  if (!isFinite(cfi)) throw new Error('CFI expected finite');
});

test('CFI Infinity when payment <= interest', () => {
  const cfi = calculateCFI(1000, 5, 30);
  if (cfi !== Infinity) throw new Error('CFI expected Infinity');
});

// Report
let failures = 0;
for (const r of results) {
  if (r.ok) console.log(`✓ ${r.name}`);
  else { console.error(`✗ ${r.name} -> ${r.msg}`); failures++; }
}
if (failures > 0) process.exit(1);
console.log('All tests passed');
