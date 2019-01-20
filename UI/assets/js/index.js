let mainNav = document.getElementById('main__nav__menu');
let navBarToggle = document.getElementById('navbar__toggle__btn');

navBarToggle.addEventListener('click', function () {
  mainNav.classList.toggle('show');
});