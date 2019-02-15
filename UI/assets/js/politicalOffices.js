const tableBody = document.getElementById('table-body');
const pagination = document.getElementsByClassName('pagination-container')[0];

pagination.style.display = 'none';
const url = 'https://oriechinedu-politico.herokuapp.com/api/v1/offices';
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
        data.forEach((office, index) => {
          row = `<tr>
                    <td>${index + 1}</td>
                    <td class="text-uppercase">${office.type}</td>
                    <td>${office.name}</td>
                    <td>
                        
                          <button class="btn btn-info" data-officeId="${office.id}"
                          data-office="${office.name}"
                          onclick="proceedToVote(event)">
                             Proceed to Vote
                          </button>
                        
                    </td>
                </tr>`;
          tableBody.insertAdjacentHTML('afterbegin', row);
        });
        if (data.length >= 15) {
          pagination.style.display = 'flex';
        }
      } else {
        tableBody.insertAdjacentHTML('beforeend', '<p>No office at the moment</p>');
        pagination.style.display = 'none';
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });

const proceedToVote = (e) => {
  e.preventDefault();
  const officeId = e.target.getAttribute('data-officeId');
  const selectedOffice = e.target.getAttribute('data-office');
  localStorage.setItem('officeId', officeId);
  localStorage.setItem('selectedOffice', selectedOffice);
  window.location.replace('candidates.html');
};
