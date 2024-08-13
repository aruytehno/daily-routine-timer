document.addEventListener('DOMContentLoaded', function() {
    // Массив событий с указанием названий для таймера
    const events = [
        { name: 'Подъем', start: '08:00', end: '09:00', timerName: 'До выхода из дома' },
        { name: 'Дорога на работу', start: '09:00', end: '10:00', timerName: 'До работы' },
        { name: 'Работа', start: '10:00', end: '13:00', timerName: 'До обеда' },
        { name: 'Обед', start: '13:00', end: '14:00', timerName: 'До конца обеда' },
        { name: 'Работа', start: '14:00', end: '18:00', timerName: 'До конца работы' },
        { name: 'Дорога домой', start: '18:00', end: '19:00', timerName: 'До дома' },
        { name: 'Сон', start: '23:00', end: '08:00', timerName: 'До сна' }
        // Добавьте свои события здесь
    ];

    const eventsContainer = document.getElementById('events');
    const timerElement = document.getElementById('lazy');
    const eventNameElement = document.getElementById('eventName');

    // Функция для получения объектов Date для начала и конца события
    function getEventTimes(event, referenceDate) {
        const [startHour, startMinute] = event.start.split(':').map(Number);
        const [endHour, endMinute] = event.end.split(':').map(Number);

        const startTime = new Date(referenceDate);
        startTime.setHours(startHour, startMinute, 0, 0);

        let endTime = new Date(startTime);
        endTime.setHours(endHour, endMinute, 0, 0);

        if (endTime <= startTime) {
            // Событие пересекает полночь
            endTime.setDate(endTime.getDate() + 1);
        }

        return { startTime, endTime };
    }

    // Функция для отображения списка событий
    function renderEvents() {
        eventsContainer.innerHTML = ''; // Очищаем предыдущие события
        const now = new Date();

        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event-item');

            const { startTime, endTime } = getEventTimes(event, now);

            if (now < startTime) {
                // Предстоящее событие
                eventElement.innerHTML = `
                    <span class="event-time">${event.start} - ${event.end}</span>
                    <span class="event-name">${event.name}</span>
                `;
            } else if (now >= startTime && now <= endTime) {
                // Текущее событие
                eventElement.innerHTML = `
                    <span class="event-status" style="color: #8ffe09">${event.start} - ${event.end}</span>
                    <span class="event-name" style="color: #8ffe09">${event.name}</span>
                `;
            } else {
                // Прошедшее событие
                eventElement.innerHTML = `
                    <span class="event-status" style="color: #808080">${event.start} - ${event.end}</span>
                    <span class="event-name" style="color: #808080">${event.name}</span>
                `;
            }

            eventsContainer.appendChild(eventElement);
        });
    }

    // Функция для получения текущего события
    function getCurrentEvent(now) {
        for (const event of events) {
            const { startTime, endTime } = getEventTimes(event, now);
            if (now >= startTime && now <= endTime) {
                return { event, endTime };
            }
        }
        return null;
    }

    // Функция для обновления таймера и названия текущего события
    function updateEvents() {
        const now = new Date();
        const currentEventData = getCurrentEvent(now);

        if (currentEventData) {
            const { event, endTime } = currentEventData;
            const countdown = Math.floor((endTime - now) / 1000);
            timerElement.innerText = formatTime(countdown);
            eventNameElement.innerText = event.timerName;
        } else {
            // Нет текущего события
            timerElement.innerText = '00:00:00';
            eventNameElement.innerText = 'Расписание дня';
        }
    }

    // Функция для форматирования времени в формат HH:MM:SS
    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Обновляем расписание и таймер каждую секунду
    setInterval(() => {
        renderEvents();
        updateEvents();
    }, 1000);

    // Инициализируем первоначальное отображение
    renderEvents();
    updateEvents();
});
