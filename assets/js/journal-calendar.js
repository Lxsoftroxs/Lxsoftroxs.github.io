(function () {
  var dataEl = document.getElementById('journal-data');
  if (!dataEl) return;
  var journalEntries = JSON.parse(dataEl.textContent);

  var today = new Date();
  var currentYear = today.getFullYear();
  var currentMonth = today.getMonth();

  function buildCalendar(year, month) {
    var calendarDiv = document.getElementById('calendar');
    calendarDiv.innerHTML = '';

    var table = document.createElement('table');
    table.style.margin = '0 auto';
    table.style.borderCollapse = 'collapse';
    table.style.width = '80%';
    table.style.maxWidth = '600px';
    table.setAttribute('role', 'grid');

    var monthNames = ['January','February','March','April','May','June',
      'July','August','September','October','November','December'];
    var monthDisplay = document.getElementById('month-display');
    monthDisplay.textContent = monthNames[month] + ' ' + year;

    // Days of week header
    var daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    daysOfWeek.forEach(function(day) {
      var th = document.createElement('th');
      th.textContent = day;
      th.style.border = '1px solid #666';
      th.style.padding = '5px';
      th.setAttribute('scope', 'col');
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var date = 1;

    for (var i = 0; i < 6; i++) {
      var row = document.createElement('tr');
      for (var j = 0; j < 7; j++) {
        var cell = document.createElement('td');
        cell.style.border = '1px solid #666';
        cell.style.padding = '10px';
        cell.style.textAlign = 'center';

        if (i === 0 && j < firstDay) {
          cell.textContent = '';
        } else if (date > daysInMonth) {
          cell.textContent = '';
        } else {
          cell.textContent = date;
          var cellDate = year + '-' +
            (month + 1).toString().padStart(2, '0') + '-' +
            date.toString().padStart(2, '0');
          var entry = journalEntries.find(function(e) { return e.date === cellDate; });
          if (entry) {
            cell.style.backgroundColor = '#444';
            cell.style.cursor = 'pointer';
            cell.title = entry.title;
            cell.setAttribute('tabindex', '0');
            cell.setAttribute('role', 'button');
            cell.setAttribute('aria-label', entry.title + ' (' + cellDate + ')');
            (function(e) {
              cell.addEventListener('click', function() { window.location.href = e.url; });
              cell.addEventListener('keydown', function(ev) {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  ev.preventDefault();
                  window.location.href = e.url;
                }
              });
            })(entry);
          }
          date++;
        }
        row.appendChild(cell);
      }
      tbody.appendChild(row);
      if (date > daysInMonth) break;
    }
    table.appendChild(tbody);
    calendarDiv.appendChild(table);
  }

  document.getElementById('prev-month').addEventListener('click', function() {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    buildCalendar(currentYear, currentMonth);
  });

  document.getElementById('next-month').addEventListener('click', function() {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    buildCalendar(currentYear, currentMonth);
  });

  buildCalendar(currentYear, currentMonth);
})();
