/**
 *  布尔命令参数类
 *  @version 0.0.3
 */
class Single
{
    /**
     *  @param {Single} option 配置属性
     */
    constructor(option)
    {
        //#region 可配置的
        const {
            key = null,
            description = "",
            example = "",
            modulePath = ""
        } = option || {};

        /** @type {String} 命令 */
        this.key = key;

        /** @type {String} 命令简单描述 */
        this.description = description;

        /** @type {String} 命令帮助文档路径 */
        this.example = example;

        /** @type {String} 模块所在路径 */
        this.modulePath = modulePath;
        //#endregion


        //#region 运行时自动设置的
        /** @type {Boolean} 包含此命令 */
        this.include = false;
        //#endregion
    }
}

module.exports = Single;
