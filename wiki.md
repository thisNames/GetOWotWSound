# 使用教程 & 其他说明

> [一只橙叙原](https://space.bilibili.com/1684627521)、[立秋枫林晚](https://space.bilibili.com/701443748)

## 静态配置说明 `config.properties`
1. `soundAssetsPath`
    - {游戏安装目录}\Ori and the Will of the Wisps\oriwotw_Data\StreamingAssets\Audio\GeneratedSoundBanks\Windows
    - 包含：wem bnk 资源文件所在的目录（游戏音频资源目录）
    - 包含：SoundbanksInfo.json、SoundbanksInfo.xml 文件所在的目录

2. `buildPath` __[*](#日志-logpath)__
    - 保存路径，所有的资源最终都会保存在这里
    - 此目录还会保存 bnk 解压出来的 wem 临时文件，目录名称：`bnk_wem_sources` 可以删除。

3. `logPath`
    - 日志保存目录

4. `id`
    - bool 值（true / false）
    - 是否在文件的前面加上 id 编号。编号是从 SoundbanksInfo.json 中获取的。
    - 加上 id 之后重名的文件不会覆盖，也就是说有的文件虽然是一样的，但是 id 编号不同。（确保文件数量的完整性）

5. `newType`
    - bool 值（true / false）
    - 是否创建分类文件夹，否则直接生成在 buildPath 目录下。堆成一堆（好多文件的）

6. `ww2ogg`
    - ww2ogg.exe 工具路径
    - 已内置项目中，位于：[SoundMod/ww2ogg.exe](SoundMod/ww2ogg.exe)

7. `www2ogg_packed_codebooks_aoTuV_603`
    - ww2ogg.exe 的 packed_codebooks_aoTuV_603.bin 文件路径
    - 已内置项目中，位于：[SoundMod/packed_codebooks_aoTuV_603.bin](SoundMod/packed_codebooks_aoTuV_603.bin)

8. `revorb`
    - revorb.exe 工具路径
    - 已内置项目中，位于：[SoundMod/revorb.exe](SoundMod/revorb.exe)

9. `bnk2wem`
    - bnkextr.exe 工具路径
    - 已内置项目中，位于：[SoundMod/bnkextr.exe](SoundMod/bnkextr.exe)

10. `soundbanksInfo`
    - SoundbanksInfo.js 文件的路径
    - 已知的音频文件的结构配置文件，游戏内`大部分`的音频都配置在此文件中。

---

## 命令行提示
### 获取提示
- `help` 命令、或者没有任何命令

### 提示说明
```shell
commands:
    wem executer <n/ori>                # 获取音频资源 .wem（同步）
    wem executer <n/ori> async <n>      # 获取音频资源 .wem（异步、同步并发）
    wem list                            # 获取 wem 文件的数量

    bnk executer <n/ori> task <n/ori>                            # 获取音效资源 .bnk（单进程、同步）
    bnk executer <n/ori> task <n/ori> cps <n> async <true/false> # 获取音效资源 .bnk（多进程、异步）beta
    bnk list                                                     # 获取 bnk 文件的数量
        
    ori     # 打印一个 ori
    help    # 帮助
    list    # 获取 wem 文件、bnk 文件的数量（以 SoundBanksInfo 文件中定义的为准）

options:
    executer <n/ori>
            # 解析获取 wem 文件的数量 n 或者 ori（all 所有）

    async <n>
            # 同步并发最大数量 n。（3 ~ 100 即可）
            # 如果太大会导致终端延迟打印、事件队列堆塞，导致运行速度大大降低。
            # 因为要等所有的同步发放任务执行完毕，才会执行异步任务...（略）

    task <n/ori>
            # 解析获取 bnk 文件的数量 n 或者 ori（all 所有）
            # executer * task = 输出的文件总数
            # 例举：executer 9 * task 3 = 27 个文件

    cps <n>
            # 子进程的数量 n（并发数）
            # 数量建议不要太大，最好是 CPU 线程数量的三分之一即可

    async <true/false>
        # 子进程同步、异步并发（true 异步、false 同步）

commons: 
    wem build ori           # 获取所有音频资源 .wem（同步）
    wem build ori async     # 获取所有音频资源 .wem（异步）默认 async=20

    bnk build ori           # 获取所有音效资源 .bnk（单进程、同步）
    bnk build ori cps       # 获取所有音效资源 .bnk（多进程、同步并发）默认 cps=3
```
### 例举
- `cps 3` 表示最多 3 个进程同时运行
```shell
# 解压 3 个 bnk 文件，并获取每个 bnk 文件中的前 9 个 wem 文件。输出的文件数量为：3 * 9 = 27
npm start bnk executer 9 task 3 cps 3 async false

# 解压 3 个 bnk 文件，并获取每个 bnk 文件中的所有 wem 文件。输出的文件数量为：3 * ori = 3ori
npm start bnk executer ori task 3 cps 3 async false

# 解压所有的 bnk 文件，并获取每个 bnk 文件中的前 9 个 wem 文件。输出的文件数量为：ori * 9 = ori9
npm start bnk executer 9 task ori cps 3 async false

# 所有 bnk 文件里的所有 wem 文件。输出为 ori * ori = 能够成功解析 all
npm start bnk executer ori task ori cps 3 async false
```
### 补充
- cps 不要太大，磁盘可能占用率高。（随机读写）
- async 不能太大，不然会导致事件队列阻塞，运行反而变慢。（3 ~ 100 即可）
- bnk 的多进程异步并发存在少量文件丢失文件，所以建议使用同步的。[documents/2.0.0/t_004.md#测试获取所有](documents/2.0.0/t_004.md#测试获取所有)
- 当然你可以直接使用 `commons` 里的常用命令也行。
---

## 生成说明
### 名称
```text
1af7f1734629717422_539484803_WaterDropsMultiLight_003.wav
```
#### 可看成：A_B_C
##### A
- FID 文件的序号 ID。
- 前 5 位是一个 16 进制随机数、后面的只是时间戳罢了（懒得写那么复杂得ID生成算法_(:3 」∠ )_）
- 为了确保输出的文件数量一致、虽然它有重复，但是还是要有的。原因可看测试文件 [documents/2.0.0/t_003.md#测试获取所有](documents/2.0.0/t_003.md#测试获取所有)
##### B
- SoundBanksInfo.json / .xml 中配置的文件 ID
- `soundAssetsPath` 配置目录里的文件名称（一般存在）。`id.wem`
- 可以使用此 ID 在 SoundBanksInfo.json / .xml 文件或 `soundAssetsPath` 配置目录中搜索哦

##### C
- 就是文件的名称了
- 以 SoundBanksInfo.json / .xml 中配置的名称为准

### 目录
1. `buildPath` 配置目录里的 `bnk_wem_source`：bnk 文件解压出来的临时文件（.wem），可以删除。
2. `logPath` 配置目录里的例举 `bnk_to_wem_to_ogg_sync` 包含 `_` 的是运行日志。
2. `logPath` 配置目录里的 例举 `act1HowlsOrigin` 没有包含 `_` 的，其实一个目录对应一个 bnk 文件的处理运行日志。

### 日志-`logPath`
> 日志保存路径，每个大的类目都独自有一个目录保存，里面包含 `5` 个日志文件。
1. `Success` 成功的日志 __（控制台输出的）__
2. `successDetail` 成功的详细日志
3. `Failing` 失败的日志 __（控制台输出的）__
4. `FailingDetail` 失败的详细日志
5. `Running` 运行步骤日志 __（控制台输出的）__
---
## 备注
### 运行
- 全屏 cmd 运行
- cmd 运行选中，如果被选中就会卡住暂停，只需要回车一下即可（windows cmd 特性属于了）
- 可以同时运行 wem 和 bnk，也就是同时运行两个终端（注意磁盘占用率，因为是高 IO 操作、随机读写）
- 推荐运行：先 wem，再 bnk（反之）。
- 同步运行占用系统资源少，只是运行比较慢，可以放在后台运行。
- __注意__ 异步多进程运行，可能会占满 cpu 和磁盘，因为一个进程单独处理一个 bnk 文件。而一个 bnk 文件中又有多个 wem 文件，每解析一个 wem 文件，都会调用解析工具进行解析，以此类推。`beta`
### 问题
- 关于有一些音频文件播放失败
- 显示文件已损坏，`未解决`，可能是解码工具不能正确解码导致
- 可以复制文件的名称，或者前面的 id。在 `SoundbanksInfo.xml / SoundbanksInfo.json` 文件中搜索到文件对应的所属的 wem 或者 bnk 文件。
- 或者直接在 `soundAssetsPath` 目录中搜索。

## 声明
- 本工具获取到所有的音频、音效文件。不包含游戏内的 100%。因为也不知游戏里有多少。（不包含 100%，也包含大部分了）
- 不同平台的游戏，可能出来的音频文件数量不一样。（但是基本大差不差）

---

> END 完 ...

<p align="center">
  <img src="img/ori_b.png" width="500">
</p>


