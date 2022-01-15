document.addEventListener("DOMContentLoaded", async function(event) {
    const inputName = document.getElementById("election_name");
    const submitNameButton = document.getElementById("submit_name");
    const fetchAllButton = document.getElementById("fetch_all");
    const fetchAllActive = document.getElementById("fetch_all_active");

    inputName.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("election_name").click();
        }
    });

    submitNameButton.addEventListener("click", async function(event) {
        const name = inputName.value;
        const getSearchedElection = await fetch(`/elections/find-election/${name}`);
        const searchedElection = await getSearchedElection.json();
        fillTable(searchedElection);
    })

    fetchAllButton.addEventListener("click", async function(event) {
        const getAll = await fetch("/elections/list-all")
        const allElections = await getAll.json();
        fillTable(allElections);
    })

    fetchAllActive.addEventListener("click", async function(event) {
        const getAllActive = await fetch("/elections/list-all?active=true")
        const allActiveElections = await getAllActive.json();
        fillTable(allActiveElections);
    })
});

async function fillTable(arr) {
    if(arr.length > 0) {
        let tableCard = document.getElementById('tableCard');
        tableCard.removeAttribute("hidden");
    
        let table = document.getElementById('electionListBody');
        table.innerHTML = "";
    
        for (let i = 0; i < arr.length; i++) {
            let row = table.insertRow(i);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            let cell4 = row.insertCell(3);
            let cell5 = row.insertCell(4);
    
            let candidateNameArr = [];
    
            for(const candidate of arr[i].candidates) {
                candidateNameArr.push(candidate.name);
            }
    
            cell1.innerHTML = arr[i].name_of_election;
            cell2.innerHTML = candidateNameArr.join(",");
            cell3.innerHTML = arr[i].is_ended;
            cell4.innerHTML = arr[i].creation_date;
            cell5.innerHTML = 
            `
                <button class="button blue" onclick="editElection('${arr[i]._id}')">Edit</button>
                <button class="button red" onclick="deleteElection('${arr[i]._id}')">Delete</button>
            `;
        }
    } else {
        showAlert("No elections found", "error");
    }
}

async function editElection(projectId) {
    location.href = `/elections/manage-election/${projectId}`;
}

async function deleteElection(projectId) {
    location.href = `/elections/delete-election/${projectId}`;
}