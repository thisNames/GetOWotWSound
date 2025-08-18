/**
 *  打印帮助
 */
const fs = require("node:fs");
const pt = require("node:path");

const Logger = require("../../class/Logger");
const MainRunningMeta = require("../../class/MainRunningMeta");
const Params = require("../../class/Params");
const ParamsMapping = require("../../class/ParamsMapping");
const Tools = require("../../class/Tools");
const Single = require("../../class/Single");

const LINES = "=".repeat(20);

/**
 *  打印 packages.json
 *  @returns {void}
 */
function printPackages()
{
    try
    {
        const package = require("../../../package.json");
        const listRepository = package?.listRepository;

        if (!Array.isArray(listRepository)) return;

        Logger.prompt("[获取更多]");
        listRepository.forEach(lr => lr && Logger.info("\t", lr.url, lr.type));
    } catch (error)
    {
        return;
    }
}

/**
 * 打印子命令
 * @param {Array<Params>} params 参数命令对象集合
 * @param {String} tab 制表符 \t
 * @param {Number} rpi 重复数 0 开始
 * @returns {void}
 */
function printChildren(params, tab = "\t", rpi = 0)
{
    for (let i = 0; i < params.length; i++)
    {
        const param = params[i];
        const indent = tab.repeat(rpi);
        const key = `${indent}[${param.mapKey}, ${param.key}]:`;

        Logger.info(key, param.description);

        // 没有子命令
        if (param.children.length < 1) continue;

        printChildren(param.children, tab, rpi + 1);
    }

    Logger.line();
}

/**
 *  打印描述
 *  @param {MainRunningMeta} meta
 *  @returns {void}
 */
function printDescriptions(meta)
{
    // 参数命令
    Logger.prompt("[参数命令]");
    printChildren(meta.originListParamsMapping);

    // 布尔命令
    Logger.prompt("[布尔命令]");
    for (let key in meta.singleMap)
    {
        let single = meta.singleMap[key];
        Logger.info(single.key, single.description);
    }
    Logger.line();

    // 打印包信息
    printPackages();
}

/**
 *  打印版主文档
 *  @param {String} helpDocumentPath 帮助文档路径
 *  @param {String} key 命令
 *  @returns {void}
 */
function printHelpDocument(key, helpDocumentPath)
{
    if (fs.existsSync(helpDocumentPath) && fs.statSync(helpDocumentPath).isFile())
    {
        try
        {
            let data = fs.readFileSync(helpDocumentPath, "utf-8");
            Logger.info(data);
        } catch (error)
        {
            Logger.error(error.message || "读取帮助文件失败");
        }
    }
    else
    {
        Logger.info("?_?");
        Logger.warn(`此命令[${key}]没有找到帮助描述文件`);
    }

    Logger.info(LINES);
}

/**
 *  打印参数命令对象模板
 *  @param {String} key 命令
 *  @param {Params} pm pm
 *  @returns {void}
 */
function printParamsExamples(key, pm)
{
    let helpDocumentPath = pt.join(pt.dirname(pm.modulePath), pm.example + "");

    let counter = pm.count < 0 ? "不定长参数" : pm.count;
    let defaulter = pm.count <= 0 ? "无" : `[${pm.defaults.join(", ")}]`;

    Logger
        .prompt(`[${key}]: ${pm.description} [参数命令]`)
        .prompt("参数说明")
        .info(`\t参数个数：${counter}`)
        .info(`\t默认参数：${defaulter}`);

    // 父命令
    if (pm.parent instanceof ParamsMapping || pm.parent instanceof Params)
    {
        Logger.prompt("父命令").info(`\t[${pm.parent.mapKey}, ${pm.parent.key}]: ${pm.parent.description}`);
    }

    // 子命令
    if (pm.children.length)
    {
        Logger.prompt("子命令")
        for (let i = 0; i < pm.children.length; i++)
        {
            const cpm = pm.children[i];
            Logger.info(`\t[${cpm.mapKey}, ${cpm.key}]: ${cpm.description}`);
        }
    }

    Logger.prompt("说明文档");
    printHelpDocument(key, helpDocumentPath);
}

/**
 *  打印参数命令对象模板
 *  @param {String} key 命令s
 *  @param {Single} single single
 *  @returns {void}
 */
function printSingleExamples(key, single)
{
    let helpDocumentPath = pt.join(pt.dirname(single.modulePath), single.example + "");

    Logger.prompt(`${single.key}: ${single.description} [布尔命令]`).line();
    printHelpDocument(key, helpDocumentPath);
}

/**
 *  打印模板
 *  @param {MainRunningMeta} meta meta
 *  @param {Array<String>} params 参数数组
 *  @returns {void}
 */
function printExamples(meta, params)
{
    /** @type {Map<String, Single>} */
    const singleMap = Tools.objectFMap(meta.singleMap, (k, v) => v.key, (k, v) => v);

    params.forEach(key =>
    {
        let exp = meta.paramsMap.get(key) || meta.paramsKeyMap.get(key) || singleMap.get(key);

        // 没有找到
        if (!exp) return Logger.error(`没有找到对应的命令[${key}]`);
        if (exp instanceof Params) return printParamsExamples(key, exp);

        printSingleExamples(key, exp);
    });
}

/**
 *  @param {Array<String>} params 参数集合
 *  @param {MainRunningMeta} meta meta
 *  @param {Params} __this 当前参数命令对象
 *  @param {String} taskName 任务名称
 */
function main(params, meta, __this, taskName)
{
    let hIndex = process.argv.findIndex(key => key == meta.key);
    let __params = [...new Set(process.argv.slice(hIndex + 1, process.argv.length))];

    // 简单描述
    if (__params.length < 1) return printDescriptions(meta);

    // 打印帮助模板
    printExamples(meta, __params);
}


module.exports = main;
