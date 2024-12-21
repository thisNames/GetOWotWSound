# SoundMod
### [原工具 SoundMod](http://www.mediafire.com/file/en3m7mctkfedeju/soundMod.zip/file)
> 这里只是使用到 tools 里面的工具

修改文件 convert2ogg 实现将wem转为ogg

添加了一个BNK的解析工具以及一个bnk2wem.bat

---
#### 使用方式：
1. 首先确保BnkInput、WemInput、WemOutput，3个文件夹内都没有文件

2. 将.bnk后缀的文件放入BnkInput文件夹中，运行Bnk2wem.bat后，生成的.wem都会保存到WemInput文件夹中（注意转换后的bnk将被删除，记得备份）

3. 运行ww2ogg.bat即可将.wem转化为.ogg文件（注意转换后的wem将被删除，记得备份）

4. 如果想直接转换.wem文件，则从第三步开始，需要手动将.wem文件拷贝到WemInput目录下

--------
