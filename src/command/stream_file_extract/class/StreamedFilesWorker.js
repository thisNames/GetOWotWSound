const fs = require("node:fs");
const pt = require("node:path");

const Executor = require("../../../class/cp/Executor");
const ExecutorResult = require("../../../class/cp/ExecutorResult");
const LoggerSaver = require("../../../class/LoggerSaver");
const MessageCollect = require("../../../class/MessageCollect");

const StreamedFile = require("./StreamedFile");
const DefaultConfig = require("./DefaultConfig");
const DefaultOptions = require("./DefaultOptions");
const Utils = require("./Utils");
const Counter = require("./Counter");

/**
 *  @description 处理路径函数返回值
 *  @typedef handlerPathResult
 *  @property {String} input .wem 输入路径
 *  @property {String} w2output 将 .wem 转换成 ogg 临时路径
 *  @property {String} output 临时路径中的 ogg 通过 revorb 转换后的路径
 */

/**
 *  @description 转换结果返回值
 *  @typedef ConverterResult
 *  @property {ExecutorResult} w2gStdout ww2ogg 子进程输出
 *  @property {ExecutorResult} revStdout revorb 子进程输出
 */

/**
 *  StreamedFIles 工作流
 */
class StreamedFilesWorker
{
    /**
     *  @param {DefaultConfig} config 配置项
     *  @param {DefaultOptions} options 可选项
     */
    constructor(config, options)
    {
        /** @type {DefaultConfig} 配置项 */
        this.config = config;

        /** @type {DefaultOptions} 可选项 */
        this.options = options;

        /** @type {LoggerSaver} 成功日志*/
        this.slr = null;

        /** @type {LoggerSaver} 失败日志 */
        this.flr = null;

        /** @type {MessageCollect} 成功详情日志 */
        this.smc = null;

        /** @type {MessageCollect} 失败详情日志 */
        this.fmc = null;

        /** @type {Counter} 统计对象 */
        this.counter = new Counter();


        /** @type {Number} 预处理的总数 */
        this.__total = 0;

        /** @type {Number} 预处理的当前数 */
        this.__totalCurrent = 0;

        /** @type {Number} 对其长度 */
        this.__totalPad = 0;
    }

    /**
     *  预处理的总数
     *  @param {Number} value 数量
     *  @returns {void}
     */
    setPreTotal(value)
    {
        this.__total = value;
        this.__totalPad = this.__total.toString().length;
    }

    /**
     *  初始化
     *  @param {String} workerName 工作流名称
     *  @returns {void}
     */
    init(workerName)
    {
        // 检测工具
        if (!Utils.isExeLiteSync(this.config.ww2ogg)) throw new Error("Not found ww2ogg.exe");
        if (!Utils.isExeLiteSync(this.config.revorb)) throw new Error("Not found revorb.exe");
        if (!Utils.isExeLiteSync(this.config.bnkextr)) throw new Error("Not found bnkextr.exe");

        // 初始化目录
        this.options.outputPath = Utils.folderHandler(this.options.outputPath);
        this.options.logPath = Utils.folderHandler(this.options.logPath);
        this.options.tempPath = Utils.folderHandler(this.options.tempPath);

        // 新建目录
        if (!fs.existsSync(this.options.outputPath)) fs.mkdirSync(this.options.outputPath, { recursive: true });
        if (!fs.existsSync(this.options.logPath)) fs.mkdirSync(this.options.logPath, { recursive: true });
        if (!fs.existsSync(this.options.tempPath)) fs.mkdirSync(this.options.tempPath, { recursive: true });

        // 初始化日志记录器
        let wn = workerName.toLocaleLowerCase();
        let su = wn + "_success";
        let fa = wn + "_failed";
        let sd = "_stdout";

        this.slr = new LoggerSaver(su, this.options.logPath, true);
        this.flr = new LoggerSaver(fa, this.options.logPath, true);
        this.smc = new MessageCollect(su + sd, this.options.logPath);
        this.fmc = new MessageCollect(fa + sd, this.options.logPath);
    }

    /**
     *  处理日志
     *  @param {String} is 标识索引
     *  @param {StreamedFile} stf StreamedFile 对象
     *  @param {ConverterResult} converter 转换结果子进程输出
     *  @returns {void}
     */
    logger(is, stf, converter)
    {
        const index = "[" + is + "] " + stf.toString();
        const wt = "ww2ogg " + index;
        const rt = "\t->revorb " + index;

        // ww2ogg 成功
        if (converter.w2gStdout.done)
        {
            this.slr.success(wt);
            this.smc.collect(wt, converter.w2gStdout.stdout || converter.w2gStdout.command);

            this.counter.ww2oggSuccess++;
        }
        else
        {
            this.flr.error(wt);
            this.fmc.collect(wt, converter.w2gStdout.stderr || converter.w2gStdout.errorMessage || converter.w2gStdout.command);

            this.counter.ww2oggFailed++;
        }

        // revorb 成功
        if (converter.revStdout.done)
        {
            this.slr.prompt(rt);
            this.smc.collect(rt, converter.revStdout.stdout || converter.revStdout.command);

            this.counter.revorbSuccess++;
        }
        else
        {
            this.flr.error(rt);
            this.fmc.collect(rt, converter.revStdout.stderr || converter.revStdout.errorMessage || converter.revStdout.command);

            this.counter.revorbFiled++;
        }
    }

    /**
     *  处理路径
     *  @param {StreamedFile} stf 要处理的 StreamedFile 数据
     *  @param {String} bnkExtDir 表示是一个 bnk 文件，从解压的目录中那取文件
     *  @returns {handlerPathResult}
     */
    handlerPath(stf, bnkExtDir = "")
    {
        const result = { input: "", output: "", w2output: "" };

        let id = this.options.enableId ? stf.Id + "_" : "";
        let fname = stf.GetFileName();
        let type = this.options.enableCreateTypeDir ? stf.GetTypeName() : "";

        let oname = id + fname + this.options.extname;
        let odir = pt.join(this.options.outputPath, stf.Type, type);

        let tname = id + fname + ".w2g.temp";
        let tdir = pt.join(this.options.tempPath, stf.Type, type);

        // 创建输出目录
        if (!fs.existsSync(odir)) fs.mkdirSync(odir, { recursive: true });
        // 创建临时目录
        if (!fs.existsSync(tdir)) fs.mkdirSync(tdir, { recursive: true });

        // 输入路径
        const nid = stf.GetIdForName();
        const ifname = pt.join(this.config.soundAssetsPath, nid);

        // 游戏目录存在直接那 | 从解压目录中拿
        result.input = fs.existsSync(ifname) ? ifname : pt.join(bnkExtDir, nid);
        result.output = pt.join(odir, oname);
        result.w2output = pt.join(tdir, tname);

        return result;
    }

    /**
     *  wem 同步转换
     *  @param {StreamedFile} stf 要处理的 StreamedFile 数据
     *  @param {String} bnkExtDir 表示是一个 bnk 文件，从解压的目录中那取文件
     *  @returns {ConverterResult}
     */
    converterSync(stf, bnkExtDir = "")
    {
        const result = { w2gStdout: {}, revStdout: {} };
        const hp = this.handlerPath(stf, bnkExtDir);

        const w2g = new Executor({
            exe: this.config.ww2ogg,
            params: ["--pcb", this.config.www2oggPacked, hp.input, "-o", hp.w2output]
        });

        const rev = new Executor({
            exe: this.config.revorb,
            params: [hp.w2output, hp.output]
        });

        // 执行
        result.w2gStdout = w2g.executorSync();
        result.revStdout = result.w2gStdout.done ? rev.executorSync() : new ExecutorResult({ done: false, errorMessage: "sync ww2ogg failed" });

        return result;
    }

    /**
     *  wem 异步转换
     *  @param {StreamedFile} stf 要处理的 StreamedFile 数据
     *  @param {String} bnkExtDir 表示是一个 bnk 文件，从解压的目录中那取文件
     *  @returns {Promise<ConverterResult>}
     */
    async converter(stf, bnkExtDir = "")
    {
        const result = { w2gStdout: {}, revStdout: {} };
        const hp = this.handlerPath(stf, bnkExtDir);

        const w2g = new Executor({
            exe: this.config.ww2ogg,
            params: ["--pcb", this.config.www2oggPacked, hp.input, "-o", hp.w2output]
        });

        const rev = new Executor({
            exe: this.config.revorb,
            params: [hp.w2output, hp.output]
        });

        result.w2gStdout = await w2g.executor();
        result.revStdout = result.w2gStdout.done ? await rev.executor() : new ExecutorResult({ done: false, errorMessage: "async ww2ogg failed" });

        return Promise.resolve(result);
    }

    /**
     *  同步执行
     *  @param {Array<StreamedFile>} listStreamedFile 要处理的 StreamedFile 数据集合
     *  @param {String} bnkExtDir 表示是一个 bnk 文件，从解压的目录中那取文件
     *  @returns {void}
     */
    executorSync(listStreamedFile, bnkExtDir = "")
    {
        const pad = listStreamedFile.length.toString().length;
        let current = 0;

        // 执行
        for (let i = 0; i < listStreamedFile.length; i++)
        {
            const item = listStreamedFile[i];
            const result = this.converterSync(item, bnkExtDir);

            current++;
            this.__totalCurrent++;

            // 记录日志
            let is = `[${this.__totalCurrent.toString().padStart(this.__totalPad, "0")}/${this.__total}][${current.toString().padStart(pad, "0")}]`;
            this.logger(is, item, result);
        }

        this.counter.totalStreamedFile += listStreamedFile.length;
    }

    /**
     *  异步执行
     *  @param {Array<StreamedFile>} listStreamedFile 要处理的 StreamedFile 数据集合
     *  @param {String} bnkExtDir 表示是一个 bnk 文件，从解压的目录中那取文件
     *  @returns {Promise<void>}
     */
    async executor(listStreamedFile, bnkExtDir = "")
    {
        /** @type {Array<Promise<{index: Number, stf: StreamedFile, result: ConverterResult}>>} 异步队列 */
        const asyncQueue = new Array(this.options.asyncNumber).fill(null);
        const pad = listStreamedFile.length.toString().length;
        let current = 0;

        // 主队列
        for (let i = 0; i < listStreamedFile.length; i++)
        {
            const item = listStreamedFile[i];
            let index = asyncQueue.indexOf(null);

            // 判断还有没有位置
            if (index < 0)
            {
                const result = await Promise.race(asyncQueue);
                asyncQueue[result.index] = null;
                index = result.index;

                current++;
                this.__totalCurrent++;

                // 记录日志
                let is = `[${this.__totalCurrent.toString().padStart(this.__totalPad, "0")}/${this.__total}][${current.toString().padStart(pad, "0")}]`;
                this.logger(is, result.stf, result.result);
            }

            const asyncItem = this.converter(item, bnkExtDir).then(crt => ({ index: index, stf: item, result: crt }));
            asyncQueue[index] = asyncItem;
        }

        // 尾队列
        const reset = asyncQueue.filter(item => item);
        const tails = await Promise.all(reset);
        for (let i = 0; i < tails.length; i++)
        {
            const result = tails[i];

            current++;
            this.__totalCurrent++;

            let is = `[${this.__totalCurrent.toString().padStart(this.__totalPad, "0")}/${this.__total}][${current.toString().padStart(pad, "0")}]`;
            this.logger(is, result.stf, result.result);
        }

        this.counter.totalStreamedFile += listStreamedFile.length;
    }

    /**
     *  关闭日志流
     *  @returns {void}
     */
    loggerEnd()
    {
        this.slr.close();
        this.flr.close();
        this.smc.close();
        this.fmc.close();
    }
}

module.exports = StreamedFilesWorker;
