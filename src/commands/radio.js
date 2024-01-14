const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    SlashCommandBuilder,
  } = require("discord.js");
  const { createAudioResource, createAudioPlayer, joinVoiceChannel, NoSubscriberBehavior, StreamType, VoiceConnectionStatus } = require("@discordjs/voice");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("radio")
      .setDescription("Radio"),
  
    async execute(interaction, client) {
        const url = 'https://radio.wolimby.hu/listen/wolimby/radio.mp3'
        await interaction.reply("Joining voice channel...");

    const channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.followUp("Please join a voice channel first.");
    }

    // Join the voice channel
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    // Create an audio player
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    // Create an audio resource from the stream
    const resource = createAudioResource(url, {
      inputType: StreamType.Arbitrary,
    });

    // Play the audio resource
    player.play(resource);

    // Subscribe the player to the connection
    connection.subscribe(player);

    // Handle player events
    player.on("stateChange", (oldState, newState) => {
      if (newState.status === VoiceConnectionStatus.Disconnected) {
        connection.destroy();
      }
    });

    interaction.followUp(`Now playing radio in ${channel.name}.`);
    },
  };
  