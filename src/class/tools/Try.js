/**
 * 异常处理类
 */
class Try
{
    /**
     * 
     * @param {Boolean} exit 异常退出（默认 true）
     */
    constructor(exit = true)
    {
        this.exit = exit;
    }

    /**
     * 捕获异常
     * @param {Function} fn 需要捕获异常的函数
     * @param {Function} failing 失败的回调
     * @returns {any} fn 的返回值
     * @example
     * fn
     *  参数：无
     *  返回值：fn 的返回值
     * failing
     *  参数：error.message
     *  返回值：无
     */
    tryError(fn, failing)
    {
        try
        {
            return fn();
        } catch (error)
        {
            failing(error.message);
            this.exit && process.exit();
        }
    }
}

module.exports = Try;