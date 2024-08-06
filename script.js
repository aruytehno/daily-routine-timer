document.addEventListener('DOMContentLoaded', function() {
    // События для расписания (можно изменить и добавить свои)
    const events = [
        { name: 'Подъем', start: '08:00', end: '09:00' },
        { name: 'Дорога до работы', start: '09:00', end: '10:00' },
        { name: 'Работа', start: '10:00', end: '13:00' },
        { name: 'Обед', start: '13:00', end: '14:00' },
        { name: 'Работа', start: '14:00', end: '18:00' },
        { name: 'Дорога домой', start: '18:00', end: '19:00' },
        { name: 'Сон', start: '23:59', end: '08:00' }
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
            
            const endTime = new Date();
            const [endHour, endMinute] = event.end.split(':');
            endTime.setHours(parseInt(endHour, 10));
            endTime.setMinutes(parseInt(endMinute, 10));
            endTime.setSeconds(0);

            // Если endTime меньше startTime, значит это событие проходит через полночь
            if (endTime < startTime) {
                endTime.setDate(endTime.getDate() + 1); // Увеличиваем дату на 1, чтобы перейти к следующему дню
            }

            const eventElement = document.createElement('div');
            eventElement.classList.add('event');
            
            if (now < startTime) {
                // Событие ещё не началось
                const countdown = Math.floor((startTime - now) / 1000);
                eventElement.innerHTML = `<strong>${event.name}</strong><br>${event.start}`;
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

        if (hours > 0) {
            return `${hours}ч ${minutes}м`;
        } else {
            return `${minutes}м ${remainingSeconds}с`;
        }
    }

    // Обновляем расписание каждую секунду
    setInterval(updateEvents, 1000);

    // Инициализируем первоначальное отображение
    updateEvents();
});



var defaults = {}
  , one_second = 1000
  , one_minute = one_second * 60
  , one_hour = one_minute * 60
  , one_day = one_hour * 24
  , startDate = new Date()
  , face = document.getElementById('lazy');

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
var requestAnimationFrame = (function() {
  return window.requestAnimationFrame       || 
         window.webkitRequestAnimationFrame || 
         window.mozRequestAnimationFrame    || 
         window.oRequestAnimationFrame      || 
         window.msRequestAnimationFrame     || 
         function( callback ){
           window.setTimeout(callback, 1000 / 60);
         };
}());

tick();

function tick() {
    const now = new Date();
    const elapsed = now - startDate;
    const hours = Math.floor(elapsed / one_hour).toString().padStart(2, '0');
    const minutes = Math.floor((elapsed % one_hour) / one_minute).toString().padStart(2, '0');
    const seconds = Math.floor((elapsed % one_minute) / one_second).toString().padStart(2, '0');
    face.innerText = `${hours}:${minutes}:${seconds}`;
    requestAnimationFrame(tick);
}