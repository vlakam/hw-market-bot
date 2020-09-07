const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')

exports.start = (config) => {
    const bot = new Telegraf(process.env.BOT_TOKEN)
    bot.start((ctx) => {
        ctx.reply('Describe lot')
    })
    bot.help((ctx) => ctx.reply('Help'))
    bot.on('sticker', (ctx) => ctx.reply('👍'))
    bot.on('text', (ctx) => {
        const message = ctx.message;
        const lotInfo = message.text;
        const user = {
            id: message.from.id,
            name: message.from.first_name,
            surname: message.from.last_name,
            getMentionById: function() {
                return `#id${this.id}`
            },
            getMentionByFullNameMarkdown: function() {
                //[inline mention of a user](tg://user?id=123456789)
                return `[${this.name} ${this.surname}](tg://user?id=${this.id})`
            },
            getMentionByFullNameHtml: function() {
                return `<a href="tg://user?id=${this.id}">${this.getFullName()}</a>[${this.getMentionById()}]`
            },
            getFullName: function() {
                return `${this.name} ${this.surname}`
            }
        };
        console.log(JSON.stringify(message))

        const formattedMessage = `
            ${user.getMentionByFullNameHtml()}\n
            Лот: ${lotInfo}
        `
        const extraParams = {
            parse_mode: 'HTML'
        }

        ctx.telegram.sendMessage(process.env.MODERATION_CHAT_ID, formattedMessage, extraParams)
      })
      
    bot.launch()
}
