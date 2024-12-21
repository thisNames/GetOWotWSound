const namespace = require("./class");
const config = require("./config");

const pt = require("node:path");
const fs = require("node:fs");

// 常量
const WORKER_PATH = pt.resolve("./");
const OUTPUT_PATH = pt.resolve(WORKER_PATH, config.output);

// 实例
const cos = new namespace.Printf(pt.resolve(__dirname, "log"), "build.log");

cos.printf(`worker path: ${WORKER_PATH}`).printf(`output path: ${OUTPUT_PATH}`).line();

// build 目录
function buildDirs()
{
    cos.printf("build directors >>>").line();

    for (let key in config.dirs)
    {
        // 一个目录
        const dirSource = pt.resolve(WORKER_PATH, config.dirs[key]);
        const dirTarget = pt.resolve(OUTPUT_PATH, key);

        // 新建根目录
        !fs.existsSync(dirTarget) && fs.mkdirSync(dirTarget, { recursive: true });

        cos.printf(`mkdir in: ${dirTarget}`).printf(`get ${key}: ${dirSource}`).line();

        // 获取目录里所有的内容
        const contents = namespace.Tools.getDirectors(dirSource);

        // 新建目录
        let failDir = 0;
        contents.dirs.forEach(dir =>
        {
            const target = pt.resolve(dirTarget, dir.relativePath);
            const msg = `copying dir: [${dir.sourcePath}] to [${target}]`;

            try
            {
                !fs.existsSync(target) && fs.mkdirSync(target, { recursive: true });
                cos.printf(msg);
            } catch (error)
            {
                failDir++;
                cos.printf("[copy error] => ".concat(msg));
            }
        });
        cos.printf(`${key} => total: ${contents.dirs.length}, success: ${contents.dirs.length - failDir}, fail: ${failDir}`);

        // 复制文件
        let failFile = 0;
        contents.files.forEach(file =>
        {
            const target = pt.resolve(dirTarget, file.relativePath);
            const msg = `copying file: [${file.sourcePath}] to [${target}]`;

            try
            {
                fs.copyFileSync(file.sourcePath, target);
                cos.printf(msg);
            } catch (error)
            {
                failFile++;
                cos.printf("[copy error] => ".concat(msg));
            }
        });
        cos.printf(`${key} => total: ${contents.files.length}, success: ${contents.files.length - failFile}, fail: ${failFile}`).line();
    }
}

// build 文件
function buildFiles()
{
    cos.printf("build files >>>").line();

    let failFile = 0;
    const total = Object.keys(config.files).length;
    for (let key in config.files)
    {
        const fileSource = pt.resolve(WORKER_PATH, config.files[key]);
        const fileTarget = pt.resolve(OUTPUT_PATH, key);

        const msg = `copying file: [${fileSource}] to [${fileTarget}]`;

        try
        {
            fs.copyFileSync(fileSource, fileTarget);
            cos.printf(msg);
        } catch (error)
        {
            failFile++;
            cos.printf("[copy error] => ".concat(msg));
        }
    }
    cos.printf(`files total: ${total}, success: ${total - failFile}, fail: ${failFile}`).line();
}

buildDirs();
buildFiles();
cos.close();

