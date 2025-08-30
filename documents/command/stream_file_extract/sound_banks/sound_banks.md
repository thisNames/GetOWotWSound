# 提取 bnk 文件（主命令）

## 命令
- `-bnk`, `-soundfile`

## 说明（重点）
- bnk 文件 实际上就是 SoundBanksInfo 中 SoundBanks 字段定义的文件

## 描述
- 提取音频资源文件，从 SoundBanks 中获取
- 这里说的 .bnk 就是有游戏音频资源目录下的 .bnk 文件
- 以 SoundBanksInfo 中 SoundBanks 字段定义为准
- SoundBanks 中包含 StreamedFiles 文件
- 每次启动都会询问

## options
- 输出目录 [md](../options/options.outputPath.md)
```shell
owo -bnk -opt-out build # 输出目录
```

- 日志目录 [md](../options/options.setLogPath.md)
```shell
owo -bnk -opt-log log # 日志目录
```

- 临时目录 [md](../options/options.setTempPath.md)
```shell
owo -bnk -opt-tmp temp # 临时目录
```

- 异步并发数量 [md](../options/options.setAsyncNumber.md)
```shell
owo -bnk -opt-an 6 -opt-ea t #异步并发数量、启用异步
```

- 文件拓展名 [md](../options/options.setExtname.md)
```shell
owo -bnk -opt-ext .wav # 文件拓展名
```

- 生成过滤器 [md](../options/options.setFilter.md)
```shell
owo -bnk -opt-fr ori # 过滤器
owo -bnk -opt-fr ori -opt-esic t # 过滤器、忽略大小写
```

- 使用自定义的 SoundBanks.json 结构文件 [md](../options/options.setCustomSBKStruct.md)
```shell
owo -bnk -opt-cbnk mySBK.json # 自定义的 SoundBanks 结构文件
```

- 异步并发处理 [md](../options/options.enableAsync.md)
```shell
owo -bnk -opt-ea t -opt-an 6 # 启用异步、异步并发数量
```

- 文件 ID [md](../options/options.enableId.md)
```shell
owo -bnk -opt-eid t # 文件 ID
```

- 文件 HashID [md](../options/options.enableHashId.md)
```shell
owo -bnk -opt-ehid t # 文件 HashID 
```

- 创建分类文件夹 [md](../options/options.enableCreateTypeDir.md)
```shell
owo -bnk -opt-ectd t # 创建分类文件夹
```

- 过滤器搜索时忽略大小写 [md](../options/options.enableSIgnoreCase.md)
```shell
owo -bnk -opt-fr ori -opt-esic t # 过滤器、忽略大小写
```


## 文档
```txt
owo -bnk -opt-out build # 输出目录
owo -bnk -opt-log log # 日志目录
owo -bnk -opt-tmp temp # 临时目录
owo -bnk -opt-an 6 -opt-ea t #异步并发数量、启用异步
owo -bnk -opt-ext .wav # 文件拓展名
owo -bnk -opt-fr ori # 过滤器
owo -bnk -opt-fr ori -opt-esic t # 过滤器、忽略大小写
owo -bnk -opt-cbnk mySBK.json # 自定义的 SoundBanks 结构文件
owo -bnk -opt-ea t -opt-an 6 # 启用异步、异步并发数量
owo -bnk -opt-eid t # 文件 ID
owo -bnk -opt-ehid t # 文件 HashID 
owo -bnk -opt-ectd t # 创建分类文件夹
owo -bnk -opt-fr ori -opt-esic t # 过滤器、忽略大小写

基本使用提取所有 bnk（同步）：owo -bnk
基本使用提取所有 bnk（异步）：owo -bnk -opt-ea t -opt-an 6
使用过滤器：owo -bnk -opt-fr ori

询问（这里只说几个必要字段、详细可取 options 中查看）
operate             => StreamedFiles    # 本次操作的名称
total               => 14465            # 共处理多少个 wem 文件
bnkTotal            => 122              # 共提取多少个 bnk 文件
extname             => .ogg             # 生成文件后的拓展名
filter              =>                  # 过滤器，空表示不启用
customSBKStruct     =>                  # 自定义的结构文件，空表示不启用
outputPath          => E:\Developer\Projects\GetOWotWSound\build        # 输出目录
logPath             => E:\Developer\Projects\GetOWotWSound\build\log    # 日志目录
tempPath            => E:\Developer\Projects\GetOWotWSound\build\temp   # 临时目录
asyncNumber         => 6        # 异步并发数
enableAsync         => true     # 启用异步
enableSIgnoreCase   => false    # 检索忽略大小写
enableHashId        => true     # 生成 HashID
enableId            => true     # 生成文件 ID
enableCreateTypeDir => true     # 创建分类文件夹

结束输出：
totalSoundBank    => 122    # 总的 bnk 文件数量
totalStreamedFile => 14465  # 总的 wem 文件数量  
bnkExtractSuccess => 122    # 成功提取 bnk 数量
bnkExtractFailed  => 0      # 失败提取 bnk 数量
ww2oggSuccess     => 14440  # 成功将 wem 转换成 ogg 数量
ww2oggFailed      => 25     # 失败将 wem 转换成 ogg 数量
revorbSuccess     => 14440  # 成功将 ogg 重编码数量
revorbFiled       => 25     # 失败将 ogg 重编码数量
bankExtractRate   => 100.00%    # bnk 提取率
wemConversionRate => 99.83%     # wem ogg 转换率
convertTime       => 3.69m      # 用时
```