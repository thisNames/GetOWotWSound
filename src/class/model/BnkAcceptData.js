/**
 * bnk 子进程发送的数据对象类
 */
class BnkAcceptData
{
    /**
     * @param {Number} wemTotal  wem 文件总数
     * @param {Number} wemToOggSuccess wem to ogg 成功的
     */
    constructor(wemTotal, wemToOggSuccess)
    {
        this.wemTotal = wemTotal;
        this.wemToOggSuccess = wemToOggSuccess;
    }
}

module.exports = BnkAcceptData;