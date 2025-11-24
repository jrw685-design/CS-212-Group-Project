let notes = [
    /* example note for reference
    { // start note
        title: "template title",
        desc: "note content here",
        date: getCurrentDate(),
        state: "regular",
        tags: ["tag1", "tag2"]
    } // end note
     */
];

// used to add to the array
let newestIndex = 0;

// returns the current date
function getCurrentDate()
{
    let currDate = new Date();
    //return "Last updated: " + currDate.getDate() + "-" + currDate.getMonth() + "-" + currDate.getFullYear() + " at " + currDate.getHours() + ":" + currDate.getSeconds();
    return "Last updated: " + currDate.toDateString() + " at " + currDate.toTimeString().split(" ")[0];
    
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
    // get last index
    const thisIndex = notes.length;
    notes[thisIndex] = {
        title: "New Note",
        desc: "Sample Description",
        date: getCurrentDate(),
        state: "regular",
        tags: []
    };
    let allTags = "tags: " + getTags(notes[thisIndex].tags);

    // update all notes
    updateNotes();
    
}

function editNote(id)
{
    
    // store current title, tags, and description
    let tags = notes[id].tags;
    let oldDesc = document.getElementById(getNoteId(id, "desc")).innerHTML;
    let oldTitle = document.getElementById(getNoteId(id, "title")).innerHTML;

    // remove all existing elements from note
    $("#" + getNoteId(id, "title")).remove();
    $("#" + getNoteId(id, "desc")).remove();
    $("#" + getNoteId(id, "tags")).remove();

    $("#" + getNoteId(id, "editb")).remove();
    $("#" + getNoteId(id, "delb")).remove();
    $("#" + getNoteId(id, "pinb")).remove();
    $("#" + getNoteId(id, "archb")).remove();


    // create html textbox strings
    let titleTextbox = "<textarea type=\"text\" class=\"edit-note-title\" id=\"" + getNoteId(id, "edit-title") + "\">";
    let descTextbox = "<textarea type=\"text\" class=\"edit-note-desc\" id=\"" + getNoteId(id, "edit-desc") + "\">";

    // insert textboxes
    $("#" + getNoteId(id, "div")).prepend(titleTextbox);
    document.getElementById(getNoteId(id, "body")).innerHTML = descTextbox;

    // place existing content in textboxes
    document.getElementById(getNoteId(id, "edit-title")).value = oldTitle;
    document.getElementById(getNoteId(id, "edit-desc")).value = oldDesc;
    
    // create input box and button to add a tag
    let addTagHTML = "<input type=\"input\" id=\"" + getNoteId(id, "add-tag-in") + "\"></input>" + "<button id=\"" + getNoteId(id, "add-tag-b") + "\">Add Tag</button>";
    $("#" + getNoteId(id, "body")).append(addTagHTML);
    $("button#" + getNoteId(id, "add-tag-b")).on("click", function()
    {
        
        addTag(id);
        
    });

    // add button to save changes
    let saveb = getNoteHtml("button", id, "save-edit", "Save");
    $("#" + getNoteId(id, "div")).append(saveb);
    $("button#" + getNoteId(id, "save-edit")).on("click", function()
    {
        
        saveNote(id);
        
    });
    updateEditTags(id);

}



function addTag(id)
{
    
    let newTag = document.getElementById(getNoteId(id, "add-tag-in")).value;
    let newIndex = findValue(notes[id].tags, " ");
    if(findValue(notes[id].tags, newTag) == notes[id].tags.length && newTag != "")
    {
        notes[id].tags[newIndex] = newTag;
    }
    updateEditTags(id);
    


}


function updateEditTags(id)
{

    $(".tag-list-" + id).remove();
    
    for (var i = 0; i < notes[id].tags.length; i++)
    {
        if(notes[id].tags[i] != undefined)
        {
            // small edit to this line by adding a ">" after the class attribute and a closing </p> in the quotations
            let tagHTML = " <p id=\"note-tag-" + i + "\" class=\"tag-list-" + id + "\">" + notes[id].tags[i] + "</p>";
            const thisIndex = i;
            $("#" + getNoteId(id, "body")).append(tagHTML);
            $("#note-tag-" + thisIndex + ".tag-list-" + id).on("click", function()
            {
                
                delTag(thisIndex, id);
            
            });
        }
    }
}
function delTag(index, id)
{
    notes[id].tags[index] = " ";
    moveIndexes(notes[id].tags);
    updateEditTags(id);
}
function moveIndexes(list)
{
    if(list.length > 1)
    {
        for(var i = 0; i < list.length; i++)
            {
                if(i < list.length - 1)
                {
                    if(list[i] == " " || list[i] == undefined)
                    {
                        list[i] = list[i + 1];
                        list[i + 1] = undefined;
                    }
                }

            }
    }
    list.length--;
    
}

function findValue(list, value)
{
    for (var i = 0; i < list; i++)
    {
        if (list[i] == value)
        {
            return i;
        }
    }
    return list.length;
}


function saveNote(id)
{
    notes[id].date = getCurrentDate();
    notes[id].title = document.getElementById(getNoteId(id, "edit-title")).value;
    notes[id].desc = document.getElementById(getNoteId(id, "edit-desc")).value;
    
    
    if(showArchived == false)
    {
        updateNotes();
    }
    else
    {
        displayArchived();
    }
}

function delNote(id)
{
    for(var i = id; i < notes.length - 1; i++)
    {
        notes[i] = notes[i + 1];
    }
    notes.length--;

    if(showArchived == false)
    {
        updateNotes();
    }
    else
    {
        displayArchived();
    }
}


function updateNotes()
{
    showArchived = false;
    document.getElementsByClassName("all-notes")[0].innerHTML = "";
    for(var i = 0; i < notes.length; i++)
    {
        let allTags = "";
        if(notes[i].tags.length > 0)
        {
            allTags = "tags: " + getTags(notes[i].tags);
        }
        
        const thisIndex = i;
        

        if(notes[i].state == "pinned")
        {
            setNote(i);
        
        }

        
    }

    for(var i = 0; i < notes.length; i++)
    {
        
        

        if(notes[i].state == "regular")
        {
            setNote(i);
        }

        
    }

    
}
let showArchived = false;

function findWord(note, word)
{
    for(var i = 0; i < note.title.length; i++)
    {
        let title = note.title;
        
        if(word[0].toLowerCase() == title[i].toLowerCase())
        {
            
            let lowWord = word.toLowerCase();
            
            let listStr = title.substring(i-1, word.length + i).toLowerCase();
            
            if(listStr == word.toLowerCase() || title[i].toLowerCase() == word.toLowerCase())
            {
                
                return true;
            }
        }
    }
    for(var i = 0; i < note.desc.length; i++)
    {
        let desc = note.desc;
        
        if(word[0].toLowerCase() == desc[i].toLowerCase())
        {
            
            let lowWord = word.toLowerCase();
            
            let listStr = desc.substring(i-1, word.length + i).toLowerCase();
            if(listStr == word.toLowerCase() || desc[i].toLowerCase() == word.toLowerCase())
            {
                console.log(listStr);
                return true;
            }
        }
    }
    return false;
}
function getIndexes(state)
{
    let indexList = [];
    for(var i = 0; i < notes.length; i++)
    {
        if(notes[i].state == state)
        {
            indexList[indexList.length] = i;
        }
    }
    return indexList;
}
function showSearch()
{
    
    let searchVal = document.getElementById("search-input").value;
    if(showArchived == true)
    {
        
        searchArchive(searchVal);
        return false;
    }
    if(searchVal == "")
    {
        updateNotes();
        return false;
    }
    
    document.getElementsByClassName("all-notes")[0].innerHTML = "";
    let pinnedIndexes = getIndexes("pinned");
    let regularIndexes = getIndexes("regular");
    for(var i = 0; i < pinnedIndexes.length; i++)
    {
        if(findValue(notes[pinnedIndexes[i]].tags, searchVal) || findWord(notes[pinnedIndexes[i]], searchVal))
        {
            
            setNote(pinnedIndexes[i]);
            
            
        }
    }
    for(var i = 0; i < regularIndexes.length; i++)
    {
        if(findValue(notes[regularIndexes[i]].tags, searchVal) || findWord(notes[regularIndexes[i]], searchVal))
        {
            
            
            setNote(regularIndexes[i]);
            
        }
    }
    return true;
}



function displayArchived()
{
    document.getElementsByClassName("all-notes")[0].innerHTML = "";
    let archivedNotes = getIndexes("archived");

    for(var i = 0; i < archivedNotes.length; i++)
    {
        setNote(archivedNotes[i]);
    }
}
function togglePin(index)
{
    if(notes[index].state == "pinned")
    {
        notes[index].state = "regular";
    }
    else
    {
        notes[index].state = "pinned";
    }
    updateNotes();
}

function toggleArchive()
{
    if(showArchived == false)
    {
        displayArchived();
        showArchived = true;
    }
    else
    {
        updateNotes();
        showArchived = false;
    }
}

function setNote(index)
{
    
    const thisIndex = index;
    let allTags = "";
    if(notes[thisIndex].tags.length > 0)
    {
        allTags = "tags: " + getTags(notes[thisIndex].tags);
    }
    let stateText;
    let archived = getNoteHtml("button", thisIndex, "archb", "Archive");
    if(notes[index].state == "pinned")
    {
        stateText = getNoteHtml("button", thisIndex, "pinb", "Unpin");
    }
    else if(notes[index].state == "regular")
    {
        stateText = getNoteHtml("button", thisIndex, "pinb", "Pin");
    }
    else
    {
        stateText = "";
        archived = getNoteHtml("button", thisIndex, "archb", "Unarchive");
    }

    // add note to html document with a single string
    let newNote = "<div class =\"single-note\" id=\"" + getNoteId(thisIndex, "div") + "\">" 
        + getNoteHtml("h2", thisIndex, "title", notes[thisIndex].title) 
        + "<div class = \"note-body\"id=\"" + getNoteId(thisIndex, "body") + "\">"
        + getNoteHtml("p", thisIndex, "desc", notes[thisIndex].desc)
        + getNoteHtml("p", thisIndex, "tags", allTags) + "</div>"
        + getNoteHtml("p", thisIndex, "date", notes[thisIndex].date)
        + "<div class=\"note-buttons\">"
        + getNoteHtml("button", thisIndex, "editb", "Edit")
        + getNoteHtml("button", thisIndex, "delb", "Delete")
        + stateText
        + archived
        + "</div>" + "</div>";
    $("div.all-notes").append(newNote);
    if(notes[index].state == "pinned")
    {
        $("#" + getNoteId(thisIndex, "div")).css("background", "rgba(255, 244, 142, 1)");
    }
    // add event listeners to buttons
    let editbid = getNoteId(thisIndex, "editb");
    $("button#" + editbid).on("click", function()
    {
        editNote(thisIndex);
    });

    $("button#" + getNoteId(thisIndex, "delb")).on("click", function()
    {
        delNote(thisIndex);
    });

    $("button#" + getNoteId(thisIndex, "pinb")).on("click", function()
    {
        togglePin(thisIndex);
    });

    $("button#" + getNoteId(thisIndex, "archb")).on("click", function()
    {
        setArchived(thisIndex);
    });
    
}

document.getElementById("archive-toggle").addEventListener("click", toggleArchive);


document.getElementById("search-button").addEventListener("click", showSearch);

function setArchived(index)
{
    if(notes[index].state == "archived")
    {
        notes[index].state = "regular";
        displayArchived();
    }
    else
    {
        notes[index].state = "archived";
        updateNotes();
    }
    
}

function searchArchive(search)
{
    document.getElementsByClassName("all-notes")[0].innerHTML = "";
    let archIndexes = getIndexes("archived");
    for(var i = 0; i < archIndexes.length; i++)
    {
        if(findValue(notes[archIndexes[i]].tags, search) || findWord(notes[archIndexes[i]], search))
        {
            
            setNote(archIndexes[i]);
            
            
        }
    }
}
