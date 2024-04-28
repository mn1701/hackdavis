document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/shifts')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        const tableBody = document.getElementById('shiftsTable').getElementsByTagName('tbody')[0];
        data.forEach(row => {
            let newRow = tableBody.insertRow();
            let cell1 = newRow.insertCell(0);
            let cell2 = newRow.insertCell(1);
            let cell3 = newRow.insertCell(2);
            cell1.textContent = row['Shift Time'];
            if (row['Date']) {
                const date = new Date((row['Date'] - (25567 + 2)) * 86400000);
                date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                cell2.textContent = date.toLocaleDateString();
            } else {
                cell2.textContent = '';
            }
            cell3.textContent = row['Volunteers'];
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
});
