#!/bin/bash
convert $1 -resize 16x16 favicon.ico
convert $1 -resize 32x32 favicon.png
convert $1 -resize 72x72 assets/img/favicons/apple-icon-72x72.png
convert $1 -resize 114x114 assets/img/favicons/apple-icon-114x114.png
convert $1 -resize 144x144 assets/img/favicons/apple-icon-144x144.png
convert $1 -resize 72x72 assets/img/favicons/apple-icon-precomposed.png
convert $1 assets/img/favicons/logo.png
convert $1 assets/img/logo.png
