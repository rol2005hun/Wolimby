module.exports = async (client, interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      command.execute(interaction, client);
    } catch (err) {
      if (err) console.error(err);
      interaction.reply({
        content: 'Hiba történt a parancs végrehajtásakor.',
        ephemeral: true,
      });
    }
  } else if (interaction.isAutocomplete()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`Nincs ${interaction.commandName} parancs.`);
			return;
		}

		try {
			await command.autocomplete(interaction);
		} catch (error) {
			console.error(error);
		}
  } else if (interaction.isButton()) {

    const button = client.buttons.get(interaction.customId);
    try {
      button.execute(interaction, client);
    } catch (err) {
      if (err) console.error(err);
      interaction.reply({
        content: 'Hiba történt a gomb kattintásakor.',
        ephemeral: true,
      });
    }
  } else if (interaction.isSelectMenu()) {
    const button = client.buttons.get(interaction.customId);
    if (button) return button.execute(interaction, client);
  }
};
