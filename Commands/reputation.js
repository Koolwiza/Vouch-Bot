const {
    MessageEmbed
} = require("discord.js")

module.exports = {
    name: "reputation",
    description: "View the reputation of a user",
    aliases: ['rep'],
    execute: async function (message, args, client, user) {
        let vouchUser = message.mentions.users.first() || (args[0] ? await client.users.fetch(args[0]) : undefined) || message.author

        let data = user(vouchUser)
        let vouches = data.upvotes.length
        let downvotes = data.downvotes.length

        let chart = {
            type: 'pie',
            data: {
                labels: ["Upvotes", "Downvotes"],
                datasets: [{
                    data: [vouches, downvotes],
                    backgroundColor: [
                        'rgb(120, 186, 45)',
                        'rgb(186, 45, 45)'
                    ]
                }]
            }
        }

        let enChart = encodeURIComponent(JSON.stringify(chart))
        const chartUrl = `https://quickchart.io/chart?c=${enChart}&backgroundColor=(rgb(47,%2049,%2054))`;

        let embed = new MessageEmbed()
            .setTitle(`${vouchUser.username}'s Reputation`)
            .setDescription(`👍 Vouches: ${vouches}.\n\n👎 Downvotes: ${downvotes}`)
            .setColor("BLUE")
            .setImage(chartUrl)
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
        return message.channel.send(embed)

    }
}