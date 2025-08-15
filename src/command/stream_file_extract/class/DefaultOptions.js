/**
 *  默认选项类
 */
class DefaultOptions
{
    constructor()
    {
        //#region 路径配置
        /** @type {String} 输出路径 */
        this.outputPath = process.cwd();

        /** @type {String} 日志保存路径 */
        this.logPath = process.cwd();
        //#endregion


        //#region 数值配置
        /** @type {Number} 异步并发的数量 [2, 1024] */
        this.asyncNumber = 10;

        /** @type {Number} 线程数量 [2, max_thread * 2] */
        this.threadNumber = 4;
        //#endregion


        //#region 布尔配置
        /** @type {boolean} 启用 异步 */
        this.enableAsync = false;

        /** @type {String} 启用 多线程 */
        this.enableThread = false;

        /** @type {String} 启用 生成 ID */
        this.enableId = true;

        /** @type {String} 启用 分类文件夹 */
        this.enableenableCreateTypeDir = true;
        //#endregion
    }
}

module.exports = DefaultOptions;
