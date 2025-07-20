fetch('Blood%20Film%20Archives.csv')
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split('\n').slice(1); // Skip header
    const table = document.createElement('table');
    const thead = `
      <thead>
        <tr>
          <th>Date of Consult</th><th>Lab #</th><th>Gender</th><th>Age</th><th>Ward</th>
          <th>Indication</th><th>Date Reported Out</th><th>Blood Film Report</th>
        </tr>
      </thead>`;
    table.innerHTML = thead + '<tbody>' + rows.map(row => {
      const cols = row.split(',');
      return `<tr>
        <td>${cols[0]}</td>
        <td>${cols[1]}</td>
        <td>${cols[2]}</td>
        <td>${cols[3]}</td>
        <td>${cols[4]}</td>
        <td>${cols[7]}</td>
        <td>${cols[8]}</td>
        <td>${cols[10]}</td>
      </tr>`;
    }).join('') + '</tbody>';
    document.getElementById('table-container').innerHTML = '';
    document.getElementById('table-container').appendChild(table);

    document.getElementById('search').addEventListener('input', e => {
      const val = e.target.value.toLowerCase();
      [...table.querySelectorAll('tbody tr')].forEach(tr => {
        tr.style.display = tr.textContent.toLowerCase().includes(val) ? '' : 'none';
      });
    });
  });
