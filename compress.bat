@echo off
setlocal enabledelayedexpansion

rem input dir
set /p input_dir="Enter the input directory (where the original images are): "

rem outpout dir
set /p output_dir="Enter the output directory (where the WebP images will be saved): "

rem Check for dirs
if not exist "%input_dir%" (
    echo Input directory does not exist!
    exit /b 1
)
if not exist "%input_dir%" (
    echo Output directory does not exist!
    exit /b 1
)

rem Loop through all image files in the input directory
for %%f in ("%input_dir%\*.jpg" "%input_dir%\*.jpeg" "%input_dir%\*.png" "%input_dir%\*.bmp" "%input_dir%\*.tiff" "%input_dir%\*.webp") do (
    set "file_name=%%~nf"
    
    rem Convert the image to WebP format using ImageMagick
    magick "%%f" -quality 74 -resize "1200x1200\>" -strip "%output_dir%\!file_name!.webp"
    
    echo Converted %%f to %output_dir%\!file_name!.webp
)

echo Conversion complete!
timeout /t 10