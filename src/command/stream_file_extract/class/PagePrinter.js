const Logger = require("../../../class/Logger");
const Tools = require("../../../class/Tools");

const StreamedFile = require("./StreamedFile");
const Utils = require("./Utils");

/**
 *  每一行的打印回调
 *  @callback LineCallBack
 *  @param {StreamedFile} value streamedFile 对象
 *  @param {Number} index 索引
 *  @returns {void}
 */

/**
 *  分页打印
 */
class PagePrinter
{
    /**
     *  @param {Array<StreamedFile} [listStreamedFile=[]] listStreamedFile 数据集
     *  @param {Number} [lineSize=1] 每条数据占用几行，例如一条数据占两行，那么应传入 2，必须 大于 0
     */
    constructor(listStreamedFile = [], lineSize = 1)
    {
        /** @type {Array<StreamedFile} 数据集 */
        this.listStreamedFile = listStreamedFile;

        /** @type {Number} 当前页 */
        this.currentPage = 0;

        /** @type {Number} 每页数量 */
        this.pageSize = Math.max(Math.ceil(process.stdout.rows / (lineSize + 1)), 1);

        /** @type {Number} 总页数 */
        this.totalPage = Math.ceil(this.listStreamedFile.length / this.pageSize);

        /** @type {{ pre: String, next: String, tp: String, quit: String}} 快捷键绑定 */
        this.keyBinds = { pre: "w", next: "s", tp: "tp", quit: "q" };

        /** @type {String} 提示行 */
        this.promptLine = "w - 上一页，s - 下一页，tp n 跳转页，q - 退出，回车确认";


        /** @type {Boolean} 是否继续执行 */
        this.__continue = true;
    }

    /**
     *  打印区间
     *  @param {Number} index 起始索引
     *  @param {Number} endIndex 终止索引
     *  @param {LineCallBack} lineCallBack 每一行的打印回调
     *  @returns {void}
     */
    printerInterval(index, endIndex, lineCallBack)
    {
        for (let i = index; i < endIndex; i++)
        {
            if (i > this.listStreamedFile.length - 1) break;

            const item = this.listStreamedFile[i];

            lineCallBack(item, i);
        }
    }

    /**
     *  上一页
     *  @param {String} input 输入
     *  @returns {void}
     */
    perPage(input)
    {
        if (this.currentPage > 0)
        {
            this.currentPage--;
            return;
        }

        Logger.warn("已经是第一页了，不要在翻啦");
    }

    /**
     *  下一页
     *  @param {String} input 输入
     *  @returns {void}
     */
    nextPage(input)
    {
        if (this.currentPage < this.totalPage - 1)
        {
            this.currentPage++;
            return;
        }

        Logger.warn("已经是最后一页了，不要在翻啦");
    }

    /**
     *  跳转页
     *  @param {String} input 输入
     *  @returns {void}
     */
    tpPage(input)
    {
        let tpValue = Utils.instruction(input) - 1;
        this.currentPage = Math.min(this.totalPage - 1, Math.max(0, tpValue));
    }

    /**
     *  退出
     *  @param {String} input 输入
     *  @returns {void}
     */
    quit(input)
    {
        this.__continue = false;

        Logger.warn("退出", input);
    }

    /**
     *  未知输入
     *  @param {String} input 输入
     *  @returns {void}
     */
    unknown(input)
    {
        Logger.warn("无效输入", input);
    }

    /**
     *  @param {String} input 检测输入
     *  @returns {void}
     */
    __onKeyboardInput(input)
    {
        // 指令输入
        if (input.startsWith(this.keyBinds.tp)) return this.tpPage(input);

        // 正常输入
        switch (input)
        {
            case this.keyBinds.pre:
                this.perPage(input);
                break;
            case this.keyBinds.next:
                this.nextPage(input);
                break;
            case this.keyBinds.quit:
            case "":
                this.quit(input);
                break;
            default:
                this.unknown(input);
                break;
        }
    }

    /**
     * 分页打印
     * @param {LineCallBack} lineCallBack 每一行的打印回调
     * @returns {Promise<void>}
     */
    async printer(lineCallBack)
    {
        // 显示
        while (this.__continue)
        {
            let index = this.currentPage * this.pageSize;
            let endIndex = index + this.pageSize;

            // 打印区间
            this.printerInterval(index, endIndex, lineCallBack);

            // 提示
            Logger.info(`${this.promptLine} ${this.currentPage + 1}/${this.totalPage} p${this.pageSize} ${this.listStreamedFile.length}`);

            // 检测输入
            const input = await Tools.terminalInput().catch(m => m + "");

            this.__onKeyboardInput(input.toLocaleLowerCase());
        }
    }
}

module.exports = PagePrinter;
