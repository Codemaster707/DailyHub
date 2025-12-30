const inputsDiv = document.getElementById("inputs");
const resultText = document.getElementById("result-text");
const resultLabel = document.getElementById("result-label");
const resultBox = document.getElementById("result-box");

function updateInputs() {
  const mode = document.getElementById("mode").value;
  let html = "";
  
  const config = {
    percentOf: [['a', 'Percentage (%)'], ['b', 'Of Number']],
    whatPercent: [['a', 'Part Value'], ['b', 'Total Value']],
    increase: [['a', 'Current Value'], ['b', 'Increase %']],
    decrease: [['a', 'Current Value'], ['b', 'Decrease %']],
    change: [['a', 'Old Value'], ['b', 'New Value']],
    marks: [['a', 'Marks Obtained'], ['b', 'Total Marks']]
  };

  config[mode].forEach(f => {
    html += `
    <div style="margin-top:20px;">
      <label class="field-label">${f[1]}</label>
      <input id="${f[0]}" type="number" placeholder="0" oninput="calculate()">
    </div>`;
  });

  inputsDiv.innerHTML = html;
  resultBox.classList.add("hidden");
}

function calculate() {
  const mode = document.getElementById("mode").value;
  const a = parseFloat(document.getElementById("a")?.value);
  const b = parseFloat(document.getElementById("b")?.value);

  if (isNaN(a) || isNaN(b) || (mode === "marks" && b === 0)) {
    return resultBox.classList.add("hidden");
  }

  let res = 0;
  let label = "RESULT";

  switch (mode) {
    case "percentOf": res = (a / 100) * b; label = "VALUE"; break;
    case "whatPercent": res = (a / b) * 100; label = "PERCENTAGE"; break;
    case "increase": res = a + (a * b / 100); label = "NEW TOTAL"; break;
    case "decrease": res = a - (a * b / 100); label = "NEW TOTAL"; break;
    case "change": res = ((b - a) / a) * 100; label = "CHANGE"; break;
    case "marks": res = (a / b) * 100; label = "SCORE"; break;
  }

  const isPercent = ["whatPercent", "change", "marks"].includes(mode);
  resultText.innerText = res.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + (isPercent ? "%" : "");
  resultLabel.innerText = label;
  resultBox.classList.remove("hidden");
}

function copyResult() {
  navigator.clipboard.writeText(resultText.innerText);
  const btn = document.querySelector(".copy-button");
  btn.innerHTML = "Copied!";
  setTimeout(() => { btn.innerHTML = '<i class="far fa-copy"></i> Copy'; }, 1500);
}

// Start with inputs ready
updateInputs();