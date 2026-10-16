const { 
    SlashCommandBuilder, 
    ApplicationIntegrationType, 
    InteractionContextType 
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Sends a message a specified number of times')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('How many times to repeat (Max: 10)')
                .setRequired(false))
        .setIntegrationTypes([
            ApplicationIntegrationType.UserInstall,
            ApplicationIntegrationType.GuildInstall
        ])
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel
        ]),

    async execute(interaction) {
        const text = interaction.options.getString('message');
        const count = interaction.options.getInteger('count') || 1;
        
        // Limits repetition to a maximum of 10 times to prevent rate limits
        const maxRepetitions = Math.min(count, 10);

        // First message response
        await interaction.reply({ content: text });

        // Loop to send remaining messages with a small delay
        for (let i = 1; i < maxRepetitions; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            await interaction.followUp({ content: text });
        }
    },
};
