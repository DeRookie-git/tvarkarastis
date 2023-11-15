document.addEventListener("DOMContentLoaded", function() {
});

// Change var into let !!!!!!!
function addElement(day) {
    var timeStart = prompt("Enter Starting Time (e.g., 9:00):");
    if (timeStart === null) return;

    var timeEnd = prompt("Enter Ending Time (e.g., 10:00):");
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
    // If we add a new entry, we also need to include it in var Entry to show up and in processFromCSV function to be read from the csv save file
    // String entry for the user input
    var entry = `${timeStart},${timeEnd},${name},${surname},${activity},${roomNumber},${buildingCode}`;

    // Append the entry to the respective day's list with the day stored as a data attribute
    var dayList = document.getElementById(day + "List");
    var listItem = document.createElement("li");
    listItem.innerHTML = `<span class="delete-btn" onclick="deleteElement(this, '${day}')">Delete</span>${entry}`;
    listItem.setAttribute('data-day', day); // Store the day information as a data attribute
    dayList.appendChild(listItem);

    // Saving the entry separately for CSV export 
    var fullEntry = `${day},${entry}`; // Day because we save and load it but do not show it, unless it's added in var entry as ${day}
    saveEntryToStorage(fullEntry);

    saveDataToFile();
}



function deleteElement(element, day) {
    var listItem = element.parentNode;
    var dayList = document.getElementById(day + "List");
    dayList.removeChild(listItem);

    // Updating saved entries list by reconstructing the entries
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
            // If there's delete, we'll exclude it
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

    var csvContent = "data:text/csv;charset=utf-8,";

    entries.forEach(function (entry) {
        var day = entry.split(',')[0]; // Extract day from entry
        var entryData = entry.split(',').slice(1).join(','); // Extract entry data
        var modifiedEntry = `${day},${entryData}`; // Concatenate day and entry data
        csvContent += modifiedEntry + "\n"; // Add the modified entry to CSV content
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "schedule.csv");
    document.body.appendChild(link);
    link.click();
}

function processDataFromCSV(csv) {
    const entries = csv.split('\n');

    entries.forEach(function (entry) {
        const [day, start, end, name, surname, activity, roomNumber, buildingCode] = entry.split(',');

        const reconstructedEntry = `${start},${end},${name},${surname},${activity},${roomNumber},${buildingCode}`; // Jei pridesim ${day} tai rasys ir diena

        const listItem = document.createElement("li");
        listItem.setAttribute("data-day", day); // Set the data-day attribute
        listItem.innerHTML = `<span class="delete-btn" onclick="deleteElement(this, '${day}')">Delete</span>${reconstructedEntry}`;

        const dayList = document.getElementById(day + "List");
        dayList.appendChild(listItem);
    });
}


function loadFromCSV() {
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

    input.click();
}

function clearAllData() {
    var dayContainers = document.querySelectorAll('.day-container');
    dayContainers.forEach(function (container) {
        var dayList = container.querySelector('.day-list');
        dayList.innerHTML = ''; // Clearing UI (globalus delete, istrina ir jeyra uzkrautu bet nepriskirtu entries)
    });

    localStorage.removeItem('entries');
}
        // --- wip stuff ---
function changeColor() {
    var colorDropdown = document.getElementById("colorDropdown");
    if (colorDropdown.style.display === "none") {
        colorDropdown.style.display = "block";
    } else {
        colorDropdown.style.display = "none";
    }
}

function selectColor() {
    var selectedColor = document.getElementById("colorSelect").value;
    document.body.style.backgroundColor = selectedColor;
}
