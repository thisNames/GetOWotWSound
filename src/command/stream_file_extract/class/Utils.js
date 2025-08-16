const fs = require("node:fs");
const pt = require("node:path");

const Tools = require("../../../class/Tools");
const StreamedFile = require("./StreamedFile");
const SoundBank = require("./SoundBank");

/**
 *  工具类
 */
class Utils
{
    constructor() { }

    /**
     *  获取项目的根路径
     *  @returns {String} path
     */
    static getProjectRoot()
    {
        const dirname = process.argv[1] || process.cwd();
        return pt.dirname(dirname + "");
    }

    /**
     *  获取项目的资源目录路径
     *  @returns {String} path
     */
    static getResourcePath()
    {
        return pt.join(Utils.getProjectRoot(), "resource");
    }

    /**
     *  获取缓存 json 文件目录路径
     *  @param {String}  name 缓存文件名称
     *  @param {String}  defaultPath 如果没用则返回默认路径 
     *  @returns {{cache: Boolean, path: String}} {cache, path}
     */
    static getCacheSoundBnkInfoJsonPath(name, defaultPath)
    {
        name = (name + "").trim();
        defaultPath = (defaultPath + "").trim();

        const path = pt.join(Utils.getResourcePath(), "cache", name);

        // 返回缓存文件路径
        if (fs.existsSync(path) && fs.statSync(path).isFile()) return { cache: true, path: path };

        return { cache: false, path: defaultPath };
    }

    /**
     *  处理路径目录
     *  @param {String} value 路径名称
     */
    static folderHandler(value)
    {
        // 是否是绝对路径
        let path = pt.isAbsolute(value) ? value : pt.join(process.cwd(), value);
        let isExist = fs.existsSync(path);

        // 存在是目录
        if (isExist && fs.statSync(path).isDirectory()) return path;

        // 路径被占用了
        if (isExist && !fs.statSync(path).isDirectory())
        {
            path = path + "_" + Tools.generateHashId(16);
        }

        return path;
    }

    /**
     *  创建 StreamedFiles 数据结构
     *  @param {Array<StreamedFile>} listStreamedFile listStreamedFile
     *  @returns {Object}
     */
    static createStreamedFilesStruct(listStreamedFile)
    {
        return {
            SoundBanksInfo: {
                StreamedFiles: listStreamedFile
            }
        };
    }

    /**
     *  创建 SoundBanks 数据结构
     *  @param {Array<SoundBank>} listSoundBank listSoundBank
     *  @returns {Object}
     */
    static createSoundBanksStruct(listSoundBank)
    {
        return {
            SoundBanksInfo: {
                SoundBanks: listSoundBank
            }
        };
    }

    /**
     *  创建 SoundBnkInfo 数据结构
     *  @param {Array<StreamedFile>} listStreamedFile listStreamedFile
     *  @param {Array<SoundBank>} listSoundBank listSoundBank
     *  @returns {Object}
     */
    static createSoundBnkInfoStruct(listStreamedFile, listSoundBank)
    {
        return {
            SoundBanksInfo: {
                StreamedFiles: listStreamedFile,
                SoundBanks: listSoundBank
            }
        };
    }

    /**
     *  处理指令值
     *  @param {String} inst 指令
     *  @param {String} splitSymbol 分隔符号
     *  @returns {Number}
     */
    static instruction(inst, splitSymbol = " ")
    {
        let [key, value = 0] = (inst + "").split(splitSymbol + "", 2);

        value = Number.parseInt(value, 10);

        if (Number.isFinite(value)) return value;

        return 0;
    }
}

module.exports = Utils;
