# 异步并发的数量

## 命令
- `-opt-an`, `-options-asyncNumber`

## 说明
- 设置异步并发数量, `an = <[2, cpu_threads]>`, HDD=2, SATA<=6, NVMe<=12
- 需要启用异步才生效
- 类型：数值
- 值：最小值 2，最大值 CPU 的线程数量
- 磁盘建议：机械硬盘 HDD = 2、固态硬盘 SATA <=6、固态硬盘 NVMe <= 12
- 不建议设置成最大，不然磁盘 IO 会爆满

## 文档
```txt
示例：owo -opt-an 3
```