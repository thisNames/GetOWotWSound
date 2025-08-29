# 自定义的 StreamedFiles.json 结构文件

## 命令
- `-opt-cwem`, `-options-customSFStruct`

## 描述
- 使用自定义的 StreamedFiles.json 结构文件（默认值：空，空即为不启用）
- 类型：字符串
- 值：自定义的 StreamedFiles.json 结构文件路径

## StreamedFiles.json 结构文件
### 字段说明
- `Id` 对应游戏音频资源目录中的 .wem 文件名称
- `ShortName` 生成文件的归类目录和文件名称
- `Type` 类型 StreamedFiles | SoundBanks | Other。生成文件的归类目录
- `BnkFile` 对应游戏音频资源目录中的 .bnk 文件名称。先从游戏音频资源目录中取 id.wem 文件，没有再从 .bnk 中取
### json 结构
```json
{
    "SoundBanksInfo": {
        "StreamedFiles": [
            {
                "Id": "1000518441",
                "ShortName": "undefined\\1000518441.wav",
                "Type": "StreamedFiles",
                "BnkFile": ""
            }
        ]
    }
}
```

## 父命令
- `-opt`, `-options` [md](options.md)

## 文档
```txt
设置：owo -opt-cwem mySF.json
转换 wem 时使用自己的结构文件：owo -wem -opt-cwem mySF.json
```