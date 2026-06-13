const defaultNotes = [
  { notesID: 0, notesMsg: "ABC", notesTimeStamp: 1776085680 },
];

const defaultElement = document.getElementById(
  `note-${defaultNotes[0].notesID}`,
);

defaultElement.textContent = defaultNotes[0].notesMsg;
