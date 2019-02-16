const submit = document.querySelector('.add-party');
const name = document.querySelector('[name="name"]');
const hqAddress = document.querySelector('[name="hqAddress"]');
const logo = document.querySelector('[type="file"]');
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
const createParty = (body) => {
  const url = 'https://oriechinedu-politico.herokuapp.com/api/v1/parties';
  const token = localStorage.getItem('token');
  const headers = new Headers({
    token,
    Authorization: token,
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
      toggleInfo();
      console.log(response);
      if (response.status === 400) {
        showAlert(response.errors.join('\n'), false);
      } else if (response.status === 401) {
        showAlert(response.message, false);
      } else if (response.status === 201) {
        showAlert(response.message);
      } else if (response.status === 409) {
        showAlert(response.error, false);
      }
    })
    .catch((err) => {
      toggleInfo();
      showAlert(err, false);
    });
};
submit.addEventListener('click', (e) => {
  e.preventDefault();

  const errors = [];
  if (name.value === '') {
    errors.push('The party name is required');
    name.classList.add('has-error');
  } else name.classList.remove('has-error');
  if (hqAddress.value === '') {
    errors.push('The party Headqauters Address is required');
    hqAddress.classList.add('has-error');
  } else hqAddress.classList.remove('has-error');
  if (errors.length) {
    showAlert(errors.join('\n'), false);
  } else {
    toggleInfo('Processing...', false);

    const uploadedFile = logo.files[0];
    if (uploadedFile) {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('upload_preset', 'khmwg7sr');

      const options = {
        method: 'POST',
        body: formData,
      };
      const request = new Request('https://api.cloudinary.com/v1_1/drjpxke9z/image/upload', options);
      const result = fetch(request)
        .then(res => res.json())
        .then(res => res.secure_url)
        .catch(err => console.log(err));

      result.then((secureUrl) => {
        const logoUrl = secureUrl;
        const body = JSON.stringify({ name: name.value, hqAddress: hqAddress.value, logoUrl });
        createParty(body);
      });
    } else {
      const body = JSON.stringify({ name: name.value, hqAddress: hqAddress.value });
      createParty(body);
    }
  }
});
