const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const User = require('./model/User')

let replyOptions;
let extraParams = {
    parse_mode: 'HTML',
    disable_notification: true,
    disable_web_page_preview: true,
    reply_markup: replyOptions
}


exports.start = (config) => {
    const bot = new Telegraf(process.env.BOT_TOKEN)
    bot.start((ctx) => {
        console.log(ctx);
        ctx.reply('Hello, I\'m hw-market bot. Here you can describe whatever you\'re going to sell related to hardware.')
    })
    bot.help((ctx) => ctx.reply('Help'))
    bot.on('sticker', (ctx) => ctx.reply('👍'))

    bot.on('text', (ctx) => {
        const message = ctx.message;
        const lotInfo = message.text;
        const user = new User(message.from.id, message.from.first_name, message.from.last_name);
        console.log(JSON.stringify(message))

        const formattedMessage = `\nОт: ${user.getMentionByFullNameHtml()}\nЛот: ${lotInfo}`

        replyOptions = Markup.inlineKeyboard([
            Markup.callbackButton('Добро', `allow${user.id}`),
            Markup.callbackButton('Говно', `deny${user.id}`)
        ])
        extraParams.reply_markup = replyOptions;
        //   .extra()

        ctx.telegram.sendMessage(process.env.MODERATION_CHAT_ID, formattedMessage, extraParams)
    })

    bot.action(/^allow([0-9]+)$/, (ctx) => {
        const userId = ctx.match[1];
        replyOptions = Markup.inlineKeyboard([
            Markup.callbackButton('Продано', `sold${userId}`)
        ])
        extraParams.reply_markup = replyOptions;
        ctx.telegram.sendMessage(userId, `Оп! Модерация рассмотрела и одобрила твой лот. Обнови статус лота после продажи`, extraParams)
        ctx.reply('Окей, закрываю лот.')
    })
    bot.action(/^deny([0-9]+)$/, (ctx) => {
        const userId = ctx.match[1];
        const reasonMessage = '-';
        ctx.telegram.sendMessage(userId, `Извини, но твой лот не был одобрен модерацией.\nПричина: ${reasonMessage}`)
    })


    bot.launch()
}
