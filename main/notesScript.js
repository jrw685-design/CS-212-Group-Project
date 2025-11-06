let notes = [
    { // start note
        title: "template title",
        desc: "note content here",
        date: getCurrentDate(),
        state: "regular",
        tags: ["tag1", "tag2"]
    } // end note
];

// used to add to the array
let newestIndex = 0;

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

// generates a custom html element
// just so you dont have to keep typing the really complicated string for it
// e.g. assuming the note has an index of 0 and has a description of "take out trash at 6:00",

//         getNoteHtml(p, 0, desc, notes[0].desc)

// would return the following:

//         <p class="note-desc" id="note-0-desc">take out trash at 6:00</p>

// IMPORTANT NOTE (pun intended) does not work for div element
function getNoteHtml(element, index, type, content)
{
    return "<" + element + "class=\"note-" + type + "\" id=\"" + getNoteId(index, type) + "\">" + content + "</" + element + ">";
}

function getTags(tags)
{
    let tagsStr = ""
    for (var i = 0; i < tags.length; i++)
    {
        tagsStr += tags[i];
        if (i != tags.length - 1)
        {
            tagsStr += ", ";
        }
    }
    return tagsStr;

}

document.querySelector("#add-note").addEventListener("click", addNote);

function addNote()
{
    notes[newestIndex].title = "New Note";
    notes[newestIndex].desc = "";
    notes[newestIndex].date = getCurrentDate();
    notes[newestIndex].state = "regular";
    notes[newestIndex].tags = [];

    // add note to html document with a single string
    let newNote = "div id=\"" + getNoteId(newestIndex, "div") + "\">" 
        + getNoteHtml("h2", newestIndex, "title", notes[newestIndex].title) 
        + getNoteHtml("p", newestIndex, "desc", notes[newestIndex].desc) 
        + getNoteHtml(getNoteHtml("p", newestIndex, "tags", getTags(notes[newestIndex].tags))) 
        + getNoteHtml(getNoteHtml("p", newestIndex, "date", notes[newestIndex].date)) 
        + getNoteHtml(getNoteHtml("button", newestIndex, "editb", "Edit"))
        + getNoteHtml(getNoteHtml("button", newestIndex, "delb", "Delete"))
        + "</div>";
    $("div.all-notes").append(newNote);

    //TODO: add event listeners to edit/delete buttons

    newestIndex++;
}

