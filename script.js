// Objeto para almacenar los temporizadores de los empleados
let timers = {};

function getCurrentTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Función para agregar un nuevo empleado
function addEmployee() {
    // Obtener el nombre del empleado mediante una ventana emergente
    const name = prompt('Ingrese Nick:');
    if (!name) {
        return; // Salir de la función si no se proporciona un nombre
    }

    // Crear el div del empleado
    const employeeDiv = document.createElement('div');
    employeeDiv.classList.add('employee');
    employeeDiv.dataset.name = name;

    // Agregar botón para borrar el div del empleado
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => deleteEmployee(employeeDiv));
    employeeDiv.appendChild(deleteButton);

    // Agregar hora actual en formato horas:minutos
    const currentTimeDiv = document.createElement('div');
    currentTimeDiv.textContent = '--:--';
    currentTimeDiv.classList.add('current-time');
    employeeDiv.appendChild(currentTimeDiv);

    // Agregar nombre del empleado
    const nameDiv = document.createElement('div');
    nameDiv.textContent = name;
    nameDiv.classList.add('employee-name');
    employeeDiv.appendChild(nameDiv);

    // Agregar temporizador del empleado
    const timerDiv = document.createElement('div');
    timerDiv.textContent = '00:00:00';
    timerDiv.classList.add('timer');
    employeeDiv.appendChild(timerDiv);

    // Agregar botones de control
    const controlsDiv = document.createElement('div');

    const startButton = document.createElement('button');
    startButton.textContent = 'Start';
    startButton.classList.add('play-button');
    startButton.addEventListener('click', () => startTimer(name));
    controlsDiv.appendChild(startButton);

    const pauseButton = document.createElement('button');
    pauseButton.textContent = 'Pause';
    pauseButton.classList.add('pausebtn');
    pauseButton.addEventListener('click', () => pauseTimer(name));
    controlsDiv.appendChild(pauseButton);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.classList.add('reloadbtn');
    resetButton.addEventListener('click', () => resetTimer(name));
    controlsDiv.appendChild(resetButton);

    employeeDiv.appendChild(controlsDiv);

    // Agregar el div del empleado al contenedor
    const container = document.getElementById('employees-container');
    container.appendChild(employeeDiv);
}

// Función para eliminar el div del empleado
function deleteEmployee(employeeDiv) {
    employeeDiv.remove();
}

// Objeto para almacenar las fechas de inicio de los temporizadores de los empleados
let startDates = {};
// Objeto para almacenar los tiempos transcurridos al momento de pausar los temporizadores de los empleados
let pausedTimes = {};

function startTimer(name) {
    const employeeDiv = document.querySelector(`.employee[data-name="${name}"]`);
    const timerDiv = employeeDiv.querySelector('.timer');
    const playButton = employeeDiv.querySelector('.play-button');
    const currentTimeDiv = employeeDiv.querySelector('.current-time');


    // Si el temporizador ya está en funcionamiento, no hacer nada
    if (timers[name]) {
        return;
    }
    if (currentTimeDiv.textContent === '--:--') {
        // Obtener la hora actual
        const currentTime = getCurrentTime();
        // Actualizar el div de hora con la hora actual
        currentTimeDiv.textContent = currentTime;
    }

    playButton.classList.add('play-button'); // Agregar clase de botón de reproducción
    playButton.classList.remove('paused'); // Asegurarse de que el botón no esté pausado

    const startDate = new Date();
    if (pausedTimes[name]) {
        // Si hay un tiempo pausado para este empleado, ajustar la fecha de inicio
        startDate.setMilliseconds(startDate.getMilliseconds() - pausedTimes[name]);
        delete pausedTimes[name]; // Eliminar el tiempo pausado
    }

    startDates[name] = startDate; // Almacenar la fecha de inicio

    timers[name] = setInterval(() => {
        const currentDate = new Date();
        const elapsed = currentDate - startDates[name]; // Calcular el tiempo transcurrido desde la fecha de inicio
        const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
        const seconds = Math.floor((elapsed / 1000) % 60);
        timerDiv.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);

    // Cambiar el color del botón a verde
    playButton.style.backgroundColor = '#4CAF50'; // Verde
}

// Función para pausar el temporizador de un empleado
function pauseTimer(name) {
    clearInterval(timers[name]);
    timers[name] = null; // Eliminar el temporizador
    const currentDate = new Date();
    pausedTimes[name] = currentDate - startDates[name]; // Almacenar el tiempo transcurrido hasta el momento de pausar

    const employeeDiv = document.querySelector(`.employee[data-name="${name}"]`);
    const playButton = employeeDiv.querySelector('.play-button');

    // Cambiar el color del botón a gris oscuro cuando se pausa
    playButton.classList.add('paused');
    playButton.style.backgroundColor = '#555'; // Gris oscuro
}

// Función para reiniciar el temporizador de un empleado
function resetTimer(name) {
    const employeeDiv = document.querySelector(`.employee[data-name="${name}"]`);
    const timerDiv = employeeDiv.querySelector('.timer');
    const playButton = employeeDiv.querySelector('.play-button');

    timerDiv.textContent = '00:00:00';
    clearInterval(timers[name]);
    delete timers[name]; // Eliminar el temporizador
    delete startDates[name]; // Eliminar la fecha de inicio
    delete pausedTimes[name]; // Eliminar el tiempo pausado

    // Restaurar el color original del botón
    playButton.style.backgroundColor = ''; // Restaurar el color original
}
// Función para descargar los datos de los empleados
function downloadEmployeeData() {
    // Obtener la fecha actual
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10); // Formato YYYY-MM-DD

    // Crear el contenido del archivo
    const employeeDivs = document.querySelectorAll('.employee');
    let data = 'Tiempos:\n';
    employeeDivs.forEach((employeeDiv, index) => {
        const name = employeeDiv.querySelector('.employee-name').textContent;
        const time = employeeDiv.querySelector('.timer').textContent;
        data += `${name} - ${time}\n`;
    });

    // Crear un elemento <a> para descargar el archivo
    const downloadLink = document.createElement('a');
    downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(data);
    downloadLink.download = `registro_${formattedDate}.txt`; // Nombre del archivo

    // Agregar el enlace al cuerpo del documento y simular un clic para iniciar la descarga
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Eliminar el enlace después de la descarga
    document.body.removeChild(downloadLink);
}

