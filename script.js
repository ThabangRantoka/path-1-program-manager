let programs = JSON.parse(localStorage.getItem("programs")) || [];
let editingId = null;

const form = document.getElementById("programForm");
const list = document.getElementById("programList");
const searchInput = document.getElementById("searchInput");

    // ISSUE 1:
    // If localStorage.setItem() is removed,
    // all programs disappear after refreshing the browser.

function savePrograms() {
    localStorage.setItem("programs", JSON.stringify(programs));
}

function displayPrograms(filter = "") {

    // ISSUE 2:
    // If this line is removed,
    // program cards will duplicate every time displayPrograms() runs.

    list.innerHTML = "";

    const filteredPrograms = programs.filter(program =>

        // ISSUE 3:
        // Without toLowerCase(),
        // search becomes case-sensitive.
        // Example:
        // "news" will not find "News"

        program.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredPrograms.length === 0) {
        list.innerHTML = `<p class="empty-message">No programs available</p>`;
        return;
    }

    filteredPrograms.forEach(program => {

        const card = document.createElement("div");
        card.className = "program-card";

        card.innerHTML = `
            <h3>${program.name}</h3>

            <p>${program.description}</p>

            <div class="info">
                <span>⏱ ${program.duration} mins</span>
                <span>📅 ${program.timeSlot}</span>
            </div>

            <div class="info">
                <span>📺 ${program.channel}</span>


                  <!-- ISSUE 4:
                If this condition is wrong,
                LIVE and RECORDED status displays incorrectly -->


                <span class="${program.isLive ? 'live' : 'recorded'}">
                    ${program.isLive ? 'LIVE' : 'RECORDED'}
                </span>
            </div>

            <div class="buttons">

                <!-- ISSUE 5:
                If program.id is missing,
                Edit button edits wrong program -->

                <button class="edit-btn" onclick="editProgram(${program.id})">
                    Edit
                </button>


                 <!-- ISSUE 6:
                Wrong ID causes delete to fail -->

                <button class="delete-btn" onclick="deleteProgram(${program.id})">
                    Delete
                </button>
            </div>
        `;

        list.appendChild(card);
    });
}

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const description = document.getElementById("description").value.trim();
    const duration = parseInt(document.getElementById("duration").value);
    const timeSlot = document.getElementById("timeSlot").value;
    const channel = document.getElementById("channel").value;
    const isLive = document.getElementById("isLive").checked;
    

    // ISSUE 9:
    // Without validation,
    // empty fields can be submitted.

    if (!name || !description || !duration || !timeSlot) {
        alert("Please fill in all fields.");
        return;
    }

    if (duration < 1 || duration > 300) {
        alert("Duration must be between 1 and 300 minutes.");
        return;
    }

    if (editingId) {

        const program = programs.find(p => p.id === editingId);

        program.name = name;
        program.description = description;
        program.duration = duration;
        program.timeSlot = timeSlot;
        program.channel = channel;
        program.isLive = isLive;

        editingId = null;

        form.querySelector("button").textContent = "Add Program";

    } else {

        const newProgram = {
            id: Date.now(),
            name,
            description,
            duration,
            timeSlot,
            channel,
            isLive
        };

        programs.push(newProgram);
    }

    savePrograms();
    displayPrograms();

    form.reset();
});

function editProgram(id) {

    const program = programs.find(p => p.id === id);

    document.getElementById("name").value = program.name;
    document.getElementById("description").value = program.description;
    document.getElementById("duration").value = program.duration;
    document.getElementById("timeSlot").value = program.timeSlot;
    document.getElementById("channel").value = program.channel;
    document.getElementById("isLive").checked = program.isLive;

    editingId = id;

    form.querySelector("button").textContent = "Update Program";
}

function deleteProgram(id) {

    const confirmDelete = confirm("Delete this program?");

    if (confirmDelete) {

        programs = programs.filter(program => program.id !== id);

        savePrograms();
        displayPrograms();
    }
}

searchInput.addEventListener("input", function (e) {
    displayPrograms(e.target.value);
});

displayPrograms();