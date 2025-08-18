const Logger = require("../../class/Logger");

/**
 *  打印版本
 *  @returns {void}
 */
function main()
{
    try
    {
        const package = require("../../../package.json");
        const version = package.version || "unknown";

        Logger.info("v" + version);
    } catch (error)
    {
        Logger.error("Get version error");
    }
}

module.exports = main;
