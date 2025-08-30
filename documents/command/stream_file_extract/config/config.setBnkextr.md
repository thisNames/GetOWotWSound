# bnk 提取工具

## 命令
- `-cfg-bnk`, `-config-bnkextr`

## 描述
- 设置 SoundMod/bnkextr-v2.exe 工具路径
- 用于提取 .bnk 文件成 .wem 文件的工具，项目已内置最新版本（一般不去改动）
- GitHub: https://github.com/eXpl0it3r/bnkextr
- 类型：字符串
- 值：工具的绝对路径

## 使用
- 设置
```shell
owo -cfg-bnk "<项目路径>\SoundMod\bnkextr-v2.exe"
```

- 设置并查看配置
```shell
owo -cfg-bnk <absPath> -cfg
```

## 父命令
- `-cfg`, `-config` [md](config.md)

## 文档
```txt
```shell
owo -cfg-bnk "<项目路径>\SoundMod\bnkextr-v2.exe" # 设置
owo -cfg-bnk <absPath> -cfg # 设置并查看配置
```