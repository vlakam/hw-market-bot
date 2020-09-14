import "./helpers/env";
import bot from "./HwMarketBot";
import { connect } from "./models";

const { MONGO } = process.env;

const init = async () => {
    await connect(MONGO);
    await bot.launch();
};

init();