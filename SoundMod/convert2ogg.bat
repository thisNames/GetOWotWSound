for %%f in (WemInput\*.wem) do ww2ogg.exe %%f --pcb packed_codebooks_aoTuV_603.bin
for %%f in (*.stream) do ww2ogg.exe %%f --pcb packed_codebooks_aoTuV_603.bin
for %%f in (WemInput\*.ogg) do revorb.exe %%f
move "WemInput\*.ogg" WemOutput\
@REM del "WemInput\*.wem"