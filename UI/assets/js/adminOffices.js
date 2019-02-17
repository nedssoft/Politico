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
                    <td>${office.name}</td>
                    <td class="text-uppercase">${office.type}</td>
                </tr>`;
          tableBody.insertAdjacentHTML('beforeend', row);
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
