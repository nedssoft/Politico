const user = document.getElementById('auth-user');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');
const userPhone = document.getElementById('user-phone');

const authUser = JSON.parse(localStorage.getItem('authUser'));
user.innerHTML = authUser.firstname;
userName.innerHTML = `${authUser.firstname} ${authUser.lastname}`;
userEmail.innerHTML = authUser.email;
userPhone.innerHTML = authUser.phone;
