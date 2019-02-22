const alertError = document.getElementById('alert-error');
const error = document.getElementById('error');
const success = document.getElementById('success');
const alertSuccess = document.querySelector('.alert-success');
const spinner = document.querySelector('.spinner');
const email = document.querySelector('[name="email"]');
const submit = document.querySelector('[type="submit"]');

spinner.style.display = 'none';
const toggleSpinner = (hide = true) => {
  if (hide) {
    spinner.style.display = 'none';
  } else {
    spinner.style.display = 'block';
  }
};
const showAlert = (message, succeeded = true) => {
  if (succeeded) {
    success.innerHTML = message;
    alertSuccess.style.display = 'block';
    setTimeout(() => {
      alertSuccess.style.display = 'none';
    }, 5000);
  } else {
    error.innerHTML = message;
    alertError.style.display = 'block';
    setTimeout(() => {
      alertError.style.display = 'none';
    }, 5000);
  }
};
const resetPassword = (body) => {
  const url = 'https://oriechinedu-politico.herokuapp.com/api/v1/auth/reset';
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  const options = {
    method: 'POST',
    headers,
    body,
  };
  const request = new Request(url, options);
  fetch(request)
    .then(response => response.json())
    .then((response) => {
      toggleSpinner();
      email.value = '';
      if (response.status === 404) {
        showAlert(response.error, false);
      } else if (response.status === 200) {
        showAlert(response.message);
      }
    })
    .catch((err) => {
      toggleSpinner();
      showAlert(err, false);
    });
};
// Credit: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
submit.addEventListener('click', (e) => {
  e.preventDefault();
  if (email.value === '') {
    email.classList.add('has-error');
    showAlert('Enter the email address for reset password link', false);
    email.focus();
    return false;
  }
  email.classList.remove('has-error');
  if (!validEmail.test(String(email.value).toLowerCase())) {
    email.classList.add('has-error');
    showAlert('Enter a valid email address', false);
    email.focus();
    return false;
  }
  toggleSpinner(false);
  email.classList.remove('has-error');
  const body = JSON.stringify({ email: email.value });
  resetPassword(body);
});
