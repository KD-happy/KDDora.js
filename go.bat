@echo off
title 快速压缩
for /f %%i in ('dir /AD-H /B') do (
    echo %%i
    tar -zcvf %%i.dora %%i
)
pause