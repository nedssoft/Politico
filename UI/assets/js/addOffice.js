
if (!localStorage.getItem('isAdmin')) {
  window.location.replace('login.html');
}

const submit = document.querySelector('.add-party');
const name = document.querySelector('[name="name"]');
const type = document.querySelector('[name="type"]');
const alertError = document.getElementById('alert-error');
const error = document.getElementById('error');
const success = document.getElementById('success');
const info = document.getElementById('info');
const alertSuccess = document.getElementsByClassName('alert-success')[0];
const alertInfo = document.getElementsByClassName('alert-info')[0];

alertError.style.display = 'none';
alertSuccess.style.display = 'none';
alertInfo.style.display = 'none';
const toggleInfo = (msg = null, hide = true) => {
  if (hide) {
    alertInfo.style.display = 'none';
  } else {
    info.innerHTML = msg;
    alertInfo.style.display = 'block';
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
submit.addEventListener('click', (e) => {
  e.preventDefault();
  const errors = [];
  if (name.value === '') {
    errors.push('The Office name is required');
    name.classList.add('has-error');
  } else name.classList.remove('has-error');
  if (type.value === '') {
    errors.push('The Office type is required');
    type.classList.add('has-error');
  } else type.classList.remove('has-error');
  if (errors.length) {
    showAlert(errors.join('\n'), false);
  } else {
    toggleInfo('Processing...', false);
    const body = { name: name.value, type: type.value };
    const url = 'https://oriechinedu-politico.herokuapp.com/api/v1/offices';
    const token = localStorage.getItem('token');
    const headers = new Headers({
      'Content-Type': 'application/json',
      token,
      authorization: token,
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
        toggleInfo();
        if (response.status === 400) {
          showAlert(response.errors.join('\n'), false);
        } else if (response.status === 401) {
          showAlert(response.message, false);
        } else if (response.status === 201) {
          showAlert('Office created Successfully');
        } else if (response.status === 409 || response.status === 500) {
          showAlert(response.error, false);
        }
      })
      .catch(err => showAlert(err, false));
  }
});
