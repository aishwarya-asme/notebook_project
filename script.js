function saveToServer(event) {
    event.preventDefault();
    
    const noteTitle = document.getElementById("noteTitle").value;
    const noteDesc = document.getElementById("noteDesc").value;

    const obj = {
        noteTitle,
        noteDesc
    }

    axios.post("https://crudcrud.com/api/306bc43785944282ab1b15da22825bc4/notebook", obj)
        .then((response) => {
            console.log(response);
            showNewNoteOnScreen(response.data);

            const totalNotes = document.getElementById('totalNotes');
            totalNotes.textContent = parseInt(totalNotes.textContent) + 1;

            const searchValue = document.getElementById('searchNote').value.toLowerCase();
            const newNoteTitle = response.data.noteTitle.toLowerCase();
            if (newNoteTitle.includes(searchValue)) {
                const showing = document.getElementById('showing');
                showing.textContent = parseInt(showing.textContent) + 1;
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function fetchNotesFromServer() {
    axios.get("https://crudcrud.com/api/306bc43785944282ab1b15da22825bc4/notebook")
        .then((response) => {
            console.log(response);
            for (let i = 0; i < response.data.length; i++) {
                showNewNoteOnScreen(response.data[i]);
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function showNewNoteOnScreen(note) {
    const parentNode = document.getElementById('listOfbooks');
    const childHTML = `<li id=${note._id} class="note">
                           <div class="noteTitle">${note.noteTitle}</div>
                           <div class="noteDesc">${note.noteDesc}</div>
                           <button onclick="deleteNote('${note._id}')">Delete</button>
                       </li>`;

    parentNode.innerHTML += childHTML;
}

function deleteNote(noteId) {
    axios.delete(`https://crudcrud.com/api/306bc43785944282ab1b15da22825bc4/notebook/${noteId}`)
        .then((response) => {
            console.log(response);
            removeNoteFromScreen(noteId);
        })
        .catch((err) => {
            console.log(err);
        });
}

function removeNoteFromScreen(noteId) {
    const noteElement = document.getElementById(noteId);
    if (noteElement) {
        noteElement.remove();
    }
}

function searchNotes() {
    const searchValue = document.getElementById('searchNote').value.toLowerCase();
    const notes = document.getElementsByClassName('note');

    let counter = 0;

    for (let i = 0; i < notes.length; i++) {
        const noteTitle = notes[i].querySelector('.noteTitle').textContent.toLowerCase();

        if (noteTitle.includes(searchValue)) {
            notes[i].style.display = 'block';
            counter++;
        } else {
            notes[i].style.display = 'none';
        }
    }

    document.getElementById('showing').textContent = counter;
}

document.getElementById('searchNote').addEventListener('input', searchNotes);
document.getElementById('searchButton').addEventListener('click', searchNotes);
document.getElementById('addNoteForm').addEventListener('submit', saveToServer);

window.addEventListener("DOMContentLoaded", fetchNotesFromServer);