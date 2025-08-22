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

    /**
     *  过滤 SoundBanks.json 里的内容
     *  @param {String} shortNameORId  全 ID 绝等搜索 || 短文件名模糊搜索
     *  @param {Boolean} ignoreCase 不区分大小写
     *  @returns {Array<SoundBank>} listSoundBank
     */
    filterSoundBank(shortNameORId, ignoreCase = false)
    {
        const listSoundBank = [];

        for (let i = 0; i < this.listSoundBank.length; i++)
        {
            const soundBank = this.listSoundBank[i];
            const listStreamedFile = [];

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

            // 如果存在匹配的 StreamedFile，则添加
            if (listStreamedFile.length > 0)
            {
                const newSBInfo = new SoundBank(soundBank.Id, soundBank.Path);
                newSBInfo.IncludedMemoryFiles = listStreamedFile;

                listSoundBank.push(newSBInfo);
            }
        }

        return listSoundBank;
    }

    /**
     *  将 SoundBanks.json 里的 StreamedFile 内容提取出来
     *  @param {Array<SoundBank>} listSoundBank 
     *  @returns {Array<StreamedFile>} listStreamedFile
     */
    lSBKToLSF(listSoundBank)
    {
        const listStreamedFile = [];

        for (let i = 0; i < listSoundBank.length; i++)
        {
            const soundBank = listSoundBank[i];

            for (let j = 0; j < soundBank.IncludedMemoryFiles.length; j++)
            {
                const item = soundBank.IncludedMemoryFiles[j];
                listStreamedFile.push(item);
            }
        }

        return listStreamedFile;
    }

    /**
     *  统计 SoundBanks.json 里的 StreamedFile 数量
     *  @param {Array<SoundBank>} listSoundBank 
     *  @returns {Number} count
     */
    counterListSoundBank(listSoundBank)
    {
        let count = 0;

        for (let i = 0; i < listSoundBank.length; i++)
        {
            const soundBank = listSoundBank[i];

            for (let j = 0; j < soundBank.IncludedMemoryFiles.length; j++)
            {
                count++;
            }
        }

        return count;
    }
}

module.exports = SoundBanksInfoData;
