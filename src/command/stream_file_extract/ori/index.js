const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../../class/LoggerSaver");

/**
 *  随机打印一个 ori
 *  @returns {void}
 */
function randomPrintOri()
{
    const logger = new LoggerSaver();

    const randomPath = ["ori", "wisps", "body", "project"];
    const randomColor = [LoggerSaver.RESET, LoggerSaver.GREEN, LoggerSaver.LIGHT_BLUE, LoggerSaver.LIGHT_YELLOW, LoggerSaver.CYAN];

    const randomIndex = Math.floor(Math.random() * randomPath.length);
    const colorIndex = Math.floor(Math.random() * randomColor.length);

    const filename = randomPath[randomIndex] || randomPath[0];
    const color = randomColor[colorIndex] || randomColor[0];

    const oriPath = pt.join(__dirname, `txt/${filename}.txt`);

    try
    {
        const data = fs.readFileSync(oriPath, { encoding: "utf-8", flag: "r" });
        logger.__log(color, data);
    } catch (error)
    {
        logger.light("ori 不见了...");
    }
}

module.exports = {
    randomPrintOri
};
