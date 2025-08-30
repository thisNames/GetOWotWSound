# 查看默认可选项（主命令）

## 命令
- `-opt`, `-options`

## 描述
- 查看运行时的可选项
- 如果不设置将使用默认的选项

## 子命令
- `-opt-out`, `-options-outputPath` [md](options.outputPath.md)
- `-opt-log`, `-options-logPath` [md](options.setLogPath.md)
- `-opt-tmp`, `-options-tempPath`[md](options.setTempPath.md)
- `-opt-an`, `-options-asyncNumber` [md](options.setAsyncNumber.md)
- `-opt-ext`, `-options-extname` [md](options.setExtname.md)
- `-opt-fr`, `-options-filter` [md](options.setFilter.md)
- `-opt-cwem`, `-options-customSFStruct` [md](options.setCustomSFStruct.md)
- `-opt-cbnk`, `-options-customSBKStruct` [md](options.setCustomSBKStruct.md)
- `-opt-ea`, `-options-enableAsync` [md](options.enableAsync.md)
- `-opt-eid`, `-options-enableId` [md](options.enableId.md)
- `-opt-ehid`, `-options-enableHashId` [md](options.enableHashId.md)
- `-opt-ectd`, `-options-enableCreateTypeDir` [md](options.enableCreateTypeDir.md)
- `-opt-esic`, `-options-enableSIgnoreCase` [md](options.enableSIgnoreCase.md)
- `-opt-essjson`, `-options-enableSSjson` [md](options.enableSSjson.md)
- `-opt-esslog`, `-options-enableSSlog` [md](options.enableSSlog.md)
- `-opt-esscsv`, `-options-enableSScsv` [md](options.enableSScsv.md)
- `-opt-sw`, `-options-sStreamfile` [md](options.searchEnum.md)
- `-opt-sb`, `-options-sSoundBanks` [md](options.searchEnum.md)
- `-opt-did`, `-options-dplId` [md](options.duplicateEnum.md)
- `-opt-dsn`, `-options-dplShortName` [md](options.duplicateEnum.md)
- `-opt-didsn`, `-options-dplIdShortName` [md](options.duplicateEnum.md)

## 文档
```txt
使用：owo -opt
以下是默认的输出：
extname             = .ogg  # 生成的文件名称后缀
filter              =       # 生成过滤器，没有值则表示不启用
customSFStruct      =       # 使用自定义的 StreamedFiles.json 结构文件，没有值则表示不启用
customSBKStruct     =       # 使用自定义的 SoundBanks.json 结构文件，没有值则表示不启用
outputPath          = <项目路径>\build      # 输出目录
logPath             = <项目路径>\build\log  # 日志保存目录
tempPath            = <项目路径>\build\temp # 临时文件保存目录
asyncNumber         = 4     # 异步并发的数量 [2, max_cpu_thread]
enableAsync         = false # 异步
enableSIgnoreCase   = false # 检索忽略大小写
enableSSjson        = false # 保存搜索结果为 json
enableSSlog         = false # 保存搜索结果为 log
enableSScsv         = false # 保存搜索结果为 csv
enableHashId        = false # HashId，可用于保证数量完整性
enableId            = true  # 生成文件 ID
enableCreateTypeDir = true  # 分类文件夹
searchEnum          = 2 # 搜索枚举
duplicateEnum       = 1 # 查找重复的属性枚举
```
