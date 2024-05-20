/** 测试 exe 类 */

const namespace = require("../../src/class");

const config = new namespace.Config("config", "config.properties");

function testWw2ogg()
{
    const wem = new namespace.Ww2ogg(config.ww2ogg, config.www2ogg_packed_codebooks_aoTuV_603);
    const res = wem.run("F:\\Develop\\_Project\\GetOWotWSound\\SoundMod\\0043.wem", "www.ogg");
    console.log(res);
}

function testBnkextr()
{
    const bnk = new Bnkextr("F:\\Develop\\_Project\\GetOWotWSound\\SoundMod\\bnkextr.exe");
    bnk.workSpace = __dirname;
    const res = bnk.run("F:\\Develop\\_Project\\GetOWotWSound\\SoundMod\\BnkInput\\twillen.bnk");
    console.log(res);
}

function testRevorb()
{
    const rev = new Revorb("F:\\Develop\\_Project\\GetOWotWSound\\SoundMod\\revorb.exe");
    rev.workSpace = __dirname;
    const res = rev.run("F:\\Develop\\_Project\\GetOWotWSound\\www.ogg")
    console.log(res);
}

console.log(11111111);
module.exports = 100;