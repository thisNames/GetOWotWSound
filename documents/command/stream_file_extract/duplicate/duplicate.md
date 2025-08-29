# 查找重复定义的文件（主命令）

## 命令
- `-dpl`, `-duplicate`

## 描述
- 查找出 SoundBanksInfo 中重复定义的文件，默认搜索全部
- SoundBanksInfo 中重复定义的文件数量，Id 相等、ShortName 相对、Id 相等 + ShortName 相对

## options
- 将结果保存 json [md](../options/options.enableSSjson.md)
- 将结果保存 csv [md](../options/options.enableSScsv.md)
- 设置搜索方式 [md](../options/options.searchEnum.md)


## 文档
```txt
查找全部：owo -dpl
查找 wem：owo -dpl -opt-sw
查找 bnk：owo -dpl -opt-sb
将结果保存 json、csv：owo -dpl -opt-essjson t -opt-esscsv t

结束：
searchEnum     => 2 # 搜索方法
key            => ShortName # 匹配的属性
wemRepeat      => 151 # StreamedFiles 重复定义数量
bnkInWemRepeat => 2792 # SoundBanks 重复定义数量
```