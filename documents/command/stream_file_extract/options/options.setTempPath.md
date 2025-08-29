# 临时文件保存目录

## 命令
- `-opt-tmp`, `-options-tempPath`

## 描述
- 设置临时文件保存目录（默认值：<当前工作目录>\build\temp）
- 存放的文件包含：将 wem 转换成 ogg 未经重编码的临时文件、bnk 提取出来的 wem 文件（运行完成后可删除）
- 类型：字符串
- 值：[名称, 绝对路径] 目录路径

## 父命令
- `-opt`, `-options` [md](options.md)

## 文档
```txt
设置在当前工作目录：owo -opt-tmp temp
设置绝对路径：owo -opt-tmp E:\Developer\Projects\GetOWotWSound\build\temp
```