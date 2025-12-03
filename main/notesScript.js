// Grab the main elements we interact with
const notesContainer = document.querySelector(".all-notes");
const addBtn = document.getElementById("add-note");
const archiveToggleBtn = document.getElementById("archive-toggle");
const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");

// Simple state for notes and archive view
let notes = [];
let showArchived = false;
let draggingId = null;

// Allowed sticky colors with friendly labels
const NOTE_COLORS = [
    { name: "Light Pink", value: "#ff7eb9" },
    { name: "Dark Pink", value: "#ff65a3" },
    { name: "Cyan", value: "#7afcff" },
    { name: "Light Yellow", value: "#feff9c" },
    { name: "Standard Yellow", value: "#fff740" }
];

// Small helpers
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
const nowStamp = () => {
    const d = new Date();
    return `Last updated: ${d.toDateString()} at ${d.toTimeString().split(" ")[0]}`;
};
const randomColor = () => NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)].value;
const randomAngle = () => (Math.random() * 4) - 2;
const refreshArchiveLabel = () => {
    archiveToggleBtn.textContent = showArchived ? "Hide Archive" : "Show Archive";
};

addBtn.onclick = () => {
    // New note with defaults
    notes.push({
        id: uid(),
        title: "New Note",
        desc: "Sample Description",
        date: nowStamp(),
        state: "regular",
        color: randomColor(),
        angle: randomAngle(),
        font: "Patrick Hand"
    });
    persistAndRender();
};

archiveToggleBtn.onclick = () => {
    // Flip between archive view and active notes
    showArchived = !showArchived;
    refreshArchiveLabel();
    render();
};

searchBtn.onclick = () => render(searchInput.value.trim().toLowerCase());

function persistAndRender() {
    // Save changes and repaint the board
    localStorage.setItem("notes", JSON.stringify(notes));
    render();
}

function render(searchTerm = "") {
    notesContainer.innerHTML = "";

    const visible = notes
        .filter((n) => (showArchived ? n.state === "archived" : n.state !== "archived"))
        .filter((n) => !searchTerm ||
            n.title.toLowerCase().includes(searchTerm) ||
            n.desc.toLowerCase().includes(searchTerm));

    const ordered = showArchived
        ? visible
        : [
            ...visible.filter((n) => n.state === "pinned"),
            ...visible.filter((n) => n.state === "regular")
        ];

    ordered.forEach((note) => notesContainer.appendChild(buildNoteCard(note)));
}

function buildNoteCard(note) {
    // Build one sticky note element
    const card = document.createElement("div");
    card.className = "single-note";
    card.id = `note-${note.id}`;
    card.style.background = note.color;
    card.style.setProperty("--angle", `${note.angle}deg`);
    card.style.fontFamily = note.font || "Patrick Hand";

    card.draggable = true;
    card.addEventListener("dragstart", (e) => {
        draggingId = note.id;
        card.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
    });
    card.addEventListener("dragend", () => {
        draggingId = null;
        card.classList.remove("dragging");
    });
    card.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    });
    card.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggingId && draggingId !== note.id) {
            moveNote(draggingId, note.id);
        }
    });

    const title = document.createElement("h2");
    title.textContent = note.title;
    title.className = "note-title";

    const desc = document.createElement("p");
    desc.textContent = note.desc;
    desc.className = "note-desc";

    const date = document.createElement("p");
    date.textContent = note.date;
    date.className = "note-date";

    const buttons = document.createElement("div");
    buttons.className = "note-buttons";

    const viewBtn = button("View", () => viewNote(note.id));
    viewBtn.classList.add("note-view-btn");

    buttons.append(
        button("Edit", () => openEditor(note.id)),
        button("Delete", () => removeNote(note.id)),
        button(note.state === "pinned" ? "Unpin" : "Pin", () => togglePin(note.id)),
        button(note.state === "archived" ? "Unarchive" : "Archive", () => toggleArchive(note.id))
    );

    card.append(viewBtn, title, desc, date, buttons);
    requestAnimationFrame(() => card.classList.add("note-loaded"));
    return card;
}

function button(label, onClick) {
    // Small helper to make buttons
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.onclick = onClick;
    return btn;
}

function openEditor(id) {
    // Edit modal for a single note
    document.body.classList.add("modal-open");
    const overlay = document.createElement("div");
    overlay.className = "edit-overlay";

    const win = document.createElement("div");
    win.className = "edit-window";

    const titleBox = document.createElement("textarea");
    const descBox = document.createElement("textarea");

    const note = notes.find((n) => n.id === id);
    titleBox.value = note.title;
    descBox.value = note.desc;

    const fontLabel = document.createElement("label");
    fontLabel.textContent = "Font";
    const fontSelect = document.createElement("select");
    fontSelect.className = "edit-input";
    ["Patrick Hand", "Georgia", "Arial", "Courier New"].forEach((f) => {
        const opt = document.createElement("option");
        opt.value = f;
        opt.textContent = f;
        if (note.font === f) opt.selected = true;
        fontSelect.append(opt);
    });

    const colorLabel = document.createElement("label");
    colorLabel.textContent = "Note Color";
    const colorSelect = document.createElement("select");
    colorSelect.className = "edit-input";
    NOTE_COLORS.forEach(({ name, value }) => {
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = name;
        if (note.color === value) opt.selected = true;
        colorSelect.append(opt);
    });

    const btns = document.createElement("div");
    btns.className = "buttons";

    const save = button("Save", () => {
        note.title = titleBox.value;
        note.desc = descBox.value;
        note.date = nowStamp();
        note.font = fontSelect.value;
        note.color = colorSelect.value || note.color;
        closeModal(overlay);
        persistAndRender();
    });
    save.style.background = "#7afcff";

    const cancel = button("Cancel", () => closeModal(overlay));
    cancel.style.background = "#ff7eb9";

    btns.append(save, cancel);
    win.append(titleBox, descBox, fontLabel, fontSelect, colorLabel, colorSelect, btns);
    overlay.append(win);
    document.body.append(overlay);
}

function viewNote(id) {
    // Read-only view modal
    document.body.classList.add("modal-open");
    const overlay = document.createElement("div");
    overlay.className = "edit-overlay";

    const win = document.createElement("div");
    win.className = "edit-window view-window";
    win.style.maxHeight = "80vh";
    win.style.overflowY = "auto";

    const note = notes.find((n) => n.id === id);
    const title = document.createElement("h2");
    title.textContent = note.title;
    title.style.marginTop = "0";

    const desc = document.createElement("p");
    desc.textContent = note.desc;
    desc.style.whiteSpace = "pre-wrap";

    const date = document.createElement("p");
    date.textContent = note.date;

    const btns = document.createElement("div");
    btns.className = "buttons";

    const close = button("Close", () => closeModal(overlay));
    close.style.background = "#ff7eb9";

    btns.append(close);
    win.append(title, desc, date, btns);
    overlay.append(win);
    document.body.append(overlay);
}

function closeModal(overlay) {
    document.body.classList.remove("modal-open");
    overlay.remove();
}

function removeNote(id) {
    // Delete a note by id
    notes = notes.filter((n) => n.id !== id);
    persistAndRender();
}

function togglePin(id) {
    const note = notes.find((n) => n.id === id);
    note.state = (note.state === "pinned") ? "regular" : "pinned";
    persistAndRender();
}

function toggleArchive(id) {
    const note = notes.find((n) => n.id === id);
    note.state = (note.state === "archived") ? "regular" : "archived";
    persistAndRender();
}

function moveNote(fromId, toId) {
    const fromIndex = notes.findIndex((n) => n.id === fromId);
    const toIndex = notes.findIndex((n) => n.id === toId);
    if (fromIndex < 0 || toIndex < 0) return;
    const [item] = notes.splice(fromIndex, 1);
    notes.splice(toIndex, 0, item);
    persistAndRender();
}

function loadNotes() {
    // Pull notes from storage and normalize data
    try {
        const saved = JSON.parse(localStorage.getItem("notes") || "[]");
        const normalizeColor = (c) => NOTE_COLORS.some((n) => n.value === c) ? c : NOTE_COLORS[0].value;
        notes = Array.isArray(saved) ? saved.map((n) => ({
            ...n,
            color: normalizeColor(n.color || randomColor()),
            angle: typeof n.angle === "number" ? n.angle : randomAngle(),
            font: n.font || "Patrick Hand"
        })) : [];
    } catch {
        notes = [];
    }
    refreshArchiveLabel();
    render();
}

loadNotes();
