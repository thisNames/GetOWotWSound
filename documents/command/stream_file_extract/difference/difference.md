# 查找未定义的文件（主命令）

## 命令
- `-dif`, `-difference`

## 描述
- 查找出 SoundBanksInfo 中未定义的文件，默认搜索全部
- 在游戏音频资源目录（soundAssetsPath）下所有的 id.wem 文件。在 SoundBanksInfo 中并没有对应的 id 定义，即为未定义的文件。

## options
- 将结果保存 json [md](../options/options.enableSSjson.md)
- 设置搜索方式 [md](../options/options.searchEnum.md)

## 文档
```txt
搜索全部：owo -dif
搜索 wem 文件：owo -dif -opt-sw
搜索 bnk 文件：owo -dif -opt-sb
将搜索的结果保存 json：owo -dif -opt-essjson t

输出：
searchEnum   => 2 # 搜索方式
undefinedWem => 128 # 未定义文件数量
```