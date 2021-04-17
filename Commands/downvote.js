const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    name: "downvote",
    description: "Downvote a user",
    aliases: [],
    execute: async function (message, args, client, user) {
        let vouchUser = message.mentions.users.first() || await client.users.fetch(args[0])
        let reason = args.slice(1).join(" ")
        if (!vouchUser) return message.channel.send("Please provide a valid user")
        if (!reason) return message.channel.send("Please provide a downvote reason")

        user(vouchUser)
        if (client.vouches.get(message.author.id).downvotedFor.includes(message.author.id)) return message.channel.send("You have already downvoted this user!")

        client.vouches.push(vouchUser.id, {
            author: message.author.id,
            time: new Date().toLocaleDateString(),
            reason: reason
        }, "downvotes")

        client.vouches.push(message.author.id, vouchUser.id, "downvotedFor")

        return message.channel.send(new MessageEmbed()
            .setTitle("Downvoted")
            .setDescription(`You have downvoted for **${vouchUser.tag}**.`)
            .setColor('RED')
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
        )
    }
}