const Executor = require("../../../class/cp/Executor");
const ExecutorResult = require("../../../class/cp/ExecutorResult");

const StreamedFile = require("./StreamedFile");
const DefaultConfig = require("./DefaultConfig");
const DefaultOptions = require("./DefaultOptions");

/**
 *  StreamedFIles 工作流
 */
class StreamedFilesWorker
{
    /**
     *  @param {Array<StreamedFile>} listStreamedFile 要处理的 StreamedFile 数据集合
     *  @param {DefaultConfig} config 配置项
     *  @param {DefaultOptions} options 可选项
     */
    constructor(listStreamedFile, config, options)
    {
        /** @type {Array<StreamedFile>} 数据集合 */
        this.listStreamedFile = listStreamedFile;

        /** @type {DefaultConfig} 配置项 */
        this.config = config;

        /** @type {DefaultOptions} 可选项 */
        this.options = options;
    }

    /**
     *  同步执行
     */
    executorSync()
    {

    }

    /**
     *  异步执行
     */
    executor()
    {

    }
}

module.exports = StreamedFilesWorker;
