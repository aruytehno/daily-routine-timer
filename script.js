document.addEventListener('DOMContentLoaded', function() {
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
        const now = new Date();
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
        return null;
    }

    /**
     * Функция для обновления отображения таймера и названия события.
     */
    function updateEvents() {
        const now = new Date();
        const { event, endTime } = getCurrentEvent(now);
        const countdown = Math.floor((endTime - now) / 1000);

        // Обновляем отображение таймера и названия события
        timerElement.innerText = formatTime(countdown);
        eventNameElement.innerText = event.timerName;

        // Обновляем заголовок страницы
        document.title = `${formatTime(countdown)}`;

        // Получите корневой элемент документа
        const root = document.documentElement;
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
