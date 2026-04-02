(function () {
  var dataEl = document.getElementById('timeline-data');
  if (!dataEl) return;
  var timelineData = JSON.parse(dataEl.textContent);
  var ascending = true;

  function sortEvents(events, asc) {
    return events.slice().sort(function(a, b) {
      var partsA = a.date.split('-');
      var dateA = new Date(partsA[0], partsA[1] - 1, partsA[2]);
      var partsB = b.date.split('-');
      var dateB = new Date(partsB[0], partsB[1] - 1, partsB[2]);
      return asc ? dateA - dateB : dateB - dateA;
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
      var empty = document.createElement('div');
      empty.className = 'timeline-empty';
      empty.textContent = 'No events found matching your criteria';
      container.appendChild(empty);
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

      var date = document.createElement('div');
      date.className = 'timeline-date';
      date.textContent = dateStr;
      content.appendChild(date);

      var category = document.createElement('span');
      category.className = 'timeline-category';
      category.textContent = event.category || '';
      content.appendChild(category);

      if (event.age) {
        var age = document.createElement('span');
        age.className = 'timeline-age';
        age.textContent = 'Age ' + event.age;
        content.appendChild(age);
      }

      var title = document.createElement('h3');
      title.className = 'timeline-title';
      title.textContent = event.title || '';
      content.appendChild(title);

      var summary = document.createElement('div');
      summary.className = 'timeline-summary';
      summary.textContent = event.summary || '';
      content.appendChild(summary);

      if (event.details) {
        var details = document.createElement('div');
        details.className = 'timeline-details';
        details.textContent = event.details;
        content.appendChild(details);
      }

      if (event.people && event.people.length > 0) {
        var people = document.createElement('div');
        people.className = 'timeline-people';
        event.people.forEach(function(person) {
          var tag = document.createElement('span');
          tag.className = 'person-tag';
          tag.setAttribute('tabindex', '0');
          tag.textContent = person;
          people.appendChild(tag);
        });
        content.appendChild(people);
      }

      if (event.media && event.media.length > 0) {
        var media = document.createElement('div');
        media.className = 'timeline-media';
        event.media.forEach(function(img) {
          var image = document.createElement('img');
          image.src = img;
          image.alt = 'Memory';
          image.loading = 'lazy';
          media.appendChild(image);
        });
        content.appendChild(media);
      }

      if (event.notes) {
        var notes = document.createElement('div');
        notes.className = 'timeline-notes';
        notes.textContent = event.notes;
        content.appendChild(notes);
      }

      if (event.connections && event.connections.length > 0) {
        var connections = document.createElement('div');
        connections.className = 'timeline-connections';
        connections.textContent = event.connections.join(', ');
        content.appendChild(connections);
      }

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
    return sortEvents(filterEvents(searchTerm, category), ascending);
  }

  function setSortButtons() {
    var ascBtn = document.getElementById('sort-asc');
    var descBtn = document.getElementById('sort-desc');
    ascBtn.classList.toggle('active', ascending);
    descBtn.classList.toggle('active', !ascending);
    ascBtn.setAttribute('aria-pressed', ascending ? 'true' : 'false');
    descBtn.setAttribute('aria-pressed', ascending ? 'false' : 'true');
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
    ascending = true;
    setSortButtons();
    renderTimeline(getFiltered());
  });

  document.getElementById('sort-desc').addEventListener('click', function() {
    ascending = false;
    setSortButtons();
    renderTimeline(getFiltered());
  });

  document.getElementById('show-all').addEventListener('click', function() {
    document.getElementById('timeline-search').value = '';
    document.getElementById('category-filter').value = 'all';
    var filtered = getFiltered();
    renderTimeline(filtered);
    updateStats(filtered);
  });

  // Initial render
  setSortButtons();
  var initial = getFiltered();
  renderTimeline(initial);
  updateStats(initial);
})();
