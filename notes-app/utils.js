const chalk = require('chalk')

module.exports = new class {
    constructor()
    {
        this.name = "Michael Masterson"
    }

    add(a, b, c) {
        return a + b + c;
    }

    printStringGreenWithChalk(s) {
        console.log(chalk.blue.bold(s))
    }
}