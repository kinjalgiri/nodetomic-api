const Redis = require('socket.io-redis');
const chalk = require('chalk');
const fs = require("fs");
const config = require('../../config');

const io = require('socket.io')(config['socket.io'].port);
io.adapter(Redis(config['socket.io'].redis));

// Scan events
const pathSocket = `${config.base}/api/sockets`;
let events = [];
fs.readdirSync(pathSocket).forEach(path => {
    events.push(`${pathSocket}/${path}`);
});

// Total socket clients
function total() {
    io.of('/').adapter.clients((err, clients) => {
        console.log(chalk.blueBright(`Socket-> total clients [${clients.length}]`));
    });
}

// Connect
export async function connect() {

    return await io.on('connection', socket => {

        if (config.log) {
            console.log(chalk.blueBright(`Socket-> connected`));
            total();
        }

        // inject events to new socket...
        events.forEach(path => require(path).default(socket, io));

        socket.on('disconnect', () => {
            if (config.log) {
                console.log(chalk.blueBright(`Socket-> disconnect`));
                total();
            }
        });

    });
}