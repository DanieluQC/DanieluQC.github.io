const addEmployeeBtn = document.getElementById('addEmployeeBtn');
const resetBtn = document.getElementById('resetBtn');

addEmployeeBtn.addEventListener('click', addEmployee);
resetBtn.addEventListener('click', resetAllTimers);

function addEmployee() {
    const name = prompt('Ingrese el nombre del empleado:');
    if (name) { // Si se ingresó un nombre
        const employeesContainer = document.querySelector('.employees');
        const employeeDiv = document.createElement('div');
        employeeDiv.classList.add('employee');

        const nameDisplay = document.createElement('div');
        nameDisplay.className = 'namedisp';
        nameDisplay.textContent = name;
        employeeDiv.appendChild(nameDisplay);

        const deleteEmployee = document.createElement('button');
        deleteEmployee.textContent = 'X';
        deleteEmployee.classList.add('boton-del');
        deleteEmployee.addEventListener('click', function () {
            employeeDiv.remove();
        });
        employeeDiv.appendChild(deleteEmployee);

        const timerDisplay = document.createElement('div');
        timerDisplay.classList.add('timer');
        timerDisplay.textContent = '00:00:00';
        employeeDiv.appendChild(timerDisplay);

        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'botones';
        controlsDiv.classList.add('controls');

        const startBtn = document.createElement('button');
        startBtn.textContent = 'Play';
        startBtn.className = 'playbtn';
        startBtn.addEventListener('click', startTimer);
        controlsDiv.appendChild(startBtn);

        const pauseBtn = document.createElement('button');
        pauseBtn.textContent = 'Pausar';
        pauseBtn.className = 'pausebtn';
        pauseBtn.addEventListener('click', pauseTimer);
        controlsDiv.appendChild(pauseBtn);

        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reiniciar';
        resetBtn.className = 'reloadbtn';
        resetBtn.addEventListener('click', resetTimer);
        controlsDiv.appendChild(resetBtn);

        employeeDiv.appendChild(controlsDiv);
        employeesContainer.appendChild(employeeDiv);
    }
}
let timers = {};


function startTimer(event) {
    const employeeDiv = event.target.closest('.employee');
    const name = employeeDiv.querySelector('div:first-child').textContent;
    // Verificar si el temporizador ya está corriendo
    if (!timers[name]) {
        timers[name] = setInterval(() => {
            const timerDisplay = employeeDiv.querySelector('.timer');
            const time = timerDisplay.textContent.split(':');
            let hours = parseInt(time[0], 10);
            let minutes = parseInt(time[1], 10);
            let seconds = parseInt(time[2], 10);

            seconds++;

            if (seconds === 60) {
                seconds = 0;
                minutes++;
            }

            if (minutes === 60) {
                minutes = 0;
                hours++;
            }

            timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000); // 1000ms = 1 segundo
    }
}

function pauseTimer(event) {
    const employeeDiv = event.target.closest('.employee');
    const name = employeeDiv.querySelector('div:first-child').textContent;

    // Verificar si el temporizador está corriendo
    if (timers[name]) {
        clearInterval(timers[name]);
        timers[name] = null;
    }
}

function resetTimer(event) {
    const employeeDiv = event.target.closest('.employee');
    const timerDisplay = employeeDiv.querySelector('.timer');
    timerDisplay.textContent = '00:00:00';

    const name = employeeDiv.querySelector('div:first-child').textContent;

    // Verificar si el temporizador está corriendo
    if (timers[name]) {
        clearInterval(timers[name]);
        timers[name] = null;
    }
}

function resetAllTimers() {
    // Reiniciar todos los temporizadores y vaciar el objeto timers
    for (const name in timers) {
        if (timers[name]) {
            clearInterval(timers[name]);
        }
    }
    timers = {};

    // Reiniciar todos los temporizadores en la interfaz a 00:00:00
    const timerDisplays = document.querySelectorAll('.timer');
    timerDisplays.forEach(timerDisplay => {
        timerDisplay.textContent = '00:00:00';
    });
}

/// Function to download employee data
function downloadEmployeeData() {
    // Get all employee divs
    const employeeDivs = document.querySelectorAll('.employee');

    // Create a string to store employee information
    let data = '';

    // Iterate over each employee div to get the information
    employeeDivs.forEach((employeeDiv, index) => {
        const employeeName = employeeDiv.querySelector('.namedisp').textContent;
        const employeeTime = employeeDiv.querySelector('.timer').textContent;

        // Add employee information to the string
        data += `${employeeName} - ${employeeTime}\n`;
    });

    // Create a Blob object with the data
    const blob = new Blob([data], { type: 'text/plain' });

    // Create a URL object for the Blob
    const url = URL.createObjectURL(blob);

    // Create an <a> element to download the file
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tiempos.txt';

    // Simulate a click on the link to initiate the download
    a.click();

    // Revoke the URL object
    URL.revokeObjectURL(url);
}