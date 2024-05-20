const namespace = require("../../src/class");

const config = new namespace.Config("config", "config.properties");
const ww2ogg = new namespace.Ww2ogg(config.ww2ogg, config.www2ogg_packed_codebooks_aoTuV_603);
const revorb = new namespace.Revorb(config.revorb);
const bnk2wm = new namespace.Bnkextr(config.bnk2wem);

/**
 * 多进程使用的
 * @param { {ss: namespace.SoundBank, bnkCurrentNumber: String} } data
 * @example
 * ss
 *  SoundBank 数据对象
 * 
 * bnkCurrentNumber 
 *  当前执行的 bnk 文件编号
 */
function taskAndProcess({ ss, bnkCurrentNumber })
{
    const IncludedMemoryFiles = [];

    if (ss.IncludedMemoryFiles === undefined)
    {
        const line = `${bnkCurrentNumber} build: ${ss.ShortName} is not <IncludedMemoryFiles> node`;
        console.debug(line);
        process.exit();
    }

    ss.IncludedMemoryFiles.forEach(mf => IncludedMemoryFiles.push(new namespace.AudioItem(mf.Id, mf.Language, mf.ShortName, mf.Path)));
    const soundBank = new namespace.SoundBank(ss.Id, ss.Language, ss.ShortName, ss.Path, ss.GUID, ss.ObjectPath, IncludedMemoryFiles);

    // 处理一个 SoundBank
    const imf = new namespace.IncludedMemoryFile(config, soundBank);
    imf.setTools(ww2ogg, revorb, bnk2wm);

    // 解压 bnk（同步）
    const wem = imf.buildBnkToWemSync();

    // 生成 ogg（同步）
    let current = 0;
    imf.buildSync(wem.wemFilePathList, function (value)
    {
        current++;
        const line = `${bnkCurrentNumber} build: ${imf.SoundBank.ShortName}: ${imf.SoundBank.IncludedMemoryFiles.length}/${current}\t${value.target} ${value.done}`;
        console.debug(line);
        return true;
    });

    // 修复 ogg（同步）
    current = 0;
    imf.fixOriOggSync(function (value)
    {
        current++;
        const line = `${bnkCurrentNumber} fix: ${imf.SoundBank.ShortName}: ${imf.SoundBank.IncludedMemoryFiles.length}/${current}\t${value.target} ${value.done}`;
        console.debug(line);
        return true;
    });

    process.exit();
}

/**
 * // 单进程使用的
 * @param { {ss: namespace.SoundBank, bnkCurrentNumber: String} } data
 * @example
 * ss
 *  SoundBank 数据对象
 * 
 * bnkCurrentNumber 
 *  当前执行的 bnk 文件编号
 */
function task({ ss, bnkCurrentNumber, pid, id })
{
    const IncludedMemoryFiles = [];

    if (ss.IncludedMemoryFiles === undefined)
    {
        const line = `${bnkCurrentNumber} build: ${ss.ShortName} is not <IncludedMemoryFiles> node`;
        console.debug(line);
        return;
    }

    ss.IncludedMemoryFiles.forEach(mf => IncludedMemoryFiles.push(new namespace.AudioItem(mf.Id, mf.Language, mf.ShortName, mf.Path)));
    const soundBank = new namespace.SoundBank(ss.Id, ss.Language, ss.ShortName, ss.Path, ss.GUID, ss.ObjectPath, IncludedMemoryFiles);

    // 处理一个 SoundBank
    const imf = new namespace.IncludedMemoryFile(config, soundBank);
    imf.setTools(ww2ogg, revorb, bnk2wm);

    // 解压 bnk（同步）
    const wem = imf.buildBnkToWemSync();

    // 生成 ogg（同步）
    let current = 0;
    imf.buildSync(wem.wemFilePathList, function (value)
    {
        current++;
        const line = `${bnkCurrentNumber} build: ${imf.SoundBank.ShortName}: ${imf.SoundBank.IncludedMemoryFiles.length}/${current}\t${value.target} ${value.done}`;
        console.debug(line);
        return true;
    });

    // 修复 ogg（同步）
    current = 0;
    imf.fixOriOggSync(function (value)
    {
        current++;
        const line = `${bnkCurrentNumber} fix: ${imf.SoundBank.ShortName}: ${imf.SoundBank.IncludedMemoryFiles.length}/${current}\t${value.target} ${value.done}`;
        console.debug(line);
        return true;
    });
}

process.on("message", taskAndProcess);

module.exports = task;