const pt = require("node:path");
const fs = require("node:fs");

const FDItem = require("./FDItem");

class Tools
{
    constructor()
    {

    }

    /**
     *  获取目录里的所有项目
     *  @param {path} path 目录路径
     *  @returns {{ dirs: Array<FDItem>, files: Array<FDItem> }}
     */
    static getDirectors(path, up = "", level = 0)
    {
        level = level + 1;

        const dirList = [];
        const filesList = [];

        // 获取目录里所有的内容
        const list = fs.readdirSync(path);

        for (let i = 0; i < list.length; i++)
        {
            const item = list[i];
            const sourcePath = pt.resolve(path, item);
            const relativePath = pt.join(up, item);

            const fsa = fs.statSync(sourcePath);

            if (fsa.isDirectory())
            {
                dirList.push(new FDItem(level, relativePath, sourcePath));

                const gd = Tools.getDirectors(sourcePath, relativePath, level);

                dirList.push(...gd.dirs);
                filesList.push(...gd.files);
            }
            else
            {
                filesList.push(new FDItem(level, relativePath, sourcePath));
            }
        }
        return {
            dirs: dirList,
            files: filesList
        }
    }
}

module.exports = Tools;