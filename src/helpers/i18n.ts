import TelegrafI18n, { I18n } from "telegraf-i18n";
import path from "path";

export const i18n = new TelegrafI18n({
  useSession: true,
  defaultLanguageOnMissing: true,
  directory: path.resolve(__dirname, "..", "..", "locales"),
});
