/**
 *  显示加载
 *  @version 0.0.2
 */
class Loading
{
    /**
     *  @param {Number} [speed=100] 旋转的速度，毫秒
     */
    constructor(speed = 100)
    {
        this.__spinner = null;
        this.__index = 0;
        this.__startTime = Date.now();

        this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        this.speed = speed;
    }

    /**
     *  @param {string} [msg="Done"] 提示
     *  @returns {Loading} this
     */
    start(msg = "Loading")
    {
        if (this.__spinner === null)
        {
            process.stdout.write('\x1B[?25l'); // 隐藏终端光标

            this.__startTime = Date.now();
            this.__spinner = setInterval(() =>
            {
                // 计算经过的时间
                let elapsed = ((Date.now() - this.__startTime) / 1000).toFixed(2);
                let frame = this.frames[this.__index % this.frames.length];

                process.stdout.write(`\r${frame} ${msg} ${elapsed}s`);

                this.__index++;
            }, this.speed);
        }

        return this;
    }

    /**
     *  @param {Boolean} success 加载成功还是失败
     *  @param {string} [msg="Done"] 提示
     *  @returns {Loading} this
     */
    stop(success, msg = "Done")
    {
        if (this.__spinner !== null)
        {
            process.stdout.write('\x1B[?25h'); // 显示终端光标
            clearInterval(this.__spinner);

            let binggo = success ? "✅" : "❌";
            let elapsed = ((Date.now() - this.__startTime) / 1000).toFixed(2);

            this.__spinner = null;
            this.__index = 0;

            process.stdout.write(`\r${binggo} ${msg} ${elapsed}s         \n\n`);
        }

        return this;
    }
}

module.exports = Loading;
