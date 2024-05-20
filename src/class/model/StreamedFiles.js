const Config = require("./Config");
const AudioItem = require("./AudioItem");
const FileItem = require("../lib/FileItems");

/**
 * 本地文件
 * @description 实例记得先调用 setTools 方法
 * @deprecated 直接继承 FileItem 类即可
 */
class StreamedFiles extends FileItem
{
    /**
     * @param {Config} config 配置
     * @param {Array<AudioItem>} nodes 音频集合
     */
    constructor(config, nodes)
    {
        super(config);
        this.nodes = nodes;
    }
}

module.exports = StreamedFiles;