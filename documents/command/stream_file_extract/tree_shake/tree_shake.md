# 字段树摇（主命令）

## 命令
- `-trs`, `-treeshake`

## 描述
- 将 SoundBnkInfo 中多余的字段统统删除，并生成缓存文件（可提高加载速度）
- 首此运行建议运行此命令
- 缓存目录位于：<项目目录>/resource/cache，请勿删除！！！

## 子命令
- `-trs-clr`, `-treeshake-clear` [md](tree_shake.clearCacheFile.md)
- `-trs-del`, `-treeshake-delete` [md](tree_shake.deleteCacheFile.md)

## 文档
```txt
使用：owo -trs
输出：
cacheGenerator
originSize        => 6.32MB # 源文件大小
cacheSize         => 2.28MB # 树摇后文件大小
listStreamedFile  => 2272   # StreamedFiles 中定义 wem 文件数量
bnk               => 122    # SoundBanks 中定义 bnk 文件数量
listSoundBank     => 14465  # SoundBanks 中定义 StreamedFiles 文件数量
totalStreamedFile => 16737  # 总的 StreamedFiles 文件数量
timeMS            => 50     # 耗时毫秒
```