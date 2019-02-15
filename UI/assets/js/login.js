/* eslint-disable no-useless-escape */
const signIn = document.getElementById('sign-in');
const email = document.getElementById('email');
const password = document.getElementById('password');
const alertError = document.getElementById('alert-error');
const error = document.getElementById('error');
const success = document.getElementById('success');
const alertSuccess = document.getElementsByClassName('alert-success')[0];
const spinner = document.getElementsByClassName('spinner')[0];

alertError.style.display = 'none';
alertSuccess.style.display = 'none';
spinner.style.display = 'none';

// Credit: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
signIn.addEventListener('click', (e) => {
  e.preventDefault();

  if (email.value === '') {
    email.classList.add('has-error');
    error.innerHTML = 'The Email is required';
    alertError.style.display = 'block';
    email.focus();
    return false;
  }
  email.classList.remove('has-error');
  if (!validEmail.test(String(email.value).toLowerCase())) {
    email.classList.add('has-error');
    error.innerHTML = 'The email must be valid';
    alertError.style.display = 'block';
    email.focus();
    return false;
  }
  email.classList.remove('has-error');

  if (password.value === '') {
    password.classList.add('has-error');
    error.innerHTML = 'The password is required';
    alertError.style.display = 'block';
    password.focus();
    return false;
  }
  password.classList.remove('has-error');

  const loginData = {
    email: email.value,
    password: password.value,
  };
  alertError.style.display = 'none';
  const fetchData = {
    method: 'POST',
    body: JSON.stringify(loginData),
    headers: { 'Content-Type': 'application/json' },
  };
  const url = 'https://oriechinedu-politico.herokuapp.com/api/v1/auth/login';
  spinner.style.display = 'block';
  fetch(url, fetchData)
    .then(res => res.json())
    .then((res) => {
      spinner.style.display = 'none';
      if (res.status === 400) {
        error.innerHTML = res.errors.join('\n');
      } else if (res.error) {
        error.innerHTML = res.message;
        alertError.style.display = 'block';
      } else {
        const { data, message } = res;
        const { token, user } = data[0];
        success.innerHTML = `${message} ...`;
        alertSuccess.style.display = 'block';

        localStorage.setItem('token', token);
        localStorage.setItem('authUser', JSON.stringify(user));
        setTimeout(() => {
          if (user.isadmin) {
            localStorage.setItem('isAdmin', user.isadmin);
            window.location = 'admin-parties.html';
          } else window.location = 'profile.html';
        }, 3000);
      }
    })
    .catch((err) => {
      error.innerHTML = err;
      alertError.style.display = 'block';
    });
});
