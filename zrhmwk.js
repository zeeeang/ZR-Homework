document.addEventListener('DOMContentLoaded', function() {

    var divisionNames = {
        'Workforce Development': ['Seok Hieng', 'Stephanie', 'Laureen'],
        'Smart City': ['Guoming', 'Eng Hwee', "Shanny"],
        'Human Capital': ['Wee Teng','Christine'],
        'Finance': ['Cher Maine', 'Keith', 'Chole', 'Christine', 'Sok Hwai'],
        'Office Admin': ['Dexun'],
        'Others': []
    };

    var divisionSelection = document.getElementById('divisionSelection');
    var officerSelection = document.getElementById('officerSelection');
    var otherOfficersName = document.getElementById('otherOfficersName');
    
    //function to populate dropdown lists
    function populateDropdown(dropdown, options) {
        dropdown.innerHTML = "";
        options.forEach(element => {
            var optionElem = document.createElement('option');
            optionElem.value = element;
            optionElem.textContent = element;
            dropdown.appendChild(optionElem);
            });
    }
    
    //function to add a new homework entry into table    
    function addHomeWork() {

        var emailSubject = document.getElementById('emailSubject').value;
        var division = document.getElementById('divisionSelection').value;
        var sentBy;
        var otherSentBy = document.getElementById('otherOfficersName').value;
        var dateSent = document.getElementById('dateSent').value;
        var timeSent = document.getElementById('timeSent').value;
        var clearBy = document.getElementById('dateToBeCleared').value;

        if (division === "Others"){
            sentBy = otherSentBy;
        } else {
            sentBy = document.getElementById('officerSelection').value
        }

        //call to store the new homework input in local storage
        storeHomeWorkData(emailSubject, sentBy, otherSentBy, dateSent, timeSent, clearBy);

        location.reload();
    }

    //function to store homework data in local storage
    function storeHomeWorkData(emailSubject, sentBy, otherSentBy, dateSent, timeSent, clearBy){
        var existingData = getHomeWorkData();

        existingData.unshift({
            emailSubject: emailSubject,
            sentBy: sentBy || otherSentBy || "",
            dateSent: dateSent,
            timeSent: timeSent,
            clearBy: clearBy
        });

        localStorage.setItem('homeworkData', JSON.stringify(existingData));
    }
    
    //function to delete a selected row
    function deleteSelectedRow(row) {
        var tableBody = document.getElementById('homeworkTableBody');
        var rowIndex = row.rowIndex;

        removeHomeworkData(rowIndex);

        tableBody.deleteRow(row.rowIndex - 1);
        
    }

    // function to remove data from localStorage
    function removeHomeworkData(rowIndex) { 
        // Get existing data from localStorage
        var existingData = getHomeWorkData();
    
        // Remove the data corresponding to the deleted row
        existingData.splice(existingData.length - rowIndex, 1);
    
        // Save the updated data back to localStorage
        localStorage.setItem('homeworkData', JSON.stringify(existingData));
    }

    //function to get existing homework data from local storage
    function getHomeWorkData(){
        var existingDataString = localStorage.getItem('homeworkData');
        var existingData = existingDataString ? JSON.parse(existingDataString) : [];

        return existingData;
    }

    function restoreHomeWork() {
        // Check if there is data in local storage
        if (localStorage.getItem('homeworkData')) {
            // Get existing data from local storage
            var existingData = getHomeWorkData();
    
            // Iterate through the existing data and add rows to the table
            existingData.forEach(function(data) {
                var tableBody = document.getElementById('homeworkTableBody');
                var newRow = tableBody.insertRow(0);
    
                // Fill cells with data
                newRow.insertCell(0).textContent = data.emailSubject;
                newRow.insertCell(1).textContent = data.sentBy || "";
                newRow.insertCell(2).textContent = data.dateSent;
                newRow.insertCell(3).textContent = data.timeSent;
                newRow.insertCell(4).textContent = data.clearBy;
    
                // Add a delete button
                var deleteCell = newRow.insertCell(5);
                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = function() {
                    deleteSelectedRow(newRow);
                };
    
                deleteCell.appendChild(deleteButton);
            });
        } else {
            console.log("No homework data in local storage.");
        }
    }

    //call when division is selected    
    divisionSelection.addEventListener('change', function() {
        var selectedDivision = divisionSelection.value;
        if (selectedDivision === 'Others') {
            officerSelection.style.display = 'none';
            otherOfficersName.style.display = 'block';
        } else {
            officerSelection.style.display = 'block';
            otherOfficersName.style.display = 'none';
            var names = divisionNames[selectedDivision] || [];
            populateDropdown(officerSelection, names);
        }
        
    });

    //call when add homework button is clicked
    document.getElementById('addHomeworkBtn').addEventListener('click', addHomeWork)
  
    if (localStorage.length !== 0) {
        // Show data in table
        restoreHomeWork()

    } else {
        // Do nothing
        console.log("No local Storage!");
    }
});