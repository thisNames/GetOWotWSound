# 自定义的 SoundBanks.json 结构文件

## 命令
- `-opt-cbnk`, `-options-customSBKStruct`

## 描述
- 使用自定义的 SoundBanks.json 结构文件（默认值：空，空即为不启用）
- 类型：字符串
- 值：自定义的 SoundBanks.json 结构文件路径

## SoundBanks.json 结构文件
### 字段说明
- `SoundBanks[0].Id` .bnk 文件的 Id
- `SoundBanks[0].Path` 对应游戏音频资源目录中的 .bnk 文件名称
- `SoundBanks[0].IncludedMemoryFiles` 表示 .bnk 文件中包含的 .wem 文件，即提取出来的文件
- `Id` 对应游戏音频资源目录中的 .wem 文件名称
- `ShortName` 生成文件的归类目录和文件名称
- `Type` 类型 StreamedFiles | SoundBanks | Other。生成文件的归类目录
- `BnkFile` 对应游戏音频资源目录中的 .bnk 文件名称。先从游戏音频资源目录中取 id.wem 文件，没有再从 .bnk 中取
### json 结构
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

## 父命令
- `-opt`, `-options` [md](options.md)

## 文档
```txt
设置：owo -opt-cbnk mySBK.json
提取 bnk 时使用自己的结构文件：owo -bnk -opt-cbnk mySBK.json
```