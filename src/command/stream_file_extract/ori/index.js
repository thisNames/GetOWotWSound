const Logger = require("../../../class/Logger");

const Ori = require("../class/Ori");

/**
 *  打印一个 ori
 *  @returns {void}
 */
function main()
{
    const ori = new Ori();

    Logger.log(ori.oriColor(), ori.ori());
}

module.exports = main;
