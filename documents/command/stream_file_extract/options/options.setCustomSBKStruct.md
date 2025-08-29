# 使用自定义的 SoundBanks.json 结构文件（子命令）

## 命令
- `-opt-cbnk`, `-options-customSBKStruct`

## 描述
- 使用自定义的 SoundBanks.json 结构文件, `cbnk = <filepath>`
- 类型：字符串
- 值：json 文件路径

## 结构文件
- SoundBanks[0].Id .bnk 文件 Id
- SoundBanks[0].Path 对应游戏资源中 .bnk 文件的名称
- SoundBanks[0].IncludedMemoryFiles .bnk 文件中包含的 .wem 文件，即提取出来的文件
- Id 对应游戏资源中 .wem 文件的名称
- ShortName 对应文件的归类目录和文件名称
- Type 类型
- BnkFile：对应游戏资源中 .bnk 文件的名称。表示从中提取 .wem 文件。Id 先从游戏资源中取，没有再从 .bnk 中取
```json
{
    "SoundBanksInfo": {
        "SoundBanks": [
            {
                "Id": "13348331",
                "Path": "corruptSpiderling.bnk",
                "IncludedMemoryFiles": [
                    {
                        "Id": "6516071",
                        "ShortName": "characters\\enemies\\corruptSpiderling\\corruptSpiderlingHitReactionSmall_003.wav",
                        "Type": "SoundBanks",
                        "BnkFile": "corruptSpiderling.bnk"
                    },
                    {
                        "Id": "11777040",
                        "ShortName": "characters\\enemies\\corruptSpiderling\\corruptSpiderlingBodyFall_008.wav",
                        "Type": "SoundBanks",
                        "BnkFile": "corruptSpiderling.bnk"
                    }
                ]
            }
        ]
    }
}
```

## 文档
```txt
示例：owo -opt-cbnk mySoundBanks.json
```