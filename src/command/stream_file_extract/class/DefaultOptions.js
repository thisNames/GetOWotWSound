const pt = require("node:path");

/**
 *  默认选项类
 */
class DefaultOptions
{
    constructor()
    {
        //#region 字符串配置
        /** @type {String} 生成的文件名称后缀 */
        this.extname = ".ogg";
        //#endregion


        //#region 路径配置
        /** @type {String} 输出路径 */
        this.outputPath = pt.join(process.cwd(), "builds");

        /** @type {String} 日志保存路径 */
        this.logPath = pt.join(process.cwd(), "logs");
        //#endregion


        //#region 数值配置
        /** @type {Number} 异步并发的数量 [2, max_thread] */
        this.asyncNumber = 4;
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

        /** @type {String} 启用 生成 ID */
        this.enableId = true;

        /** @type {String} 启用 分类文件夹 */
        this.enableCreateTypeDir = true;
        //#endregion


        //#region 枚举设置
        /** @type {Number} [0 - StreamedFiles, 1 - SoundBanks, n - StreamedFiles & SoundBanks] */
        this.searchEnum = 2;
        //#endregion
    }
}

module.exports = DefaultOptions;
