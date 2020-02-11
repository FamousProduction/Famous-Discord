const Discord = require('discord.js')
const mongoose = require("mongoose")
mongoose.connect('mongodb://hazze:famousbot@famousdb-shard-00-00-gpgqa.mongodb.net:27017,famousdb-shard-00-01-gpgqa.mongodb.net:27017,famousdb-shard-00-02-gpgqa.mongodb.net:27017/test?ssl=true&replicaSet=FamousDB-shard-0&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true
});
const Coins = require("../models/coins.js");


module.exports.run = async (bot, message, args) => {
  //this is where the actual code for the command goes
  await message.delete()

  let embed = new Discord.RichEmbed()
    .setTitle("Coins")
    .setThumbnail(message.author.displayAvatarURL);

  Coins.findOne({
    userID: message.author.id,
    serverID: message.guild.id
  }, (err, res) => {
    if (err) console.log(err);

    if (!res) {
      embed.setColor("RED");
      embed.addField("Error", "Sorry, you don't have any coins in this server...");
    } else {
      embed.setColor("BLURPLE");
      embed.addField(res.username, res.coins + " coins.");
    }

    message.channel.send(embed)

  })

}
//name this whatever the command name is.
module.exports.help = {
  name: "coins"
}
