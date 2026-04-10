#!/bin/bash

# Define the source directory (dist output)
SRC_DIR="dist"

# Read version from dist/manifest.json
VERSION=$(grep '"version":' dist/manifest.json | sed 's/.*"\(.*\)".*/\1/')

# Define the output zip file name
OUTPUT_ZIP="chrome_extension_v$VERSION.zip"

# Check if the source directory exists
if [ -d "$SRC_DIR" ]; then
    # Zip the files in the source directory
    zip -r "$OUTPUT_ZIP" "$SRC_DIR"
    echo "Files in $SRC_DIR have been zipped into $OUTPUT_ZIP"
else
    echo "Source directory $SRC_DIR does not exist."
fi
