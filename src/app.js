const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')

exports.start = (config) => {
    const bot = new Telegraf(process.env.BOT_TOKEN)
    bot.start((ctx) => {
        console.log('welcome')
        ctx.reply('Welcome!')
    })
    bot.help((ctx) => ctx.reply('Send me a sticker'))
    bot.on('sticker', (ctx) => ctx.reply('👍'))
    bot.launch()
}
