const unitsEl = document.getElementById('units');
const heightEl = document.getElementById('height');
const weightEl = document.getElementById('weight');
const heightUnitLabel = document.getElementById('heightUnitLabel');
const weightUnitLabel = document.getElementById('weightUnitLabel');
const form = document.getElementById('bmi-form');
const errorEl = document.getElementById('error');
const bmiValueEl = document.getElementById('bmiValue');
const bmiCategoryEl = document.getElementById('bmiCategory');
const adviceEl = document.getElementById('advice');
const markerEl = document.getElementById('marker');
const resetBtn = document.getElementById('resetBtn');

function toNumber(v) { return Number(String(v).replace(/,/g, '')); }
function round1(x) { return Math.round(x * 10) / 10; }

function calcBMI(height, weight, units) {
  return units === 'metric'
    ? weight / Math.pow(height / 100, 2)
    : 703 * weight / Math.pow(height, 2);
}

function categoryFromBMI(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#06b6d4' };
  if (bmi < 25) return { label: 'Normal', color: '#16a34a' };
  if (bmi < 30) return { label: 'Overweight', color: '#d97706' };
  return { label: 'Obesity', color: '#dc2626' };
}

function healthyWeightRange(height, units) {
  if (units === 'metric') {
    const m2 = Math.pow(height / 100, 2);
    return [18.5 * m2, 24.9 * m2];
  } else {
    const h2 = Math.pow(height, 2);
    return [18.5 * h2 / 703, 24.9 * h2 / 703];
  }
}

function setMarkerPosition(bmi) {
  const min = 12, max = 40;
  const pct = Math.max(0, Math.min(100, ((bmi - min) / (max - min)) * 100));
  markerEl.style.left = pct + '%';
}

function setCategoryChip(cat) {
  bmiCategoryEl.textContent = cat.label;
  bmiCategoryEl.style.background = cat.color + '15';
  bmiCategoryEl.style.borderColor = cat.color + '55';
  bmiCategoryEl.style.color = cat.color;
}

function updateUnitHints() {
  if (unitsEl.value === 'metric') {
    heightUnitLabel.textContent = '(cm)';
    weightUnitLabel.textContent = '(kg)';
    heightEl.placeholder = 'e.g., 170';
    weightEl.placeholder = 'e.g., 65';
    heightEl.min = 30; heightEl.max = 272; weightEl.min = 2; weightEl.max = 500;
  } else {
    heightUnitLabel.textContent = '(in)';
    weightUnitLabel.textContent = '(lb)';
    heightEl.placeholder = 'e.g., 67';
    weightEl.placeholder = 'e.g., 160';
    heightEl.min = 12; heightEl.max = 107; weightEl.min = 5; weightEl.max = 1100;
  }
  errorEl.textContent = '';
  bmiValueEl.textContent = '—';
  bmiCategoryEl.textContent = '—';
  adviceEl.textContent = 'Enter your height and weight to see your BMI and healthy weight range.';
  setMarkerPosition(12);
}

function validate(height, weight) {
  if (height <= 0 || weight <= 0 || Number.isNaN(height) || Number.isNaN(weight)) {
    return 'Please enter valid positive numbers for height and weight.';
  }
  return '';
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorEl.textContent = '';

  const units = unitsEl.value;
  const height = toNumber(heightEl.value);
  const weight = toNumber(weightEl.value);

  const msg = validate(height, weight);
  if (msg) { errorEl.textContent = msg; return; }

  const bmi = round1(calcBMI(height, weight, units));
  const cat = categoryFromBMI(bmi);

  bmiValueEl.textContent = bmi.toFixed(1);
  setCategoryChip(cat);
  setMarkerPosition(bmi);

  const [min, max] = healthyWeightRange(height, units);
  const showMin = Math.round(min * 10) / 10;
  const showMax = Math.round(max * 10) / 10;

  adviceEl.innerHTML = units === 'metric'
    ? `For your height, a healthy weight range is <strong>${showMin.toFixed(1)}–${showMax.toFixed(1)} kg</strong>.`
    : `For your height, a healthy weight range is <strong>${showMin.toFixed(1)}–${showMax.toFixed(1)} lb</strong>.`;

  document.getElementById('resultLabel').textContent = `Your BMI (${units === 'metric' ? 'kg/cm' : 'lb/in'})`;
});

resetBtn.addEventListener('click', () => { form.reset(); updateUnitHints(); });
unitsEl.addEventListener('change', updateUnitHints);

updateUnitHints();
