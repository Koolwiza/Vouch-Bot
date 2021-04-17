const Discord = require('discord.js'),
    Enmap = require('enmap')

const client = new Discord.Client(),
    {
        readdirSync
    } = require('fs'),
    commandFiles = readdirSync('./commands').filter(c => c.endsWith('.js')),
    config = require('./config.json')

client.vouches = new Enmap({
    name: "vouches",
    autoFetch: true,
    fetchAll: true,
    ensureProps: true
})

client.commands = new Discord.Collection()

for (let file of commandFiles) {
    let command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}

client.on('ready', () => {
    console.clear()
    console.log(`${client.user.tag} is online!`)
})

client.on('message', async message => {
    let user = (user) => {
        return client.vouches.ensure(user.id, {
            upvotes: [

            ],
            downvotes: [

            ],
            vouchedFor: [],
            downvotedFor: []
        })
    }
    let a = user(message.author)
    if (message.author.bot || !message.content.startsWith(config.prefix)) return;

    let args = message.content.trim().slice(config.prefix.length).split(/\s+/g)
    let commandName = args.shift().toLowerCase()

    let command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName))
    if (!command) return;

    try {
        await command.execute(message, args, client, user)
    } catch (e) {
        console.log(e)
    }

})

client.login(config.token)