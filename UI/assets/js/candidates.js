const alertError = document.getElementById('alert-error');
const error = document.getElementById('error');
const success = document.getElementById('success');
const info = document.getElementById('info');
const alertSuccess = document.getElementsByClassName('alert-success')[0];
const alertInfo = document.getElementsByClassName('alert-info')[0];


alertError.style.display = 'none';
alertSuccess.style.display = 'none';
alertInfo.style.display = 'none';

document.getElementById('election-title').innerHTML = `Welcome to ${localStorage.getItem('selectedOffice')} Election`;
const tableBody = document.getElementById('table-body');
const pagination = document.getElementsByClassName('pagination-container')[0];

pagination.style.display = 'none';

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
const officeId = localStorage.getItem('officeId');
let url = `https://oriechinedu-politico.herokuapp.com/api/v1/office/${officeId}/candidates`;
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
        data.forEach((candidate, index) => {
          row = `<tr>
                    <td>${index + 1}</td>
                    <td>${candidate.firstname} ${candidate.lastname} </td>
                    <td class="text-uppercase">${candidate.partyname}</td>
                    <td><img src="${candidate.partylogo}" class="party-logo" alt="${candidate.partyname}"></td>
                    <td>
                        <button class="btn btn-info"
                          data-candidate="${candidate.candidate}" 
                          data-party="${candidate.party}" 
                          data-office="${candidate.office}" 
                         onclick="processVote(event)">
                         Vote
                        </button>
                    </td>
                  </tr>`;
          tableBody.insertAdjacentHTML('beforeend', row);
        });
        if (data.length >= 15) {
          pagination.style.display = 'flex';
        }
      } else {
        tableBody.insertAdjacentHTML('beforeend', '<p>No candidates for this office at the moment</p>');
        pagination.style.display = 'none';
      }
    }
  })
  .catch((err) => {
    if (err) showAlert('Failed to load candidates, kindly refresh your browser', false);
  });
const processVote = (event) => {
  event.preventDefault();
  info.innerHTML = 'Processing vote...';
  alertInfo.style.display = 'block';
  const candidate = event.target.getAttribute('data-candidate');
  const party = event.target.getAttribute('data-party');
  const office = event.target.getAttribute('data-office');
  const token = localStorage.getItem('token');
  url = 'https://oriechinedu-politico.herokuapp.com/api/v1/vote';
  options = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      token,
    }),
    body: JSON.stringify({ candidate, party, office }),
  };
  request = new Request(url, options);
  fetch(request)
    .then(res => res.json())
    .then((response) => {
      alertInfo.style.display = 'none';
      if (response.status === 401 || response.status === 409 || response.status === 500) {
        showAlert(response.error, false);
      } else if (response.status === 400) {
        showAlert(response.errors.join('\n'), false);
      } else if (response.status === 201) {
        showAlert(response.data.message);
      }
    })
    .catch((err) => {
      if (err) showAlert('Failed to load candidates, kindly refresh your browser', false);
    });
};
