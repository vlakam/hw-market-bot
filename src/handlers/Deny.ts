import { Extra, Markup, Telegraf } from 'telegraf';
import { ContextWithI18n } from '../HwMarketBot';
import { DealModel, DealStatus } from '../models';

const denyCallback = async (ctx: ContextWithI18n) => {
    if (!ctx.match || !ctx.callbackQuery) return;

    const [_, dealId] = ctx.match;
    const deal = await DealModel.findById(dealId);
    if (!deal || deal.status !== DealStatus.REVIEW) return; // :DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD

    const { creator, moderationMessageId } = deal;
    deal.status = DealStatus.DECLINED;

    await deal.save();
    await ctx.telegram.sendMessage(
        (creator as unknown) as number,
        `Извини, но твой лот "${deal.title}" не был одобрен модерацией.\nПричина: -`,
    );

    await ctx.telegram.editMessageText(
        process.env.MODERATION_CHAT_ID,
        moderationMessageId,
        undefined,
        ctx.callbackQuery.message!.text!,
        Extra.HTML().markup((markup: Markup) => {
            return Markup.inlineKeyboard(
                [Markup.callbackButton(`Отклонено ${ctx.from!.first_name} ${ctx.from!.last_name}`, 'dummydumbdumb')],
                {},
            );
        }),
    );
};

export const setupDenyCallback = (bot: Telegraf<ContextWithI18n>) => bot.action(/^deny(.+)$/, denyCallback);
