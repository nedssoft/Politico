const mainNav = document.getElementById('main__nav__menu');
const navBarToggle = document.getElementById('navbar__toggle__btn');

navBarToggle.addEventListener('click', () => {
  mainNav.classList.toggle('show');
});
