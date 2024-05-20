const ConfigLoader = require("../lib/ConfigLoader");

/**
 *  配置类
 */
class Config extends ConfigLoader
{
    constructor(name, path)
    {
        super(name, path);

        /**@type {String} */
        this.soundAssetsPath = this._soundAssetsPath;

        /**@type {String} */
        this.buildPath = this._buildPath;

        /**@type {Boolean} */
        this.id = this._id;

        /**@type {Boolean} */
        this.newType = this._newType;

        /**@type {String} */
        this.revorb = this._revorb;

        /**@type {String} */
        this.ww2ogg = this._ww2ogg;

        /**@type {String} */
        this.bnk2wem = this._bnk2wem;

        /**@type {String} */
        this.www2ogg_packed_codebooks_aoTuV_603 = this._www2ogg_packed_codebooks_aoTuV_603;

        /**@type {String} */
        this.logPath = this._logPath;

        /**@type {Number} */
        this.wemCMax = this._wemCMax;
    }

    //#region get config

    get _wemCMax()
    {
        return this.checkNumber("wemCMax");
    }

    get _logPath()
    {
        return this.toAbsPath(this.checkKey("logPath"), true);
    }

    get _newType()
    {
        return this.checkBool("newType");
    }

    get _www2ogg_packed_codebooks_aoTuV_603()
    {
        return this.toAbsPath(this.checkKey("www2ogg_packed_codebooks_aoTuV_603"));
    }

    get _soundAssetsPath()
    {
        return this.toAbsPath(this.checkKey("soundAssetsPath"));
    }

    get _buildPath()
    {
        return this.toAbsPath(this.checkKey("buildPath"), true);
    }

    get _id()
    {
        return this.checkBool("id");
    }

    get _revorb()
    {
        return this.toAbsPath(this.checkKey("revorb"));
    }

    get _ww2ogg()
    {
        return this.toAbsPath(this.checkKey("ww2ogg"));
    }

    get _bnk2wem()
    {
        return this.toAbsPath(this.checkKey("bnk2wem"));
    }

    //#endregion
}

module.exports = Config;
