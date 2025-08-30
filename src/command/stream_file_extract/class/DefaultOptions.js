const pt = require("node:path");

/**
 *  默认选项类
 */
class DefaultOptions
{
    /** @type {String} 默认输出路径 */
    static defOutputPath = pt.join(process.cwd(), "build");

    /** @type {String} 默认日志保存路径 */
    static defLogPath = pt.join(process.cwd(), "build", "log");

    /** @type {String} 默认临时文件保存路径 */
    static defTempPath = pt.join(process.cwd(), "build", "temp");

    constructor()
    {
        //#region 字符串配置
        /** @type {String} 生成的文件名称后缀 */
        this.extname = ".ogg";

        /** @type {String} 生成过滤器 */
        this.filter = "";

        /** @type {String} 使用自定义的 StreamedFiles.json 结构文件 */
        this.customSFStruct = "";

        /** @type {String} 使用自定义的 SoundBanks.json 结构文件 */
        this.customSBKStruct = "";
        //#endregion


        //#region 路径配置
        /** @type {String} 输出路径 */
        this.outputPath = DefaultOptions.defOutputPath;

        /** @type {String} 日志保存路径 */
        this.logPath = DefaultOptions.defLogPath;

        /** @type {String} 临时文件保存路径 */
        this.tempPath = DefaultOptions.defTempPath;
        //#endregion


        //#region 数值配置
        /** @type {Number} 异步并发的数量 [2, max_thread] */
        this.asyncNumber = 3;
        //#endregion


        //#region 布尔配置
        /** @type {boolean} 启用 异步 */
        this.enableAsync = false;

        /** @type {Boolean} 启用 检索忽略大小写 */
        this.enableSIgnoreCase = false;

        /** @type {Boolean} 启用 保存搜索结果为 json */
        this.enableSSjson = false;

        /** @type {Boolean} 启用 保存搜索结果为 log */
        this.enableSSlog = false;

        /** @type {Boolean} 启用 保存搜索结果为 csv */
        this.enableSScsv = false;

        /** @type {Boolean} 启用 HashId */
        this.enableHashId = true;

        /** @type {Boolean} 启用 生成 ID */
        this.enableId = true;

        /** @type {Boolean} 启用 分类文件夹 */
        this.enableCreateTypeDir = true;
        //#endregion


        //#region 枚举设置
        /** @type {Number} [0 - StreamedFiles, 1 - SoundBanks, 2 - StreamedFiles & SoundBanks] 搜索枚举 */
        this.searchEnum = 2;

        /** @type {Number} [0 - Id, 1 - ShortName, 2 - Id & ShortName] 查找重复的 key 枚举 */
        this.duplicateEnum = 1;
        //#endregion
    }
}

module.exports = DefaultOptions;
