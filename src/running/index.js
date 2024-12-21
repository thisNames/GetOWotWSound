/**
 *  统一引入执行函数
 */
// bnk
const BnkExtractSyncTask = require("./BnkExtractSyncTask");
const BnkExtractSync = require("./BnkExtractSync");
const BnkExtractCProcess = require("./BnkExtractCProcess");

// wem
const Wm2OggSync = require("./Wm2OggSync");
const Wem2Ogg = require("./Wem2Ogg");

// list
const List = require("./List");


module.exports = {
    BnkExtractSync,
    BnkExtractSyncTask,
    BnkExtractCProcess,
    Wm2OggSync,
    Wem2Ogg,
    List
}