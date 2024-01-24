const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Kilépteti a botot a hangcsatornából.'),

    async execute(interaction) {
        let connection = getVoiceConnection(interaction.guild.id);
        if (connection === undefined) {
            await interaction.reply('Nem vagyok hangcsatornában!');
            return;
        };
    
        await interaction.reply(`Sikeresen kiléptem innen: ${interaction.guild.members.me.voice.channel.name}`);

        connection.destroy();
    }
}