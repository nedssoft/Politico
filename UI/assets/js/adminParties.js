if (!localStorage.getItem('isAdmin')) {
  window.location.replace('login.html');
}

const tableBody = document.getElementById('table-body');
const pagination = document.getElementsByClassName('pagination-container')[0];
const alertError = document.getElementById('alert-error');
const error = document.getElementById('error');
const success = document.getElementById('success');
const info = document.getElementById('info');
const alertSuccess = document.getElementsByClassName('alert-success')[0];
const alertInfo = document.getElementsByClassName('alert-info')[0];

alertError.style.display = 'none';
alertSuccess.style.display = 'none';
alertInfo.style.display = 'none';
pagination.style.display = 'none';
let url = 'https://oriechinedu-politico.herokuapp.com/api/v1/parties';
let options = {
  method: 'GET',
  headers: new Headers({ 'Content-Type': 'application/json' }),
};
const resetStorage = () => {
  localStorage.removeItem('partyId');
  localStorage.removeItem('partyName');
  localStorage.removeItem('hqAddress');
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
const toggleInfo = (msg = null, hide = true) => {
  if (hide) {
    alertInfo.style.display = 'none';
  } else {
    info.innerHTML = msg;
    alertInfo.style.display = 'block';
  }
};
resetStorage();
fetch(url, options)
  .then(res => res.json())
  .then((res) => {
    if (res.status === 200) {
      const { data } = res;
      if (data.length) {
        let row;
        data.forEach((party, index) => {
          row = `<tr>
                      <td>${index + 1}</td>
                      <td class="text-uppercase">${party.name}</td>
                      <td><img src="${party.logourl}" alt="${party.name}" class="party-logo"></td>
                      <td>
                        ${party.hqaddress}
                      </td>
                      <td>
                        <div class="btn-group">
                            <button class="btn btn-info" 
                              data-partyId="${party.id}"
                              data-partyName="${party.name}"
                              data-hqAddress="${party.hqaddress}"
                              onclick="editParty(event)"
                            >
                              Edit
                            </button>
                            <button class="btn btn-danger"
                              data-partyId="${party.id}"
                              onclick="deleteParty(event)"
                            >
                                Delete
                            </button>
                        </div>
                      </td>
                  </tr>`;
          tableBody.insertAdjacentHTML('beforeend', row);
        });
        if (data.length >= 15) {
          pagination.style.display = 'flex';
        }
      } else {
        tableBody.insertAdjacentHTML('beforeend', '<p>No party at the moment</p>');
        pagination.style.display = 'none';
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });

const editParty = (event) => {
  const target = event.target;
  const partyId = target.getAttribute('data-partyId');
  const partyName = target.getAttribute('data-partyName');
  const hqAddress = target.getAttribute('data-hqAddress');
  localStorage.setItem('partyId', partyId);
  localStorage.setItem('partyName', partyName);
  localStorage.setItem('hqAddress', hqAddress);
  window.location.replace('edit-party.html');
};

const deleteParty = (event) => {
  const partyId = event.target.getAttribute('data-partyId');
  const token = localStorage.getItem('token');
  const confirmed = confirm('Are you sure you want to delete this party?');
  if (confirmed) {
    url = `https://oriechinedu-politico.herokuapp.com/api/v1/parties/${partyId}`;
    options = {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        token,
        authorization: token,
      }),
    };
    toggleInfo('Processing...', false);
    const request = new Request(url, options);
    fetch(request)
      .then(res => res.json())
      .then((response) => {
        toggleInfo();
        if (response.status === 200) {
          showAlert(response.data[0].message);
          window.location.reload();
        } else if (response.status === 500) {
          showAlert(response.message, false);
        }
      })
      .catch((err) => {
        if (err) showAlert('Unable to delete the party, try again', false);
      });
  }
};
