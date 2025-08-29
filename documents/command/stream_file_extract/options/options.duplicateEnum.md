# 重复属性枚举

## 命令
- `-opt-did`, `-options-dplId` duplicateEnum = 0
- `-opt-dsn`, `-options-dplShortName` duplicateEnum = 1
- `-opt-didsn`, `-options-dplIdShortName` duplicateEnum = 2 

## 描述
- 设置查找重复定义文件时的属性
- duplicateEnum 默认 1
- 0 => 使用 Id 属性值
- 1 => 使用 ShortName 属性值
- 2 => 使用 Id + ShortName 属性加起来的值
- 只需要包含此命令即可

## 父命令
- `-opt`, `-options` [md](options.md)

## 文档
```txt
使用 Id 属性：owo -opt-did
使用 ShortName 属性：owo -opt-dsn
使用 Id + ShortName 属性：owo -opt-didsn
```