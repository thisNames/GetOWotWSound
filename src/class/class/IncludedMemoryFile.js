const Config = require("../model/Config");
const SoundBank = require("../model/SoundBank");
const FileItem = require("../lib/FileItems");

const fs = require("node:fs");
const pt = require("node:path");

/**
 *  处理 SoundBanks 里的 SoundBank 类（内存）
 *  @example
 *  new 一个 IncludedMemoryFile 来处理一个 SoundBank
 *  本质是处理 SoundBank 里面的 IncludedMemoryFiles
 */
class IncludedMemoryFile extends FileItem
{
    /**
     * @param {Config} config
     * @param {SoundBank} SoundBank
     */
    constructor(config, SoundBank)
    {
        super(config, SoundBank);
        this.SoundBank = SoundBank;

        const folderName = "".concat(this.config.id ? this.SoundBank.Id + "_" : "", this.SoundBank.ShortName, "_wem");

        /**
         * bnk 文件解压后生成得路径
         */
        this.ShortNamePath = pt.resolve(this.config.buildPath, "bnk_wem_source", folderName);

        this.linkPath(this.ShortNamePath);
    }

    /**
     * 生成文件（同步）包含生成
     * @param {Array<String>} wemFilePathList wem 文件集合
     * @param {Function} next 回调，每一次执行
     * @example
     * next 
     *  回调，每一次执行（ww2ogg.exe 执行）
     *  形参：Object
     *      cmd         执行的命令
     *      buffer      执行的输出日志 Buffer（如果 error，就是 null）
     *      done        成功时为 true
     *      source      源路径
     *      target      目标路径
     * 返回值：
     *      如果为 false，则直接结束循环
     */
    buildSync(wemFilePathList, next)
    {
        for (let i = 0; i < this.SoundBank.IncludedMemoryFiles.length; i++)
        {
            const audioItem = this.SoundBank.IncludedMemoryFiles[i];
            const source = wemFilePathList[i];

            if (source === undefined) break;

            const ori1 = this.installOriAndSeri(audioItem, source);

            const res = this.ww2ogg.runSync(ori1.source, ori1.target);

            const save = { ...res, ...ori1 };

            res.done ? this.buildSyncScAudioItems.push(save) : this.buildSyncFaAudioItems.push(save);

            if (typeof next != "function") continue;
            if (!next(save))
                break;
        }
    }

    /**
     * 解压 bnk 到 wem（同步）
     * @returns { {wemFilePathList: Array<String>, complete: Object} }
     * @description
     * 1. 使用 bnkextr.exe 解压 bnk，将解压出来的 wem 文件保存至 ShortNamePath 目录中
     * 2. 将 wem 文件收集至数组，按照 sort 排序
     * @example
     * ------------------------------------------------------------------------
     *  wemFilePathList：wem 文件路径集合
     * 
     *  complete：Object
     *      cmd         执行的命令
     *      buffer      执行的输出日志 Buffer（如果 error，就是 null）
     *      done        成功时为 true
     *      source      源路径 bnk 文件
     *      target      目标路径 解压后 wem 的保存目录
     */
    buildBnkToWemSync()
    {
        this.bnkextr.WorkSpace = this.ShortNamePath;

        // 解压 bnk 文件
        const bnkSource = pt.resolve(this.config.soundAssetsPath, this.SoundBank.Path);

        const bnkextr = this.bnkextr.runSync(bnkSource);

        //  排序文件
        const wemFilePathList = this.#sortWemFiles();

        const complete = { ...bnkextr, target: this.ShortNamePath, source: bnkSource }

        return { wemFilePathList, complete };
    }

    /**
    * 解压 bnk 到 wem（异步）
    * @returns {Promise< {wemFilePathList: Array<String>, complete: Object} >} wem 文件路径集合
    * @description 虽然是异步，但是和同步差不多。因为必须的先有 bnk 解压后的 wem 文件，才能执行 build
    * @deprecated 使用同步 buildBnkToWemSync + 多进程
    * 1. 使用 bnkextr.exe 解压 bnk，将解压出来的 wem 文件保存至 ShortNamePath 目录中
    * 2. 将 wem 文件收集至数组，按照 sort 排序
    * 3. 返回一个 wem 文件路径集合
    * @example
    * ------------------------------------------------------------------------
    * Promise<Object>
    *  wemFilePathList：wem 文件路径集合
    * 
    *  complete：Object
    *      cmd         执行的命令
    *      buffer      执行的输出日志 String（如果 error，就是 error.message）
    *      done        成功时为 true
    *      pid         进程 pid
    *      source      源路径 bnk 文件
    *      target      目标路径 解压后 wem 的保存目录
    */
    buildBnkToWem()
    {
        return new Promise(res =>
        {
            this.bnkextr.WorkSpace = this.ShortNamePath;

            // 解压 bnk 文件
            const bnkSource = pt.resolve(this.config.soundAssetsPath, this.SoundBank.Path);

            this.bnkextr.run(bnkSource).then(value =>
            {
                //  排序文件
                const wemFilePathList = this.#sortWemFiles();
                const complete = { ...value, target: this.ShortNamePath, source: bnkSource }
                res({ wemFilePathList, complete });
            });
        });
    }

    /**
    * 排序文件
    * @returns {Array<String>}
    */
    #sortWemFiles()
    {
        //  排序文件
        const dirs = fs.readdirSync(this.ShortNamePath).sort((a, b) =>
        {
            const aIndex_temp = Number.parseInt(a.split(".").shift());
            const bIndex_temp = Number.parseInt(b.split(".").shift());
            const aIndex = Number.isNaN(aIndex_temp) ? 0 : aIndex_temp;
            const bIndex = Number.isNaN(bIndex_temp) ? 0 : bIndex_temp;
            return aIndex - bIndex;
        }).map(d => pt.resolve(this.ShortNamePath, d)); // 映射成绝对路径
        return dirs;
    }
}

module.exports = IncludedMemoryFile;