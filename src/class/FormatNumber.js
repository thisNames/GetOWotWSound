/**
 *  转换数字单位，转换为更合适的单位
 *  适合频繁转换数字（例如字节数等）
 *  @version 0.0.4
 */
class formatNumber
{
    /**
     *  @param {number} num 数
     *  @param {Number} base 被除数
     *  @param {Array<String>} levels 层级
     */
    constructor(num = 0, base = 1, levels = [])
    {
        this.num = num || 0;
        this.base = base || 0;
        this.levels = levels || [];

        // 字节大小
        this.__KB = 1024;
        this.__MB = this.__KB * 1024;
        this.__GB = this.__MB * 1024;

        // 时间大小
        this.__ms = 1000;
        this.__s = this.__ms * 60;
        this.__m = this.__s * 60;
    }

    /**
     *  将字节(byte)转换为最合适的单位（KB、MB、GB）
     *  @param {number} bytes 字节数
     *  @param {number} [toFixed=2] 保留几位小数 - 2
     *  @returns {{value: number, type: "KB" | "MB" | "GB"}}
     */
    formatBytes(bytes, toFixed = 2)
    {
        let type = { value: 0, type: "B" };

        if (!Number.isFinite(bytes) || bytes < 1) return type;

        if (bytes < this.__KB)
        {
            type.value = bytes;
            type.type = "B";
        } else if (bytes < this.__MB)
        {
            type.value = bytes / this.__KB;
            type.type = "KB";
        } else if (bytes < this.__GB)
        {
            type.value = bytes / this.__MB;
            type.type = "MB";
        } else
        {
            type.value = bytes / this.__GB;
            type.type = "GB";
        }

        // 保留两位小数
        type.value = parseFloat(type.value.toFixed(toFixed));

        return type;
    }

    /**
     *  将数字转换为指定位数
     *  @param {number} num 数字
     *  @param {number} [toFixed=2] 保留几位小数 - 2
     *  @returns {{value: number, type: String}}
     */
    formatNumber(num, toFixed = 2)
    {
        this.num = num;
        let type = { value: 0, type: "B" };

        if (!Number.isFinite(this.num) || !Number.isFinite(this.base) || this.num < 1 || this.base < 1) return type;

        for (let i = 0; i < this.levels.length; i++)
        {
            let l = this.levels[i];

            type.value = this.num;;
            type.type = l;

            if (this.num <= this.base) break;

            this.num = this.num / this.base;
        }

        // 保留两位小数
        type.value = parseFloat(type.value.toFixed(toFixed));

        return type;
    }

    /**
     *  将时间毫秒转换为时间（ms、s、m）
     *  @param {number} millisecond 毫秒
     *  @param {number} [toFixed=2] 保留几位小数 - 2
     */
    formatTimeMinute(millisecond, toFixed = 2)
    {
        let type = { value: 0, type: "" };

        if (!Number.isFinite(millisecond) || millisecond < 1) return type;

        if (millisecond < this.__ms)
        {
            type.value = millisecond;
            type.type = "ms";
        }
        else if (millisecond < this.__s)
        {
            type.value = millisecond / this.__ms;
            type.type = "s";
        }
        else
        {
            type.value = millisecond / this.__s;
            type.type = "m";
        }

        type.value = Number.parseFloat(type.value.toFixed(toFixed));

        return type;
    }
}

module.exports = formatNumber;
