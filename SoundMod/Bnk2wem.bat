for %%f in (BnkInput\*.bnk) do bnkextr.exe %%f 
move "*.wem" WemInput
@REM del "BnkInput\*.bnk"