var fs = require('fs');
var parser = require('xml-js');
const { systems, markets } = require('../config.json');

module.exports = {
    name: 'store',
    description: 'Retrieves listing information of supplied store guid. A single item subtypeID can be specified to filter listings.',
    usage: '[storeGUID [, itemSubtypeID]]',
    cooldown: 1,
    execute(message, args) {
        console.log('User ran \`store\` command...');

        if(!systems.includes(args[0])) {
            console.log('User either did not specify a system name or gave some bullshit argument.');
            message.channel.send('Unfortunately I can only retrieve data for systems within the Draconis Cluster, please include a system in your request.');
            return;
        }

        try {
            console.log(`Retrieving store data from ${args[0]}...`);
            var stores = JSON.parse(parser.xml2json(fs.readFileSync(markets[0].path, 'utf-8'))).elements[0].elements[0]; // <Stores>
            console.dir(stores);
            console.log(`Store data successfully retrieved from ${args[0]}!`);

            console.log(`Retrieving listing data from ${args[1]}...`);

            /*
            stores.elements[n].elements[0].elements[0] = <GUID>
            stores.elements[n].elements[0].elements[1] = <RefreshRate>
            stores.elements[n].elements[0].elements[2] = <SmartPriceEnabled>
            stores.elements[n].elements[0].elements[3] = <SESEStoreItems>
            stores.elements[n].elements[0].elements[4] = <AllowedUser>
            stores.elements[n].elements[0].elements[5] = <AllowedFactions>
            */
            var reqStore = stores.elements.filter(e => e.elements[0].elements[0].text == args[1]);
            console.log(`Displaying listing data for ${reqStore[0].elements[0].elements[0].text}:`);
            
            // <SESEStoreItems> for requested store
            var listings = reqStore[0].elements[3].elements;
            console.log(listings);

            if (!args[2]) {
                console.log('User did not specify item subtypeID, showing all listings...');
                var listStr = "```json\n";
                listings.forEach(listing => {
                    listStr += `Item: ${listing.elements[1].elements[0].text}\n`;
                    listStr += `Offer/Order: ${listing.elements[4].elements[0].text}\n`;
                    listStr += `Price: ${listing.elements[3].elements[0].text}\n\n`;
                });
                listStr += "```";

                message.channel.send(listStr);
                return console.log('Listing data successfully retrieved.');
            } else {
                console.log(`Item specified, retrieving ${args[2]} data from ${args[1]}`);
                var reqItem = listings.filter(listing => listing.elements[1].elements[0].text.toLowerCase() == args[2].toLowerCase());
                var listStr = "```json\n";
                listStr += `Store: ${args[1]}\nItem: ${reqItem[0].elements[1].elements[0].text}\nOffer/Order: ${reqItem[0].elements[4].elements[0].text}\nPrice: ${reqItem[0].elements[3].elements[0].text}SC`;
                listStr += '\n```';
                message.channel.send(listStr);
                return console.log('Item data successfully retrieved.');
            }

            return;
        } catch (err) {
            console.log(`Failed to retrieve store data from ${args[0]}.`);
            console.log(err);
            message.channel.send(`Unfortunately I was unable to retrieve store data from ${args[0]}`);
            return;
        }
    },
};