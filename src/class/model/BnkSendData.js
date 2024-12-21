const SoundBank = require("./SoundBank");
const RunOption = require("../option/RunOption");
/**
 * 向 bnk  子进程发送的数据对象类
 */
class BnkSendData extends RunOption
{
    /**
     * @param {Number} bnkTotal bnk 文件总数
     * @param {SoundBank} SoundBank SoundBank 对象
     * @param {Number} index 当前是第几个 bnk 文件
     * @param {Number | 'ori'} executer 运行次数，控制 next 方法
     */
    constructor(bnkTotal, SoundBank, index, executer)
    {
        super(executer);
        this.bnkTotal = bnkTotal;
        this.bnkTotalLength = this.bnkTotal.toFixed().length;
        this.SoundBank = SoundBank;
        this.index = index;
    }
}

module.exports = BnkSendData;