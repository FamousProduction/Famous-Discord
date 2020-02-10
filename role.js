const { Client, RichEmbed } = require("discord.js");
const { prefix, token, owner_id, channel, role } = require("./data/config.json");
const { welcomes } = require("./data/text.json");
const moment = require("moment");
const bot = new Client({disableEveryone: true});

bot.on("ready", () => {
  bot.user.setActivity("for fame", { type: "STREAMING", url: "https://www.twitch.tv/something" })
  console.log("[SYSTEM] The bot is online.")
});

bot.on("message", async message => {
  
  if(message.author.bot) return;
  if(message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`💗 is ${m.createdTimestamp - message.createdTimestamp}ms. 💓 is ${Math.round(bot.ping)}ms`);
  }
  
  if(command === "say") {
    if(message.author.id !== owner_id) return;
    const sayMessage = args.join(" ");
    message.delete(); 
    message.channel.send(sayMessage);
  }

  if(command === "verify") {
    if(message.author.id !== owner_id) return;
    message.delete();
    const roleEmbed = new RichEmbed()
      .setColor("#dd9323")
      .setDescription("React to the emoji below to get access to this server.");

    msg = await message.channel.send(roleEmbed);
    msg.react("✅");
  }
});

bot.on("messageReactionAdd", (reaction, user) => {
  let random_welcomes = welcomes[Math.floor(Math.random()*welcomes.length)];
  let message = reaction.message;
  let emoji = reaction.emoji;
  if(message.channel.id === channel.verify && emoji.name === "✅") {
    message.guild.fetchMember(user.id).then(member => {
      console.log("[SYSTEM] " + member.user.tag + " passed verification.");
      member.addRole(role.verified);
      member.guild.channels.get(channel.welcome).send(`<@${member.user.id}> ${random_welcomes}.`); 
    });
  }
});

bot.on("messageReactionRemove", (reaction, user) => {

});

bot.on("guildMemberAdd", (member) => {
  console.log("[SYSTEM] " + member.user.tag + " joined.");
  const joinlogEmbed = new RichEmbed()
      .setColor("#5780cd")
      .setTitle(member.user.tag + " joined.")
      .addField("Created at:", "Soon")
      .addField("Invited by:", "Soon")
      .setTimestamp();
  member.guild.channels.get(channel.joinlog).send(joinlogEmbed); 
});

bot.on("guildMemberRemove", (member) => {
  console.log("[SYSTEM] " + member.user.tag + " left. (Joined: " + moment.utc(member.joinedAt).format('DD/MM/YY') + ")");
  const leavelogEmbed = new RichEmbed()
      .setColor("#5780cd")
      .setTitle(member.user.tag + " left.")
      .addField("Joined at:", moment.utc(member.joinedAt).format('DD/MM/YY'))
      .setTimestamp();
  member.guild.channels.get(channel.leavelog).send(leavelogEmbed);
});

bot.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    const channel = bot.channels.get(packet.d.channel_id);
    if (channel.messages.has(packet.d.message_id)) return;
    channel.fetchMessage(packet.d.message_id).then(message => {
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.get(emoji);
        if (reaction) reaction.users.set(packet.d.user_id, bot.users.get(packet.d.user_id));
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            bot.emit('messageReactionAdd', reaction, bot.users.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            bot.emit('messageReactionRemove', reaction, bot.users.get(packet.d.user_id));
        }
    });
});

//bot.login(token);
bot.login(process.env.TOKEN)
