#!/bin/bash
cd sencha-workspace

cd SlateDemonstrationsTeacher
sencha app build testing

cd ../SlateDemonstrationsStudent
sencha app build testing

cd ../SlateTasksTeacher
sencha app build testing

cd ../SlateTasksStudent
sencha app build testing

cd ../AggregridExample
sencha app build testing