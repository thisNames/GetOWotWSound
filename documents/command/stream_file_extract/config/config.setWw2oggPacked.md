# codebooks

## 命令
- `-cfg-w2gp`, `-config-www2oggPacked`

## 描述
- 设置 SoundMod/packed_codebooks_aoTuV_603.bin 文件路径,
- ww2ogg-v0.24.exe 工具运行参数 --pcb 所需要的 codebooks 文件，项目已内置最新版本（一般不去改动）
- 详细了解 -> GitHub: https://github.com/hcs64/ww2ogg
- 类型：字符串
- 值：文件所在的绝对路径

## 使用
- 设置
```shell
owo -cfg-w2gp "<项目路径>\SoundMod\packed_codebooks_aoTuV_603.bin"
设置并查看：owo -cfg-w2gp <absPath> -cfg
```

## 父命令
- `-cfg`, `-config` [md](config.md)

## 文档
```txt
owo -cfg-w2gp "<项目路径>\SoundMod\packed_codebooks_aoTuV_603.bin"
设置并查看：owo -cfg-w2gp <absPath> -cfg # 设置
```