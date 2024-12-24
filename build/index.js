const namespace = require("./class");
const config = require("./config");

const pt = require("node:path");
const fs = require("node:fs");

// 常量
const WORKER_PATH = pt.resolve("./");
const OUTPUT_PATH = pt.resolve(WORKER_PATH, config.output);
const ARGS_SET = [...new Set(process.argv)];

const s = Date.now();

// 实例
const cos = new namespace.Printf(pt.resolve(__dirname, "log"), "build.log");

process.on("exit", () => cos.printf(Date.now() - s + "ms exit").close());

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

        cos.printf(`mkdir in: ${dirTarget}`).printf(`get ${key}: ${dirSource}`);

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
        cos.printf(`${key} dirs => total: ${contents.dirs.length}, success: ${contents.dirs.length - failDir}, fail: ${failDir}`);

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
        cos.printf(`${key} files => total: ${contents.files.length}, success: ${contents.files.length - failFile}, fail: ${failFile}`).line();
    }

    cos.line();
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

// build scripts
function buildScripts()
{
    cos.printf("build scripts >>>").line();

    const renames = [];

    for (let key in config.scripts)
    {
        const source = pt.resolve(WORKER_PATH, config.scripts[key]);

        cos.printf("build source: " + source);

        const sb = new namespace.ScriptBuild(config.npx, OUTPUT_PATH);
        const returnBuffer = sb.executorSync("ncc", "build", sb.a_content_b(source), "-m", "-o", OUTPUT_PATH);

        cos.printf(returnBuffer.cmd, returnBuffer.done);
        cos.printf(returnBuffer.buffer.toString("utf-8"));

        const finalName = pt.resolve(OUTPUT_PATH, key + ".js");
        const tempName = pt.resolve(OUTPUT_PATH, namespace.AudioItem.buildFID() + `_${key}.js`);

        renames.push({ finalName, tempName });

        const index = pt.resolve(OUTPUT_PATH, "index.js");
        fs.renameSync(index, tempName);

        cos.printf("build to: " + tempName).line();
    }


    for (let i = 0; i < renames.length; i++)
    {
        const item = renames[i];
        fs.renameSync(item.tempName, item.finalName);
        const msg = "Eliminate ID: ".concat(item.tempName, " to ", item.finalName);
        cos.printf(msg);
    }



    cos.line();
}

const RUN_MAPS = {
    "-d": buildDirs,
    "-f": buildFiles,
    "-s": buildScripts
}

function running()
{
    for (let index = 2; index < ARGS_SET.length; index++)
    {
        const key = ARGS_SET[index];
        const action = RUN_MAPS[key];
        if (typeof action == "undefined" || typeof action != "function")
        {
            throw new Error(`no such option: ${key}`);
        }
        RUN_MAPS[key]();
    }
}

running();
