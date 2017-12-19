#!/bin/bash

jsduck \
    sencha-workspace/packages/slate-theme \
    sencha-workspace/packages/slate-core-data/src \
    sencha-workspace/packages/slate-cbl/src \
    sencha-workspace/SlateDemonstrationsStudent/app \
    sencha-workspace/SlateDemonstrationsTeacher/app \
    sencha-workspace/SlateTasksManager/app \
    sencha-workspace/SlateTasksStudent/app \
    sencha-workspace/SlateTasksTeacher/app \
    --output sencha-workspace/docs