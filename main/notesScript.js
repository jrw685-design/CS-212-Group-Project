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
// types: div (used for entire note div), title, desc, tags, date, editb, body, edit-desc, edit-title, save-edit, tag, add-tag
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
    return "<" + element + " class=\"note-" + type + "\" id=\"" + getNoteId(index, type) + "\">" + content + "</" + element + ">";
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

document.getElementById("add-note").addEventListener("click", addNote);

function addNote()
{
    const thisIndex = newestIndex;
    notes[newestIndex] = {
        title: "New Note",
        desc: "Sample Description",
        date: getCurrentDate(),
        state: "regular",
        tags: ["cooltag", "sample"]
    };
    let allTags = getTags(notes[newestIndex].tags);
    
    // add note to html document with a single string
    let newNote = "<div id=\"" + getNoteId(newestIndex, "div") + "\">" 
        + getNoteHtml("h2", newestIndex, "title", notes[newestIndex].title) 
        + "<div id=\"" + getNoteId(newestIndex, "body") + "\">"
        + getNoteHtml("p", newestIndex, "desc", notes[newestIndex].desc)
        + getNoteHtml("p", newestIndex, "tags", allTags) + "</div>"
        + getNoteHtml("p", newestIndex, "date", notes[newestIndex].date)
        + getNoteHtml("button", newestIndex, "editb", "Edit")
        + getNoteHtml("button", newestIndex, "delb", "Delete")
        + "</div>";
    $("div.all-notes").append(newNote);
    
    let editbid = getNoteId(thisIndex, "editb");
    console.log(editbid)
    $("button#" + editbid).on("click", function()
    {
        editNote(thisIndex);
    });
    

    newestIndex++;
}

function editNote(id)
{
    console.log(id);
    
    let tags = notes[id].tags;
    let oldDesc = document.getElementById(getNoteId(id, "desc")).innerHTML;
    let oldTitle = document.getElementById(getNoteId(id, "title")).innerHTML;
    $("#" + getNoteId(id, "title")).remove();
    $("#" + getNoteId(id, "desc")).remove();
    $("#" + getNoteId(id, "tags")).remove();

    $("#" + getNoteId(id, "editb")).remove();
    $("#" + getNoteId(id, "delb")).remove();

    let titleTextbox = "<textarea type=\"text\" class=\"edit-note-title\" id=\"" + getNoteId(id, "edit-title") + "\">";
    let descTextbox = "<textarea type=\"text\" class=\"edit-note-desc\" id=\"" + getNoteId(id, "edit-desc") + "\">";
    $("#" + getNoteId(id, "div")).prepend(titleTextbox);
    document.getElementById(getNoteId(id, "body")).innerHTML = descTextbox;
    document.getElementById(getNoteId(id, "edit-title")).value = oldTitle;
    document.getElementById(getNoteId(id, "edit-desc")).value = oldDesc;
    

    // TODO: fix this becuase it doesnt work for whatever reason
    for (var i = 0; i < notes[id].tags.length; i++)
    {
        // small edit to this line by adding a ">" after the class attribute and a closing </p> in the quotations
        let tagHTML = " <p id=\"note-tag-" + i + "\" class=\"tag-list-" + id + "\">" + notes[id].tags[i] + "</p>";
        
        $("#" + getNoteId(id, "body")).append(tagHTML + ", ");
    }

    //TODO: make tags editable

    let saveb = getNoteHtml("button", id, "save-edit", "Save");
    $("#" + getNoteId(id, "div")).append(saveb);
    $("button#" + getNoteId(id, "save-edit")).on("click", function()
    {
        console.log(this);
        saveNote(id);
        
    });

}
// TODO: addTag function (and probably delTag eventually)
function addTag(id, tagIndex)
{

}


function saveNote(id)
{
    notes[id].date = new Date();
    notes[id].title = document.getElementById(getNoteId(id, "edit-title")).value;
    notes[id].desc = document.getElementById(getNoteId(id, "edit-desc")).value;
    
    $("#" + getNoteId(id, "date")).remove();
    let newTags = getTags(notes[id].tags);
    
    let newBody = getNoteHtml("h2", id, "title", notes[id].title)
        + "<div id=\"" + getNoteId(id, "body") + "\">"
        + getNoteHtml("p", id, "desc", notes[id].desc)
        + getNoteHtml("p", id, "tags", newTags) + "</div>"
        + getNoteHtml("p", id, "date", notes[id].date)
        + getNoteHtml("button", id, "editb", "Edit")
        + getNoteHtml("button", id, "delb", "Delete");

    $("#" + getNoteId(id, "div")).append(newBody);

    $("button#" + getNoteId(id, "save-edit")).remove();
    $("#" + getNoteId(id, "edit-desc")).remove();
    $("#" + getNoteId(id, "edit-title")).remove();
    
    const thisIndex = id;
    let editbid = getNoteId(thisIndex, "editb");
    console.log(editbid)
    $("button#" + editbid).on("click", function()
    {
        editNote(thisIndex);
    });

}
