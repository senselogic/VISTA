#!/bin/sh
set -x
cd CAROUSEL
stylus style.styl
cd ../FORM
stylus style.styl
cd ../PAGE
stylus style.styl
cd ..