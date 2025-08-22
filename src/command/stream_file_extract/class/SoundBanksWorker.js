const fs = require("node:fs");
const pt = require("node:path");

const Executor = require("../../../class/cp/Executor");
const ExecutorResult = require("../../../class/cp/ExecutorResult");

const StreamedFilesWorker = require("./StreamedFilesWorker");
const DefaultConfig = require("./DefaultConfig");
const DefaultOptions = require("./DefaultOptions");
const SoundBank = require("./SoundBank");

/**
 *  @description 处理路径函数返回值
 *  @typedef bnkHandlerPathResult
 *  @property {String} extract 提取 .bnk 的临时路径
 *  @property {String} oinput 源 .bnk 输入路径
 *  @property {String} tinput 临时 .bnk 输入路径
 *  @property {String} output 将 .bnk 提取出来的 .wem 目录路径
 */

/**
 *  SoundBanks 工作流
 */
class SoundBanksWorker extends StreamedFilesWorker
{
    static bnkExtractorName = "bnkExtractor";

    /**
     *  @param {DefaultConfig} config 配置项
     *  @param {DefaultOptions} options 可选项
     */
    constructor(config, options)
    {
        super(config, options);
    }

    /**
     *  处理 bnk 路径
     *  @param {SoundBank} sbk SoundBank 对象
     *  @returns {bnkHandlerPathResult}
     */
    bnkHandlerPath(sbk)
    {
        const result = { extract: "", oinput: "", tinput: "", output: "" };
        const extractPath = pt.join(this.options.tempPath, SoundBanksWorker.bnkExtractorName, sbk.GetBnkExtractPath());

        // 如果路径不存在，则创建路径 bnk 解压目录
        if (!fs.existsSync(extractPath)) fs.mkdirSync(extractPath, { recursive: true });

        result.extract = extractPath;
        result.oinput = pt.join(this.config.soundAssetsPath, sbk.Path);
        result.tinput = pt.join(extractPath, sbk.Path);
        result.output = pt.join(extractPath, sbk.GetBnkFileName());

        if (fs.existsSync(result.tinput) && fs.statSync(result.tinput).isFile()) return result;

        // 将源 .bnk 拷贝至 temp 目录
        fs.copyFileSync(result.oinput, result.tinput);

        return result;
    }

    /**
     *  提取一个 bnk 文件
     *  @param {bnkHandlerPathResult} bhp bnkHandlerPathResult 对象
     *  @returns {ExecutorResult}
     */
    extractor(bhp)
    {
        const bnkextr = new Executor({
            exe: this.config.bnkextr,
            params: [bhp.tinput]
        });

        return bnkextr.executorSync();
    }

    /**
     *  bnk 处理日志
     *  @param {String} is 标识索引
     *  @param {SoundBank} sbk StreamedFile 对象
     *  @param {ExecutorResult} extract 提取结果子进程输出
     *  @returns {void}
     */
    bnkLogger(is, sbk, extract)
    {
        const index = "[" + is + "] " + sbk.toString();
        const et = "bnkextr  " + index;

        // bnkextr 提取成功
        if (extract.done)
        {
            this.slr.light(et);
            this.smc.collect(et, extract.stdout || extract.command);

            this.counter.bnkExtractSuccess++;
        }
        else
        {
            this.flr.error(et);
            this.fmc.collect(et, extract.stderr || extract.errorMessage || extract.command);

            this.counter.bnkExtractFailed++;
        }
    }

    /**
     *  同步执行 提取 bnk 文件
     *  @param {Array<SoundBank>} listSoundBank 要处理的 SoundBank 数据集合
     *  @returns {void}
     */
    bnkExtractorSync(listSoundBank)
    {
        const pad = listSoundBank.length.toString().length;

        for (let i = 0; i < listSoundBank.length; i++)
        {
            const item = listSoundBank[i];
            const bhp = this.bnkHandlerPath(item);
            const result = this.extractor(bhp);

            // 日志记录
            this.bnkLogger((i + 1).toString().padStart(pad, "0"), item, result);

            // 同步执行
            this.executorSync(item.IncludedMemoryFiles, bhp.output);
        }

        this.counter.totalSoundBank += listSoundBank.length;
    }

    /**
     *  异步执行 提取 bnk 文件
     *  @param {Array<SoundBank>} listSoundBank 要处理的 SoundBank 数据集合
     *  @returns {Promise<void>}
     */
    async bnkExtractor(listSoundBank)
    {
        const pad = listSoundBank.length.toString().length;

        let current = 0;

        for (let i = 0; i < listSoundBank.length; i++)
        {
            const item = listSoundBank[i];
            const bhp = this.bnkHandlerPath(item);
            const result = this.extractor(bhp);
            current++;

            // 日志记录
            this.bnkLogger(current.toString().padStart(pad, "0"), item, result);

            await this.executor(item.IncludedMemoryFiles, bhp.output);
        }

        this.counter.totalSoundBank += listSoundBank.length;
    }
}

module.exports = SoundBanksWorker;
