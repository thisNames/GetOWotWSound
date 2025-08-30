const Logger = require("../../../class/Logger");

const Utils = require("../class/Utils");

/**
 *  答应项目所在目录
 *  @returns {void}
 */
function main()
{
    Logger.info(Utils.getProjectRoot());
}

module.exports = main;
