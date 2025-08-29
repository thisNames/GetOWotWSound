# 异步并发数量

## 命令
- `-opt-an`, `-options-asyncNumber`

## 说明
- 异步并发数量（默认值：3）
- 需要配合命令：`-opt-ea` 使用，表示启用异步。
- 磁盘建议：机械硬盘 HDD = 2、固态硬盘 SATA <=6、固态硬盘 NVMe <= 12
- 不建议设置成最大值，不然磁盘 IO 会爆满
- 类型：数值
- 值：最小值 2，最大值 CPU 的线程数量

## 父命令
- `-opt`, `-options` [md](options.md)

## 文档
```txt
设置：owo -opt-an 6
启用异步并设置并发数：owo -opt-ea t -opt-an 6
```