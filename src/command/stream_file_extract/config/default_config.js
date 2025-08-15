const DefaultConfig = require("../class/DefaultConfig");

const config = new DefaultConfig();

/**
 *  加载本地配置
 *  @returns {Object}
 */
function loaderConfig()
{
    try
    {
        const localPath = DefaultConfig.LOCAL_CONFIG;

        const local = require(`./${localPath}`);

        return typeof local === "object" ? local : {};
    } catch (error)
    {
        return {};
    }
}

/**
 * @type {DefaultConfig}
 */
module.exports = {
    ...config,
    ...loaderConfig()
};
