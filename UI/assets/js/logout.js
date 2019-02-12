const logout = document.getElementById('logout');

logout.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('authUser');
  localStorage.removeItem('token');
  if (localStorage.getItem('isAdmin')) {
    localStorage.removeItem('isAdmin');
  }
  window.location = 'index.html';
});
