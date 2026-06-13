const localStorageNotesData = JSON.parse(
  localStorage.getItem("WEB_DIARY_NOTES"),
);

const defaultNotes = localStorageNotesData
  ? localStorageNotesData
  : [
      { notesID: 0, notesMsg: "ABC", notesTimeStamp: 1776085680 },
      { notesID: 1, notesMsg: "yes", notesTimeStamp: 1776085680 },
      { notesID: 2, notesMsg: "Test 1234", notesTimeStamp: 1776085680 },
    ];

const mainBoard = document.getElementById("main-board");

function updateDefaultNotes(e) {
  const newDiv = document.createElement("div");
  newDiv.className = "sticky-notes";
  newDiv.textContent = e.notesMsg;
  localStorage.setItem("WEB_DIARY_NOTES", JSON.stringify(defaultNotes));
  mainBoard.append(newDiv);
}

defaultNotes.map((e) => {
  const newDiv = document.createElement("div");
  newDiv.className = "sticky-notes";
  newDiv.textContent = e.notesMsg;
  mainBoard.append(newDiv);
});

const newDiv = document.createElement("div");

// defaultElement.textContent = defaultNotes[0].notesMsg;

const postButton = document.getElementById("post-button");
const postText = document.getElementById("post-text");

postButton.addEventListener("click", () => {
  // alert(postText.value);
  if (postText.value) {
    const newStickyNote = {
      notesID: defaultNotes.length,
      notesMsg: postText.value,
      notesTimeStamp: 1776085680,
    };
    defaultNotes.push(newStickyNote);
    updateDefaultNotes(newStickyNote);
    // alert("clicked dalam");
  }
  // alert("clicked");
});
