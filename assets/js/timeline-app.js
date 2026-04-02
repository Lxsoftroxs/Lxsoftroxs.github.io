(function () {
  var dataEl = document.getElementById('timeline-data');
  if (!dataEl) return;
  var timelineData = JSON.parse(dataEl.textContent);

  function sortEvents(ascending) {
    return timelineData.sort(function(a, b) {
      var partsA = a.date.split('-');
      var dateA = new Date(partsA[0], partsA[1] - 1, partsA[2]);
      var partsB = b.date.split('-');
      var dateB = new Date(partsB[0], partsB[1] - 1, partsB[2]);
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  function filterEvents(searchTerm, category) {
    var filtered = timelineData;
    if (category !== 'all') {
      filtered = filtered.filter(function(e) { return e.category === category; });
    }
    if (searchTerm) {
      var term = searchTerm.toLowerCase();
      filtered = filtered.filter(function(e) {
        return e.title.toLowerCase().includes(term) ||
          e.summary.toLowerCase().includes(term) ||
          (e.details && e.details.toLowerCase().includes(term)) ||
          (e.location && e.location.toLowerCase().includes(term)) ||
          (e.people && e.people.some(function(p) { return p.toLowerCase().includes(term); }));
      });
    }
    return filtered;
  }

  function calculateSpacing(currentDate, nextDate) {
    if (!nextDate) return 30;
    var cp = currentDate.split('-');
    var current = new Date(cp[0], cp[1] - 1, cp[2]);
    var np = nextDate.split('-');
    var next = new Date(np[0], np[1] - 1, np[2]);
    var diffDays = Math.ceil(Math.abs(next - current) / 86400000);
    var spacing = 30 + Math.log(diffDays + 1) * 15;
    return Math.round(Math.max(30, Math.min(300, spacing)));
  }

  function renderTimeline(events) {
    var container = document.getElementById('timeline-events');
    container.innerHTML = '';

    if (events.length === 0) {
      container.innerHTML = '<div class="timeline-empty">No events found matching your criteria</div>';
      return;
    }

    var fragment = document.createDocumentFragment();

    events.forEach(function(event, index) {
      var item = document.createElement('div');
      item.className = 'timeline-item ' + (index % 2 === 0 ? 'left' : 'right');
      item.style.animationDelay = (index * 0.1) + 's';

      var nextEvent = events[index + 1];
      item.style.marginBottom = calculateSpacing(event.date, nextEvent ? nextEvent.date : null) + 'px';

      var dot = document.createElement('div');
      dot.className = 'timeline-dot' + (event.milestone ? ' milestone' : '');

      var content = document.createElement('div');
      content.className = 'timeline-content';
      content.setAttribute('tabindex', '0');
      content.setAttribute('role', 'button');
      content.setAttribute('aria-expanded', 'false');

      var dateParts = event.date.split('-');
      var eventDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      var dateStr = eventDate.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });

      var html = '<div class="timeline-date">' + dateStr + '</div>' +
        '<span class="timeline-category">' + event.category + '</span>' +
        (event.age ? '<span class="timeline-age">Age ' + event.age + '</span>' : '') +
        '<h3 class="timeline-title">' + event.title + '</h3>' +
        '<div class="timeline-summary">' + event.summary + '</div>';

      if (event.details) {
        html += '<div class="timeline-details">' + event.details + '</div>';
      }

      if (event.people && event.people.length > 0) {
        html += '<div class="timeline-people">';
        event.people.forEach(function(person) {
          html += '<span class="person-tag" tabindex="0">' + person + '</span>';
        });
        html += '</div>';
      }

      if (event.media && event.media.length > 0) {
        html += '<div class="timeline-media">';
        event.media.forEach(function(img) {
          html += '<img src="' + img + '" alt="Memory" loading="lazy">';
        });
        html += '</div>';
      }

      if (event.notes) {
        html += '<div class="timeline-notes">' + event.notes + '</div>';
      }

      if (event.connections && event.connections.length > 0) {
        html += '<div class="timeline-connections">' + event.connections.join(', ') + '</div>';
      }

      content.innerHTML = html;

      function toggleExpand() {
        var expanded = content.classList.toggle('expanded');
        content.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      }

      content.addEventListener('click', toggleExpand);
      content.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleExpand();
        }
      });

      item.appendChild(dot);
      item.appendChild(content);
      fragment.appendChild(item);
    });

    container.appendChild(fragment);
  }

  function updateStats(events) {
    document.getElementById('total-events').textContent = events.length;
    if (events.length > 0) {
      var years = events.map(function(e) {
        var p = e.date.split('-');
        return parseInt(p[0], 10);
      });
      document.getElementById('years-span').textContent =
        Math.max.apply(null, years) - Math.min.apply(null, years) + 1;
    }
    document.getElementById('milestones-count').textContent =
      events.filter(function(e) { return e.milestone; }).length;
  }

  function getFiltered() {
    var searchTerm = document.getElementById('timeline-search').value;
    var category = document.getElementById('category-filter').value;
    return filterEvents(searchTerm, category);
  }

  document.getElementById('timeline-search').addEventListener('input', function() {
    var filtered = getFiltered();
    renderTimeline(filtered);
    updateStats(filtered);
  });

  document.getElementById('category-filter').addEventListener('change', function() {
    var filtered = getFiltered();
    renderTimeline(filtered);
    updateStats(filtered);
  });

  document.getElementById('sort-asc').addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('sort-desc').classList.remove('active');
    sortEvents(true);
    renderTimeline(getFiltered());
  });

  document.getElementById('sort-desc').addEventListener('click', function() {
    this.classList.add('active');
    document.getElementById('sort-asc').classList.remove('active');
    sortEvents(false);
    renderTimeline(getFiltered());
  });

  document.getElementById('show-all').addEventListener('click', function() {
    document.getElementById('timeline-search').value = '';
    document.getElementById('category-filter').value = 'all';
    renderTimeline(timelineData);
    updateStats(timelineData);
  });

  // Initial render
  sortEvents(true);
  renderTimeline(timelineData);
  updateStats(timelineData);
})();
