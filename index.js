const { Client } = require('discord.js-selfbot-v13');

const userId = 'ID DA PESSOA';

const client = new Client();

client.on('ready', async () => {
    console.log(`conectado na conta: ${client.user.username}`);

    const user = await client.users.fetch(userId);
    const dm = await user.createDM();

    let messagesDeleted = 0;
    let lastId = null;
    let done = false;

    while (!done) {
        const options = { limit: 100 };
        if (lastId) options.before = lastId;

        const messages = await dm.messages.fetch(options);

        if (messages.size === 0) break;

        const ownMessages = messages.filter(m => m.author.id === client.user.id);

        for (const [id, msg] of ownMessages) {
            try {
                await msg.delete();
                messagesDeleted++;
                console.log(`Deletado: ${id}`);
                await new Promise(r => setTimeout(r, 1000));
            } catch (err) {
                console.error(`Erro ao deletar ${id}:`, err.message);
            }
        }

        lastId = messages.last().id;
        if (messages.size < 100) done = true;
    }

    console.log(`Fim: ${messagesDeleted} mensagens apagadas da DM.`);
});

client.login("");
