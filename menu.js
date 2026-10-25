/* Menu : se referme quand on choisit une section, quand on clique ailleurs ou sur Echap. */
(function () {
  var menu = document.getElementById('menu');
  if (!menu) return;
  menu.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('nav a')) { menu.removeAttribute('open'); }
  });
  document.addEventListener('click', function (e) {
    if (menu.hasAttribute('open') && !menu.contains(e.target)) { menu.removeAttribute('open'); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.hasAttribute('open')) { menu.removeAttribute('open'); menu.querySelector('summary').focus(); }
  });
})();
