# 查找重复定义的文件（主命令）

## 命令
- `-dpl`, `-duplicate`

## 描述
- 查找出 SoundBanksInfo 中重复定义的文件，默认搜索全部

## options
### 将结果保存 json
- `-opt-essjson`
```shell
owo opt-dpl -opt-essjson t
```
### 将结果保存 csv
```shell
owo opt-dpl -opt-esscsv t
```
### 设置搜索方式
- `-opt-sw`, `-options-sStreamfile`: 只搜索 StreamedFiles, searchEnum = 0
- `-opt-sb`, `-options-sSoundBanks`: 只搜索 SoundBanks, searchEnum = 1
```shell
owo -opt-dpl -opt-sw
owo -opt-dpl -opt-sb 
```
### 设置比较的属性
- `-opt-did`, `-options-dplId`: 以 Id 查找重复定义的文件, duplicateEnum = 0
- `-opt-dsn`, `-options-dplShortName`: 以 ShortName 查找重复定义的文件, duplicateEnum = 1
- `-opt-didsn`, `-options-dplIdShortName`: 以 Id + ShortName 查找重复定义的文件, duplicateEnum = 2
```shell
owo -opt-dpl -opt-did
owo -opt-dpl -opt-dsn
owo -opt-dpl -opt-didsn
```

## 文档
```txt
SoundBanksInfo 中重复定义的文件数量，Id 相等、ShortName 相对、Id 相等 + ShortName 相对
示例：owo -dpl

结束：
searchEnum     => 2 # 搜索方法
key            => ShortName # 匹配的属性
wemRepeat      => 151 # StreamedFiles 重复定义数量
bnkInWemRepeat => 2792 # SoundBanks 重复定义数量
```