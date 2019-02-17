const tableBody = document.getElementById('table-body');
const pagination = document.querySelector('.pagination-container');
const alertError = document.getElementById('alert-error');
const error = document.getElementById('error');
const success = document.getElementById('success');
const info = document.getElementById('info');
const alertSuccess = document.querySelector('.alert-success');
const alertInfo = document.querySelector('.alert-info');

alertError.style.display = 'none';
alertSuccess.style.display = 'none';
alertInfo.style.display = 'none';
pagination.style.display = 'none';
const token = localStorage.getItem('token');
let url = 'https://oriechinedu-politico.herokuapp.com/api/v1/office/applications';
let options = {
  method: 'GET',
  headers: new Headers({ 'Content-Type': 'application/json' }),
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
const getStatus = (status) => {
  if (status === 'approved') {
    return ['Approved', 'success'];
  } if (status === 'pending') {
    return ['Pending', 'primary'];
  } if (status === 'rejected') {
    return ['Rejected', 'danger'];
  } if (status === 'revoked') {
    return ['Revoked', 'danger'];
  }
};
const updateApplication = (event) => {
  const applicationId = event.target.getAttribute('data-applicationId');
  const status = event.target.getAttribute('data-status');
  url = `https://oriechinedu-politico.herokuapp.com/api/v1/office/applications/${applicationId}`;
  let action = status === 'rejected' ? status.slice(0, -2) : status.slice(0, -1);
  action = status === 'delete' ? status : action;
  const confirmed = confirm(`Are you sure you want to ${action} this application?`);
  if (confirmed) {
    if (status === 'delete') {
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
            showAlert(response.data.message);
            window.location.reload();
          } else if (response.status === 500) {
            showAlert(response.message, false);
          }
        })
        .catch((err) => {
          if (err) showAlert('Unable to delete the application, try again', false);
        });
    } else {
      options = {
        method: 'PATCH',
        headers: new Headers({
          'Content-Type': 'application/json',
          token,
          authorization: token,
        }),
        body: JSON.stringify({ status }),
      };
      toggleInfo('Processing...', false);
      const request = new Request(url, options);
      fetch(request)
        .then(res => res.json())
        .then((response) => {
          toggleInfo();
          if (response.status === 200) {
            showAlert(response.message);
            window.location.reload();
          } else {
            showAlert(response.message, false);
          }
        })
        .catch((err) => {
          if (err) showAlert('Unable to update the application, try again', false);
        });
    }
  }
};
const getAction = (application) => {
  if (application.status === 'pending') {
    return `<div class="btn-group">
              <a href="#" class="btn btn-info"
              data-applicationId="${application.id}"
              data-status="approved"
              onclick="updateApplication(event)"
              >
                  Approve
              </a>
              <button class="btn btn-danger"
              data-applicationId="${application.id}"
              data-status="rejected"
              onclick="updateApplication(event)"
              >
                  Reject
              </button>
          </div>`;
  } if (application.status === 'approved') {
    return `<button class="btn btn-danger"
              data-applicationId="${application.id}"
              data-status="revoked"
              onclick="updateApplication(event)"
              >
                Revoke
            </button>`;
  } if (application.status === 'rejected') {
    return `<button class="btn btn-danger"
            data-applicationId="${application.id}"
            data-status="delete"
            onclick="updateApplication(event)"
            >
              Delete
          </button>`;
  }
};

fetch(url, options)
  .then(res => res.json())
  .then((res) => {
    if (res.status === 200) {
      const { data } = res;
      if (data.length) {
        let row;
        data.forEach((applicant, index) => {
          row = ` <tr>
                    <td>${index + 1}</td>
                    <td class="text-uppercase">${applicant.firstname} ${applicant.lastname}</td>
                    <td>
                      <div class="logo-container">
                          <img src="assets/img/pdp.jpeg" class="party-logo" alt="PDP">
                          <p>${applicant.partyname}</p>
                      </div>
                    </td>
                    <td>${applicant.officename}</td>
                    <td>${applicant.officetype}</td>
                    <td><span class="badge-${getStatus(applicant.status)[1]}">${getStatus(applicant.status)[0]}</span></td>
                    <td>${new Date(applicant.createdon).toDateString()}</td>
                    <td>
                        ${getAction(applicant)}
                    </td>
                  </tr>`;
          tableBody.insertAdjacentHTML('beforeend', row);
        });
        if (data.length >= 15) {
          pagination.style.display = 'flex';
        }
      } else {
        tableBody.insertAdjacentHTML('beforeend', '<p>No Application at the moment</p>');
        pagination.style.display = 'none';
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });
