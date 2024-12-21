/**
 * 全局指令类（使用枚举法）
 * @description 使用链式调用
 */
class GlobalCmd
{
    /**@type {Boolean}  是否只使用一次 */
    #once = false;

    /**@type {Boolean} 是否已经执行过一次 */
    #isRunning = false;

    /**@param  {Boolean} once 是否只使用一次 */
    constructor(once = false)
    {
        this.#once = once;

        /**@type {Array<String>} 需要匹配的指令 */
        this.cmd = [];

        /**@type {Array<String>} 默认的指令（输入的指令） */
        this.processArgs = process.argv.slice(2);

        /**@type {Array<String>} 比较的指令 */
        this.compares = this.processArgs;
    }

    /**
     * 校验命令
     * @param {Array<String>} cmd cmd集合
     * @returns {Boolean}
     */
    _check(cmd = [])
    {
        const compares = this.compares.slice(0, cmd.length);

        const _cmd = cmd.join("");
        const _compares = compares.join("");

        return _cmd === _compares;
    }

    /**
     * 追加一个命令
     * @param {String} cmd 指令
     * @returns {GlobalCmd}
     */
    append(cmd)
    {
        this.cmd.push(cmd);
        return this;
    }

    /**
     * 获取一个参数
     * @param {Function} fn 回调函数
     * @description 从指令的后方获取一个参数，此参数不作为比较的指令
     * @example
     * 参数：指令后面跟的参数
     * @returns {GlobalCmd}
     */
    param(fn)
    {
        // 指令的下一个是参数
        const index = this.cmd.length;

        // 从指令集合中获取参数
        const param = this.compares[index];

        // 参数也是属于指令的一部分（确保长度一致）
        this.cmd.push(param);

        // 前面的命令匹配成功，才会执行参数
        this._check(this.cmd) && fn(param);

        return this;
    }

    /**
     * 执行
     * @param {Function} task       回调（匹配指令成功执行）
     * @description 只有调用了此方法，命令才会重置
     * @example
     *  task 回调，命令符合执行
     *      参数：cmd 匹配成功的命令集合
     */
    run(task)
    {
        const temp = this.cmd;
        // 重置
        this.cmd = [];

        // 如果已经执行过一次，并且只允许执行一次
        if (this.#isRunning && this.#once) return;

        if (temp.length === this.compares.length && this._check(temp) && typeof task === "function")
        {
            task(temp);
            this.#isRunning = true;
        }
    }

    /**
    * 获取一个全局指令对象
    * @returns {GlobalCmd}
    * @description 生成一个只使用一次的全局指令对象（工厂函数）
    */
    static CLine()
    {
        return new GlobalCmd(true);
    }
}


module.exports = GlobalCmd;