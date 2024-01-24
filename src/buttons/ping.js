module.exports = {
  data: {
    name: 'ping',
    description: 'Egyszerű ping parancs',
  },

  async execute(interaction, client) {
    console.log('Ping parancs lefutott!');
  }
}