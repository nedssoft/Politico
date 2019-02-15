const accessToken = localStorage.getItem('token');
const isAuthenticated = (tkn) => {
  if (!tkn) window.location = 'login.html';
  if (tkn) {
    const body = { token: tkn };
    const url = 'https://oriechinedu-politico.herokuapp.com/api/v1/token/validate';
    const headers = new Headers({
      'Content-Type': 'application/json',
    });
    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    };
    const request = new Request(url, options);
    fetch(request)
      .then(response => response.json())
      .then((response) => {
        if (response.status === 200) {
          return true;
        }
        window.location = 'login.html';
      })
      .catch((err) => { if (err) return false; });
  }
};

isAuthenticated(accessToken);
