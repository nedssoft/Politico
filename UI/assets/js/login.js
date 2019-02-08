const signIn = document.getElementById('sign-in');
const email = document.getElementById('email');
const password = document.getElementById('password');

//Credit: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
signIn.addEventListener('click', (e) => {
  e.preventDefault();
  
  if (email.value === '' || !validEmail.test(String(email.value).toLowerCase())) {
    email.classList.add('has-error');
    return false;
  }
  else {
    email.classList.remove('has-error');
  }

  if (password.value === ''){
    password.classList.add('has-error');
    return false;
  }
  else {
    password.classList.remove('has-error');
  }
	if (email.value === 'admin@politico.com') {
    window.location = 'admin-parties.html';
  } else  window.location = 'profile.html';
});
