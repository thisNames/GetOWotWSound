// dirs, files ==> 目标: 源
module.exports = {
    output: "dist/GetOWotWSound_v2.0.0",
    npx: "D:\\Program Files\\nodejs\\npx.cmd",
    dirs: {
        SoundMod: "SoundMod",
    },
    files: {
        "config.properties": "config.properties"
    },
    scripts: {
        index: "src/index.js",
        index_bnk: "src/index_bnk.js"
    }
}