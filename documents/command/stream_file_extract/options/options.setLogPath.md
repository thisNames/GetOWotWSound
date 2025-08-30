# 日志保存目录

## 命令
- `-opt-log`, `-options-logPath`

## 描述
- 设置日志保存目录（默认值：<当前工作目录>\build\log）
- 类型：字符串
- 值：[名称, 绝对路径] 目录路径

## 日志文件说明
### StreamedFiles 日志
- 同步以 `syncsf` 开头、异步为：`asyncsf`
- 成功打印（控制台输出）：`asyncsf_success_e6816b37.log`
- 失败打印（控制台输出）：`asyncsf_failed_e6816b37.log`
- 成功详情：`asyncsf_success_stdout_e6816b37`
- 失败详情：`asyncsf_failed_stdout_e6816b37`

### SoundBanks 日志
- 同步以 `syncsbk` 开头、异步为：`asyncsbk`
- 成功打印（控制台输出）：`asyncsbk_success_e6816b37.log`
- 失败打印（控制台输出）：`asyncsbk_failed_e6816b37.log`
- 成功详情：`asyncsbk_success_stdout_e6816b37`
- 失败详情：`asyncsbk_failed_stdout_e6816b37`

## 父命令
- `-opt`, `-options` [md](options.md)

## 文档
```txt
设置在当前工作目录：owo -opt-log log
设置绝对路径：owo -opt-log E:\Developer\Projects\GetOWotWSound\build\log
```