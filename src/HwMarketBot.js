const Telegraf = require('telegraf')
const TelegrafI18n = require('telegraf-i18n')
const Markup = require('telegraf/markup')
const path = require('path')
const TextHandler = require('./handler/TextHandler')

exports.start = (config) => {
    const bot = new Telegraf(process.env.BOT_TOKEN)
    const i18n = new TelegrafI18n({
        useSession: true,
        defaultLanguageOnMissing: true,
        directory: path.resolve(__dirname, '..', 'locales')
    })

    bot.use(Telegraf.session())
    bot.use(i18n.middleware())

    bot.start((ctx) => {
        ctx.i18n.locale(ctx.from.language_code)
        ctx.reply(ctx.i18n.t('start'));
    })
    bot.help((ctx) => {
        ctx.i18n.locale(ctx.from.language_code)
        ctx.reply(ctx.i18n.t('help'));
    })

    bot.on('sticker', (ctx) => ctx.reply('👍'))
    bot.on('text', (ctx) => TextHandler.handleText(ctx))

    bot.action(/^allow([0-9]+)$/, (ctx) => { TextHandler.allowCallback(ctx) })
    bot.action(/^deny([0-9]+)$/, (ctx) => { TextHandler.denyCallback(ctx) })

    bot.launch()
}
