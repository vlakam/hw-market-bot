import Telegraf from 'telegraf';
import { Context } from 'telegraf';
import { I18n } from 'telegraf-i18n';
import { i18n } from './helpers/i18n';
import { setupAllowCallback } from './handlers/Accept';
import { setupDenyCallback } from './handlers/Deny';
import { handleMessage } from './handlers/Message';

export class ContextWithI18n extends Context {
    i18n!: I18n;
}

const { BOT_TOKEN } = process.env;
if (!BOT_TOKEN) throw 'BOT_TOKEN unspecified';
const bot = new Telegraf<ContextWithI18n>(BOT_TOKEN);

bot.use(async (_, next) => {
    try {
        await next();
    } catch (e) {
        console.log(e);
    }
});

bot.use(i18n.middleware());

// bot.start((ctx) => {
//     ctx.i18n.locale(ctx.from!.language_code);
//     ctx.reply(ctx.i18n.t('start'));
// });
// bot.help((ctx) => {
//     ctx.i18n.locale(ctx.from!.language_code);
//     ctx.reply(ctx.i18n.t('help'));
// });
// bot.on('sticker', (ctx) => ctx.reply('👍'));

bot.on('message', handleMessage);
setupAllowCallback(bot);
setupDenyCallback(bot);

export default bot;
