document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Loaded. Code Safe to Run");
  initApp();
});

function initApp() {
  // Defining Constants and Variables
  //-------------------------------------------
  // Get Local Storage Notes Data
  const localStorageNotesData = JSON.parse(
    localStorage.getItem("WEB_DIARY_NOTES"),
  );

  // Get Local Storage Notes Location Data
  const localStorageNewNoteLocation = JSON.parse(
    localStorage.getItem("NEW_NOTES_LOCATION"),
  );

  // Check if there's local storage Data or not before appending to Default Notes
  let defaultNotes = localStorageNotesData
    ? localStorageNotesData
    : [
        {
          notesID: 0,
          notesMsg: "ABC",
          notesTimeStamp: Date.now(),
          left: 0,
          top: 0,
        },
        {
          notesID: 1,
          notesMsg: "yes",
          notesTimeStamp: Date.now(),

          left: 0,
          top: 0,
        },
        {
          notesID: 2,
          notesMsg: "Test 1234",
          notesTimeStamp: Date.now(),
          left: 0,
          top: 0,
        },
      ];

  let lastDeleteStack = [];
  // Get Main Board
  const mainBoard = document.getElementById("main-board");

  const newNoteDiv = defineInputNote();
  const newSearchInput = defineSearchInput();
  const link = defineDownloadData();
  const fileInput = defineUploadDataFile();
  const undoButton = defineUndoButton();

  // Filter Notes for Search Note Feature
  const filterNotes = defaultNotes.filter(
    (note) => note.notesMsg == newSearchInput.value,
  );

  // Check which notes data is used for source notes
  let sourcenotes = newSearchInput.value == "" ? defaultNotes : filterNotes;

  // Defining App Title to Change App Title Based on Notes Count
  const appTitle = document.getElementById("app-title");
  appTitle.innerText =
    defaultNotes.length > 0
      ? appTitle.innerText + " " + "with " + defaultNotes.length + " notes.."
      : appTitle.innerText;

  function defineUndoButton() {
    const undoButton = document.createElement("button");
    undoButton.style.display = !lastDeleteStack ? "flex" : "none";
    undoButton.textContent = "Undo";

    undoButton.addEventListener("click", () => {
      defaultNotes.push(lastDeleteStack.pop());

      localStorage.setItem("WEB_DIARY_NOTES", JSON.stringify(defaultNotes));
      checkIfNoteDeleted();
      cleanCurrentNotes();
      populateNotes();
    });

    return undoButton;
  }

  function checkIfNoteDeleted() {
    if (lastDeleteStack.length <= 0) {
      undoButton.style.display = "none";
    } else undoButton.style.display = "flex";
  }

  function defineDownloadData() {
    const link = document.createElement("a");

    link.download = "note-data.json";
    link.text = "Download JSON";

    link.addEventListener("click", () => {
      const blobData = new Blob([JSON.stringify(defaultNotes)], {
        type: "application/json",
      });
      link.href = URL.createObjectURL(blobData);

      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 200);
    });

    return link;
  }

  function defineUploadDataFile() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];

      if (!file) return;

      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        alert(e.target.result);

        defaultNotes = JSON.parse(e.target.result);
        localStorage.setItem("WEB_DIARY_NOTES", JSON.stringify(defaultNotes));
        sourcenotes = newSearchInput.value == "" ? defaultNotes : filterNotes;

        cleanCurrentNotes();
        populateNotes();
      };

      reader.onerror = (e) => {
        console.log("Error Reading File");
      };
    });

    return fileInput;
  }

  function defineInputNote() {
    // Created Input Note for Adding New Notes
    const newNoteDiv = document.createElement("div");
    newNoteDiv.className = "sticky-notes-add";
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

    // Add Input Note Button
    newNoteButton.addEventListener("click", (e) => {
      e.preventDefault();
      addNewStickyNote(e);
      newNoteForm.requestSubmit();
    });

    // Input Note from Enter
    newNoteTextArea.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        addNewStickyNote(e);
        newNoteForm.requestSubmit();
      }
    });

    newNoteInputContainer.appendChild(newNoteTextArea);
    newNoteForm.appendChild(newNoteInputContainer);
    newNoteForm.appendChild(newNoteButton);
    newNoteDiv.appendChild(newNoteForm);

    return newNoteDiv;
  }

  function defineSearchInput() {
    const newSearchInput = document.createElement("input");

    // Defining Search Input Element
    newSearchInput.style.className = "search-bar";
    newSearchInput.style.backgroundColor = "pink";
    newSearchInput.style.width = "100px";
    newSearchInput.style.height = "100px";

    // New Search Input Events
    newSearchInput.addEventListener("input", (e) => {
      e.preventDefault();

      // alert(newSearchInput.value);
      if (newSearchInput.value == "") {
        sourcenotes = defaultNotes;
      } else {
        const filterNotes = defaultNotes.filter((note) =>
          new RegExp(newSearchInput.value, "i").test(note.notesMsg),
        );
        sourcenotes = filterNotes;
      }

      console.log(sourcenotes);
      // alert(sourcenotes);
      cleanCurrentNotes();
      populateNotes();
    });

    return newSearchInput;
  }

  function getDuration(startDateTime) {
    const diffinMs = Math.abs(new Date(startDateTime) - new Date());

    const days = Math.floor(diffinMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diffinMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((diffinMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffinMs % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }

  function defineStarterElements(e) {
    // Starter Elements in a Sticky Notes

    const newText = document.createElement("text");
    const newTextArea = document.createElement("textarea");
    const newDateText = document.createElement("span");
    const deleteButton = document.createElement("button");

    newText.innerText = e.notesMsg;
    newText.className = "sticky-text";
    newText.style.maxWidth = "100%";
    newText.style.textAlign = "left";
    newText.style.display = "flex";

    newTextArea.defaultValue = e.notesMsg;
    newTextArea.className = "sticky-input";
    newTextArea.style.display = "none";
    newTextArea.style.height = "100px";

    deleteButton.textContent = "Delete";
    deleteButton.className = "deleteNote";
    deleteButton.style.display = "none";

    //Time Padding
    const pad = (n) => String(n).padStart(2, 0);

    const convertedTimeStamp = new Date(e.notesTimeStamp);
    const durationToNow = getDuration(e.notesTimeStamp);

    const fullDateConverted = `${convertedTimeStamp.getDate()}-${convertedTimeStamp.getMonth() + 1}-${convertedTimeStamp.getFullYear()} | ${pad(convertedTimeStamp.getHours())}:${pad(convertedTimeStamp.getMinutes())}:${pad(convertedTimeStamp.getSeconds())} | ${durationToNow.days} days ${durationToNow.hours} hours ${durationToNow.minutes} minutes ${durationToNow.seconds} seconds ago`;

    newDateText.innerText = fullDateConverted;
    newDateText.style.width = "100%";
    newDateText.style.position = "absolute";
    newDateText.style.top = "130px";

    //Events
    deleteButton.addEventListener("click", (e) => {
      const parentDiv = deleteButton.closest("div");
      const parentId = parentDiv.id;
      parentDiv.remove();

      const deletedData = defaultNotes.filter(
        (data) => data.notesID == parentId,
      );
      lastDeleteStack.push(deletedData[0]);
      checkIfNoteDeleted();
      alert(lastDeleteStack);

      const updatedData = defaultNotes.filter(
        (data) => data.notesID != parentId,
      );
      defaultNotes = updatedData;
      let tempText = "Sticky Dump";
      appTitle.innerText = null;
      appTitle.innerText =
        defaultNotes.length > 0
          ? tempText + " " + "with " + defaultNotes.length + " notes.."
          : tempText;
      localStorage.setItem("WEB_DIARY_NOTES", JSON.stringify(updatedData));
    });
    return { newText, newTextArea, deleteButton, newDateText };
  }

  function defineNewDiv(e, elements) {
    // a Div to Contain All Sticky Notes Element

    const newDiv = document.createElement("div");

    newDiv.appendChild(elements.newDateText);
    newDiv.appendChild(elements.newTextArea);
    newDiv.appendChild(elements.newText);
    newDiv.appendChild(elements.deleteButton);

    newDiv.className = "sticky-notes";
    newDiv.id = `${e.notesID}`;
    newDiv.style.left = `${e.left}px`;
    newDiv.style.top = `${e.top}px`;

    console.log(localStorageNewNoteLocation);

    //events
    newNoteDiv.style.left = localStorageNewNoteLocation
      ? `${localStorageNewNoteLocation.left}px`
      : 0;
    newNoteDiv.style.top = localStorageNewNoteLocation
      ? `${localStorageNewNoteLocation.top}px`
      : 0;

    newDiv.addEventListener("pointerdown", (e) => {
      if (
        e.target === elements.newTextArea ||
        e.target === elements.deleteButton
      )
        return;
      e.preventDefault();
      // Calculate cursor position relative to the element's position from top left
      const offsetX = e.clientX - newDiv.offsetLeft;
      const offsetY = e.clientY - newDiv.offsetTop;

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

          localStorage.setItem("WEB_DIARY_NOTES", JSON.stringify(defaultNotes));
        }
      }

      function pointerUp() {
        document.removeEventListener("pointermove", pointerMove);
        document.removeEventListener("pointerup", pointerUp);
      }
    });

    const delButtonInside = newDiv.querySelector(".deleteNote");

    newDiv.addEventListener("mouseenter", (e) => {
      elements.newTextArea.style.display = "flex";
      elements.newText.style.display = "none";

      if (delButtonInside) {
        delButtonInside.style.display = "flex";
      }
    });

    newDiv.addEventListener("mouseleave", (e) => {
      elements.newTextArea.style.display = "none";
      elements.newText.style.display = "flex";
      if (delButtonInside) {
        delButtonInside.style.display = "none";
      }
    });

    elements.newTextArea.addEventListener("input", (e) => {
      const changedNote = sourcenotes.find(
        (note) => note.notesID === Number(newDiv.id),
      );
      if (changedNote) {
        changedNote.notesMsg = elements.newTextArea.value;
        elements.newText.innerText = changedNote.notesMsg;
        localStorage.setItem("WEB_DIARY_NOTES", JSON.stringify(defaultNotes));
      }
    });

    return { newDiv };
  }

  function defineAddNoteDiv(e) {
    //Make Sticky Notes Draggable
    let offsetX = 0;
    let offsetY = 0;

    const postText = document.getElementById("post-text");

    postText.addEventListener("mouseenter", (e) => {
      //Focus on Text Area for Post on Mouse Hover
      postText.focus();
    });

    console.log(postText);

    //Event Listeners

    newNoteDiv.addEventListener("pointerdown", (e) => {
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
  }

  function updateDefaultNotes(e) {
    const elements = defineStarterElements(e);
    const { newDiv } = defineNewDiv(e, elements);
    mainBoard.insertBefore(newDiv, newNoteDiv);
  }

  function addNewStickyNote(e) {
    // e.preventDefault();
    const newNoteDiv = document.getElementById("new-note");
    const postText = document.getElementById("post-text");

    const newStickyNote = {
      notesID: Date.now(),
      notesMsg: postText.value,
      notesTimeStamp: Date.now(),
      left: newNoteDiv.style.left.split("px")[0],
      top: newNoteDiv.style.top.split("px")[0] - 100,
    };
    // alert(newStickyNote);
    // alert("masuk");
    defaultNotes.push(newStickyNote);
    updateDefaultNotes(newStickyNote);
    localStorage.setItem("WEB_DIARY_NOTES", JSON.stringify(defaultNotes));
    newNoteDiv.style.left = `${localStorageNewNoteLocation.left}px`;
    newNoteDiv.style.top = `${localStorageNewNoteLocation.top}px`;
  }

  function cleanCurrentNotes(e) {
    document.querySelectorAll(".sticky-notes").forEach((el) => el.remove());
  }

  function populateNotes() {
    sourcenotes.forEach((e) => {
      updateDefaultNotes(e);
    });
  }

  function startApp() {
    // Appending to the Main Board
    mainBoard.appendChild(newNoteDiv);
    mainBoard.appendChild(newSearchInput);
    mainBoard.appendChild(link);
    mainBoard.appendChild(fileInput);
    mainBoard.appendChild(undoButton);

    defineAddNoteDiv();
    populateNotes();
  }

  startApp();
}
