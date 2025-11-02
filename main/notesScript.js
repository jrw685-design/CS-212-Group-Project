let notes = [
    { // start note
        title: "template title",
        desc: "note content here",
        date: getCurrentDate(),
        state: "regular",
        tags: ["tag1", "tag2"]
    } // end note
];

// returns the current date
function getCurrentDate()
{
    let currDate = new Date();
    return currDate;
    
}

// each note will have its own html id,
// allowing them to be referenced easily
// (e.g. notes[0].title would have an id of "note-0-title" and accessed with getNoteId(0, "title") )
// types: div (used for entire note div), title, desc, tags, date, edit
function getNoteId(index, type)
{
    return "note-" + index + "-" + type;
}