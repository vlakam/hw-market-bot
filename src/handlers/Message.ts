import { ContextWithI18n } from '../HwMarketBot';
import { Extra, Markup, Telegraf } from 'telegraf';
import { DealModel, DealStatus, User } from '../models';

let { MODERATION_CHAT_ID: moderatorsChatIdString } = process.env;
if (!moderatorsChatIdString) {
    console.log('MODERATION_CHAT_ID is unspecified.');
    moderatorsChatIdString = '123'; // type coercion
}

const moderatorsChatId = parseInt(moderatorsChatIdString);

export const handleMessage = async (ctx: ContextWithI18n) => {
    if (ctx.chat && ctx.chat.type === 'private') {
        // заявка на объявление
        const message = ctx.message!;
        const { from } = message;

        const text = message.caption || message.text!; // надо еще поддерживать заявки с фотографиями!!!
        const photo = message.photo ? message.photo[0].file_id : undefined;

        if (!from) return;
        const user = await User.findOrCreate({
            id: from.id,
            surname: from.last_name,
            name: from.first_name,
            username: from.username,
        });

        const formattedMessage = `\nОт: ${user.getMentionByFullNameHtml()}\nЛот: ${text}`;
        const title = text.split('\n')[0].slice(0, 15);
        const deal = await DealModel.create({
            creator: user,
            media: photo,
            title,
            description: text,
            status: DealStatus.REVIEW,
        });

        const moderatorsChatMessage = await ctx.telegram.sendMessage(
            moderatorsChatId,
            formattedMessage,
            Extra.HTML().markup((m: Markup) => {
                return m.inlineKeyboard(
                    [m.callbackButton('Добро', `allow${deal.id}`), m.callbackButton('Говно', `deny${deal.id}`)],
                    {},
                );
            }),
        );

        deal.moderationMessageId = moderatorsChatMessage.message_id;
        await deal.save();

        user.deals.push(deal);
        await user.save();
    } else if (ctx.chat && ctx.chat.id === moderatorsChatId) {
        // модераторы рофлят

        const message = ctx.message!;
        const { text, reply_to_message: replyTo } = message;
        if (!replyTo) return; // Какой-то поехавший модер спамит в чат без ответа

        const deal = await DealModel.findOne({ moderationMessageId: replyTo.message_id });
        if (!deal || deal.status !== DealStatus.REVIEW) return; // :DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD

        const { creator } = deal;
        deal.status = DealStatus.DECLINED;

        await deal.save();
        await ctx.telegram.sendMessage(
            (creator as unknown) as number,
            `Извини, но твой лот "${deal.title}" не был одобрен модерацией.\nПричина: ${text}`,
        );
        await ctx.telegram.editMessageText(
            moderatorsChatId,
            replyTo.message_id,
            undefined,
            replyTo.text!,
            Extra.HTML().markup((markup: Markup) => {
                return markup.inlineKeyboard([
                    markup.callbackButton(
                        `Отклонено ${message.from!.first_name} ${message.from!.last_name}. Причина: ${text}`,
                        'dummydumbdumb',
                    ),
                ], {});
            }),
        );
    }
};
