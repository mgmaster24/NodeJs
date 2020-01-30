const yargs = require('yargs')
const weatherApi = require('./weatherApi')

// get weather for location
yargs.command({
    command: 'get',
    describe: 'Get the weather at the specified location',
    builder: {
        location: { 
            describe: 'Location to get weather forecast',
            demandOption: true,
            type: 'string'
        }
    },
    handler: (argv) => weatherApi.getWeather(argv.location)
})

yargs.parse();