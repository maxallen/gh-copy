#!/bin/bash

# Check if an input file was provided
if [ $# -eq 0 ]; then
    echo "Error: Please provide an input image file"
    echo "Usage: $0 <input_image_file>"
    exit 1
fi

INPUT_IMAGE="$1"

# Check if the input file exists
if [ ! -f "$INPUT_IMAGE" ]; then
    echo "Error: Input file '$INPUT_IMAGE' does not exist"
    exit 1
fi

ffmpeg -i "$INPUT_IMAGE" -vf scale=16:16 favicon-16.png
ffmpeg -i "$INPUT_IMAGE" -vf scale=32:32 favicon-32.png
ffmpeg -i "$INPUT_IMAGE" -vf scale=48:48 favicon-48.png
ffmpeg -i "$INPUT_IMAGE" -vf scale=128:128 favicon-128.png
