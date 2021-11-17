const functions = require('firebase-functions');
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

exports.left = functions.https.onRequest((request, response) => {
  client.channels.get('757688700011282608').send('LEFT');
  response.send('success');
});

exports.right = functions.https.onRequest((request, response) => {
  client.channels.get('757688700011282608').send('RIGHT');
  response.send('success');
});

client.login(functions.config().discord.token);

