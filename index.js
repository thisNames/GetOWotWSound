/**
 *  @version 0.0.6
 *  @description 主执行文件（入口）
 */

// core class
const Params = require("./src/class/Params");
const MainRunningMeta = require("./src/class/MainRunningMeta");
const Tools = require("./src/class/Tools");
const Single = require("./src/class/Single");
const TodoTasks = require("./src/class/TodoTasks");

// src index.js
const { PARAMS_MAP, SINGLE_MAP, PARAMS_KEY_MAP, ORIGIN_LIST_PARAMS_MAPPING } = require("./src/index");

//#region 初始化常量
const STATIC_META = new MainRunningMeta({
    dirname: __dirname,
    filename: __filename,
    singleMap: SINGLE_MAP,
    paramsMap: PARAMS_MAP,
    paramsKeyMap: PARAMS_KEY_MAP,
    originListParamsMapping: ORIGIN_LIST_PARAMS_MAPPING
});
//#endregion

/**
 *  填充指令参数
 *  @version 0.0.2
 *  @param {Params} pm 参数命令对象
 *  @param {String} dvpKey 默认参数占位符
 *  @param {Array<String>} processArgv 原始参数数组
 *  @returns {Params} 原来的参数命令对象
 */
function fillParams(pm, dvpKey, processArgv)
{
    // 如果值为小于0，那么后面的参数都将作为 params 的参数，defaults 参数将不会生效
    if (pm.count < 0)
    {
        while (processArgv.length > 0)
        {
            let pv = processArgv.shift();
            pm.params.push(pv);
        }
        return pm;
    }

    // 填充参数
    for (let i = 0; i < pm.count; i++)
    {
        if (processArgv.length < 1)
        {
            // 使用默认参数
            pm.params.push(pm.defaults[i]);
            continue;
        }
        // 使用命令参数
        let pv = processArgv.shift();
        pm.params.push(pv == dvpKey ? pm.defaults[i] : pv);
    }

    return pm;
}

/**
 *  指定区间填充指令参数
 *  @version 0.0.1
 *  @param {Params} pm 参数命令对象
 *  @param {String} dvpKey 默认参数占位符
 *  @param {Number} index 从第几个开始截取
 *  @param {Array<String>} processArgv 原始参数数组
 *  @returns {Params} 原来的参数命令对象
 */
function fillParamsFSplice(pm, dvpKey, index, processArgv)
{
    if (pm.count < 0)
    {
        // 如果值为小于0，那么后面的参数都将作为 params 的参数，defaults 参数将不会生效，直接截取到末尾
        pm.params.push(...processArgv.splice(index, processArgv.length - index));
        return pm;
    }

    // 使用命令参数
    let pvs = processArgv.splice(index, pm.count);
    for (let i = 0; i < pm.count; i++)
    {
        if (pvs.length < 1) // 1
        {
            // 使用默认参数 1 2
            pm.params.push(pm.defaults[i]);
            continue;
        }
        let pv = pvs.shift();
        pm.params.push(pv == dvpKey ? pm.defaults[i] : pv);

    }

    return pm;
}

/**
 *  初始化单值指令
 *  @version 0.0.1
 *  @param {MainRunningMeta} meta 忽略布尔命令
 *  @param {Array<String>} processArgv 原始参数数组
 *  @returns {void}
 */
function initSingles(meta, processArgv)
{
    /** @type {Map<String, Single>} */
    const singleMap = Tools.objectFMap(meta.singleMap, (k, v) => v.key, (k, v) => v);

    let i = 0
    for (; i < processArgv.length; i++)
    {
        if (processArgv.length < 1) break;

        const key = processArgv[i];
        const single = singleMap.get(key);

        // 处理布尔参数
        if (single && !single.include)
        {
            single.include = true;

            // 排除默认参数占位符指令
            if (key == meta.singleMap.dvp.key) continue;

            // 踢出去匹配到的指令，并且倒退回去，继续下次循环判断是否还有下一个指令
            //  [1, 2, -R, 4, 5] i=2 => [1, 2, 4, 5] i--
            processArgv.splice(i, 1);
            i--;
            continue;
        }
    }
}

/**
 *  初始化 before 参数指令
 *  @version 0.0.3
 *  @param {MainRunningMeta} meta 忽略布尔命令
 *  @param {Array<String>} processArgv 原始参数数组
 *  @returns {void}
 */
function initBeforeParams(meta, processArgv)
{
    // 待执行的任务队列
    const todoTasks = new TodoTasks();

    let i = 0
    for (; i < processArgv.length; i++)
    {
        if (processArgv.length < 1) break;

        const key = processArgv[i];

        // 处理带 before 的参数命令
        let pm = meta.paramsMap.get(key) || meta.paramsKeyMap.get(key) || meta.paramsKeyMap.get("*");
        if (!pm || pm.include || !pm.before) continue;

        pm.include = true;

        // fillParamsFSplice(pm, meta.singleMap.dvp.key, i + 1, processArgv).running({ ...meta, key });

        // 填充参数 添加任务队列
        fillParamsFSplice(pm, meta.singleMap.dvp.key, i + 1, processArgv);
        todoTasks.addTodoTask(pm, { ...meta, key });

        // 踢出去匹配到的指令，并且倒退回去，继续下次循环判断是否还有下一个指令
        processArgv.splice(i, 1);
        i--;
    }

    // 执行任务队列
    todoTasks.sort().running();
    todoTasks.allAfterRunning();
}

/**
 *  初始化命令
 *  @version 0.0.2
 *  @param {MainRunningMeta} meta 忽略布尔命令
 *  @param {Array<String>} processArgv 原始参数数组
 *  @returns {void}
 */
function initProcessArgs(meta, processArgv)
{
    // 去掉第一个参数和第二个参数，因为它们分别是 node 和入口文件路径 index.js
    processArgv.splice(0, 2);
}

/**
 *  运行 Params 参数命令
 *  @version 0.0.4
 *  @param {Map<String, Params>} paramsMap 参数命令映射表 mapKey
 *  @param {Map<String, Params>} paramKeyMap 参数命令映射表 params.key
 *  @param {String} dvpKey 默认参数占位符
 *  @param {MainRunningMeta} meta 静态数据对象
 *  @param {Array<String>} processArgv 原始参数数组
 *  @returns {void}
 */
function running(meta, processArgv)
{
    // 待执行的任务队列
    const todoTasks = new TodoTasks();

    // 解析参数并运行
    while (processArgv.length > 0)
    {
        let key = processArgv.shift();
        // 通过 mapKey || params.key || * 通配符参数命令 取值筛选
        let pm = meta.paramsMap.get(key) || meta.paramsKeyMap.get(key) || meta.paramsKeyMap.get("*");

        if (!pm || pm.include) continue;

        pm.include = true;

        // 填充参数 运行任务
        // fillParams(pm, meta.singleMap.dvp.key, processArgv).running({ ...meta, key });

        // 填充参数 添加任务队列
        fillParams(pm, meta.singleMap.dvp.key, processArgv);
        todoTasks.addTodoTask(pm, { ...meta, key });
    }

    // 执行任务队列
    todoTasks.sort().running();
    todoTasks.allAfterRunning();
}

/**
 *  running 运行结束
 *  @version 0.0.1
 *  @returns {void}
 */
function end()
{
    // 啥也不输出了 >A< >_< >V< ...
}

/**
 *  运行主入口
 *  @version 0.0.2
 *  @returns {void}
 */
function main()
{
    // 拷贝一份静态指令数据，避免破坏数据
    const processArgv = process.argv.map(k => k);

    // 初始化参数
    initProcessArgs(STATIC_META, processArgv);

    // 初始化布尔指令
    initSingles(STATIC_META, processArgv);

    // 运行 before 的 Params 参数指令
    initBeforeParams(STATIC_META, processArgv);

    // 运行 Params 参数命令
    running(STATIC_META, processArgv);

    // 运行结束
    end();
}

main();