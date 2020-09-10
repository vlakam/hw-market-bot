import { User } from '../model/User'
const Markup = require('telegraf/markup')

let replyOptions;
let extraParams = {
    parse_mode: 'HTML',
    disable_notification: true,
    disable_web_page_preview: true,
    reply_markup: replyOptions
}

const denyCallback = (ctx) => {
    const userId = ctx.match[1];
    const reasonMessage = '-';
    ctx.telegram.sendMessage(userId, `Извини, но твой лот не был одобрен модерацией.\nПричина: ${reasonMessage}`)
    ctx.telegram.editMessageReplyMarkup(process.env.MODERATION_CHAT_ID, ctx.message.message_id);
}
const allowCallback = (ctx) => {
    const userId = ctx.match[1];
    replyOptions = Markup.inlineKeyboard([
        Markup.callbackButton('Продано', `sold${userId}`)
    ])
    extraParams.reply_markup = replyOptions;
    ctx.telegram.sendMessage(userId, `Оп! Модерация рассмотрела и одобрила твой лот. Обнови статус лота после продажи`, extraParams)
    ctx.reply('Окей, закрываю лот.')
}

const handleText = (ctx) => {
    const message = ctx.message;
    if (message.chat.id == process.env.MODERATION_CHAT_ID) {
        const content = message.text;
        const replyTo = message.reply_to_message.entities[0].user.id;
        ctx.telegram.sendMessage(replyTo, `Извини, но твой лот не был одобрен модерацией.\nПричина: ${content}`)
        replyOptions = Markup.inlineKeyboard([
            Markup.button(`Отклонено ${message.from.first_name} ${message.from.last_name}`)
        ])
        ctx.telegram.editMessageReplyMarkup(process.env.MODERATION_CHAT_ID, message.reply_to_message.message_id, {
            reply_markup: replyOptions
        });
    } else {
        const lotInfo = message.text;
        const user = new User(message.from.id, message.from.first_name, message.from.last_name);

        const formattedMessage = `\nОт: ${user.getMentionByFullNameHtml()}\nЛот: ${lotInfo}`

        replyOptions = Markup.inlineKeyboard([
            Markup.callbackButton('Добро', `allow${user.id}`),
            Markup.callbackButton('Говно', `deny${user.id}`)
        ])
        extraParams.reply_markup = replyOptions;

        ctx.telegram.sendMessage(process.env.MODERATION_CHAT_ID, formattedMessage, extraParams)
    }
}

module.exports = {
    handleText,
    allowCallback,
    denyCallback
}