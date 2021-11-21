const functions = require('firebase-functions');
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });
const cors = require('cors')({origin: true});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

exports.left = functions.https.onRequest((req, res) => {
  // cors(req, res, () => {
    client.channels.get('757688700011282608').send('LEFT');
    res.set('Access-Control-Allow-Origin', '*');
    res.send('success');
  // });

});

exports.right = functions.https.onRequest((req, res) => {

  // cors(req, res, () => {
    client.channels.get('757688700011282608').send('RIGHT');
    res.set('Access-Control-Allow-Origin', '*');
    res.send('success');
  // });
});

client.login(functions.config().discord.token);

