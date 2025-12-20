@echo off
setlocal EnableDelayedExpansion

rem Build postName from all arguments
set "postName=%~1"
:loopName
SHIFT
if "%~1"=="" goto endLoopName
set "postName=!postName! %~1"
goto loopName

:endLoopName
rem Ask user if nothing was provided
if not defined postName (
    set /p "postName=Please enter your new post name [add .fr at the end for french posts]: "
)

rem Remove language suffixes
set "postNameWithoutSuffix=!postName:.fr=!"
set "postNameWithoutSuffix=!postNameWithoutSuffix:.en=!"

rem Create Hugo post
if "!postName:~-3!"==".fr" (
    hugo new "posts/!postNameWithoutSuffix!/index.fr.md"
) else (
    hugo new "posts/!postNameWithoutSuffix!/index.md"
)

endlocal
