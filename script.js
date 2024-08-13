document.addEventListener('DOMContentLoaded', function() {
    const events = [
        { name: 'Подъем', start: '08:00', end: '09:00' },
        { name: 'Дорога на работу', start: '09:00', end: '10:00' },
        { name: 'Работа', start: '10:00', end: '13:00' },
        { name: 'Обед', start: '13:00', end: '14:00' },
        { name: 'Работа', start: '14:00', end: '18:00' },
        { name: 'Дорога домой', start: '18:00', end: '19:00' },
        { name: 'Сон', start: '23:00', end: '08:00' }
    ];

    const eventsContainer = document.getElementById('events');
    const timerElement = document.getElementById('lazy');
    const eventNameElement = document.getElementById('eventName');

    function renderEvents() {
        eventsContainer.innerHTML = '';
        const now = new Date();

        events.forEach(event => {
            const eventStart = getTime(event.start, now);
            const eventEnd = getTime(event.end, now, eventStart);

            const eventElement = document.createElement('div');
            eventElement.classList.add('event-item');

            if (now < eventStart) {
                eventElement.innerHTML = `
                    <span class="event-time">${event.start} - ${event.end}</span>
                    <span class="event-name">${event.name}</span>
                `;
            } else if (now >= eventStart && now <= eventEnd) {
                eventElement.innerHTML = `
                    <span class="event-status" style="color: #8ffe09">${event.start} - ${event.end}</span>
                    <span class="event-name" style="color: #8ffe09">${event.name}</span>
                `;
            } else {
                eventElement.innerHTML = `
                    <span class="event-status" style="color: #808080">${event.start} - ${event.end}</span>
                    <span class="event-name" style="color: #808080">${event.name}</span>
                `;
            }

            eventsContainer.appendChild(eventElement);
        });
    }

    function updateEvents() {
        const now = new Date();
        const currentEvent = getCurrentEvent(now);

        if (currentEvent) {
            const endTime = getTime(currentEvent.end, now, getTime(currentEvent.start, now));

            if (now <= endTime) {
                const countdown = Math.floor((endTime - now) / 1000);
                timerElement.innerText = formatTime(countdown);
                eventNameElement.innerText = currentEvent.name;
            } else {
                timerElement.innerText = '00:00:00';
                eventNameElement.innerText = 'Расписание дня';
            }
        } else {
            timerElement.innerText = '00:00:00';
            eventNameElement.innerText = 'Расписание дня';
        }
    }

    function getTime(timeString, referenceDate, startDate = null) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const time = new Date(referenceDate);
        time.setHours(hours);
        time.setMinutes(minutes);
        time.setSeconds(0);

        if (startDate && time < startDate) {
            time.setDate(time.getDate() + 1);
        }

        return time;
    }

    function getCurrentEvent(now) {
        return events.find(event => {
            const eventStart = getTime(event.start, now);
            const eventEnd = getTime(event.end, now, eventStart);
            return now >= eventStart && now <= eventEnd;
        });
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    setInterval(() => {
        updateEvents();
        renderEvents();
    }, 1000);

    renderEvents();
    updateEvents();
});
