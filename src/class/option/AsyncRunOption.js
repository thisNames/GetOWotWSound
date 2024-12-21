const RunOption = require("./RunOption");

/**
 * 异步运行配置
 */
class AsyncRunOption extends RunOption
{
    constructor()
    {
        super();
        /** @type {Number} 异步最大数量（默认 20） */
        this.aMax = 20;
    }
}

module.exports = AsyncRunOption;