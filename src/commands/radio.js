const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
} = require('discord.js');
const {
  createAudioResource,
  createAudioPlayer,
  joinVoiceChannel,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnectionStatus,
} = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder().setName('radio').setDescription('Radio'),

  async execute(interaction, client) {
    const channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.reply('Nem vagy hangcsatornában!');
    }

    const url = 'https://radio.wolimby.hu/listen/wolimby/radio.mp3';
    await interaction.reply('Belépés a hangcsatornába...');

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    const resource = createAudioResource(url, {
      inputType: StreamType.Arbitrary,
    });

    player.play(resource);

    connection.subscribe(player);

    player.on('stateChange', (oldState, newState) => {
      if (newState.status === VoiceConnectionStatus.Disconnected) {
        connection.destroy();
      }
    });

    interaction.followUp(`Megy a rádió itt: ${channel.name}.`);
  }
}