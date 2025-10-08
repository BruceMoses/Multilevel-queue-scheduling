let ganttData = [];
let ganttChart = null;
const queues = {
    high: document.getElementById('highQueue'),
    medium: document.getElementById('mediumQueue'),
    low: document.getElementById('lowQueue')
};

const processList = [];

function addProcess(name, queue) {
    const processDiv = document.createElement('div');
    processDiv.classList.add('process');
    processDiv.textContent = name;
    processDiv.dataset.queue = queue;
    queues[queue].appendChild(processDiv);
    processList.push({name, queue, element: processDiv});
    document.getElementById('output').textContent = `${name} added to ${queue} priority queue.`;
}

async function runScheduling() {
    if (processList.length === 0) {
        document.getElementById('output').textContent = "No processes to schedule!";
        return;
    }

    const cpuSlot = document.getElementById('cpuSlot');
    cpuSlot.innerHTML = "";

    const order = processList
        .filter(p => p.queue === 'high')
        .concat(processList.filter(p => p.queue === 'medium'))
        .concat(processList.filter(p => p.queue === 'low'));

    document.getElementById('output').textContent = "Running processes...";

    // Reset Gantt data
    ganttData = [];
    let currentTime = 0;

    for (let p of order) {
        await moveToCPU(p.element, cpuSlot);
        ganttData.push({
            process: p.name,
            start: currentTime,
            end: currentTime + 1
        });
        await sleep(1000);
        cpuSlot.innerHTML = "";
        currentTime++;
    }

    document.getElementById('output').textContent = "All processes executed according to Multi-Level Queue Scheduling.";

    // Draw Gantt Chart
    drawGanttChart();

    // Clear queues
    Object.values(queues).forEach(q => q.innerHTML = `<h3>${q.querySelector('h3').textContent}</h3>`);
    processList.length = 0;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function moveToCPU(processDiv, cpuSlot) {
    const rectCPU = cpuSlot.getBoundingClientRect();
    const rectProcess = processDiv.getBoundingClientRect();
    const dx = rectCPU.left - rectProcess.left + rectCPU.width / 2 - rectProcess.width / 2;
    const dy = rectCPU.top - rectProcess.top;

    processDiv.style.transform = `translate(${dx}px, ${dy}px)`;
    await sleep(500);
    cpuSlot.appendChild(processDiv);
    processDiv.style.transform = `translate(0,0)`;
}
