document.addEventListener('DOMContentLoaded', function() {
    // Массив событий без жестко заданного времени
    const events = [
        { name: 'Подъем', duration: 60, timerName: 'До выхода из дома' }, // 60 минут
        { name: 'Дорога на работу', duration: 60, timerName: 'До работы' }, // 60 минут
        { name: 'Работа', duration: 180, timerName: 'До обеда' }, // 3 часа
        { name: 'Обед', duration: 60, timerName: 'До конца обеда' },
        { name: 'Работа', duration: 240, timerName: 'До конца работы' }, // 4 часа
        { name: 'Дорога домой', duration: 60, timerName: 'До дома' },
        { name: 'Отдых', duration: 240, timerName: 'До сна' },
        { name: 'Сон', duration: 540, timerName: 'До подъема' } // 9 часов
    ];

    const eventsContainer = document.getElementById('events');
    const timerElement = document.getElementById('lazy');
    const eventNameElement = document.getElementById('eventName');
    const startTimeInput = document.getElementById('startTimeInput');
    const setStartTimeBtn = document.getElementById('setStartTimeBtn');

    let startOfDay;

    setStartTimeBtn.addEventListener('click', () => {
        const [hours, minutes] = startTimeInput.value.split(':').map(Number);
        startOfDay = new Date();
        startOfDay.setHours(hours, minutes, 0, 0);
        renderEvents();
        updateEvents();
    });

    function getEventTimes(event, referenceDate, startTime) {
        const startTimeCopy = new Date(startTime);
        const endTime = new Date(startTimeCopy.getTime() + event.duration * 60000); // Добавляем длительность события

        return { startTime: startTimeCopy, endTime };
    }

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

    function updateEvents() {
        const now = new Date();
        const currentEventData = getCurrentEvent(now);

        if (currentEventData) {
            const { event, endTime } = currentEventData;
            const countdown = Math.floor((endTime - now) / 1000);
            timerElement.innerText = formatTime(countdown);
            eventNameElement.innerText = event.timerName;
            // Обновление заголовка страницы
            document.title = `${formatTime(countdown)}`;
        } else {
            // Нет текущего события
            timerElement.innerText = '00:00:00';
            eventNameElement.innerText = 'Расписание дня';
        }
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Обновляем расписание и таймер каждую секунду
    setInterval(() => {
        if (startOfDay) {
            renderEvents();
            updateEvents();
        }
    }, 1000);

    // Инициализируем начальные значения
    setStartTimeBtn.click();
});
