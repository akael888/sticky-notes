const localStorageNotesData = JSON.parse(
  localStorage.getItem("WEB_DIARY_NOTES"),
);

const localStorageNewNoteLocation = JSON.parse(
  localStorage.getItem("NEW_NOTES_LOCATION"),
);

let defaultNotes = localStorageNotesData
  ? localStorageNotesData
  : [
      {
        notesID: 0,
        notesMsg: "ABC",
        notesTimeStamp: 1776085680,
        left: 0,
        top: 0,
      },
      {
        notesID: 1,
        notesMsg: "yes",
        notesTimeStamp: 1776085680,
        left: 0,
        top: 0,
      },
      {
        notesID: 2,
        notesMsg: "Test 1234",
        notesTimeStamp: 1776085680,
        left: 0,
        top: 0,
      },
    ];

const mainBoard = document.getElementById("main-board");

function updateDefaultNotes(e) {
  const newDiv = document.createElement("div");
  const newText = document.createElement("text");
  const newInput = document.createElement("input");
  const newNoteDiv = document.getElementById("new-note");

  newText.innerText = e.notesMsg;
  newInput.defaultValue = e.notesMsg;
  newInput.className = "sticky-input";
  newInput.style.display = "none";

  newDiv.appendChild(newInput);
  newDiv.appendChild(newText);

  newDiv.className = "sticky-notes";
  newDiv.id = `${e.notesID}`;
  newDiv.style.left = `${e.left}px`;
  newDiv.style.top = `${e.top}px`;

  console.log(localStorageNewNoteLocation);

  newNoteDiv.style.left = localStorageNewNoteLocation
    ? `${localStorageNewNoteLocation.left}px`
    : 0;
  newNoteDiv.style.top = localStorageNewNoteLocation
    ? `${localStorageNewNoteLocation.top}px`
    : 0;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "deleteNote";
  deleteButton.style.display = "none";

  deleteButton.addEventListener("click", (e) => {
    parentDiv = deleteButton.closest("div");
    parentId = parentDiv.id;
    parentDiv.remove();

    const updatedData = defaultNotes.filter((data) => data.notesID != parentId);
    defaultNotes = updatedData;
    localStorage.setItem("WEB_DIARY_NOTES", JSON.stringify(updatedData));
  });

  //Make Sticky Notes Draggable
  let offsetX = 0;
  let offsetY = 0;

  const textArea = document.getElementById("post-text");

  textArea.addEventListener("mouseenter", (e) => {
    //Focus on Text Area for Post on Mouse Hover
    textArea.focus();
  });
  
  console.log(textArea);

  newNoteDiv.addEventListener("pointerdown", (e) => {
    if (e.target === newInput || e.target === deleteButton) return;
    e.preventDefault();
    // Calculate cursor position relative to the element's position from top left
    offsetX = e.clientX - newNoteDiv.offsetLeft;
    offsetY = e.clientY - newNoteDiv.offsetTop;

    document.addEventListener("pointermove", pointerMove);
    document.addEventListener("pointerup", pointerUp);

    function pointerMove(e) {
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      newNoteDiv.style.left = `${newX}px`;
      newNoteDiv.style.top = `${newY}px`;

      const changedNote = defaultNotes.find(
        (note) => note.notesID === "new-note",
      );

      const newNoteLocation = {
        left: newX,
        top: newY,
      };

      localStorage.setItem(
        "NEW_NOTES_LOCATION",
        JSON.stringify(newNoteLocation),
      );
    }

    function pointerUp() {
      document.removeEventListener("pointermove", pointerMove);
      document.removeEventListener("pointerup", pointerUp);
    }
  });

  newDiv.addEventListener("mouseenter", (e) => {
    newInput.style.display = "flex";
    newText.style.display = "none";
  });

  newDiv.addEventListener("mouseleave", (e) => {
    newInput.style.display = "none";
    newText.style.display = "flex";
  });

  newInput.addEventListener("input", (e) => {
    let inputValue = e.target.value;
    const changedNote = defaultNotes.find(
      (note) => note.notesID === Number(newDiv.id),
    );
    // alert(changedNote);
    if (changedNote) {
      changedNote.notesMsg = newInput.value;
      newText.innerText = changedNote.notesMsg;
      // alert(defaultNotes[newDiv.id].notesMsg);
      // localStorage.setItem("");
      localStorage.setItem("WEB_DIARY_NOTES", JSON.stringify(defaultNotes));

      // alert(changedNote.notesMsg);
      // updateDefaultNotes(changedNote);
    }
  });

  newDiv.addEventListener("pointerdown", (e) => {
    if (e.target === newInput || e.target === deleteButton) return;
    e.preventDefault();
    // Calculate cursor position relative to the element's position from top left
    offsetX = e.clientX - newDiv.offsetLeft;
    offsetY = e.clientY - newDiv.offsetTop;

    document.addEventListener("pointermove", pointerMove);
    document.addEventListener("pointerup", pointerUp);

    function pointerMove(e) {
      let newX = e.clientX - offsetX;
      let newY = e.clientY - offsetY;

      newDiv.style.left = `${newX}px`;
      newDiv.style.top = `${newY}px`;

      const changedNote = defaultNotes.find(
        (note) => note.notesID === Number(newDiv.id),
      );
      if (changedNote) {
        changedNote.left = newX;
        changedNote.top = newY;

        // alert(defaultNotes[newDiv.id].notesMsg);
        // localStorage.setItem("");
        localStorage.setItem("WEB_DIARY_NOTES", JSON.stringify(defaultNotes));

        // alert(changedNote.notesMsg);
        // updateDefaultNotes(changedNote);
      }
    }

    function pointerUp() {
      document.removeEventListener("pointermove", pointerMove);
      document.removeEventListener("pointerup", pointerUp);
    }
  });

  newDiv.addEventListener("mouseenter", (e) => {
    newInput.style.display = "flex";
    newText.style.display = "none";
  });

  newDiv.addEventListener("mouseleave", (e) => {
    newInput.style.display = "none";
    newText.style.display = "flex";
  });

  newInput.addEventListener("input", (e) => {
    let inputValue = e.target.value;
    const changedNote = defaultNotes.find(
      (note) => note.notesID === Number(newDiv.id),
    );
    // alert(changedNote);
    if (changedNote) {
      changedNote.notesMsg = newInput.value;
      newText.innerText = changedNote.notesMsg;
      // alert(defaultNotes[newDiv.id].notesMsg);
      // localStorage.setItem("");
      localStorage.setItem("WEB_DIARY_NOTES", JSON.stringify(defaultNotes));

      // alert(changedNote.notesMsg);
      // updateDefaultNotes(changedNote);
    }
  });

  newDiv.append(deleteButton);

  mainBoard.insertBefore(newDiv, newNoteDiv);
}

function addNewStickyNote() {
  if (postText.value) {
    const newStickyNote = {
      notesID: defaultNotes.length,
      notesMsg: postText.value,
      notesTimeStamp: 1776085680,
      left: "0px",
      top: "0px",
    };
    defaultNotes.push(newStickyNote);
    updateDefaultNotes(newStickyNote);
  }
}

defaultNotes.map((e) => {
  updateDefaultNotes(e);
});

const newDiv = document.createElement("div");
// defaultElement.textContent = defaultNotes[0].notesMsg;

const form = document.getElementById("newNoteForm");
const postButton = document.getElementById("post-button");
const postText = document.getElementById("post-text");
const stickyNotes = document.querySelectorAll(".sticky-notes");

postButton.addEventListener("click", () => {
  // alert(postText.value);

  addNewStickyNote();
  // alert("clicked dalam");

  // alert("clicked");
});

postText.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    addNewStickyNote();
    form.requestSubmit();
  }
});

stickyNotes.forEach((note) => {
  const delButtonInside = note.querySelector(".deleteNote");

  if (delButtonInside) {
    note.addEventListener("mouseenter", (event) => {
      delButtonInside.style.display = "flex";
    });

    note.addEventListener("mouseleave", (event) => {
      delButtonInside.style.display = "none";
    });
  }
});
