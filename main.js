// --- Charts ---
// Delegates by Category
const ctx1 = document.getElementById('categoryChart');
const categoryChart = new Chart(ctx1, {
  type: 'doughnut',
  data: {
    labels: ['Doctors', 'Nurses', 'Allied HCP'],
    datasets: [{ data: [700, 669, 396], backgroundColor: ['#6366f1','#22c55e','#f97316'] }]
  },
  options: {
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 15, padding: 20 } },
      datalabels: { color: '#fff', font: { weight: 'bold' } }
    }
  },
  plugins: [ChartDataLabels]
});

// UAE Delegates
const ctxUAE = document.getElementById('uaeChart');
const uaeChart = new Chart(ctxUAE, {
  type: 'bar',
  data: {
    labels: ['Dxb-Shj','Abu Dhabi-Al Ain','Other Emirates'],
    datasets: [
      { label: 'Previous', data: [779, 519, 84], backgroundColor: '#93c5fd' },
      { label: 'Current', data: [934, 586, 107], backgroundColor: '#1d4ed8' }
    ]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'bottom' }, datalabels: { anchor: 'end', align: 'top', color: '#111827', font: { weight: 'bold' } } },
    scales: { y: { beginAtZero: true, suggestedMax: 1200 } }
  },
  plugins: [ChartDataLabels]
});

// Regional & International Delegates
const ctxRegional = document.getElementById('regionalChart');
const regionalChart = new Chart(ctxRegional, {
  type: 'bar',
  data: {
    labels: ['Regional','APAC','International'],
    datasets: [
      { label: 'Previous', data: [46, 45, 31], backgroundColor: '#93c5fd' },
      { label: 'Current', data: [51, 55, 32], backgroundColor: '#1d4ed8' }
    ]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'bottom' }, datalabels: { anchor: 'end', align: 'top', color: '#111827', font: { weight: 'bold' } } },
    scales: { y: { beginAtZero: true, suggestedMax: 100 } }
  },
  plugins: [ChartDataLabels]
});

// --- Elements ---
const editBtn = document.getElementById('editBtn');
const editModal = document.getElementById('editModal');
const cancelEdit = document.getElementById('cancelEdit');
const saveEdit = document.getElementById('saveEdit');

const totalElem = document.getElementById('totalRegistrations');
const abstractElem = document.getElementById('abstractSubmissions');
const countriesElem = document.getElementById('participatingCountries');

const editTotal = document.getElementById('editTotal');
const editAbstract = document.getElementById('editAbstract');
const editCountries = document.getElementById('editCountries');

const editUAE1 = document.getElementById('editUAE1');
const editUAE2 = document.getElementById('editUAE2');
const editUAE3 = document.getElementById('editUAE3');

const editSessionsBody = document.getElementById('editSessionsBody');
const mainSessionsRows = document.querySelectorAll('section table tbody tr');

// --- Show modal ---
editBtn.addEventListener('click', () => {
  const password = prompt("Enter password to edit values:");
  if(password !== "EIOC2025") return alert("Incorrect password!");

  // Populate summary inputs (editable)
  editTotal.value = totalElem.textContent;      // now editable
  editAbstract.value = abstractElem.textContent;
  editCountries.value = countriesElem.textContent;

  editTotal.disabled = false;   // enable editing
  editAbstract.disabled = false;
  editCountries.disabled = false;

  // Populate UAE inputs from chart
  editUAE1.value = uaeChart.data.datasets[1].data[0];
  editUAE2.value = uaeChart.data.datasets[1].data[1];
  editUAE3.value = uaeChart.data.datasets[1].data[2];

  // Populate Regional & International inputs from chart
editRegional.value = regionalChart.data.datasets[1].data[0];
editAPAC.value = regionalChart.data.datasets[1].data[1];
editInternational.value = regionalChart.data.datasets[1].data[2];


  // Populate sessions modal table
  editSessionsBody.innerHTML = '';
  mainSessionsRows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const tr = document.createElement('tr');
    cells.forEach((cell, i) => {
      const td = document.createElement('td');
      if(i === 0) td.textContent = cell.textContent;
      else {
        const input = document.createElement('input');
        input.type = 'number';
        input.value = cell.textContent.replace(/,/g,'');
        input.className = 'border p- rounded w-20';
        td.appendChild(input);
      }
      tr.appendChild(td);
    });
    editSessionsBody.appendChild(tr);
  });

  saveEdit.disabled = false;
  editModal.classList.remove('hidden');
});
// --- Save ---
saveEdit.addEventListener('click', () => {
  // 1️⃣ Update summary cards
  totalElem.textContent = editTotal.value;
  abstractElem.textContent = editAbstract.value;
  countriesElem.textContent = editCountries.value;

  // 2️⃣ Update main sessions table
  const modalRows = editSessionsBody.querySelectorAll('tr');
  modalRows.forEach((row, i) => {
    const inputs = row.querySelectorAll('input');
    const mainCells = mainSessionsRows[i].querySelectorAll('td');

    // Update Target, Previous, Current, Unique, Oncologist
    for (let j = 1; j <= 5; j++) {
      mainCells[j].textContent = inputs[j-1].value;
    }

    // Compute Deficit = Target - Current
    const deficit = Number(inputs[0].value) - Number(inputs[2].value);
    mainCells[6].textContent = deficit;
    mainCells[6].className = deficit >= 0 ? 'p-1 text-green-600' : 'p-1 text-red-600';
  });

  // 3️⃣ Update Delegates by Category chart
  const categoryInputs = document.querySelectorAll('#editCategoryTable .category-input');
  categoryChart.data.datasets[0].data = Array.from(categoryInputs).map(input => Number(input.value));
  categoryChart.update();

  // 4️⃣ Update UAE chart
  uaeChart.data.datasets[1].data = [
    Number(editUAE1.value),
    Number(editUAE2.value),
    Number(editUAE3.value)
  ];
  uaeChart.update();


  // Inside saveEdit.addEventListener('click', ...)
regionalChart.data.datasets[1].data = [
  Number(editRegional.value),
  Number(editAPAC.value),
  Number(editInternational.value)
];
regionalChart.update();

  // Close modal
  editModal.classList.add('hidden');
});
