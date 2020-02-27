//const validator = require('validator')
const yargs = require('yargs')
//const utils = require('./utils.js')
const notes = require('./notes.js')

// add notes
yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title: { 
            describe: 'Note Title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: "The note to save",
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => notes.addNote(argv.title, argv.body)
})

// remove notes
yargs.command({
    command: 'remove',
    describe: 'Remove a note',
    builder: {
        title: {
            describe: "Note title to remove",
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => notes.removeNote(argv.title)
})

// read notes
yargs.command({
    command: 'read',
    describe: 'Read a note',
    builder: {
        title: {
            describe: "Note to read",
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => notes.readNote(argv.title)
})

// list notes
yargs.command({
    command: 'list',
    describe: 'List all notes',
    handler: () => notes.listNotes()
})

yargs.parse();
