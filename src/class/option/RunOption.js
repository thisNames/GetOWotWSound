/**
 * 运行默认参数对象类
 */
class RunOption
{
    /**
     * @param {Number | 'ori'} executer 执行次数
     * @param {Number | 'ori'} task 任务数量
     */
    constructor(executer = "ori", task = "ori")
    {
        /** @type {Number | 'ori'} 运行次数，控制 next 方法 */
        this.executer = executer;

        /** @type {Number | 'ori'} task 开启次数，控制 next 方法 */
        this.task = task;
    }
}

module.exports = RunOption;