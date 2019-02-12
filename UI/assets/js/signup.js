/* eslint-disable no-useless-escape */
const signUp = document.getElementById('sign-up');
const fname = document.getElementById('first__name');
const lname = document.getElementById('last__name');
const oname = document.getElementById('other__name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
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
signUp.addEventListener('click', (e) => {
  e.preventDefault();

  if (fname.value === '') {
    fname.classList.add('has-error');
    error.innerHTML = 'The First name is required';
    alertError.style.display = 'block';
    fname.focus();
    return false;
  }
  fname.classList.remove('has-error');

  if (lname.value === '') {
    lname.classList.add('has-error');
    error.innerHTML = 'The Last name is required';
    alertError.style.display = 'block';
    lname.focus();
    return false;
  }
  lname.classList.remove('has-error');

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

  if (phone.value === '') {
    phone.classList.add('has-error');
    error.innerHTML = 'The phone number is required';
    alertError.style.display = 'block';
    phone.focus();
    return false;
  }
  phone.classList.remove('has-error');
  if (phone.value.length < 11) {
    phone.classList.add('has-error');
    error.innerHTML = 'The phone number must be valid';
    alertError.style.display = 'block';
    phone.focus();
    return false;
  }
  phone.classList.remove('has-error');

  if (password.value === '') {
    password.classList.add('has-error');
    error.innerHTML = 'The password is required';
    alertError.style.display = 'block';
    password.focus();
    return false;
  }
  password.classList.remove('has-error');

  if (password.value.length < 6) {
    password.classList.add('has-error');
    error.innerHTML = 'The password must be at least 6 characters long';
    alertError.style.display = 'block';
    password.focus();
    return false;
  }
  password.classList.remove('has-error');
  alertError.style.display = 'none';

  const userData = { firstName: fname.value,
    lastName: lname.value,
    email: email.value,
    phone: phone.value,
    otherName: oname.value,
    password: password.value };
  const fetchData = {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: { 'Content-Type': 'application/json' },
  };
  const url = 'https://oriechinedu-politico.herokuapp.com/api/v1/auth/signup';
  spinner.style.display = 'block';
  fetch(url, fetchData)
    .then(res => res.json())
    .then((result) => {
      spinner.style.display = 'none';

      if (result.status !== 201) {
        error.innerHTML = result.message;
        console.log(result.errors);
      }
      const { data } = result;
      const { token, user } = data[0];
      success.innerHTML = 'Registration successful...';
      alertSuccess.style.display = 'block';

      localStorage.setItem('token', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      setTimeout(() => {
        if (user.isadmin) {
          localStorage.setItem('isAdmin', user.isadmin);
          window.location = 'admin-parties.html';
        }
        window.location = 'profile.html';
      }, 3000);
    })
    .catch((err) => {
      error.innerHTML = err;
    });
});
