
const signUp = document.getElementById('sign-up');
const fname = document.getElementById('first__name');
const lname = document.getElementById('last__name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
//Credit: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
signUp.addEventListener('click', (e) => {
  e.preventDefault();

  if (fname.value === '') {
    fname.classList.add('has-error');
    hasError = true;
  } else {
    fname.classList.remove('has-error');
    hasError = false;
  }
  if (lname.value === '') {
    lname.classList.add('has-error');
    hasError = true;
  }  else {
    lname.classList.remove('has-error');
    hasError = false;
  }

  if (phone.value === '') {
    phone.classList.add('has-error');
    hasError = true;
  }  else {
    phone.classList.remove('has-error');
    hasError = false;
  }
  
  if (password.value === '') {
    password.classList.add('has-error');
    hasError = true;
  }  else {
    password.classList.remove('has-error');
    hasError = false;
  }
  if (email.value === '' || !validEmail.test(String(email.value).toLowerCase())) {
    email.classList.add('has-error');
    hasError = true;
  }  else {
    email.classList.remove('has-error');
    hasError = false;
  }
  if (hasError) {
    return false;
  }
  window.location = 'login.html';
});
