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
    console.log('Title: ' + note.title + '\nBody: ' + note.body + '\n')

// add note
const addNote = (title, body) => {
    const notes = loadNotes();
    const dupes = notes.filter((note) => note.title === title)
    if (dupes.length === 0) {
        notes.push({ title: title, body: body});
        saveNotes(notes);
        console.log(chalk.bgGreen("New node added!"))
    } else {
        console.log(chalk.bgRed("Note title in use!"))
    }
}

const removeNote = (title) => {
    const notes = loadNotes();
    var filtered = notes.filter((note) => note.title !== title)
    if(filtered.length < notes.length) {
        saveNotes(filtered);
        console.log(chalk.bgGreen('Note ' + title + ' removed'))
    } else {
        console.log(chalk.bgRed('No note found with title ' + title))
    }
} 

const readNote = (title) => {
    var filtered = loadNotes().filter((value, index, arr) => value.title === title)
    if (filtered.length > 0) {
        filtered.forEach((note) => {
            if (note.title === title) {
                logNote(note)
            }
        })
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