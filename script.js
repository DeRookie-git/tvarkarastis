document.addEventListener("DOMContentLoaded", function() {
    // Load data from file on page load
    loadDataFromFile();
});

function addElement(day) {
    var timeStart = prompt("Enter Starting Time (e.g., 9:00 AM):");
    if (timeStart === null) return;

    var timeEnd = prompt("Enter Ending Time (e.g., 10:00 AM):");
    if (timeEnd === null) return;

    var name = prompt("Enter Name:");
    if (name === null) return;

    var surname = prompt("Enter Surname:");
    if (surname === null) return;

    var activity = prompt("Enter Activity:");
    if (activity === null) return;

    var roomNumber = prompt("Enter Room Number:");
    if (roomNumber === null) return;

    var buildingCode = prompt("Enter Building Code (3 letters):");
    if (buildingCode === null) return;

    if (!timeStart || !timeEnd || !name || !surname || !activity || !roomNumber || !buildingCode) {
        alert("Please enter all fields.");
        return;
    }

    // Create a string entry for the user input (excluding the day)
    var entry = `${timeStart},${timeEnd},${name},${surname},${activity},${roomNumber},${buildingCode}`;

    // Append the entry to the respective day's list
    var dayList = document.getElementById(day + "List");
    var listItem = document.createElement("li");
    listItem.innerHTML = `<span class="delete-btn" onclick="deleteElement(this, '${day}')">Delete</span>${entry}`;
    listItem.setAttribute('data-day', day); // Store the day information as a data attribute
    dayList.appendChild(listItem);

    // Save the entry separately for CSV export
    saveEntryToStorage(entry);

    // Save data to file
    saveDataToFile();
}



function deleteElement(element, day) {
    var listItem = element.parentNode;
    var dayList = document.getElementById(day + "List");
    dayList.removeChild(listItem);

    // Update saved entries list by reconstructing the entries without deleted item
    updateSavedEntries();
    saveDataToFile();
}

function updateSavedEntries() {
    var dayContainers = document.querySelectorAll('.day-container');
    var entries = [];

    dayContainers.forEach(function (container) {
        var dayList = container.querySelector('.day-list');
        var items = dayList.querySelectorAll('li');

        items.forEach(function (item) {
            // Exclude 'Delete' and reconstruct the entry
            var reconstructedEntry = item.innerText.replace('Delete', '').trim();
            entries.push(reconstructedEntry);
        });
    });

    localStorage.setItem('entries', JSON.stringify(entries));
}

function saveEntryToStorage(entry) {
    // Store the entry in Local Storage (for later CSV export)
    var entries = JSON.parse(localStorage.getItem('entries')) || [];
    entries.push(entry);
    localStorage.setItem('entries', JSON.stringify(entries));
}

function saveToCSV() {
    var entries = JSON.parse(localStorage.getItem('entries')) || [];

    // Convert entries to CSV format
    var csvContent = "data:text/csv;charset=utf-8,";
    entries.forEach(function (entry) {
        csvContent += entry + "\n";
    });

    // Create a download link for the CSV file
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "schedule.csv");
    document.body.appendChild(link); // Append the link to the DOM
    link.click(); // Simulate click to trigger the download
}

function processDataFromCSV(csv) {
    const entries = csv.split('\n');

    entries.forEach(function (entry) {
        const [day, start, end, name, surname, activity, roomNumber, buildingCode] = entry.split(',');

        // Construct the entry excluding the day of the week
        const reconstructedEntry = `${start},${end},${name},${surname},${activity},${roomNumber},${buildingCode}`;

        // Create a list item for the reconstructed entry
        const listItem = document.createElement("li");
        listItem.dataset.day = day; // Store the day information
        listItem.innerHTML = `<span class="delete-btn" onclick="deleteElement(this, '${day}')">Delete</span>${reconstructedEntry}`;

        // Get the respective day's list and append the reconstructed entry
        const dayList = document.getElementById(day + "List");
        dayList.appendChild(listItem);
    });
}

function loadFromCSV() {
    // Clear existing entries before loading from CSV
    localStorage.removeItem('entries');

    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';

    input.addEventListener('change', function () {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const csv = event.target.result;
            processDataFromCSV(csv);
        };

        reader.readAsText(file);
    });

    // Trigger the input click event when the button is clicked
    input.click();
}

function clearAllData() {
    var dayContainers = document.querySelectorAll('.day-container');
    dayContainers.forEach(function (container) {
        var dayList = container.querySelector('.day-list');
        dayList.innerHTML = ''; // Clear all entries from the UI
    });

    localStorage.removeItem('entries'); // Clear saved entries
}
