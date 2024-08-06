document.addEventListener('DOMContentLoaded', function() {
    // События для расписания (можно изменить и добавить свои)
    const events = [
        { name: 'Подъем', start: '08:00', end: '09:00' },
        { name: 'Дорога на работу', start: '09:00', end: '10:00' },
        { name: 'Работа', start: '10:00', end: '13:00' },
        { name: 'Обед', start: '13:00', end: '14:00' },
        { name: 'Работа', start: '14:00', end: '18:00' },
        { name: 'Дорога домой', start: '18:00', end: '19:00' },
        { name: 'Сон', start: '00:00', end: '08:00' }
        // Добавьте свои события здесь
    ];

    const eventsContainer = document.getElementById('events');
    const timerElement = document.getElementById('lazy');
    const eventNameElement = document.getElementById('eventName');

    // Функция для создания и добавления элементов списка событий
    function renderEvents() {
        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event-item');

            const now = new Date();
            const eventStart = new Date();
            const eventEnd = new Date();

            const [startHour, startMinute] = event.start.split(':');
            eventStart.setHours(parseInt(startHour, 10));
            eventStart.setMinutes(parseInt(startMinute, 10));
            eventStart.setSeconds(0);

            const [endHour, endMinute] = event.end.split(':');
            eventEnd.setHours(parseInt(endHour, 10));
            eventEnd.setMinutes(parseInt(endMinute, 10));
            eventEnd.setSeconds(0);

            if (now < eventStart) {
                // Предстоящее событие
                eventElement.innerHTML = `
                    <span class="event-time">${event.start} - ${event.end}</span>
                    <span class="event-name">${event.name}</span>
                `;
            } else if (now >= eventStart && now <= eventEnd) {
                // Текущее событие
                eventElement.innerHTML = `
                    <span class="event-status">${event.start} - ${event.end}</span>
                    <span class="event-name">${event.name}</span>  
                `;
            } else {
                // Прошедшее событие
                eventElement.innerHTML = `
                    <span class="event-status">${event.start} - ${event.end}</span>
                    <span class="event-name">${event.name}</span>
                    
                `;
            }

            eventsContainer.appendChild(eventElement);
        });
    }

    // Функция для обновления текущего события и таймера
    function updateEvents() {
        const now = new Date();
        const currentEvent = getCurrentEvent(now);
        
        if (currentEvent) {
            const startTime = new Date();
            const [startHour, startMinute] = currentEvent.start.split(':');
            startTime.setHours(parseInt(startHour, 10));
            startTime.setMinutes(parseInt(startMinute, 10));
            startTime.setSeconds(0);
            
            const endTime = new Date();
            const [endHour, endMinute] = currentEvent.end.split(':');
            endTime.setHours(parseInt(endHour, 10));
            endTime.setMinutes(parseInt(endMinute, 10));
            endTime.setSeconds(0);

            // Если endTime меньше startTime, значит это событие проходит через полночь
            if (endTime < startTime) {
                endTime.setDate(endTime.getDate() + 1); // Увеличиваем дату на 1, чтобы перейти к следующему дню
            }

            if (now >= startTime && now <= endTime) {
                // Событие идет в данный момент
                const countdown = Math.floor((endTime - now) / 1000);
                timerElement.innerText = formatTime(countdown);
                eventNameElement.innerText = currentEvent.name;
            } else {
                // Событие уже завершилось
                timerElement.innerText = '00:00:00';
                eventNameElement.innerText = 'Расписание дня';
            }
        } else {
            // Если текущее событие не определено (например, все события завершились), очищаем таймер
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

    // Обновляем расписание каждую секунду
    setInterval(updateEvents, 1000);

    // Инициализируем первоначальное отображение списка событий
    renderEvents();

    // Инициализируем первоначальное отображение текущего события и таймера
    updateEvents();
});

function getCurrentEvent(now) {
    const events = [
        { name: 'Подъем', start: '08:00', end: '09:00' },
        { name: 'Дорога до работы', start: '09:00', end: '10:00' },
        { name: 'Работа', start: '10:00', end: '13:00' },
        { name: 'Обед', start: '13:00', end: '14:00' },
        { name: 'До конца работы', start: '14:00', end: '18:00' },
        { name: 'Дорога домой', start: '18:00', end: '19:00' },
        { name: 'Сон', start: '23:59', end: '08:00' }
        // Добавьте свои события здесь
    ];

    let currentEvent = null;

    events.forEach(event => {
        const startTime = new Date();
        const [startHour, startMinute] = event.start.split(':');
        startTime.setHours(parseInt(startHour, 10));
        startTime.setMinutes(parseInt(startMinute, 10));
        startTime.setSeconds(0);
        
        const endTime = new Date();
        const [endHour, endMinute] = event.end.split(':');
        endTime.setHours(parseInt(endHour, 10));
        endTime.setMinutes(parseInt(endMinute, 10));
        endTime.setSeconds(0);

        if (now >= startTime && now <= endTime) {
            currentEvent = event;
        }
    });

    return currentEvent;
}