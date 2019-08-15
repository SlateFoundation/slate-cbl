# slate-cbl

Provides extensions for Slate to implement Competency-Based Learning

See the [slate-cbl-book](https://github.com/SlateFoundation/slate-cbl-book) repository
for full end-user and contributor documentation.

## In this repository

- `sencha-workspace/packages/slate-cbl`: Sencha CMD package containing shared client-side code
- Client-side UI applications:
  - `sencha-workspace/SlateDemonstrationsTeacher`: Demonstrations dashboard for teachers
  - `sencha-workspace/SlateDemonstrationsStudent`: Demonstrations dashboard for students
  - `sencha-workspace/SlateTasksTeacher`: Tasks dashboard for teachers
  - `sencha-workspace/SlateTasksStudent`: Tasks dashboard for students
  - `sencha-workspace/SlateTasksManager`: Tasks library for all staff
- Server-side extensions for slate:
  - `event-handlers/Slate/CBL/`
  - `html-templates/cbl/`
  - `php-classes/Slate/CBL`
  - `php-migrations/Slate/CBL`
  - `site-root/cbl/`
  - `site-root/img/cbl/`

## Technologies used

- [Emergence](http://emergence.sh): Open toolkit for building and running web applications
- [Slate](http://slate.is): Foundational web application for schools
- [Sencha Ext JS 6 Classic](http://docs.sencha.com/extjs/6.2.0/): Web-based UI framework with rich components library
- Sencha CMD 6.x: Build tools for web UI applications built with Sencha Ext JS
- [Habitat](http://habitat.sh): Provides portable and isolated environments for testing and building

## Getting started with client-side UI application development

See [Getting Started with Development](./books/slate-cbl/development/getting_started.md)

## Installing to a `v2.slate.is` server

1. Copy [sample `slate-cbl.php` git config script](https://github.com/SlateFoundation/slate-cbl/blob/releases/v2/php-config/Git.config.d/slate-cbl.php) into site
1. Visit `/site-admin/sources` and initialize the `slate-cbl` source
1. Return to `/site-admin/sources/slate-cbl` and click <kbd>Sync</kbd> → <kbd>Update emergence VFS</kbd> for the `slate-cbl` layer
1. Build each app:
   - `/sencha-cmd/app-build?name=SlateTasksTeacher`
   - `/sencha-cmd/app-build?name=SlateTasksStudent`
   - `/sencha-cmd/app-build?name=SlateTasksManager`
   - `/sencha-cmd/app-build?name=SlateDemonstrationsTeacher`
   - `/sencha-cmd/app-build?name=SlateDemonstrationsStudent`
