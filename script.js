fetch('Blood%20Film%20Archives.csv')
  .then(res => res.text())
  .then(csv => {
    const rows = csv.trim().split('\n').slice(1).map(line => line.split(','));
    const originalData = rows;
    const table = document.createElement('table');

    const renderTable = data => {
      table.innerHTML = `<thead><tr>
        <th>Date of Consult</th><th>Lab #</th><th>Gender</th><th>Age</th>
        <th>Ward</th><th>Indication</th><th>Date Reported</th><th>Report</th>
      </tr></thead><tbody>` +
      data.map(cols => `<tr>
        <td>${cols[0]}</td><td>${cols[1]}</td><td>${cols[2]}</td><td>${cols[3]}</td>
        <td>${cols[4]}</td><td>${cols[7]}</td><td>${cols[8]}</td><td>${cols[10]}</td>
      </tr>`).join('') + `</tbody>`;
    };

    const renderSummary = data => {
      let male = 0, female = 0;
      const ageBands = {'<1':0, '1–10':0, '11–20':0, '21–30':0, '31–50':0, '>50':0};
      const wards = {};
      const months = {};

      data.forEach(cols => {
        const gender = cols[2].trim().toUpperCase();
        const ward = cols[4].trim();
        const date = new Date(cols[0]);
        const age = parseFloat(cols[3]) || 0;

        if (gender === 'M') male++;
        if (gender === 'F') female++;

        if (age < 1) ageBands['<1']++;
        else if (age <= 10) ageBands['1–10']++;
        else if (age <= 20) ageBands['11–20']++;
        else if (age <= 30) ageBands['21–30']++;
        else if (age <= 50) ageBands['31–50']++;
        else ageBands['>50']++;

        wards[ward] = (wards[ward] || 0) + 1;

        const key = date.toLocaleString('default', {month: 'short', year: 'numeric'});
        months[key] = (months[key] || 0) + 1;
      });

      document.getElementById('summary').innerHTML = `
        <strong>Cases:</strong> ${data.length} | 
        <strong>Male:</strong> ${male} | <strong>Female:</strong> ${female}<br>
        <strong>Age bands:</strong> ${Object.entries(ageBands).map(([k,v]) => `${k}: ${v}`).join(' | ')}<br>
        <strong>Wards:</strong> ${Object.entries(wards).map(([k,v]) => `${k}: ${v}`).join(' | ')}<br>
        <strong>By Month:</strong> ${Object.entries(months).map(([k,v]) => `${k}: ${v}`).join(' | ')}
      `;
    };

    const updateDisplay = (filterText = '', startDate = null, endDate = null) => {
      let filtered = originalData.filter(cols => {
        const content = cols.join(' ').toLowerCase();
        const passesText = content.includes(filterText.toLowerCase());
        const consultDate = new Date(cols[0]);
        const passesDate = (!startDate || consultDate >= startDate) && (!endDate || consultDate <= endDate);
        return passesText && passesDate;
      });

      renderTable(filtered);
      renderSummary(filtered);
    };

    document.getElementById('table-container').innerHTML = '';
    document.getElementById('table-container').appendChild(table);
    updateDisplay();

    document.getElementById('search').addEventListener('input', e => {
      updateDisplay(e.target.value, 
        new Date(document.getElementById('start-date').value), 
        new Date(document.getElementById('end-date').value));
    });

    document.getElementById('apply-date').addEventListener('click', () => {
      updateDisplay(document.getElementById('search').value,
        new Date(document.getElementById('start-date').value), 
        new Date(document.getElementById('end-date').value));
    });
  });
