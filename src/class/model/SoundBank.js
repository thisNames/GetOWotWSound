const AudioItem = require("./AudioItem");

class SoundBank extends AudioItem
{
    /**
     * @param {String} Id 
     * @param {String} GUID
     * @param {String} Language 
     * @param {String} ObjectPath
     * @param {String} ShortName 
     * @param {String} Path
     * @param {Array<AudioItem>} IncludedMemoryFiles
     */
    constructor(Id, Language, ShortName, Path, GUID, ObjectPath, IncludedMemoryFiles)
    {
        super(Id, Language, ShortName, Path);
        this.GUID = GUID;
        this.ObjectPath = ObjectPath;
        this.IncludedMemoryFiles = IncludedMemoryFiles;
    }
}

module.exports = SoundBank;