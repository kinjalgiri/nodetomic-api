const mongoose = require('mongoose');
const chalk = require('chalk');
const fs = require('fs');
const config = require('../../config');

const uri = config.mongoose.uri;
const opts = config.mongoose.options;

mongoose.Promise = global.Promise;

export async function connect() {

    try {
        const conn = await mongoose.connect(uri, opts);
        const db = mongoose.connection;

        // Events
        db.on('disconnected', (err) => {
            console.log(chalk.redBright(`MongoDB-> disconnected: ${uri}`));
            connect();
        });

        db.on('reconnected', (err) => {
            console.log(chalk.greenBright(`MongoDB-> reconnected: ${uri}`));
        });

        // Success
        console.log(chalk.greenBright(`-------\nMongoDB-> connected on ${uri}\n-------`));

        // get Models
        let models = fs.readdirSync(`${config.base}/api/models`);

        for (let i in models) {
            if (models[i].indexOf('.js') > -1) {
                require(`${config.base}/api/models/${models[i]}`)
            }
        }
        // Plant seed
        await require('./seed').default(db, config);

    } catch (err) {
        console.log(chalk.redBright(`MongoDB-> connection error: ${uri} details->${err}`));
        process.exit(-1);
    }

}