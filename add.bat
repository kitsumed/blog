@echo off
setlocal enabledelayedexpansion
rem Get the first argument
set postName=%~1
:loopName
rem Move to the next argument https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/shift
SHIFT
rem If no more argument, go to end loop
if "%1" == "" goto endLoopName
set postName=!postName! %~1
goto loopName

:endLoopName
if "%postName%"=="" (
    set /p postName=Please enter your new post name (add .fr at the end for french posts)
)
hugo new "posts/%postName%.md"