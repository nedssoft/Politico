const user = document.getElementById('auth-user');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userPhone = document.getElementById('user-phone');
const sidebarImage = document.querySelector('.sidebar-image');
const profilePic = document.querySelector('.profile-pic');
const tableBody = document.getElementById('table-body');
const pagination = document.getElementsByClassName('pagination-container')[0];

pagination.style.display = 'none';
const authUser = JSON.parse(localStorage.getItem('authUser'));
user.innerHTML = authUser.firstname;
userName.innerHTML = `${authUser.firstname} ${authUser.lastname}`;
userEmail.innerHTML = authUser.email;
userPhone.innerHTML = authUser.phone;
const passporturl = authUser.passporturl || 'assets/img/avatar.jpeg';
sidebarImage.setAttribute('src', passporturl);
profilePic.setAttribute('src', passporturl);
const token = localStorage.getItem('token');
const fetchUrl = 'https://oriechinedu-politico.herokuapp.com/api/v1/vote/histories';

const options = {
  method: 'GET',
  headers: new Headers({
    'Content-Type': 'application/json',
    token,
  }),
};

fetch(fetchUrl, options)
  .then(res => res.json())
  .then((res) => {
    if (res.status === 200) {
      const { data } = res;
      if (data.length) {
        let row;
        data.forEach((history, index) => {
          row = `<tr>
                  <td>${index + 1}</td>
                  <td>${history.officename}</td>
                  <td>${history.firstname} ${history.lastname}</td>
                  <td><img src="${history.partylogo}" class="party-logo" alt="APC"></td>
                  <td>${new Date(history.createdon).toDateString()}</td>
                </tr>`;
          tableBody.insertAdjacentHTML('afterbegin', row);
        });
        if (data.length >= 15) {
          pagination.style.display = 'flex';
        }
      } else {
        tableBody.insertAdjacentHTML('afterbegin', '<p>You have not voted yet</p>');
        pagination.style.display = 'none';
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });
