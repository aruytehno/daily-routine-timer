document.addEventListener('DOMContentLoaded', function() {
    let simulatedTime = new Date(); // Начальное время

    // Задаем начальные значения для анимации
    updateSecondDuration('2s');
    updateMinuteDuration('3s');
    updateHourDuration('4s');

    setTimeout(() => {
        updateSecondDuration('1s');
    }, 2000);

    setTimeout(() => {
        updateMinuteDuration('10s');
    }, 3000);

    setTimeout(() => {
        updateHourDuration('20s');
    }, 4000);

    // Коэффициент ускорения времени. Например, 8640 ускорит время в 8640 раз, т.е. сутки за 10 секунд
    const accelerationFactor = 1;

    // Функция для симуляции времени
    function simulateTime() {
        const realElapsed = Date.now() - simulatedTime.getTime(); // Прошло реального времени
        const simulatedElapsed = realElapsed * accelerationFactor; // Ускоряем прошедшее время
        return new Date(simulatedTime.getTime() + simulatedElapsed); // Возвращаем новое "ускоренное" время
    }

    const events = [
        { name: 'Подъем', duration: 60, timerName: 'До выхода из дома' }, // 60 минут
        { name: 'Дорога на работу', duration: 60, timerName: 'До работы' }, // 60 минут
        { name: 'Работа', duration: 180, timerName: 'До обеда' }, // 3 часа
        { name: 'Обед', duration: 60, timerName: 'До конца обеда' }, // 1 час
        { name: 'Работа', duration: 240, timerName: 'До конца работы' }, // 4 часа
        { name: 'Дорога домой', duration: 60, timerName: 'До дома' }, // 1 час
        { name: 'Отдых', duration: 300, timerName: 'До сна' }, // 6 часов
        { name: 'Сон', duration: 480, timerName: 'До подъема' } // 8 часов
    ];

    const eventsContainer = document.getElementById('events');
    const timerElement = document.getElementById('lazy');
    const eventNameElement = document.getElementById('eventName');
    const startTimeInput = document.getElementById('startTimeInput');

    let startOfDay;

    // Обработчик события изменения времени
    startTimeInput.addEventListener('change', () => {
        const [hours, minutes] = startTimeInput.value.split(':').map(Number);
        startOfDay = new Date();
        startOfDay.setHours(hours, minutes, 0, 0);
        renderEvents();
        updateEvents();
    });

    /**
     * Функция для получения времени начала и конца события.
     * @param {Object} event - Объект события с длительностью и другими данными.
     * @param {Date} referenceDate - Дата, к которой привязано событие.
     * @param {Date} startTime - Время начала события.
     * @returns {Object} - Объект с временем начала и окончания события.
     */
    function getEventTimes(event, referenceDate, startTime) {
        const startTimeCopy = new Date(startTime);
        const endTime = new Date(startTimeCopy.getTime() + event.duration * 60000); // Добавляем длительность события
        return { startTime: startTimeCopy, endTime };
    }

    /**
     * Функция для рендеринга списка событий.
     */
    function renderEvents() {
        eventsContainer.innerHTML = ''; // Очищаем предыдущие события
        const now = simulateTime(); // Используем ускоренное время
        let currentStartTime = new Date(startOfDay);

        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event-item');

            const { startTime, endTime } = getEventTimes(event, now, currentStartTime);
            currentStartTime = new Date(endTime); // Следующее событие начинается сразу после предыдущего

            if (now < startTime) {
                // Предстоящее событие
                eventElement.innerHTML = `
                    <span class="event-time">${startTime.toTimeString().substring(0, 5)} - ${endTime.toTimeString().substring(0, 5)}</span>
                    <span class="event-name">${event.name}</span>
                `;
            } else if (now >= startTime && now <= endTime) {
                // Текущее событие
                eventElement.innerHTML = `
                    <span class="event-status" style="color: #8ffe09">${startTime.toTimeString().substring(0, 5)} - ${endTime.toTimeString().substring(0, 5)}</span>
                    <span class="event-name" style="color: #8ffe09">${event.name}</span>
                `;
            } else {
                // Прошедшее событие
                eventElement.innerHTML = `
                    <span class="event-status" style="color: #808080">${startTime.toTimeString().substring(0, 5)} - ${endTime.toTimeString().substring(0, 5)}</span>
                    <span class="event-name" style="color: #808080">${event.name}</span>
                `;
            }

            eventsContainer.appendChild(eventElement);
        });
    }

    /**
     * Функция для получения текущего события.
     * @param {Date} now - Текущее время.
     * @returns {Object|null} - Объект с текущим событием и временем окончания, или null, если текущее событие не найдено.
     */
    function getCurrentEvent(now) {
        let currentStartTime = new Date(startOfDay);

        for (const event of events) {
            const { startTime, endTime } = getEventTimes(event, now, currentStartTime);
            currentStartTime = new Date(endTime);
            if (now >= startTime && now <= endTime) {
                return { event, endTime };
            }
        }

        // Если текущее время превышает конец последнего события, начать цикл заново
        if (now > currentStartTime) {
            startOfDay.setDate(startOfDay.getDate() + 1); // Увеличиваем день на 1
            return getCurrentEvent(now); // Рекурсивно вызываем функцию, чтобы получить новое событие
        }

        return null;
    }

    function updateHourDuration(hourDuration) {
        const root = document.documentElement;
        root.style.setProperty('--hour-duration', hourDuration);
    }

    function updateMinuteDuration(minuteDuration) {
        const root = document.documentElement;
        root.style.setProperty('--minute-duration', minuteDuration);
    }

    function updateSecondDuration(secondDuration) {
        const root = document.documentElement;
        root.style.setProperty('--second-duration', secondDuration);
    }

    function updateEvents() {
        const now = simulateTime(); // Используем ускоренное время
        const currentEvent = getCurrentEvent(now);

        if (currentEvent) {
            const { event, endTime } = currentEvent;
            const countdown = Math.floor((endTime - now) / 1000);

            // Обновляем отображение таймера и названия события
            timerElement.innerText = formatTime(countdown);
            eventNameElement.innerText = event.timerName;

            // Обновляем заголовок страницы
            document.title = `${formatTime(countdown)}`;
        }
    }

    /**
     * Функция для форматирования времени в строку в формате ЧЧ:ММ:СС.
     * @param {number} seconds - Количество секунд.
     * @returns {string} - Отформатированное время.
     */
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Инициализируем начальные значения, если время уже установлено
    if (startTimeInput.value) {
        const [hours, minutes] = startTimeInput.value.split(':').map(Number);
        startOfDay = new Date();
        startOfDay.setHours(hours, minutes, 0, 0);
        renderEvents();
        updateEvents();
    }

    // Обновляем расписание и таймер каждую секунду
    setInterval(() => {
        if (startOfDay) {
            renderEvents();
            updateEvents();
        }
    }, 1000);
});
