# 使用自定义的 StreamedFiles.json 结构文件

## 命令
- `-opt-cwem`, `-options-customSFStruct`

## 描述
- 使用自定义的 StreamedFiles.json 结构文件, `cwem = <filepath>`
- 类型：字符串
- 值：json 文件路径

## 结构文件
- Id 对应游戏资源中 .wem 文件的名称
- ShortName 对应文件的归类目录和文件名称
- Type 类型
- BnkFile：对应游戏资源中 .bnk 文件的名称。表示从中提取 .wem 文件。Id 先从游戏资源中取，没有再从 .bnk 中取
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

## 文档
```txt
owo -opt-cwem "myStreamedFiles.json"
```