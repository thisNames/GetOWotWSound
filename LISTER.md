# 主要的文件

## Music & Sound Files

### wem
- 所有的定义都在 [SoundbanksInfo](#soundbanksinfojson) 中
#### 数量
- 2425
- SoundBnkInfo.StreamedFiles 实际定义的数量是 2272

#### 类型
- StreamedFile
```json
{
    "Id": "20302852",
    "Language": "SFX",
    "ShortName": "wotw\\howlsOrigin\\props\\portalExitHowlsOrigin_002.wav",
    "Path": "SFX\\wotw\\howlsOrigin\\props\\portalExitHowlsOrigin_002_A02A9068.wem"
}
```
- 音乐文件（一般）

#### 操作
0. wem => ww2ogg => ogg
2. ogg => revorb => ogg

### bnk
- [有自己单独的定义文件](#struct-files)
#### 数量
- 124
- 实际可用的 122
- act2grolsPlunge.bnk
    - No WEM files discovered to be extracted
- persistent_eventsOnly.bnk
    - No WEM files discovered to be extracted

#### 类型
- SoundBank
```xml
<File Id="20302852" Language="SFX">
    <ShortName>wotw\howlsOrigin\props\portalExitHowlsOrigin_002.wav</ShortName>
    <Path>SFX\wotw\howlsOrigin\props\portalExitHowlsOrigin_002_A02A9068.wem</Path>
</File>
```
- 音效音乐文件（主要是）
- SoundBank 包含 StreamedFile

#### 操作
1. bnk => bnkextr => wem
2. wem => ww2ogg => ogg
3. ogg => revorb => ogg

## Struct Files

### json
#### 数量
- 126

#### 类型
##### SoundbanksInfo.json
- 包含所有 wem、bnk 的定义文件
- +1
##### PluginInfo.json
- 只是插件管理的定义文件（不是重点）
- +1
##### ... .json
- 每个单独 bnk 的定义文件
- +124

### xml
#### 数量
- 126

#### 类型
##### SoundbanksInfo.xml
- 包含所有 wem、bnk 的定义文件
- +1
##### PluginInfo.xml
- 只是插件管理的定义文件（不是重点）
- +1
##### ... .xml
- 每个单独 bnk 的定义文件
- +124