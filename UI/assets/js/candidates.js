
const tableBody = document.getElementById('table-body');
const pagination = document.getElementsByClassName('pagination-container')[0];

pagination.style.display = 'none';
const officeId = localStorage.getItem('officeId');
const url = `https://oriechinedu-politico.herokuapp.com/api/v1/office/${officeId}/candidates`;
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
      if (data.length) {
        let row;
        data.forEach((candidate, index) => {
          row = `<tr>
                    <td>${index + 1}</td>
                    <td>${candidate.firstname} ${candidate.lastname} </td>
                    <td class="text-uppercase">${candidate.partyname}</td>
                    <td><img src="${candidate.partylogo}" class="party-logo" alt="${candidate.partyname}"></td>
                    <td>
                        <a href="#"  class="btn btn-info">
                        Vote
                        </a>
                    </td>
                  </tr>`;
          tableBody.insertAdjacentHTML('afterbegin', row);
        });
        if (data.length >= 15) {
          pagination.style.display = 'flex';
        }
      } else {
        tableBody.insertAdjacentHTML('afterbegin', '<p>No candidates for this office at the moment</p>');
        pagination.style.display = 'none';
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });
