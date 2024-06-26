let blocks = document.getElementsByClassName("drawing-area")[0];
let addEdge = false;
let cnt = 0;
let dist;

let alerted = localStorage.getItem("alerted") || "";
if (alerted !== "yes") {
  alert(
    "Read instructions before proceeding by clicking i-icon in the top-right corner"
  );
  localStorage.setItem("alerted", "yes");
}

const addEdges = () => {
  if (cnt < 2) {
    alert("Create at least two nodes to add an edge");
    return;
  }

  addEdge = true;
  document.getElementById("add-edge-enable").disabled = true;
  document.getElementsByClassName("run-btn")[0].disabled = false;
  dist = new Array(cnt + 1)
    .fill(Infinity)
    .map(() => new Array(cnt + 1).fill(Infinity));
};

let arr = [];

const appendBlock = (x, y) => {
  document.querySelector(".reset-btn").disabled = false;
  document.querySelector(".click-instruction").style.display = "none";
  const block = document.createElement("div");
  block.classList.add("block");
  block.style.top = `${y}px`;
  block.style.left = `${x}px`;
  block.style.transform = `translate(-50%,-50%)`;
  block.id = cnt;

  block.innerText = cnt++;

  block.addEventListener("click", (e) => {
    e.stopPropagation() || (window.event.cancelBubble = "true");

    if (!addEdge) return;

    block.style.backgroundColor = "coral";
    arr.push(block.id);

    if (arr.length === 2) {
      drawUsingId(arr);
      arr = [];
    }
  });
  blocks.appendChild(block);
};

blocks.addEventListener("click", (e) => {
  if (addEdge) return;
  if (cnt > 12) {
    alert("Cannot add more than 12 vertices");
    return;
  }
  appendBlock(e.x, e.y);
});

const drawLine = (x1, y1, x2, y2, ar) => {
  const len = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  const slope = x2 - x1 ? (y2 - y1) / (x2 - x1) : y2 > y1 ? 90 : -90;

  dist[Number(ar[0])][Number(ar[1])] = Math.round(len / 10);

  const line = document.createElement("div");
  line.id = `line-${ar[0]}-${ar[1]}`;
  line.classList.add("line");
  line.style.width = `${len}px`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;

  let p = document.createElement("p");
  p.classList.add("edge-weight");
  p.innerText = Math.round(len / 10);
  p.contentEditable = "true";
  p.inputMode = "numeric";
  p.addEventListener("blur", (e) => {
    if (isNaN(Number(e.target.innerText))) {
      alert("Enter valid edge weight");
      return;
    }
    n1 = Number(p.closest(".line").id.split("-")[1]);
    n2 = Number(p.closest(".line").id.split("-")[2]);
    dist[n1][n2] = Number(e.target.innerText);
  });
  line.style.transform = `rotate(${Math.atan(slope)}rad)`;
  p.style.transform = `rotate(${Math.atan(slope) * -1}rad)`;

  line.append(p);
  blocks.appendChild(line);
  document.getElementById(ar[0]).style.backgroundColor = "#333";
  document.getElementById(ar[1]).style.backgroundColor = "#333";
};

const drawUsingId = (ar) => {
  if (ar[0] === ar[1]) {
    document.getElementById(arr[0]).style.backgroundColor = "#333";
    arr = [];
    return;
  }
  x1 = Number(document.getElementById(ar[0]).style.left.slice(0, -2));
  y1 = Number(document.getElementById(ar[0]).style.top.slice(0, -2));
  x2 = Number(document.getElementById(ar[1]).style.left.slice(0, -2));
  y2 = Number(document.getElementById(ar[1]).style.top.slice(0, -2));
  drawLine(x1, y1, x2, y2, ar);
};

const generateAdjacencyMatrix = () => {
  let matrix = "<table class='matrix'>";
  // Header row with node numbers
  matrix += "<tr><td></td>";
  for (let i = 0; i < cnt; i++) {
    matrix += `<td>${i}</td>`;
  }
  matrix += "</tr>";

  // Matrix body with node numbers and edge weights
  for (let i = 0; i < cnt; i++) {
    matrix += "<tr>";
    matrix += `<td>${i}</td>`;
    for (let j = 0; j < cnt; j++) {
      if (dist[i][j] === Infinity) {
        matrix += "<td>∞</td>";
      } else {
        matrix += `<td>${dist[i][j]}</td>`;
      }
    }
    matrix += "</tr>";
  }
  matrix += "</table>";
  return matrix;
};

const findShortestPath = (el) => {
  let visited = [];
  let unvisited = [];
  clearScreen();

  let source = Number(document.getElementById("source-node").value);
  if (source >= cnt || isNaN(source)) {
    alert("Invalid source");
    return;
  }
  document.getElementById(source).style.backgroundColor = "grey";

  let parent = [];
  parent[source] = -1;
  visited = [];
  for (let i = 0; i < cnt; i++) unvisited.push(i);

  let cost = [];
  for (let i = 0; i < cnt; i++) {
    i === source
      ? null
      : dist[source][i]
      ? (cost[i] = dist[source][i])
      : (cost[i] = Infinity);
  }
  cost[source] = 0;

  let minCost = [];
  minCost[source] = 0;

  while (unvisited.length) {
    let mini = cost.indexOf(Math.min(...cost));
    visited.push(mini);
    unvisited.splice(unvisited.indexOf(mini), 1);

    for (let j of unvisited) {
      if (j === mini) continue;
      if (cost[j] > dist[mini][j] + cost[mini]) {
        minCost[j] = dist[mini][j] + cost[mini];
        cost[j] = dist[mini][j] + cost[mini];
        parent[j] = mini;
      } else {
        minCost[j] = cost[j];
      }
    }
    cost[mini] = Infinity;
  }

  for (let i = 0; i < cnt; i++)
    parent[i] === undefined ? (parent[i] = source) : null;

  document.getElementsByClassName("path")[0].innerHTML = "";
  // Add the title
  let title = document.createElement("p");
  title.innerText = "The Adjacency Matrix is: \n" + "\n";
  document.getElementsByClassName("path")[0].appendChild(title);
  let matrixDiv = document.createElement("div");
  matrixDiv.classList.add("matrix-container");
  matrixDiv.innerHTML = generateAdjacencyMatrix();
  document.getElementsByClassName("path")[0].appendChild(matrixDiv);

  indicatePath(parent, source);
};

const indicatePath = async (parentArr, src) => {
  for (let i = 0; i < cnt; i++) {
    let p = document.createElement("p");
    p.innerText =
      "\n" +
      "The Shortest path from source node to node " +
      i +
      " is: " +
      src +
      "\n\n";
    await printPath(parentArr, i, p);
  }
};

const printPath = async (parent, j, el_p) => {
  if (parent[j] === -1) return;
  await printPath(parent, parent[j], el_p);
  el_p.innerText = el_p.innerText + " " + j;

  document.getElementsByClassName("path")[0].style.padding = "1rem";
  document.getElementsByClassName("path")[0].appendChild(el_p);

  if (j < parent[j]) {
    let tmp = document.getElementById(`line-${j}-${parent[j]}`);
    await colorEdge(tmp);
  } else {
    let tmp = document.getElementById(`line-${parent[j]}-${j}`);
    await colorEdge(tmp);
  }
};

const colorEdge = async (el) => {
  if (el.style.backgroundColor !== "aqua") {
    await wait(1000);
    el.style.backgroundColor = "aqua";
    el.style.height = "8px";
  }
};

const clearScreen = () => {
  document.getElementsByClassName("path")[0].innerHTML = "";
  let lines = document.getElementsByClassName("line");
  for (let line of lines) {
    line.style.backgroundColor = "#EEE";
    line.style.height = "5px";
  }
};

const resetDrawingArea = () => {
  blocks.innerHTML = "";

  const p = document.createElement("p");
  p.classList.add("click-instruction");
  p.innerHTML = "Click to create node";

  blocks.appendChild(p);
  document.getElementById("add-edge-enable").disabled = false;
  document.querySelector(".reset-btn").disabled = true;
  document.getElementsByClassName("path")[0].innerHTML = "";

  cnt = 0;
  dist = [];
  addEdge = false;
};

const wait = async (t) => {
  let pr = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("done!");
    }, t);
  });
  res = await pr;
};
