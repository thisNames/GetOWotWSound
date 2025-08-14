const { execSync } = require("node:child_process");
const os = require("node:os");
const readline = require("node:readline");
const crypto = require("node:crypto");

/**
 *  工具类
 *  @version 0.0.7
 */
class Tools
{
    constructor() { }

    /**
     *  生成文字注释
     *  @version 0.0.1
     *  @param {...*} args 文字
     *  @returns {String}
     */
    static comment(...args)
    {
        return args.join("\r\n\t");
    }

    /**
     *  判断是否是管理员权限运行命令
     *  @version 0.0.1
     *  @returns {Boolean} 是 true 或者不是 false
     */
    static isAdministrator()
    {
        const platform = os.platform();

        try
        {
            if (platform === "win32")
            {
                // Windows: 使用 "net session" 检查管理员权限
                execSync("net session", { stdio: "ignore" });
                return true;
            } else
            {
                // Unix/Linux/macOS: 检查 UID 是否为 0（root）
                return process.getuid && process.getuid() === 0;
            }
        } catch (error)
        {
            // 如果命令执行失败（如权限不足），返回 false
            return false;
        }
    }

    /**
     *  转换整数
     *  @version 0.0.1
     *  @param {String} value 参数字符串
     *  @param {Number} defaultValue 转换失败，使用此默认值
     *  @returns {Number}
     */
    static typeInt(value, defaultValue)
    {
        let _value = Number.parseInt(value);
        return Number.isFinite(_value) ? _value : defaultValue;
    }

    /**
     *  获取日期
     *  @version 0.0.1
     *  @param {String} split 分隔符 -
     *  @returns {String}
     */
    static getDate(split = "-")
    {
        const d = new Date();
        return "".concat(d.getFullYear(), split, d.getMonth() + 1, split, d.getDate());
    }

    /**
     *  获取实时日期时间
     *  @version 0.0.1
     *  @param {String} split 分隔符 -
     *  @returns {String}
     */
    static getRealTime(split = "-")
    {
        const date = new Date();
        const datetime = date.toLocaleDateString() + split + date.toLocaleTimeString();
        return datetime;
    }

    /**
     *  将字节(byte)转换为最合适的单位（KB、MB、GB）
     *  @version 0.0.3
     *  @param {number} bytes 字节数
     *  @returns {{value: number, type: "KB" | "MB" | "GB"}}
     *  @deprecated 请使用 class/new FormatNumber().formatBytes
     */
    static formatBytes(bytes)
    {
        if (typeof bytes !== "number" || bytes < 1) return { value: 0, type: "B" };

        const KB = 1024;
        const MB = KB * 1024;
        const GB = MB * 1024;

        let value, type;

        if (bytes < KB)
        {
            value = bytes;
            type = "B";
        } else if (bytes < MB)
        {
            value = bytes / KB;
            type = "KB";
        } else if (bytes < GB)
        {
            value = bytes / MB;
            type = "MB";
        } else
        {
            value = bytes / GB;
            type = "GB";
        }

        // 保留两位小数
        value = parseFloat(value.toFixed(2));

        return { value, type };
    }

    /**
     *  获取控制台输入
     *  @version 0.0.2
     *  @returns {Promise<String>}
     */
    static terminalInput()
    {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

        rl.prompt(true);

        return new Promise((res, rej) =>
        {
            // 监听第一行输入
            rl.once("line", input =>
            {
                res(input.trim());
                rl.close();
            });
            rl.on("close", () => rej(""));
        });
    }

    /**
     * 将字符串中的非法文件夹名字符剔除
     * @version 0.0.1
     * @param {String} [defaultName="untitled"] 如果结果为空，给个默认名字
     * @param {string} str 原始字符串
     * @returns {string}   可用于新建文件夹的安全名称
     */
    static sanitizeFolderName(str, defaultName = "untitled")
    {
        if (typeof str !== "string") return "";

        // 1. 定义非法字符集合（Windows + POSIX）
        //   Windows: <>:"/\|?*
        //   Linux/macOS: 主要是 "/" 和 "\0"，但为统一体验，也去掉 <>:|?*"
        const illegalChars = /[<>:"/\\|?*\x00-\x1f]/g;

        // 2. 去掉非法字符、首尾空格/句点
        let safe = str.replace(illegalChars, "").trim().replace(/^\.+|\.+$/g, ""); // 去掉首尾连续的句点

        // 3. 处理 Windows 保留名称（CON, PRN, AUX, NUL, COM1..9, LPT1..9 等）
        const reserved = /^(CON|PRN|AUX|NUL|COM\d|LPT\d)(\.|$)/i;
        if (reserved.test(safe))
        {
            safe = safe.replace(/^(.+)/, "_$1"); // 前面加下划线
        }

        // 4. 如果结果为空，给个默认名字
        if (!safe) safe = defaultName;

        return safe;
    }

    /**
     *  判断是合法的 url
     *  @version 0.0.1
     *  @param {String} url exp: https:127.0.0.1
     *  @returns {URL | null}
     */
    static validURL(url)
    {
        try
        {
            const origin = new URL(url);
            return origin;
        } catch (error)
        {
            return null;
        }
    }

    /**
     *  生成指定长度的哈希字符串 ID
     *  @version 0.0.1
     *  @param {Number} length 哈希字符串的长度
     *  @returns {String} 生成的哈希字符串
     */
    static generateHashId(length)
    {
        if (!Number.isInteger(length) || length <= 0)
        {
            length = 5;
        }

        const buffer = crypto.randomBytes((length + 1) >> 1); // 使用位运算优化 Math.ceil
        return buffer.toString("hex").substring(0, length); // substring 性能略优于 slice
    }

    /**
     *  查找数组中所有的重复值
     *  @version 0.0.1
     *  @param {Array<>} arr 需要查找重复值的数组
     *  @param {Function} value 返回指定比较的比较内容
     *  @param {boolean} all 是否返回所有的重复值，还是只返回其中一个。默认为 false，返回其中一个
     *  @returns {Array} 查找结果数组
     */
    static findDuplicates(arr, value, all = false)
    {
        const result = [];
        const seen = new Set();

        for (let index = 0; index < arr.length; index++)
        {
            const element = arr[index];
            let content = value(element, index, arr);

            if (seen.has(content))
            {
                result.push(element);

                if (!all) return result;
            }
            else
            {
                seen.add(content);
            }
        }

        return result
    }

    /**
     *  将数字转换为指定位数
     *  @version 0.0.2
     *  @param {number} num 数
     *  @param {Number} base 被除数
     *  @param {Array<String>} levels 层级
     *  @returns {{value: number, type: String}}
     *  @deprecated 请使用 class/new FormatNumber().formatNumber
     */
    static formatNumber(num, base, levels)
    {
        let value = 0, type = "";

        if (typeof num != "number" || typeof base != "number" || num < 1 || base < 1) return { value, type };

        for (let i = 0; i < levels.length; i++)
        {
            let l = levels[i];

            value = num;;
            type = l;

            if (num <= base) break;

            num = num / base;
        }

        // 保留两位小数
        value = parseFloat(value.toFixed(2));

        return { value, type };
    }

    /**
     *  将对象值进行键名映射，并返回新的 map 对象
     *  @version 0.0.1
     *  @param {object} obj obj
     *  @param {function} KeyCall 获取映射对象值的键名的回掉函数, key, value, index, obj
     *  @param {function} valueCall 获取映射对象值的值内容的回掉函数, key, value, index, obj
     *  @returns {Map<Object, Object>}
     */
    static objectFMap(obj, KeyCall, valueCall)
    {
        const map = new Map();
        let index = 0;

        for (const key in obj)
        {
            if (Object.prototype.hasOwnProperty.call(obj, key))
            {
                const value = obj[key];
                index++;
                map.set(KeyCall(key, value, index, obj), valueCall(key, value, index, obj));
            }
        }

        return map;
    }

    /**
     *  比较两个字符串是否相等
     *  @version 0.0.1
     *  @param {String} sa 比较的字符串 A
     *  @param {String} sb 比较的字符串 B
     *  @param {Boolean} [ignoreCase=false] 是否区分大小写
     *  @returns {Boolean}
     *  @deprecated 请使用 class/FormatString.equalString()
     */
    static equalString(sa, sb, ignoreCase = false)
    {
        let _sa = sa + "";
        let _sb = sb + "";

        if (ignoreCase) return _sa.toLowerCase().trim() == _sb.toLowerCase().trim();

        return _sa.trim() == _sb.trim();
    }
}

module.exports = Tools;
