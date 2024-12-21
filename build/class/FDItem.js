class FDItem
{
    /**
     *  @param {Number} level 目录的层级
     *  @param {Number} relativePath 相对路径
     *  @param {Number} sourcePath 源路径
     */
    constructor(level, relativePath, sourcePath)
    {
        this.level = level;
        this.relativePath = relativePath;
        this.sourcePath = sourcePath;
    }
}

module.exports = FDItem;