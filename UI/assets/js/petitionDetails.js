if (!localStorage.getItem('isAdmin')) {
  window.location.replace('login.html');
}

const detailsDiv = document.querySelector('.petition-content');
const petitionImage = document.querySelector('.petition-details');

const petitionId = localStorage.getItem('petitionId');
const url = `https://oriechinedu-politico.herokuapp.com/api/v1/petitions/${petitionId}`;
const options = {
  method: 'GET',
  headers: new Headers({ 'Content-Type': 'application/json' }),
};
const request = new Request(url, options);
fetch(request)
  .then(res => res.json())
  .then((res) => {
    if (res.status === 200) {
      const { data } = res;
      console.log(data);
      const imageEvidence = data.evidence.length ? `<div class="evidence-image"><img src="${data.evidence[0]}"></div>` : '';
      const details = `
          <h1>Date</h1> <hr>
          <p>${(new Date(data.createdon)).toLocaleDateString()}</p>
          <h1>Author</h1> 
          <hr>
          <p>${data.firstname} ${data.lastname} </p>
          <h1>Office</h1> 
          <hr>
          <p>${data.officename}</p>
          <h1>Description</h1> 
          <hr>
          <p>
           ${data.body}
          </p> 
      `;
      detailsDiv.insertAdjacentHTML('beforeend', details);
      petitionImage.insertAdjacentHTML('afterbegin', imageEvidence);
    }
  })
  .catch((err) => {
    console.log(err);
  });
