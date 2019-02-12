const token = localStorage.getItem('token');

const isAuthenticated = (tkn) => {
  if (tkn) {
    const tokenComponent = tkn.split('.');
    if (tokenComponent.length === 3) {
      return true;
    }
  }
  window.location = 'login.html';
};

isAuthenticated(token);
