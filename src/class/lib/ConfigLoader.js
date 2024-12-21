// 加载配置文件
const { readFileSync, existsSync, mkdirSync } = require("node:fs");
const pt = require("node:path");

/**
 *  配置加载类
 */
class ConfigLoader
{
    #count = 0;
    #config = {};
    /**
     * @param {String} path 配置文件的路径
     */
    constructor(name, path)
    {
        this.name = name;
        this.path = this.toAbsPath(path);
        this.#loadConfig();
    }

    /**
     * 加载配置
     * @description 会触发 'config-loader' 事件，参数：加载的配置数量
     */
    #loadConfig()
    {
        const str = readFileSync(this.path, { encoding: "utf-8" });
        const lines = str.split("\n").map(t => t.trim()).filter(t => t);
        for (let line of lines)
        {
            if (line.startsWith("#")) continue;
            const [key, value] = line.split("=").map(t => t.trim());
            this.#config[key] = value;
        }
        this.#count = Object.keys(this.#config).length;
    }

    /**
    * 检测 key
    * @param {String} key key
    * @returns {String} 
    */
    checkKey(key)
    {
        if (this.#config[key] === undefined || this.#config[key] === "")
            throw new Error(`${this.name}: ${key} is not define`);
        return this.#config[key];
    }

    /**
     * 检测 bool
     * @param {Object} obj o
     * @param {String} key key
     * @returns {Boolean}
     */
    checkBool(key)
    {
        const v = this.checkKey(key);
        if (v === "true")
            return true;
        if (v === "false")
            return false;
        throw new Error(`${this.name}: ${key} type error, value must is boolean`);
    }

    /**
     * 检测 number
     * @param {Object} obj o
     * @param {String} key key
     * @returns {Number}
     */
    checkNumber(key)
    {
        const v = this.checkKey(key);
        const n = Number.parseInt(v);
        if (Number.isNaN(n))
            throw new Error(`${this.name}: ${key} type error, value must is number`);
        return n;
    }

    /**
     *  返回解析之后的配置对象
     * @returns {Object}
     */
    getConfig()
    {
        return this.#config;
    }

    /**
     * 返回加载的配置数量
     * @returns {Number}
     */
    getCount()
    {
        return this.#count;
    }

    /**
     * 获取带索引的配置
     * @param {String} key key
     * @param {boolean} before 是否是前索引 默认 false
     * @returns {Array<String>} 用户数组
     */
    listItems(key, before = false)
    {
        const list = [];
        const len = this.#count;
        let __key = null;
        for (let i = 0; i < len; i++)
        {
            __key = before ? i + key : key + i;
            const user = this.#config[__key];
            if (user === undefined) continue;
            list.push(user);
        }
        return list;
    }

    /**
     * 转换成绝对路径
     * @param {String}  path    路径
     * @param {Boolean} isCreate  如果为 true 则创建此目录，否则路径不存在则抛出异常
     * @returns 
     */
    toAbsPath(path, isCreate)
    {
        const abs = pt.resolve(("./", path));

        if (existsSync(abs))
            return abs;

        if (isCreate)
        {
            return mkdirSync(abs, { recursive: true });
        }
        else
        {
            throw new Error(`${this.name}: path error: ${abs} is not found`);
        }
    }
}

module.exports = ConfigLoader;