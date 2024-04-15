// script.js
document.getElementById("visualize-btn").addEventListener("click", function() {
    const inputArray = document.getElementById("input-array").value.trim().split(",").map(num => parseInt(num.trim()));
    const stepsDiv = document.getElementById("steps");
    stepsDiv.innerHTML = "";
    visualizeQuickSort(inputArray, stepsDiv);
});

function visualizeQuickSort(arr, stepsDiv) {
    const sortedArray = quickSort(arr.slice()); // Create a copy of the input array to avoid modification
    const steps = [];
    quickSortHelper(arr.slice(), 0, arr.length - 1, steps);
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

function quickSortHelper(arr, low, high, steps) {
    if (low < high) {
        const pivotIndex = partition(arr, low, high, steps);
        quickSortHelper(arr, low, pivotIndex - 1, steps);
        quickSortHelper(arr, pivotIndex + 1, high, steps);
    }
}

function partition(arr, low, high, steps) {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap arr[i] and arr[j]
            steps.push({ type: "compare", array: arr.slice(), comparisonIndexes: [i, j], description: `Swapping ${arr[i]} and ${arr[j]}` });
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Swap arr[i + 1] and arr[high]
    steps.push({ type: "compare", array: arr.slice(), comparisonIndexes: [i + 1, high], description: `Swapping ${arr[i + 1]} and ${arr[high]}` });

    return i + 1;
}

function quickSort(arr) {
    quickSortHelper(arr, 0, arr.length - 1, []);
    return arr;
}
