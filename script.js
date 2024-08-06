document.addEventListener('DOMContentLoaded', function() {
    // События для расписания (можно изменить и добавить свои)
    const events = [
        { name: 'Утренняя гимнастика', start: '08:00', end: '08:30' },
        { name: 'Обед', start: '12:00', end: '13:00' },
        { name: 'Вечернее совещание', start: '18:00', end: '19:00' }
        // Добавьте свои события здесь
    ];

    const eventsContainer = document.getElementById('events');

    function updateEvents() {
        const now = new Date();
        
        // Очищаем текущий список событий
        eventsContainer.innerHTML = '';

        events.forEach(event => {
            const startTime = new Date();
            const [startHour, startMinute] = event.start.split(':');
            startTime.setHours(parseInt(startHour, 10));
            startTime.setMinutes(parseInt(startMinute, 10));
            startTime.setSeconds(0);
            
            const endTime = new Date(startTime);
            const [endHour, endMinute] = event.end.split(':');
            endTime.setHours(parseInt(endHour, 10));
            endTime.setMinutes(parseInt(endMinute, 10));
            endTime.setSeconds(0);

            const eventElement = document.createElement('div');
            eventElement.classList.add('event');
            if (now < startTime) {
                // Событие ещё не началось
                const countdown = Math.floor((startTime - now) / 1000);
                eventElement.innerHTML = `<strong>${event.name}</strong><br>Начнется через ${formatTime(countdown)}`;
            } else if (now >= startTime && now <= endTime) {
                // Событие идет в данный момент
                const countdown = Math.floor((endTime - now) / 1000);
                eventElement.innerHTML = `<strong>${event.name}</strong><br>Осталось ${formatTime(countdown)}`;
            } else {
                // Событие уже завершилось
                eventElement.classList.add('finished');
                eventElement.innerHTML = `<strong>${event.name}</strong><br>Завершено`;
            }

            eventsContainer.appendChild(eventElement);
        });
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours}ч ${minutes}м ${remainingSeconds}с`;
    }

    // Обновляем расписание каждую секунду
    setInterval(updateEvents, 1000);

    // Инициализируем первоначальное отображение
    updateEvents();
});