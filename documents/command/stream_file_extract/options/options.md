# 查看默认可选项（主命令）

## 命令
- `-opt`, `-options`

## 描述
- 查看运行时的可选项

## 子命令
- `-opt-out`, `-options-outputPath`: [options.outputPath.md](options.outputPath.md)
- `-opt-log`, `-options-logPath`: [options.setLogPath.md](options.setLogPath.md)
- `-opt-tmp`, `-options-tempPath`: [options.setTempPath.md](options.setTempPath.md)
- `-opt-an`, `-options-asyncNumber`: [options.setAsyncNumber.md](options.setAsyncNumber.md)
- `-opt-ext`, `-options-extname`: [options.setExtname.md](options.setExtname.md)
- `-opt-fr`, `-options-filter`: [options.setFilter.md](options.setFilter.md)
- `-opt-cwem`, `-options-customSFStruct`: [options.setCustomSFStruct.md](options.setCustomSFStruct.md)
- `-opt-cbnk`, `-options-customSBKStruct`: [options.setCustomSBKStruct.md](options.setCustomSBKStruct.md)
- `-opt-ea`, `-options-enableAsync`: [options.enableAsync.md](options.enableAsync.md)
- `-opt-eid`, `-options-enableId`: [options.enableId.md](options.enableId.md)
- `-opt-ehid`, `-options-enableHashId`
- `-opt-ectd`, `-options-enableCreateTypeDir`
- `-opt-esic`, `-options-enableSIgnoreCase`
- `-opt-essjson`, `-options-enableSSjson`
- `-opt-esslog`, `-options-enableSSlog`
- `-opt-esscsv`, `-options-enableSScsv`
- `-opt-sw`, `-options-sStreamfile`
- `-opt-sb`, `-options-sSoundBanks`
- `-opt-did`, `-options-dplId`
- `-opt-dsn`, `-options-dplShortName`
- `-opt-didsn`, `-options-dplIdShortName`

## 文档
```txt
示例：owo -opt

结束：
extname             = .ogg  # 生成的文件名称后缀
filter              =       # 生成过滤器
customSFStruct      =       # 使用自定义的 StreamedFiles.json 结构文件
customSBKStruct     =       # 使用自定义的 SoundBanks.json 结构文件
outputPath          = E:\Developer\Projects\GetOWotWSound\build         # 输出目录
logPath             = E:\Developer\Projects\GetOWotWSound\build\log     # 日志保存目录
tempPath            = E:\Developer\Projects\GetOWotWSound\build\temp    # 临时文件保存目录
asyncNumber         = 4     # 异步并发的数量 [2, max_thread]
enableAsync         = false # 异步
enableSIgnoreCase   = false # 检索忽略大小写
enableSSjson        = false # 保存搜索结果为 json
enableSSlog         = false # 保存搜索结果为 log
enableSScsv         = false # 保存搜索结果为 csv
enableHashId        = false # HashId
enableId            = true  # 生成 ID
enableCreateTypeDir = true  # 分类文件夹
searchEnum          = 2 # 搜索枚举
duplicateEnum       = 1 # 查找重复的 key 枚举
```