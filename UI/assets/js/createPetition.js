const submit = document.querySelector('.create-petition');
const petitionBody = document.querySelector('[name="body"]');
const evidence = document.querySelector('[type="file"]');
const alertError = document.getElementById('alert-error');
const error = document.getElementById('error');
const success = document.getElementById('success');
const info = document.getElementById('info');
const alertSuccess = document.querySelector('.alert-success');
const alertInfo = document.querySelector('.alert-info');
const officeSelector = document.querySelector('[name="office"]');
const sidebarImage = document.querySelector('.sidebar-image');
const user = document.getElementById('auth-user');

const authUser = JSON.parse(localStorage.getItem('authUser'));
const passporturl = authUser.passporturl || 'assets/img/avatar.png';
sidebarImage.setAttribute('src', passporturl);
user.innerHTML = authUser.firstname;

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
const uploadToCloudinary = (uploadedFile) => {
  const fileType = uploadedFile.type;
  const formData = new FormData();
  formData.append('file', uploadedFile);
  formData.append('upload_preset', 'khmwg7sr');
  const plublicId = fileType.includes('video') ? `video-${(new Date()).getTime()}` : `image-${(new Date()).getTime()}`;
  const resourceType = fileType.includes('video') ? 'video' : 'image';
  formData.append('public_id', plublicId);
  formData.append('resource_type', resourceType);

  request = new Request('https://api.cloudinary.com/v1_1/drjpxke9z/image/upload', {
    method: 'POST',
    body: formData,
  });
  const result = fetch(request)
    .then(res => res.json())
    .then((res) => {
      console.log(res.secure_url);
      return res.secure_url;
    })
    .catch(err => console.log(err));
  return result;
};

const createPetition = (body) => {
  url = 'https://oriechinedu-politico.herokuapp.com/api/v1/petitions';
  const token = localStorage.getItem('token');
  const headers = new Headers({
    token,
    Authorization: token,
    'Content-Type': 'application/json',
  });
  options = {
    method: 'POST',
    headers,
    body,
  };
  request = new Request(url, options);
  fetch(request)
    .then(response => response.json())
    .then((response) => {
      console.log(response);
      toggleInfo();
      petitionBody.value = '';
      if (response.status === 400) {
        showAlert(response.error || response.errors.join('\n'), false);
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
  if (petitionBody.value === '') {
    errors.push('The description of the petition is required');
    petitionBody.classList.add('has-error');
  } else petitionBody.classList.remove('has-error');
  if (officeSelector.value === '') {
    errors.push('The office is required');
    officeSelector.classList.add('has-error');
  } else officeSelector.classList.remove('has-error');
  if (evidence.files[0] && evidence.files[0] > 2097152) {
    errors.push('The file is too large');
    evidence.classList.add('has-error');
  } else evidence.classList.remove('has-error');
  if (errors.length) {
    showAlert(errors.join('\n'), false);
  } else {
    toggleInfo('Processing...', false);

    const uploadedFile = evidence.files[0];
    if (uploadedFile) {
      uploadToCloudinary(uploadedFile).then((secureUrl) => {
        const imageUrl = secureUrl;
        const body = JSON.stringify({
          office: officeSelector.value,
          body: petitionBody.value,
          imageUrl });
        console.log(body);
        createPetition(body);
      });
    } else {
      const body = JSON.stringify({
        office: officeSelector.value,
        body: petitionBody.value });
      createPetition(body);
    }
  }
});
