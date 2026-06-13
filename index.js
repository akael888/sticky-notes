const defaultNotes = [
  { notesID: 0, notesMsg: "ABC", notesTimeStamp: 1776085680 },
  { notesID: 1, notesMsg: "yes", notesTimeStamp: 1776085680 },
  { notesID: 2, noteMsg: "Test 1234", notesTimeStamp: 1776085680 },
];

const mainBoard = document.getElementById("main-board");

defaultNotes.map((e) => {
  const newDiv = document.createElement("div");
  newDiv.className = "sticky-notes";
  newDiv.textContent = e.notesMsg;
  mainBoard.append(newDiv);
});

const newDiv = document.createElement("div");

defaultElement.textContent = defaultNotes[0].notesMsg;
