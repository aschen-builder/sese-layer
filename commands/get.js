var fs = require('fs');
var parser = require('xml-js');
const { markets } = require('../config.json');

const systems = [
    'sigma',
    'tau',
    'delta',
    'epsilon',
    'theta',
    'lambda',
    'gamma'
]

module.exports = {
    name: 'get',
    description: '**[DEPRECATED]** Retrieves store and item pricing from fetched data. (this command has been replaced with the newer `sese-store` and `sese-item`).',
    cooldown: 1,
    execute(message, args) {
        // sese-get <system [args[0]]> <store [guid - args[1]]> <item [opt - args[2]]>
        console.log('User ran \`get\` command, but the command is no longer enabled...');

        message.channel.send('This command has been deprecated and replaced with `sese-store` and `sese-item`. Please visit the git or use sese-help for more information.');
    },
};