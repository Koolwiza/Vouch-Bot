const Discord = require('discord.js')

module.exports = {
    name: "vouch",
    description: "Vouch for a user",
    aliases: ['upvote'],
    execute: async function (message, args, client, user) {
        let vouchUser = await getUser(args[0])
        let reason = args.slice(1).join(" ")
        if(!vouchUser) return message.channel.send("Please provide a valid user")
        if(!reason) return message.channel.send("Please provide a vouch reason")

        user(vouchUser)
        if(client.vouches.get(message.author.id).vouchedFor.includes(message.author.id)) return message.channel.send("You have already vouched for this user!")

        client.vouches.push(vouchUser.id, {
            author: message.author.id,
            time: new Date().toLocaleDateString(),
            reason: reason
        }, "upvotes")
        client.vouches.push(message.author.id, vouchUser.id, "vouchedFor")
        
        return message.channel.send(new Discord.MessageEmbed()
            .setTitle("Vouched")
            .setDescription(`You have vouched for **${vouchUser.tag}**.`)
            .setColor('GREEN')
            .setFooter(client.user.username, client.user.displayAvatarURL())
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
            )
    }
}

let getUser = async function(search, client) {
    let userRegex = /^<@!?(\d+)>$/
    let user = null;
    if (!search || typeof search !== "string") return;
    if (search.match(userRegex)) {
      const id = search.match(userRegex)[1];
      user = client.users.fetch(id).catch(() => {});
      if (user) return user;
    }
    user = await client.users.fetch(search).catch(() => {});
    return user;
}