// script.js
document.getElementById("visualize-btn").addEventListener("click", function() {
    const inputArray = document.getElementById("input-array").value.trim().split(",").map(num => parseInt(num.trim()));
    const stepsDiv = document.getElementById("steps");
    stepsDiv.innerHTML = "";
    visualizeMergeSort(inputArray, stepsDiv);
});

function visualizeMergeSort(arr, stepsDiv) {
    const sortedArray = mergeSort(arr.slice()); // Create a copy of the input array to avoid modification
    const steps = [];
    mergeSortHelper(arr.slice(), 0, arr.length - 1, steps);
    steps.push({ type: "sorted", array: sortedArray, description: "Array is now sorted" });

    // Animate the steps
    animateSteps(steps, stepsDiv, 0);
}

function animateSteps(steps, stepsDiv, index) {
    if (index >= steps.length) {
        return;
    }

    const step = steps[index];
    const stepDiv = document.createElement("div");
    stepDiv.className = "step";
    stepDiv.innerHTML = `<strong>Step ${index + 1}:</strong> ${step.description}`;
    const bars = createBars(step.array, step.type, step.comparisonIndexes);
    bars.forEach(bar => stepDiv.appendChild(bar));
    stepsDiv.appendChild(stepDiv);

    if (step.type !== "sorted") {
        setTimeout(() => {
            animateSteps(steps, stepsDiv, index + 1);
        }, 300); // Change animation speed here (in milliseconds)
    } else {
        document.getElementById("sorted-array").innerText = "Final Sorted Array: " + step.array.join(", ");
    }
}

function createBars(array, stepType, comparisonIndexes) {
    const maxBarHeight = 100;
    const maxBarWidth = 30;
    const bars = array.map((value, index) => {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = `${(value / Math.max(...array)) * maxBarHeight}px`;
        bar.style.width = `${maxBarWidth}px`;
        bar.innerText = value;

        if (stepType === "left") {
            bar.classList.add("left");
        } else if (stepType === "right") {
            bar.classList.add("right");
        } else if (stepType === "compare" && comparisonIndexes.includes(index)) {
            bar.classList.add("compare");
        }
        return bar;
    });
    return bars;
}

function mergeSortHelper(arr, start, end, steps) {
    if (start < end) {
        const mid = Math.floor((start + end) / 2);
        mergeSortHelper(arr, start, mid, steps);
        mergeSortHelper(arr, mid + 1, end, steps);
        merge(arr, start, mid, end, steps);
    }
}

function merge(arr, start, mid, end, steps) {
    const leftArray = arr.slice(start, mid + 1);
    const rightArray = arr.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
            arr[k++] = leftArray[i++];
        } else {
            arr[k++] = rightArray[j++];
        }
        steps.push({ type: "compare", array: arr.slice(), comparisonIndexes: [start + i, mid + 1 + j], description: `Comparing ${leftArray[i]} and ${rightArray[j]}` });
    }

    while (i < leftArray.length) {
        arr[k++] = leftArray[i++];
        steps.push({ type: "compare", array: arr.slice(), comparisonIndexes: [start + i - 1, start + i], description: `Moving ${leftArray[i - 1]} to its proper place` });
    }

    while (j < rightArray.length) {
        arr[k++] = rightArray[j++];
        steps.push({ type: "compare", array: arr.slice(), comparisonIndexes: [mid + 1 + j - 1, mid + 1 + j], description: `Moving ${rightArray[j - 1]} to its proper place` });
    }

    steps.push({ type: "merge", array: arr.slice(), description: `Merging subarrays [${leftArray.join(", ")}] and [${rightArray.join(", ")}]` });
}

function mergeSort(arr) {
    mergeSortHelper(arr, 0, arr.length - 1, []);
    return arr;
}
