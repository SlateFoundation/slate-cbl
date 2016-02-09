#!/bin/bash

jsduck \
    ../../packages/slate-core-data/src \
    ../../packages/slate-cbl/src \
    ../../packages/slate-theme/src \
    ../../SlateDemonstrationsStudent/app \
    ../../SlateDemonstrationsTeacher/app \
    --output build \
    --guides guides.json \
    --eg-iframe eg-iframe.html