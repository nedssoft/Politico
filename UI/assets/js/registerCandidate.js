

const alertError = document.getElementById('alert-error');
const error = document.getElementById('error');
const success = document.getElementById('success');
const info = document.getElementById('info');
const alertSuccess = document.getElementsByClassName('alert-success')[0];
const alertInfo = document.getElementsByClassName('alert-info')[0];
const officeSelector = document.querySelector('[name="office"]');
const candidateSelector = document.querySelector('[name="candidate"]');
const partySelector = document.querySelector('[name="party"]');
const submit = document.querySelector('.register');

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

let url = 'https://oriechinedu-politico.herokuapp.com/api/v1/users';
let options = {
  method: 'GET',
  headers: new Headers({ 'Content-Type': 'application/json' }),
};
let request = new Request(url, options);
fetch(request)
  .then(res => res.json())
  .then((res) => {
    if (res.status === 200) {
      const { data } = res;
      if (data.length) {
        let row;
        data.forEach((candidate) => {
          row = `<option value="${candidate.id}">${candidate.firstname} ${candidate.lastname}</option>`;

          candidateSelector.insertAdjacentHTML('beforeend', row);
        });
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });

url = 'https://oriechinedu-politico.herokuapp.com/api/v1/offices';
options = {
  method: 'GET',
  headers: new Headers({ 'Content-Type': 'application/json' }),
};
request = new Request(url, options);
fetch(request)
  .then(res => res.json())
  .then((res) => {
    if (res.status === 200) {
      const { data } = res;
      if (data.length) {
        let row;
        data.forEach((office) => {
          row = `<option value="${office.id}">${office.name}</option>`;

          officeSelector.insertAdjacentHTML('beforeend', row);
        });
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });
url = 'https://oriechinedu-politico.herokuapp.com/api/v1/parties';
options = {
  method: 'GET',
  headers: new Headers({ 'Content-Type': 'application/json' }),
};
request = new Request(url, options);
fetch(request)
  .then(res => res.json())
  .then((res) => {
    if (res.status === 200) {
      const { data } = res;
      if (data.length) {
        let row;
        data.forEach((party) => {
          row = `<option value="${party.id}">${party.name}</option>`;

          partySelector.insertAdjacentHTML('beforeend', row);
        });
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });

submit.addEventListener('click', (e) => {
  e.preventDefault();
  const errors = [];
  if (candidateSelector.value === '') {
    errors.push('Select the Candidate');
    candidateSelector.classList.add('has-error');
  } else candidateSelector.classList.remove('has-error');

  if (officeSelector.value === '') {
    errors.push('Select the Office');
    officeSelector.classList.add('has-error');
  } else officeSelector.classList.remove('has-error');

  if (partySelector.value === '') {
    errors.push('Select the Party');
    partySelector.classList.add('has-error');
  } else partySelector.classList.remove('has-error');

  if (errors.length) {
    showAlert(errors.join('\n'), false);
  } else {
    toggleInfo('Processing...', false);
    const body = { office: officeSelector.value, party: partySelector.value };
    url = `https://oriechinedu-politico.herokuapp.com/api/v1/office/${candidateSelector.value}/register`;
    const token = localStorage.getItem('token');
    const headers = new Headers({
      'Content-Type': 'application/json',
      token,
      authorization: token,
    });
    options = {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    };
    request = new Request(url, options);
    fetch(request)
      .then(response => response.json())
      .then((response) => {
        toggleInfo();
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
      .catch(err => showAlert(err, false));
  }
});
