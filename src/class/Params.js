const Single = require("./Single");
const MainRunningMeta = require("./MainRunningMeta");

/**
 *  @description 任务回调函数
 *  @callback RunningTaskCallback
 *  @param {Array<String>} params 命令行参数
 *  @param {MainRunningMeta} meta 其他参数
 *  @param {Params} __this 参数命令对象
 *  @param {String} taskName 任务名称
 *  @returns {Object}
 */

/**
 *  @description 任务结束回调函数
 *  @callback RunningAfterTaskCallback
 *  @param {Object} result 命令的返回结果
 *  @param {MainRunningMeta} meta 其他参数
 *  @param {String} taskName 任务名称
 *  @returns {void}
 */

/**
 *  参数命令参数类
 *  @version 0.1.1
 *  @description
 *  执行顺序：
 *      前置（before=true）命令先执行（running）
 *          如果都是前置：那么就按照等级（__level：子命令确定等级）从大到小去执行
 *          如果等级一样：那么就按照终端输入的顺序执行（先后顺序执行）
 *      普通指令（before=false）
 *          等所有的前置命令都执行结束后，按照终端输入的顺序执行（先后顺序执行）
 */
class Params extends Single
{
    /**
     *  @param {Params} option 配置属性
     */
    constructor(option)
    {
        //#region 可配置的
        const {
            mapKey = null,
            key = null,
            count = 0,
            defaults = [],
            description = "",
            example = "",
            before = false,
            children = [],
            linkSymbol = "-",
            accordingLevelRepeat = true,
            parentPrefix = true
        } = option || {};

        super({
            key: key,
            description: description,
            example: example
        });

        /** @type {String} 参数命令键 */
        this.mapKey = mapKey;

        /** @type {Number} 命令所需要的参数个数，-1则表示后面所有的参数都作为 params 的值，defaults 不生效 */
        this.count = count;

        /** @type {Array<String>} 参数默认值数组，长度必须要和 count 一致 */
        this.defaults = defaults;

        /** @type {Boolean} 表示是一个前置执行命令（一般是用于设置配置之类的操作）*/
        this.before = before;

        /** @type {Array<Params>} 子命令集合，里面的 before 都等于 true */
        this.children = children;

        /** @type {String} 指定命令等级的链接符号，默认 "-" */
        this.linkSymbol = linkSymbol;

        /** @type {Boolean} 是否按照等级重复链接符号，默认 true */
        this.accordingLevelRepeat = accordingLevelRepeat;

        /** @type {Boolean} 命令是否使用父命令作为前缀，默认 true */
        this.parentPrefix = parentPrefix;
        //#endregion


        //#region 运行时自动设置的
        /** @type {Array<String>} 参数数组 */
        this.params = [];

        /** @type {Params} 父命令对象 */
        this.parent = null;
        //#endregion


        //#region 私有字段
        /** @type {Map<String, RunningTaskCallback>} 任务数组 */
        this.__tasks = new Map();

        /** @type {Map<String, Object>} 任务结果数组 */
        this.__taskResults = new Map();

        /** @type {Map<String, RunningAfterTaskCallback>} 任务结束数组 */
        this.__tasksAfter = new Map();

        /** @type {Map<String, RunningAfterTaskCallback>} 所有任务结束数组 */
        this.__allTasksAfter = new Map();

        /** @type {Number} 当前参数命令的执行索引，-1表示根本没有执行过；索引从0开始，表示你是第几个被执行的参数命令 */
        this.__index = -1;

        /** @type {Number} 指令的等级，从大到小执行 */
        this.__level = 0;
        //#endregion
    }

    /**
     *  添加一个任务之后的事件回调
     *  @param {String} name 任务名称
     *  @param {RunningAfterTaskCallback} task 任务
     *  @returns {Params} this
     */
    addListenerTasksAfter(name, task)
    {
        this.__tasksAfter.set(name, task);
        return this;
    }

    /**
     *  任务运行结束之后
     *  @param {MainRunningMeta} [meta={}] 其他参数
     *  @returns {Params} this
     */
    afterRunning(meta)
    {
        this.__tasksAfter.forEach((v, k) =>
        {
            const result = this.__taskResults.get(k);
            v(result, meta, k);
        });

        return this;
    }

    /**
     *  添加一个所有任务之后的事件
     *  @param {String} name 任务名称
     *  @param {RunningAfterTaskCallback} task 任务
     *  @returns {Params} this
     */
    addListenerAllTasksAfter(name, task)
    {
        this.__allTasksAfter.set(name, task);
        return this;
    }

    /**
     *  所有任务运行结束
     *  @param {MainRunningMeta} [meta={}] 其他参数
     *  @returns {Params} this
     */
    allAfterRunning(meta)
    {
        this.__allTasksAfter.forEach((v, k) =>
        {
            const result = this.__taskResults.get(k);
            v(result, meta, k);
        });
    }

    /**
     *  添加一个任务
     *  @param {String} name 任务名称
     *  @param {RunningTaskCallback} task 任务
     *  @returns {Params} this
     */
    addTask(name, task)
    {
        this.__tasks.set(name, task);
        return this;
    }

    /**
     *  运行任务
     *  @param {MainRunningMeta} [meta={}] 其他参数
     *  @returns {Params} this
     */
    running(meta = {})
    {
        this.__tasks.forEach((v, k) =>
        {
            const result = v(this.params, meta, this, k);
            this.__taskResults.set(k, result);
        });
        return this;
    }

    /**
     *  获取指定名称任务的执行结果，没有则返回 null
     *  @param {String} name 事件的名称
     *  @returns {Object | null}
     */
    getTaskResult(name)
    {
        return this.__taskResults.get(name);
    }

    /**
     *  获取所有任务的执行结果
     *  @returns {Map<String, Object>}
     */
    getTaskResults()
    {
        return this.__taskResults;
    }
}

module.exports = Params;
