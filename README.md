# GetOWotWSound

<p align="center">
  <img src="img/ori_top.png" width="500">
</p>

## 简介
### 工具功能
- 获取游戏里的音频、音效文件。批量处理 + 分类收集。

### 运行环境
- 使用 javascript 脚本，nodejs 运行环境。不依赖任何第三方库，仅仅使用原生 node（建议使用 18x lts 版本）。

### 声明
- 本项目不会有一行删除文件，目录的代码。只会新建目录，生成文件（放心食用）
> 使用 javascript es6 面向对象。但是我没有对象（悲）

<p align="center">
  <img src="img/1.jpg" width="330">
</p>

- 解压出来的所有资源都属于游戏本身的，不允许进行售卖哦。

---

## 执行逻辑（概要）
> 读取 SoundbanksInfo.xml 或者 SoundbanksInfo.json（都一样的），因为使用 nodejs，所以选择读取 json 文件，因为 nodejs 内置了 json 解析器

### 获取 ReferencedStreamedFiles 文件（一些音乐、音效）
- 获取 遍历 StreamedFiles 节点里的 file 对象
- 每一个 file 对象对应着一个 wem 文件
1. `Id` 可选项
1. `Language` 这里没有使用到
1. `ShortName` 此音频的分类、名称。
1. `Path` 这里没有使用到
- 通过 id 获取对应 wem 文件，使用工具 ww2ogg.exe 将 wem 转换成 ogg 格式
> 转换成 ogg 成功率不是 100%，虽然转换出来了，但是有可能是损坏的
- 使用 ShortName 使用全类名的方式将文件保存至目标目录
- 再次通过 revorb.exe 再次执行生成的 ogg 文件，不然会出现音频无法拖动的 bug，但是可以正常播放

---
### 获取 IncludedMemoryFiles 文件（多数是音效）
- 遍历 SoundBanks 节点里的 SoundBank 对象
- 获取到一个 SoundBank，使用 SoundBank.ShortName（唯一的）名称新建目录 `ShortNamePath`
- 使用 Path 获取对应的 bnk 文件 
- 使用工具 bnkextr.exe 解压 bnk 文件，将解压出来所有的 wem 文件存放在 `ShortNamePath` 目录下。
- 获取 `ShortNamePath` 目录所有的 wem 文件，保存至 `wem 数组`。
- 遍历 IncludedMemoryFiles 数组，以此数组的索引，作为 `wem 数组` 索引（每一个 File）。
- 使用工具 ww2ogg.exe 将 对应的 wem 转换成 ogg 格式。
- 转换时以 File.ShortName 进行全类名分类保存
> wem 文件从 `wem 数组` 中顺序获取
> bnkextr.exe 解压出来的 wem 文件，在转换成 ogg 时。成功率不会是 100%。转换失败。即不会生成 ogg 文件。也就是 done 为 false
- 将此转换 ogg 文件，保存至 buildPath 的目录内
- 通过 revorb.exe 再次执行生成的 ogg 文件，不然会出现音频无法拖动的 bug，但是可以正常播放
----
### 实体类映射 Model
json

```json
{
    "Id": "77404",
    "Language": "SFX",
    "ShortName": "a\\b\\c\\name.wav",
    "Path": "SFX\\a\\b\\c\\name.wav_7BACA535.wem"
}
```
Or

xml
```xml
<File Id="979792347" Language="SFX">
    <ShortName>a\\b\\c\\name.wav</ShortName>
    <Path>a\\b\\c\\name.wav_99B043E3.wem</Path>
</File>
```

---

## 说明
- 通过工具（ww2ogg.exe）将本地的 wem 文件转换成 ogg 文件时，所有文件基本全部成功。重名的文件，也想保留的话建议把 `id` 打开，否则直接覆盖。
- 但是如果是 bnk 文件解压出来的 wem 文件，再通过工具（ww2ogg.exe）将 wem 文件转换成 ogg 文件时成功率不是 100% 的。也就是说不会生成 ogg 文件（未解决）

### 此项目使用到的工具
1. `bnkextr.exe` 将 bnk 文件解压成 wem 文件。下载：https://github.com/eXpl0it3r/bnkextr/releases
2. SoundMod 下载：http://www.mediafire.com/file/en3m7mctkfedeju/soundMod.zip/file
    -  `SoundMod/tools/ww2ogg.exe`
    -  `SoundMod/tools/revorb.exe` 
    -  `SoundMod/tools/packed_codebooks_aoTuV_603.bin`
3. 以防万一，已将工具内置项目中了，位于 `SoundMod` 目录中

### 运行配置说明
数值参数都移植至命令参数，配置文件中只包含静态配置（v2.0.0）

### 详细看 [wiki](wiki.md)

---
## 结束 END
- 同步运行，也就是一个一个文件解析分类，只有上一个完成，才会执行下一个。虽然慢了点，毕竟文件太多了（所有的运行完毕会生成 20000 左右文件），实测大概需要 1000000 ms 左右（bnk）。400000 ~ 500000 ms（wem）。
- 主要的耗时任务就是将 bnk 解压和将 wem 转换成 ogg 文件。
- 也有可能是我的电脑比较垃圾（悲）

1. 疯狂写`注释`，`注`到昏撅
1. 疯狂`debug`，`d`到昏撅
1. 疯狂调试`日志`，日……`志`到昏撅

<p align="center">
 <img src="img/mua_.png" width="330">
</p>

###### 觉得有用的记得点点 `Star` !!!
>(脸红.jpg) 

---

## [O - R - I](https://www.orithegame.com/)
```text
⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀  " ' O ' ''
⠀⠀⠀⠀⠀⣷⣀⠀⠀⠀⠀⠀⣤⡀⠲⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢻⣿⣿⣤⡀⠀⠀⠀⣛⣿⣾⣿⣿⣶⣶⣦⣤⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣇⢇⢀⣴⣿⣿⣿⣿⣤⠊⣿⣦⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠙⢿⣯⣧⣷⢷⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣤⣿⣧⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⡿⠉⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⣤⣿⣿⣿⣿⣿⣿⡿⠋⠁⠀⣤⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠒⠿⢿⣿⣿⠿⠿⠛⠉⢀⣤⣤⣶⣿⣿⣿⣿⣯⠁⠀⠀⢀⣾⣿⣷⢆⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣿⣿⣿⣿⣿⣿⣯⣾⠋⠿⣷⣤⣤⣿⣿⣷⣷⣧⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⢏⣿⣿⣿⣿⣦⢄⢈⢻⣿⣿⣿⡿⠁⠀⠀
⠀⠀⠀⠀⠀⠀⢠⢔⠸⣿⣿⣿⣿⣿⡀⢫⣿⣿⣿⣿⣎⣇⠇⠛⠋⠁⠀⠀⠀⠀
⠀⠀⠀⢀⢆⠃⠀⠀⠀⠻⣟⣿⣿⠛⠁⢀⣠⣾⣿⣿⣟⣧⢀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢠⣏⠀⠀⠀⠀⠀⠀⠀⠈⠀⢀⣤⣾⣿⠟⠋⢀⣯⠓⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢸⣗⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⠁⠀⠀⠀⢻⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠻⣷⣦⣆⣦⣦⣦⣦⣶⣶⣮⣯⠀⠀⠀⠀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠉⠉⠉⢹⡿⣿⣶⠀⠀⢀⣾⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣾⠟⠀⢈⣿⣿ ⠻⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⣠⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⠛⠀             
-----------------------------------
----------------------
-----------
---
```
