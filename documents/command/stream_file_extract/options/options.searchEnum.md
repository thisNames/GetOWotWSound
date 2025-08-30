# 搜索枚举

## 命令
- `-opt-sw`, `-options-sStreamfile` searchEnum = 0
- `-opt-sb`, `-options-sSoundBanks` searchEnum = 1

## 描述
- 设置检索搜索时的内容
- searchEnum 默认 2
- 0 => StreamedFiles 即 .wem
- 1 => SoundBanks 即 .bnk
- 2 => StreamedFiles & SoundBanks
- 只需要包含此命令即可

## 父命令
- `-opt`, `-options` [md](options.md)

## 文档
```txt
只搜索 StreamedFiles：owo -opt-sw
只搜索 SoundBanks：owo -opt-sb
```