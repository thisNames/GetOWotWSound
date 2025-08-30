const fs = require("node:fs");

const FormatNumber = require("../../../class/FormatNumber");

const StreamedFile = require("./StreamedFile");

/**
 *  @description 保存返回
 *  @typedef SaverResult
 *  @property {String} size 大小
 *  @property {String} path 保存路径
 */

/**
 *  保存类工具类
 */
class SaverUtils
{
    constructor() { }

    /**
     *  将 StreamedFile 列表保存为 Json 文件
     *  @param {Array<StreamedFile>} listStreamedFile StreamedFile 对象集合
     *  @param {String} saverPath 保存路径
     *  @returns {SaverResult}
     *  @throws {Error} 保存失败
     */
    static saverLSFJson(listStreamedFile, saverPath)
    {
        // 空集合
        if (listStreamedFile.length < 1) return { size: "0", path: "" };

        const data = JSON.stringify(listStreamedFile);
        const size = new FormatNumber().formatBytes(Buffer.byteLength(data, "binary"));

        fs.writeFileSync(saverPath, data, { encoding: "binary", flag: "w" });

        return { size: size.value + size.type, path: saverPath };
    }

    /**
     *  将 StreamedFile 列表保存为 log 文件
     *  @param {Array<StreamedFile>} listStreamedFile StreamedFile 对象集合
     *  @param {String} saverPath 保存路径
     *  @param {(value: StreamedFile, index: Number, arr: Array<StreamedFile>) => String} dcb 写入的内容回调
     *  @returns {SaverResult}
     *  @throws {Error} 保存失败
     */
    static saverLSFLog(listStreamedFile, saverPath, dcb)
    {
        // 空集合
        if (listStreamedFile.length < 1) return { size: "0", path: "" };

        let bytes = 0;

        const fd = fs.openSync(saverPath, "w");

        // 写入内容
        for (let i = 0; i < listStreamedFile.length; i++)
        {
            const item = listStreamedFile[i];
            const data = dcb(item, i, listStreamedFile) + "\r\n";

            bytes += Buffer.byteLength(data, "binary");
            fs.writeSync(fd, data, null, "utf-8");
        }

        fs.closeSync(fd);

        let size = new FormatNumber().formatBytes(bytes);

        return { size: size.value + size.type, path: saverPath };
    }

    /**
     *  将 StreamedFile 列表保存为 csv 文件
     *  @param {Array<StreamedFile>} listStreamedFile StreamedFile 对象集合
     *  @param {String} saverPath 保存路径
     *  @returns {SaverResult}
     *  @throws {Error} 保存失败
     */
    static saverLSFCsv(listStreamedFile, saverPath)
    {
        // 空集合
        if (listStreamedFile.length < 1) return { size: "0", path: "" };

        let bytes = 0;

        const keys = Object.keys(listStreamedFile[0]);
        const keysLen = keys.length - 1;
        const fd = fs.openSync(saverPath, "w");

        // 写入表头
        const tableTitle = keys.join(",") + "\r\n";
        bytes += Buffer.byteLength(tableTitle, "binary");
        fs.writeSync(fd, tableTitle, null, "utf-8");

        // 写入内容
        for (let i = 0; i < listStreamedFile.length; i++)
        {
            const item = listStreamedFile[i];

            for (let j = 0; j < keys.length; j++)
            {
                const value = item[keys[j]];
                const data = `"${value}"` + (j < keysLen ? "," : "\r\n");
                bytes += Buffer.byteLength(data, "binary");
                fs.writeSync(fd, data, null, "utf-8");
            }
        }

        fs.closeSync(fd);

        let size = new FormatNumber().formatBytes(bytes);

        return { size: size.value + size.type, path: saverPath };
    }

    /**
     *  将对象保存只 json 文件
     *  @param {Object} obj 对象
     *  @param {String} path 保存路径
     *  @returns {SaverResult}
     *  @throws {Error} 保存失败
     */
    static saverObjectToJson(obj, saverPath)
    {
        const data = JSON.stringify(obj);
        const size = new FormatNumber().formatBytes(Buffer.byteLength(data, "binary"));

        fs.writeFileSync(saverPath, data, { encoding: "utf-8", flag: "w" });

        return { size: size.value + size.type, path: saverPath };
    }

    /**
     *  StreamedFile 委托保存
     *  @param {Array<StreamedFile>} listStreamedFile 流文件对象集合
     *  @param {String} saverPath 保存路径
     *  @param {(listStreamedFile: Array<StreamedFile>, saverPath: String) => SaverUtils.SaverResult} saverAction 保存方法
     *  @returns {SaverResult | Error}
     */
    static saverLSFDelegate(listStreamedFile, saverPath, saverAction)
    {
        try
        {
            return saverAction(listStreamedFile, saverPath);
        } catch (error)
        {
            return new Error("SaverUtils.saverLSFDelegate => " + error.message);
        }
    }

    /**
     *  保存委托
     *  @param {(...any) => SaverResult} saverAction 保存方法
     *  @param {any} ...args 保存方法参数
     *  @returns {SaverResult | Error}
     */
    static saverDelegate(saverAction, ...args)
    {
        try
        {
            return saverAction(...args);
        } catch (error)
        {
            return new Error("SaverUtils.saverDelegate => " + error.message);
        }
    }
}

module.exports = SaverUtils;
