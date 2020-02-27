const fs = require('fs')
const chalk = require('chalk')

const loadNotes = () => {
    try {
        return JSON.parse(fs.readFileSync('notes.json').toString())
    } catch (e) {
        return []
    }
}

const saveNotes = (notes) => {
    try {
        fs.writeFileSync('notes.json', JSON.stringify(notes));
    } catch (e) {
        console.log('saveNotes failed');
    }
}

const logNote = (note) => 
    console.log(chalk.blue('Title: ' + note.title) + '\nBody: ' + note.body + '\n')

// add note
const addNote = (title, body) => {
    const notes = loadNotes();
    const match = notes.find((note) => note.title === title);
    if (!match) {
        notes.push({ title: title, body: body});
        saveNotes(notes);
        console.log(chalk.bgGreen("New node added!"))
    } else {
        console.log(chalk.bgRed("Note title in use!"))
    }
}

const removeNote = (title) => {
    const notes = loadNotes();
    const filtered = notes.filter((note) => note.title !== title)
    if(filtered.length < notes.length) {
        saveNotes(filtered);
        console.log(chalk.bgGreen('Note ' + title + ' removed'))
    } else {
        console.log(chalk.bgRed('No note found with title ' + title))
    }
} 

const readNote = (title) => {
    const note = loadNotes().find((value) => value.title === title)
    if (note) {
        logNote(note);
    } else {
        console.log(chalk.bgRed("No note found for title: " + title))
    }
}

const listNotes = () => {
    console.log(chalk.blueBright.underline("Printing All Notes"))
    loadNotes().forEach(note => logNote(note));
}

module.exports = { 
    listNotes,
    addNote,
    removeNote,
    readNote
};