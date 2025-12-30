let notes = JSON.parse(localStorage.getItem("dh_notes")) || [];
const editor = document.getElementById("editor");
const titleEditor = document.getElementById("noteTitle");

// COMMANDS (bold, italic, underline)
function cmd(command) {
    document.execCommand(command);
}

// FONT FAMILY & SIZE
document.getElementById("fontFamily").onchange = function () {
    editor.style.fontFamily = this.value;
    titleEditor.style.fontFamily = this.value;
};

document.getElementById("fontSize").onchange = function () {
    editor.style.fontSize = this.value + "px";
    titleEditor.style.fontSize = (parseInt(this.value)+10) + "px";
};

// FONT COLOR
function setColor(color) {
    editor.style.color = color;
    titleEditor.style.color = color;
}

// TAB SWITCHING
function showTab(tab) {
    const writeSec = document.getElementById("writeSection");
    const savedSec = document.getElementById("savedSection");
    const writeBtn = document.getElementById("writeTab");
    const savedBtn = document.getElementById("savedTab");

    if(tab === 'write') {
        writeSec.style.display = 'block';
        savedSec.style.display = 'none';
        writeBtn.classList.add('active');
        savedBtn.classList.remove('active');
    } else {
        writeSec.style.display = 'none';
        savedSec.style.display = 'block';
        writeBtn.classList.remove('active');
        savedBtn.classList.add('active');
        renderNotes();
    }
}

// GET CURRENT TIMESTAMP
function getTimestamp() {
    const now = new Date();
    const y = now.getFullYear(), m = String(now.getMonth()+1).padStart(2,'0');
    const d = String(now.getDate()).padStart(2,'0');
    const h = String(now.getHours()).padStart(2,'0');
    const min = String(now.getMinutes()).padStart(2,'0');
    const s = String(now.getSeconds()).padStart(2,'0');
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

// SAVE NOTE
function saveNote() {
    const title = titleEditor.innerHTML.trim();
    const content = editor.innerHTML.trim();
    if(!title && !content) return;

    const titleStyle = titleEditor.getAttribute("style");
    const contentStyle = editor.getAttribute("style");
    const timestamp = getTimestamp();

    notes.push({title, content, titleStyle, contentStyle, timestamp});
    localStorage.setItem("dh_notes", JSON.stringify(notes));

    titleEditor.innerHTML = "";
    editor.innerHTML = "";
    titleEditor.removeAttribute("style");
    editor.removeAttribute("style");

    alert("Note saved ✅");
}

// RENDER SAVED NOTES
function renderNotes() {
    const list = document.getElementById("notesList");
    list.innerHTML = "";

    notes.forEach((note,i) => {
        list.innerHTML += `
        <div class="note-card">
            <small>Saved on: ${note.timestamp}</small>
            <div style="${note.titleStyle}">${note.title}</div>
            <div style="${note.contentStyle}">${note.content}</div>
            <button onclick="editNote(${i})">Edit</button>
            <button onclick="deleteNote(${i})">Delete</button>
        </div>`;
    });
}

// EDIT NOTE
function editNote(i) {
    titleEditor.innerHTML = notes[i].title;
    editor.innerHTML = notes[i].content;
    titleEditor.setAttribute("style", notes[i].titleStyle);
    editor.setAttribute("style", notes[i].contentStyle);

    notes.splice(i,1);
    localStorage.setItem("dh_notes", JSON.stringify(notes));
    showTab('write');
}

// DELETE NOTE
function deleteNote(i) {
    notes.splice(i,1);
    localStorage.setItem("dh_notes", JSON.stringify(notes));
    renderNotes();
}

// EXPORT Notes as .txt
function exportNotes() {
    if(notes.length === 0) {
        alert("No notes to export!");
        return;
    }

    let textData = notes.map(note => {
        return `---\nTitle: ${note.title}\nSaved on: ${note.timestamp}\n\n${note.content}\n`;
    }).join("\n");

    const blob = new Blob([textData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "DailyHub_Notes.txt"; // TXT file
    a.click();
    URL.revokeObjectURL(url);
}

// IMPORT Notes from JSON
function importNotes(event) {
    const file = event.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedNotes = JSON.parse(e.target.result);
            if(Array.isArray(importedNotes)) {
                notes = notes.concat(importedNotes);
                localStorage.setItem("dh_notes", JSON.stringify(notes));
                renderNotes();
                alert("Notes imported successfully ✅");
            } else {
                alert("Invalid file format!");
            }
        } catch(err) {
            alert("Error reading file!");
            console.error(err);
        }
    }
    reader.readAsText(file);
}

renderNotes();
