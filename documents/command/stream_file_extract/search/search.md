# 搜索文件（主命令）

## 命令
- `-s`, `-search`

## 描述
- 搜索 SoundBanksInfo 中定义的文件。默认搜索全部

## options
- 将结果保存 json [md](../options/options.enableSSjson.md)
- 将结果保存 csv [md](../options/options.enableSScsv.md)
- 将结果保存 log [md](../options/options.enableSSlog.md)
- 设置搜索方式 [md](../options/options.searchEnum.md)
- 忽略搜索大小写 [md](../options/options.enableSIgnoreCase.md)

## 文档
```txt
搜索全部：owo -s complete
搜索 wem：owo -s complete -opt-sw
搜索 bnk：owo -s complete -opt-sb
保存搜索结果：owo -s complete -opt-essjson t -opt-esslog t -opt-esscsv t
```