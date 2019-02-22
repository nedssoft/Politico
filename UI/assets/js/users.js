if (!localStorage.getItem('isAdmin')) {
  window.location.replace('login.html');
}

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
let url = 'https://oriechinedu-politico.herokuapp.com/api/v1/users';
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

const deleteUser = (event) => {
  const userId = event.target.getAttribute('data-userId');
  url = `https://oriechinedu-politico.herokuapp.com/api/v1/users/${userId}`;
  const confirmed = confirm('Are you sure you want to delete this user?');
  if (confirmed) {
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
          showAlert(response.message);
          window.location.reload();
        } else if (response.status === 500) {
          showAlert(response.message, false);
        }
      })
      .catch((err) => {
        if (err) showAlert('Unable to delete the user, try again', false);
      });
  }
  return false;
};

fetch(url, options)
  .then(res => res.json())
  .then((res) => {
    if (res.status === 200) {
      const { data } = res;
      if (data.length) {
        let row;
        data.forEach((user, index) => {
          row = ` <tr>
                    <td>${index + 1}</td>
                    <td class="text-uppercase">${user.firstname} ${user.lastname}</td>
                    <td>
                      <div class="logo-container">
                          <p>${user.email}</p>
                      </div>
                    </td>
                    <td>${user.phone}</td>
                    <td>${user.isadmin ? 'Admin' : 'Voter'}</td>
                    <td>${new Date(user.createdon).toDateString()}</td>
                    <td>
                        <button class="btn btn-danger"
                        data-userId="${user.id}"
                        data-status="delete"
                        onclick="deleteUser(event)"
                        >
                          Delete
                      </button>
                    </td>
                  </tr>`;
          tableBody.insertAdjacentHTML('beforeend', row);
        });
        if (data.length >= 15) {
          pagination.style.display = 'flex';
        }
      } else {
        tableBody.insertAdjacentHTML('beforeend', '<p>No user found</p>');
        pagination.style.display = 'none';
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });
