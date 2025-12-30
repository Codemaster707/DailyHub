const inputsDiv = document.getElementById("inputs");
const resultDiv = document.getElementById("result");

function changeMode() {
  resultDiv.style.display = "none";
  const mode = document.getElementById("mode").value;
  inputsDiv.innerHTML = "";

  if (mode === "unit") {
    inputsDiv.innerHTML = `
      <input id="value" type="number" placeholder="Value">
      <select id="unitType">
        <option value="km-m">Km ➔ Meters</option>
        <option value="m-km">Meters ➔ Km</option>
      </select>`;
  } else if (mode === "age") {
    inputsDiv.innerHTML = `<input id="dob" type="date">`;
  } else if (mode === "interest") {
    inputsDiv.innerHTML = `
      <input id="p" type="number" placeholder="Principal">
      <input id="r" type="number" placeholder="Rate (%)">
      <input id="t" type="number" placeholder="Years">
      <select id="interestType">
        <option value="simple">Simple Interest</option>
        <option value="compound">Compound Interest</option>
      </select>`;
  } else if (mode === "tax") {
    inputsDiv.innerHTML = `
      <input id="amount" type="number" placeholder="Amount">
      <input id="gst" type="number" placeholder="Tax %">
      <select id="gstType">
        <option value="add">Add Tax</option>
        <option value="remove">Remove Tax</option>
      </select>`;
  }
}

function calculate() {
  const mode = document.getElementById("mode").value;
  if (!mode) return;

  resultDiv.style.display = "block";
  let res = "";

  if (mode === "unit") {
    const v = +document.getElementById("value").value;
    if (isNaN(v)) {
      res = "Please enter a valid number";
    } else {
      res = document.getElementById("unitType").value === "km-m" 
        ? v * 1000 + " meters" 
        : (v / 1000) + " km";
    }

  } else if (mode === "age") {
    const dobInput = document.getElementById("dob").value;
    if (!dobInput) {
      res = "Please select your date of birth";
    } else {
      const birth = new Date(dobInput);
      const today = new Date();
      
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      const dayDiff = today.getDate() - birth.getDate();
      
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
      }
      
      res = age + " Years Old";
    }

  } else if (mode === "interest") {
    const P = +document.getElementById("p").value;
    const R = +document.getElementById("r").value;
    const T = +document.getElementById("t").value;
    const interestType = document.getElementById("interestType").value;

    if (isNaN(P) || isNaN(R) || isNaN(T) || P < 0 || R < 0 || T < 0) {
      res = "Please enter valid positive numbers";
    } else if (interestType === "simple") {
      const interest = (P * R * T) / 100;
      res = interest.toFixed(2) + " (Simple Interest Amount)";
    } else {
      const amount = P * Math.pow(1 + R / 100, T);
      const interest = amount - P;
      res = interest.toFixed(2) + " (Compound Interest Amount)";
    }

  } else if (mode === "tax") {
    const A = +document.getElementById("amount").value;
    const G = +document.getElementById("gst").value;
    const gstType = document.getElementById("gstType").value;

    if (isNaN(A) || isNaN(G) || A < 0 || G < 0) {
      res = "Please enter valid positive numbers";
    } else if (gstType === "add") {
      const finalAmount = A + (A * G / 100);
      res = finalAmount.toFixed(2) + " (Amount with Tax)";
    } else {
      const originalAmount = A * 100 / (100 + G);
      res = originalAmount.toFixed(2) + " (Amount without Tax)";
    }
  }

  resultDiv.innerHTML = "✨ Result: " + res;
}