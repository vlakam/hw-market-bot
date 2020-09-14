import { Extra, Markup, Telegraf } from 'telegraf';
import { ContextWithI18n } from '../HwMarketBot';

const allowCallback = (ctx: ContextWithI18n) => {
    if (!ctx.match) return;

    const [_, dealId] = ctx.match;
    console.log('ОП. НЕ РЕАЛИЗОВАНО!!!!!!!!!!!!!!!!');
    // const userId = 123; // Достать из монги
    // ctx.telegram.sendMessage(
    //     userId,
    //     `Оп! Модерация рассмотрела и одобрила твой лот. Обнови статус лота после продажи`,
    //     Extra.markup((m: Markup) => {
    //         return m.inlineKeyboard([m.callbackButton('Продано', `sold${dealId}`)], {});
    //     }),
    // );
};

export const setupAllowCallback = (bot: Telegraf<ContextWithI18n>) => bot.action(/^allow(.+)$/, allowCallback);
