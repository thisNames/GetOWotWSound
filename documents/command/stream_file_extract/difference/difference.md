# 查找未定义的文件（主命令）

## 命令
- `-dif`, `-difference`

## 描述
- 查找出 SoundBanksInfo 中未定义的文件，默认搜索全部

## options
### 将结果保存 json
`-opt-essjson`, `-options-enableSSjson`: 启用保存搜索结果为json, `essjson = <[true, t]>`
```shell
owo opt-dif -opt-essjson t
```
### 设置搜索方式
- `-opt-sw`, `-options-sStreamfile`: 只搜索 StreamedFiles, searchEnum = 0
- `-opt-sb`, `-options-sSoundBanks`: 只搜索 SoundBanks, searchEnum = 1
```shell
owo -opt-dif -opt-sw
owo -opt-dif -opt-sb 
```

## 文档
```txt
在游戏资源目录（soundAssetsPath）下所有的 .wem 文件。id.wem，在 SoundBanksInfo 中并没有对应的 id 定义，即为未定义的文件。
示例：owo -dif

结束：
searchEnum   => 2 # 搜索方式
undefinedWem => 128 # 未定义文件数量
```