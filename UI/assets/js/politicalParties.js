const tableBody = document.getElementById('table-body');
const pagination = document.getElementsByClassName('pagination-container')[0];

pagination.style.display = 'none';
const url = 'https://oriechinedu-politico.herokuapp.com/api/v1/parties';
const options = {
  method: 'GET',
  headers: new Headers({ 'Content-Type': 'application/json' }),
};

fetch(url, options)
  .then(res => res.json())
  .then((res) => {
    if (res.status === 200) {
      const { data } = res;
      if (data.length) {
        let row;
        data.forEach((party, index) => {
          row = `  <tr>
                      <td>${index + 1}</td>
                      <td class="text-uppercase">${party.name}</td>
                      <td><img src="${party.logourl}" alt="${party.name}" class="party-logo"></td>
                      <td>
                          ${party.hqaddress}
                      </td>
                  </tr>`;
          tableBody.insertAdjacentHTML('afterbegin', row);
        });
        if (data.length >= 15) {
          pagination.style.display = 'flex';
        }
      } else {
        tableBody.insertAdjacentHTML('afterbegin', '<p>No party at the moment</p>');
        pagination.style.display = 'none';
      }
    }
  })
  .catch((err) => {
    console.log(err);
  });
