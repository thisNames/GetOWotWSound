/**
 * 校验对象数据
 * @description 校验对象中的 key 是否存在 和 value 类型是否正确
 */
class Verify
{
    static name = "verify";

    constructor()
    {

    }

    /**
     * 检测 key
     * @param {String} key 对象的 key
     * @param {Object} obj 需要校验的数据（对象 |  基本数据类型）
     * @returns {String}
     */
    static checkKey(obj, key = "")
    {
        const value = typeof obj === "object" ? obj[key] : obj;
        if (value === null || value === undefined)
            throw new Error(`${Verify.name}: ${key} value is not define`);
        return value;
    }

    /**
     * 检测 bool
     * @param {String} key key
     * @param {Object} obj o
     * @returns {Boolean}
     */
    static checkBool(obj, key = "")
    {
        const v = Verify.checkKey(obj, key);

        if (v === "true")
            return true;
        if (v === "false")
            return false;

        throw new Error(`${Verify.name}: ${key} type error, value must is boolean (true or false)`);
    }

    /**
     * 检测 number
     * @param {Object} obj o
     * @param {String} key key
     * @param {Boolean} isZero 是否允许 0（默认不允许）
     * @returns {Number}
     */
    static checkNumber(obj, key, isZero = false)
    {
        const v = Verify.checkKey(obj, key);
        const n = Number.parseInt(v);
        if (Number.isNaN(n))
            throw new Error(`${Verify.name}: ${key} type error, value must is number (n>0)`);

        if (!isZero && n == 0)
            throw new Error(`${Verify.name}: ${key} value is this zero?`);

        return Math.abs(n);
    }
}

module.exports = Verify;