document.addEventListener('DOMContentLoaded', function () {
  var select = document.getElementById('site-nav-select');
  if (!select) return;

  var currentPath = window.location.pathname.replace(/index\.html$/, '');
  var found = false;
  for (var i = 0; i < select.options.length; i++) {
    if (select.options[i].value === currentPath) {
      select.selectedIndex = i;
      found = true;
      break;
    }
  }
  if (!found) {
    select.selectedIndex = 0;
  }

  select.addEventListener('change', function () {
    var target = this.value;
    if (target) {
      window.location.href = target;
    }
  });
});
