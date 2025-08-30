const fs = require("node:fs");
const pt = require("node:path");

const LoggerSaver = require("../../../class/LoggerSaver");

const Utils = require("./Utils");

class Ori
{
    constructor()
    {
        /** @type {Array<String>} random txt */
        this.randomPath = [];

        /** @type {Array<String>} random color */
        this.randomColor = [LoggerSaver.RESET, LoggerSaver.GREEN, LoggerSaver.LIGHT_BLUE, LoggerSaver.LIGHT_YELLOW, LoggerSaver.CYAN];

        /** @type {String} error message */
        this.errorMessage = "ori 不见了...";

        this.__initRandomPath();
    }

    /**
     *  初始化随机数据
     *  @returns {void}
     */
    __initRandomPath()
    {
        const resource = pt.join(Utils.getResourcePath(), "txt");

        try
        {
            /** @type {Array<fs.Dirent>} */
            const listItem = fs.readdirSync(resource, { encoding: "utf-8", flag: "r", withFileTypes: true });
            listItem.forEach(item => item.isFile() && pt.extname(item.name) == ".txt" && this.randomPath.push(pt.join(resource, item.name)));
        } catch (error)
        {
            this.randomPath = [this.errorMessage];
        }
    }

    /**
     *  随机获取一个 ori
     *  @returns {String} ori 的内容，从 txtList 中随机一个文件并返回其中一个
     */
    ori()
    {
        const randomIndex = Math.floor(Math.random() * this.randomPath.length);
        const filename = this.randomPath[randomIndex] || randomPath[0];

        try
        {
            const data = fs.readFileSync(filename, { encoding: "utf-8", flag: "r" });
            return data;
        } catch (error)
        {
            return this.errorMessage;
        }
    }

    /**
     *  随机获取一个颜色
     *  @returns {String} random color
     */
    oriColor()
    {
        const colorIndex = Math.floor(Math.random() * this.randomColor.length);
        const color = this.randomColor[colorIndex] || this.randomColor[0];

        return color;
    }

    /**
     *  打印 ori
     *  @returns {void}
     */
    printer()
    {
        const logger = new LoggerSaver();
        const color = this.oriColor();
        const ori = this.ori();

        logger.__log(color, ori);
    }
}

module.exports = Ori;
