const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('randompost')
    .setDescription('Random post'),

  async execute(interaction, client) {
    const post = await fetch('https://api.social.wolimby.hu/posts/getall')
      .then((response) => response.json())
      .then(
        (data) => data.posts[Math.floor(Math.random() * data.posts.length)],
      );
    const pingembed = new EmbedBuilder()

      .setColor('#5865f4')
      .setAuthor({
        name: post.author.profile.username,
        iconURL: post.author.profile.profilePicture,
        url: `https://social.wolimby.hu/post/${post._id}`,
      })
      .setFooter({
        text: `❤️ ${post.likes.length} | 💬 ${post.comments.length} | 🔁 ${post.shares.length}`,
      })
      .setTimestamp(new Date(post.createdAt));
    if (post.file != 'none' && post.description != '') {
      pingembed.setDescription(post.description);
      pingembed.setImage(post.file);
    } else if (post.file == 'none' && post.description != '') {
      pingembed.setDescription(post.description);
    } else if (post.file != 'none' && post.description == '') {
      pingembed.setImage(post.file);
    }

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Megnyitás')
        .setStyle(5)
        .setEmoji('📷')
        .setURL(`https://social.wolimby.hu/post/${post._id}`),
    );

    await interaction.reply({
      embeds: [pingembed],
      components: [button],
    });
  }
}
