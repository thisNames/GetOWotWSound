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
        let indexPath = process.argv[1];

        if (indexPath) return pt.dirname(indexPath);

        return process.cwd();
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

    /**
     *  为对象中每个 key 格式化
     *  @param {Object} obj 
     *  @param {"l" | "r"} alignment 对齐方式 left, right
     *  @param {String} spaceStr 空字符内容
     *  @returns {Array< {key: String, fKey: String, value: Object} >}
     */
    static formatOutputObject(obj, alignment = "l", spaceStr = " ")
    {
        let len = 0;
        let keys = Object.keys(obj);
        let result = [];

        keys.forEach(key =>
        {
            if (len < key.length) len = key.length;
        });

        keys.forEach(key =>
        {
            let value = Reflect.get(obj, key);
            let fKey = null;

            fKey = alignment == "l" ? key.padEnd(len, spaceStr) : key.padStart(len, spaceStr);

            result.push({ key: key, fKey: fKey, value: value });
        });

        return result;
    }

    /**
     *  去掉首尾空字符
     *  @param {String} str 字符串
     *  @returns {String}
     */
    static trim(str)
    {
        return (str + "").trim();
    }

    /**
     *  检测是否是一个可执行问价
     *  @param {String} path 路径
     *  @returns {Boolean} 是否存在
     */
    static isExeLiteSync(filePath)
    {
        if (!fs.existsSync(filePath)) return false;
        if (!fs.statSync(filePath).isFile()) return false;

        try
        {
            const fd = fs.openSync(filePath, "r");
            const buf = Buffer.alloc(2);

            fs.readSync(fd, buf, 0, 2, 0);
            fs.closeSync(fd);

            return buf[0] === 0x4D && buf[1] === 0x5A;
        } catch
        {
            return false;
        }
    }

    /**
     *  计算文件大小
     *  @param {String} filename 文件路径
     *  @returns {String}
     */
    static filesize(filename)
    {
        if (fs.existsSync(filename) && fs.statSync(filename).isFile())
        {
            const size = Tools.formatBytes(fs.statSync(filename).size);
            return size.value + size.type;
        }

        return "0";
    }
}

module.exports = Utils;
