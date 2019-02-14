const tableBody = document.getElementById('table-body');
const pagination = document.getElementsByClassName('pagination-container')[0];
const alertError = document.getElementById('alert-error');
const error = document.getElementById('error');
const success = document.getElementById('success');
const info = document.getElementById('info');
const officeSelector = document.getElementById('office');
const submitFilter = document.getElementById('submit-filter');
const alertSuccess = document.getElementsByClassName('alert-success')[0];
const alertInfo = document.getElementsByClassName('alert-info')[0];
const resultTitle = document.getElementById('result-title');

alertError.style.display = 'none';
alertSuccess.style.display = 'none';
alertInfo.style.display = 'none';
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

let url = 'https://oriechinedu-politico.herokuapp.com/api/v1/offices';
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
submitFilter.addEventListener('click', (e) => {
  e.preventDefault();
  info.innerHTML = 'Retrieving Result...';
  alertInfo.style.display = 'block';
  url = `https://oriechinedu-politico.herokuapp.com/api/v1/office/${officeSelector.value}/result`;
  options = {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' }),
  };
  request = new Request(url, options);
  fetch(request)
    .then(res => res.json())
    .then((res) => {
      alertInfo.style.display = 'none';
      resultTitle.innerHTML = officeSelector.options[officeSelector.selectedIndex].textContent;
      if (res.status === 200) {
        const { data } = res;
        if (data.length) {
          let row;
          data.forEach((result, index) => {
            row = `<tr>
                      <td>${index + 1}</td>
                      <td>${result.firstname} ${result.lastname}</td>
                      <td class="text-uppercase">${result.partyname}</td>
                      <td><img src="${result.partylogo}" class="${result.partyname}" width="50px" height="50px" alt="YPP"></td>
                      <td>${result.result}</td>
                  </tr>`;
            tableBody.innerHTML = '';
            tableBody.insertAdjacentHTML('afterbegin', row);
          });
          if (data.length >= 15) {
            pagination.style.display = 'flex';
          }
        } else {
          tableBody.insertAdjacentHTML('afterbegin', '<p>No result for the selected office</p>');
          pagination.style.display = 'none';
        }
      }
    })
    .catch((err) => {
      if (err) showAlert('Unable to fetch result, Refresh the browser', false);
    });
});
