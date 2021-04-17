module.exports = {
    name:"ping",
    description:"A simple ping pong command",
    aliases: [],
    execute: async function(message, args, client, user) {
        message.channel.send("pong!")
    }
}