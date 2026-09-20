/* Clickable-prototype behaviors for the redesign mockups. */
(function () {
  'use strict';

  /* 1. Sidebar nav — active state moves on click */
  var navItems = Array.prototype.slice.call(document.querySelectorAll('.sidebar .nav-item'));
  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      if (item.querySelector('.chev')) return; // group header stays put
      navItems.forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
    });
  });

  /* 2. Tabs — switch panels */
  document.querySelectorAll('[data-tabs]').forEach(function (tabs) {
    var buttons = Array.prototype.slice.call(tabs.querySelectorAll('[data-tab]'));
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var name = btn.getAttribute('data-tab');
        buttons.forEach(function (b) { b.classList.toggle('active', b === btn); });
        document.querySelectorAll('[data-panel]').forEach(function (panel) {
          panel.hidden = panel.getAttribute('data-panel') !== name;
        });
      });
    });
  });

  /* 3. Tables — live search + pagination */
  function setupTable(table) {
    var root = table.closest('[data-panel]') || document;
    var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
    var pageSize = parseInt(table.getAttribute('data-page-size') || '0', 10) || rows.length || 1;
    var search = root.querySelector('[data-search]');
    var pager = root.querySelector('[data-pager]');
    var meta = root.querySelector('[data-meta]');
    var page = 1;

    function visibleRows() {
      if (!search) return rows;
      var q = search.value.trim().toLowerCase();
      if (!q) return rows;
      return rows.filter(function (r) { return r.textContent.toLowerCase().indexOf(q) !== -1; });
    }

    function draw() {
      var list = visibleRows();
      var pageCount = Math.max(1, Math.ceil(list.length / pageSize));
      if (page > pageCount) page = pageCount;
      rows.forEach(function (r) { r.hidden = true; });
      var start = (page - 1) * pageSize;
      list.slice(start, start + pageSize).forEach(function (r) { r.hidden = false; });

      if (meta) {
        meta.textContent = list.length
          ? 'Showing ' + (start + 1) + '\u2013' + Math.min(start + pageSize, list.length) + ' of ' + list.length + ' entries'
          : 'No matching entries';
      }

      if (pager) {
        pager.innerHTML = '';
        function addButton(label, target, state) {
          state = state || {};
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'page-btn' + (state.active ? ' active' : '');
          b.textContent = label;
          if (state.disabled) {
            b.disabled = true;
          } else {
            b.addEventListener('click', function () { page = target; draw(); });
          }
          pager.appendChild(b);
        }
        addButton('Previous', page - 1, { disabled: page <= 1 });
        for (var i = 1; i <= pageCount; i++) addButton(String(i), i, { active: i === page });
        addButton('Next', page + 1, { disabled: page >= pageCount });
      }
    }

    if (search) search.addEventListener('input', function () { page = 1; draw(); });
    draw();
  }

  document.querySelectorAll('table[data-table]').forEach(setupTable);
})();
