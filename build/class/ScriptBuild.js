const Executor = require("../../src/class/lib/Executor");

class ScriptBuild extends Executor
{
    /**
     * @param {String} exe exe 程序路径
     * @param {String} workSpace exe 程序的工作目录
     */
    constructor(exe, workSpace = pt.resolve("./"))
    {
        super(exe, workSpace);
    }
}

module.exports = ScriptBuild;