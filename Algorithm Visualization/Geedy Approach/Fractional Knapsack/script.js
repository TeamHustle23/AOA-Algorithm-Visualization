function startFractional() {
  let p = document.getElementById("profit").value;
  let w = document.getElementById("weight").value;
  let maxw = document.getElementById("maxw").value;
  if (p && w && maxw) {
    maxw = parseInt(maxw);
    p = p.split(" ");
    w = w.split(" ");
    for (let i = 0; i < w.length; i++) {
      w[i] = parseInt(w[i]);
      p[i] = parseInt(p[i]);
    }
    let n = w.length;
    fractionalKnapsack(n, w, p, maxw);
  } else {
    alert("Please Fill All Fields!");
  }
}

function createTable(selectedItems, n, p, w, maxw) {
  const data = document.getElementById("data");
  if (!data) {
    console.error("Data element not found.");
    return;
  }

  let table = document.createElement("table");
  let headerRow = table.insertRow();
  let headers = ["Item No.", "Profit", "Weight", "Profit/Weight Ratio"];
  headers.forEach((headerText) => {
    let header = document.createElement("th");
    let textNode = document.createTextNode(headerText);
    header.appendChild(textNode);
    headerRow.appendChild(header);
  });

  for (let i = 0; i < n; i++) {
    let row = table.insertRow();
    let cell0 = row.insertCell();
    let cell1 = row.insertCell();
    let cell2 = row.insertCell();
    let cell3 = row.insertCell();
    cell0.appendChild(document.createTextNode(i + 1));
    cell1.appendChild(document.createTextNode(p[i]));
    cell2.appendChild(document.createTextNode(w[i]));
    cell3.appendChild(document.createTextNode((p[i] / w[i]).toFixed(2)));
  }

  data.innerHTML = "";
  data.appendChild(table);
}

function fractionalKnapsack(n, w, p, maxw) {
  let ratios = [];
  for (let i = 0; i < n; i++) {
    ratios.push({ index: i, ratio: p[i] / w[i] });
  }

  ratios.sort((a, b) => b.ratio - a.ratio);

  let selectedItems = Array(n).fill(0);
  let totalWeight = 0;
  let totalProfit = 0;

  for (let i = 0; i < n; i++) {
    if (totalWeight + w[ratios[i].index] <= maxw) {
      selectedItems[ratios[i].index] = 1;
      totalWeight += w[ratios[i].index];
      totalProfit += p[ratios[i].index];
    } else {
      let remainingWeight = maxw - totalWeight;
      let fraction = remainingWeight / w[ratios[i].index];
      selectedItems[ratios[i].index] = fraction;
      totalProfit += p[ratios[i].index] * fraction;
      break;
    }
  }

  createTable(selectedItems, n, p, w, maxw);

  const data = document.getElementById("data");
  let maxProfitElement = document.getElementById("ans");
  if (maxProfitElement) {
    maxProfitElement.textContent = "Max Profit: " + totalProfit.toFixed(2);
  } else {
    maxProfitElement = document.createElement("h3");
    maxProfitElement.id = "ans";
    maxProfitElement.textContent = "Max Profit: " + totalProfit.toFixed(2);
    data.appendChild(maxProfitElement);
  }
}
