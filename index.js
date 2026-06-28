const localStorageNotesData = JSON.parse(
  localStorage.getItem("WEB_DIARY_NOTES"),
);

const localStorageNewNoteLocation = JSON.parse(
  localStorage.getItem("NEW_NOTES_LOCATION"),
);

const mainBoard = document.getElementById("main-board");

// Created New Note Div foR Injection
const newNoteDiv = document.createElement("div");
newNoteDiv.className = "sticky-notes";
newNoteDiv.id = "new-note";
const newNoteForm = document.createElement("form");
newNoteForm.id = "newNoteForm";
const newNoteInputContainer = document.createElement("div");
newNoteInputContainer.className = "main-text-area-container";
const newNoteTextArea = document.createElement("textarea");
newNoteTextArea.id = "post-text";
const newNoteButton = document.createElement("button");
newNoteButton.id = "post-button";
newNoteButton.textContent = "+";

newNoteInputContainer.appendChild(newNoteTextArea);
newNoteForm.appendChild(newNoteInputContainer);
newNoteForm.appendChild(newNoteButton);
newNoteDiv.appendChild(newNoteForm);
mainBoard.appendChild(newNoteDiv);

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

function updateDefaultNotes(e) {
  const newDiv = document.createElement("div");
  const newText = document.createElement("text");
  const newInput = document.createElement("input");

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

  const delButtonInside = newDiv.querySelector(".deleteNote");

  newDiv.addEventListener("mouseenter", (e) => {
    newInput.style.display = "flex";
    newText.style.display = "none";

    if (delButtonInside) {
      delButtonInside.style.display = "flex";
    }
  });

  newDiv.addEventListener("mouseleave", (e) => {
    newInput.style.display = "none";
    newText.style.display = "flex";
    if (delButtonInside) {
      delButtonInside.style.display = "none";
    }
  });

  mainBoard.insertBefore(newDiv, newNoteDiv);
}

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
    addNewStickyNote(e);
    form.requestSubmit();
  }
});

// stickyNotes.forEach((note) => {
//   const delButtonInside = note.querySelector(".deleteNote");

//   if (delButtonInside) {
//     note.addEventListener("mouseenter", (event) => {
//       delButtonInside.style.display = "flex";
//     });

//     note.addEventListener("mouseleave", (event) => {
//       delButtonInside.style.display = "none";
//     });
//   }
// });

function addNewStickyNote(e) {
  e.preventDefault();

  const newNoteDiv = document.getElementById("new-note");

  // alert(postText.value);

  const newStickyNote = {
    notesID: defaultNotes.length,
    notesMsg: postText.value,
    notesTimeStamp: 1776085680,
    left: newNoteDiv.style.left.split("px")[0],
    top: newNoteDiv.style.top.split("px")[0] - 100,
  };
  // alert(newStickyNote);
  // alert("masuk");
  defaultNotes.push(newStickyNote);
  updateDefaultNotes(newStickyNote);
  localStorage.setItem("WEB_DIARY_NOTES", JSON.stringify(defaultNotes));
}

defaultNotes.map((e) => {
  updateDefaultNotes(e);
});
