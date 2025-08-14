const GlobalSingle = require("../config/GlobalSingle");
const Params = require("./Params");
const Single = require("./Single");

/**
 *  @description 运行命令时的元数据信息对象，由入口文件定义数据
 *  @version 0.0.5
 */
class MainRunningMeta
{
    /**
     *  @param {MainRunningMeta} meta 配置对象
     */
    constructor(meta)
    {
        /** @type {String} 运行的命令 */
        this.key = meta.key || "";

        /** @type {String} 程序工作目录 */
        this.cwd = meta.cwd || process.cwd();

        /** @type {Number} 程序启动时间戳 */
        this.startTime = meta.startTime || Date.now();

        /** @type {String} 程序所在目录 */
        this.dirname = meta.dirname;

        /** @type {String} 入口文件路径 */
        this.filename = meta.filename;

        /** @type {GlobalSingle} 布尔命令存储对象 */
        this.singleMap = meta.singleMap;

        /** @type {Map<String, Params>} mapKey 参数命令映射表 */
        this.paramsMap = meta.paramsMap;

        /** @type {Map<String, Params>} params.key 参数命令映射表 */
        this.paramsKeyMap = meta.paramsKeyMap;

        /** @type {Array<Params>} 原始的参数命令集合 */
        this.originListParamsMapping = meta.originListParamsMapping;
    }
}

module.exports = MainRunningMeta;
