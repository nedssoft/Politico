
const dashNavToggle = document.getElementById('dash__nav__toggle');
const sidebar = document.getElementById('sidebar__menu');
dashNavToggle.addEventListener('click', () => {
  sidebar.classList.toggle('show-sidebar');
});
