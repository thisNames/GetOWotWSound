# 使用教程

## 配置选项
#### 说明
1. `soundAssetsPath`
- {安装目录}\Ori and the Will of the Wisps\oriwotw_Data\StreamingAssets\Audio\GeneratedSoundBanks\Windows
- 包含：wem bnk 资源文件所在的目录（游戏音频资源目录）
- 包含：SoundbanksInfo.json、SoundbanksInfo.xml 文件所在的目录

2. `buildPath` 
- 保存路径，所有的资源最终都会保存在这里
- 此目录还会保存就 bnk 解压出来的 wem 文件，目录名称：bnk_wem_sources 可以删除。

3. `id`（默认 true）
- bool 值，是否在文件的前面加上 id 编号。编号是从 SoundbanksInfo.json 中获取的。
- 加上 id 之后重名的文件不会覆盖，也就是说有的文件虽然是一样的，但是 id 编号不同。（确保文件数量的完整性）

4. `newType`（默认 true）
- bool 值，是否创建分类文件夹，否则直接生成在 buildPath 目录下，堆成一堆（好多文件的）

5.  `ww2ogg`、`revorb`、`www2ogg_packed_codebooks_aoTuV_603`
- SoundMod 下载：http://www.mediafire.com/file/en3m7mctkfedeju/soundMod.zip/file
- ww2ogg.exe、revorb.exe、packed_codebooks_aoTuV_603.bin 所在的路径。
- SoundMod/tools/ww2ogg.exe
- SoundMod/tools/revorb.exe
- SoundMod/tools/packed_codebooks_aoTuV_603.bin

6. `bnkextr`
- bnkextr.exe 工具所在路径
- 下载：https://github.com/eXpl0it3r/bnkextr/releases

7. `logPath`
- 日志保存路径，每个大的类目都独自有一个目录。里面包含 5 个 日志文件。
- Success 成功的日志（控制台输出的）
- successDetail 成功的详细日志
- Failing 失败的日志（控制台输出的）
- FailingDetail 失败的详细日志
- Running 运行日志（控制台输出的）

8. `wemCMax`（默认 20）
- 最大同步并发数量

####  config.properties
```properties
#  游戏音频资源目录
soundAssetsPath = soundAssetsPath

# 保存路径
buildPath = build

# 是否在文件的前面 + id
id = true

# 是否创建分类文件夹，否则直接生成在 buildPath 目录下
newType = true

# ww2ogg.exe 文件路径
ww2ogg = ww2ogg.exe

# ww2ogg.exe 的 SoundMod/packed_codebooks_aoTuV_603.bin 文件路径
www2ogg_packed_codebooks_aoTuV_603 = packed_codebooks_aoTuV_603.bin

# revorb.exe 文件路径
revorb = revorb.exe

# bnkextr.exe 文件路径
bnk2wem = bnkextr.exe

# 日志保存目录
logPath = log

# 最大异步并发数（只对 wem 命令有效）
wemCMax = 20

```
---

## 使用工具
### 1. 只包含工具的版本
1. 确保你的电脑上安装了 nodejs，并且配置好环境变量。
2. 下载发行版本（就几kb），解压进入目录，在此目录打开控制台。
3. 获取游戏内的音乐+少数音效文件：输入命令：
```shell
# 同步
node index.js wem
# 或者异步
node index.js wem promise
```
4. 获取音效文件，输入命令：
```shell
# 同步
node index.js bnk
```
4. 注意：控制台不要处于选择状态，否则会暂停（windows 特性），如果选中暂停了回车即可。
### 2. 包含 node 程序的版本（xxx_Node_vx.x.x）
1. 下载好带 node 的版本，也就是名称中带 Node 的
2. 解压进入目录，里面包含一键运行 bat
3. 获取游戏内的音乐+少数音效文件：`wem.bat`（单进程，且同步）
4. 获取游戏内的音乐+少数音效文件：`wem_promise.bat`（单进程，且异步）
5. 获取所有音效文件：`bnk.bat`（单进程，且同步）

---

### 备注
1. 可以同时运行 wem 和 bnk（注意磁盘占用率，因为是高 IO 操作）
2. 推荐运行：先 wem，再 bnk（反之）
3. 同步运行占用系统资源少，只是运行比较慢。
4. 本工具获取到所有的音频、音效文件。不包含游戏内的 100%。因为也不知游戏里有多少。（不包含 100%，也包含大部分了）
5. 有一些 ogg 文件会有播放失败
    - 显示文件已损坏，未解决。可能是工具不能正确解码导致
    - 可以复制文件的名称，或者前面的 id。在 SoundbanksInfo.xml 文件中搜索到，文件对应的所属的 wem 或者 bnk 文件。
