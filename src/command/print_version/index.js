const LoggerSaver = require("../../class/LoggerSaver");
const Params = require("../../class/Params");
const MainRunningMeta = require("../../class/MainRunningMeta");

/**
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 */
module.exports = function (param, meta, __this, taskName)
{
    const Logger = new LoggerSaver(taskName, meta.cwd, meta.singleMap.isSaveLog.include);
    let package = {};
    let version = "";

    try
    {
        package = require("../../../package.json");
        version = package.version;
    } catch (error)
    {
        version = "unknown";
    }

    Logger.info("v" + version);
    Logger.close();
};
