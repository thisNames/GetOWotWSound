const LoggerSaver = require("../../../class/LoggerSaver");

const Ori = require("../class/Ori");

/**
 *  打印一个 ori
 *  @returns {void}
 */
function main()
{
    const logger = new LoggerSaver();
    const ori = new Ori();

    logger.__log(ori.oriColor(), ori.ori());
}

module.exports = main;
