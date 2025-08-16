const StreamedFile = require("./StreamedFile");
const SoundBank = require("./SoundBank");

/**
 *  SoundBanksInfo 数据信息
 */
class SoundBanksInfoData
{
    /**
     * @param {Array<StreamedFile>} listStreamedFile 
     * @param {Array<SoundBank>} listSoundBank 
     */
    constructor(listStreamedFile = [], listSoundBank = [])
    {
        /** @type {Array<StreamedFile>} wem */
        this.listStreamedFile = listStreamedFile;

        /** @type {Array<SoundBank>} bnk */
        this.listSoundBank = listSoundBank;
    }

    /**
     *  s1 中是否包含 s2
     *  @param {String} s1 
     *  @param {String} s2
     *  @param {Boolean} ignoreCase 不区分大小写
     */
    __includes(s1, s2, ignoreCase)
    {
        if (ignoreCase) return s1.toLocaleLowerCase().includes(s2.toLocaleLowerCase());
        return s1.includes(s2);
    }

    /**
     *  搜索 StreamedFiles.json 内容
     *  @param {String} shortNameORId  全 ID 绝等搜索 || 短文件名模糊搜索
     *  @param {Boolean} ignoreCase 不区分大小写
     *  @returns {Array<StreamedFile>} listStreamedFile
     */
    searchStreamedFile(shortNameORId, ignoreCase = false)
    {
        const listStreamedFile = [];
        for (let i = 0; i < this.listStreamedFile.length; i++)
        {
            const item = this.listStreamedFile[i];

            // 短文件名模糊搜索
            if (this.__includes(item.ShortName, shortNameORId, ignoreCase))
            {
                listStreamedFile.push(item);
                continue;
            };

            // ID 直接匹配
            if (item.Id == shortNameORId) listStreamedFile.push(item);
        }

        return listStreamedFile;
    }

    /**
     *  搜索 SoundBanks.json 里的 StreamedFiles 内容
     *  @param {String} shortNameORId  全 ID 绝等搜索 || 短文件名模糊搜索
     *  @param {Boolean} ignoreCase 不区分大小写
     *  @returns {Array<StreamedFile>} listStreamedFile
     */
    searchSoundBank(shortNameORId, ignoreCase = false)
    {
        const listStreamedFile = [];

        for (let i = 0; i < this.listSoundBank.length; i++)
        {
            const soundBank = this.listSoundBank[i];

            for (let j = 0; j < soundBank.IncludedMemoryFiles.length; j++)
            {
                const item = soundBank.IncludedMemoryFiles[j];

                // 短文件名模糊搜索
                if (this.__includes(item.ShortName, shortNameORId, ignoreCase))
                {
                    listStreamedFile.push(item);
                    continue;
                };

                // ID 直接匹配
                if (item.Id == shortNameORId) listStreamedFile.push(item);
            }
        }

        return listStreamedFile;
    }
}

module.exports = SoundBanksInfoData;
