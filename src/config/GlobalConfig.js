/**
 *  运行时全局配置类
 *  @version 0.0.1
 */

class GlobalConfig
{
    constructor()
    {

    }

    /**
     *  @type {Number} 递归最大深度
     */
    static recursionDeep = 10;

    /**
    *  @type {Number} 文件收集最大数量，如果小于 1 则不做限制
    */
    static collectFileMaxCount = 1000;

}

module.exports = GlobalConfig;
