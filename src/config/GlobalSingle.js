const Single = require("../class/Single");

class GlobalSingle
{
    constructor()
    {
        /** @type {Single} 占位符，表示使用默认参数（前提是有） */
        this.dvp = new Single({
            key: "$D",
            description: "占位符，表示使用默认参数（前提是有）",
            example: "example/dvp.txt",
            modulePath: __filename
        });
    }
}

module.exports = GlobalSingle;
