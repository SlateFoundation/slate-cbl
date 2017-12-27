slate-cbl
=========
Provides extensions for Slate to implement Competency-Based Learning

See the [slate-cbl-book](https://github.com/SlateFoundation/slate-cbl-book) repository
for full end-user and contributor documentation.

## In this repository
- `sencha-workspace/slate-cbl`: Sencha CMD package containing shared client-side code
- Client-side UI applications:
  - `sencha-workspace/SlateDemonstrationsTeacher`: Demonstrations dashboard for teachers
  - `sencha-workspace/SlateDemonstrationsStudent`: Demonstrations dashboard for students
  - `sencha-workspace/SlateTasksTeacher`: Tasks dashboard for teachers
  - `sencha-workspace/SlateTasksStudent`: Tasks dashboard for students
- Server-side extensions for slate:
  - `event-handlers/Slate/CBL/`
  - `html-templates/cbl/`
  - `php-classes/Slate/CBL`
  - `php-migrations/Slate/CBL`
  - `site-root/cbl/`
  - `site-root/img/cbl/`


## Technologies used
- Emergence
- Slate
- Sencha CMD 6.x
- [Sencha Ext JS 6 Classic](http://docs.sencha.com/extjs/6.0/)


## Getting started with client-side UI application development
1. [Install latest 6.x Sencha CMD](https://www.sencha.com/products/extjs/cmd-download/)
2. `git clone --recursive -b develop git@github.com:SlateFoundation/slate-cbl.git`
3. `cd ./slate-cbl`
4. `./build-all-apps.sh`

If you have a version of GIT older than 1.6, get a newer version of git.

Then run a web server from `sencha-workspace` or higher in your file tree and navigate to the subdirectory for the app you want to run in your browser. If you don't have a server you can run `sencha web start`
to run a basic local server at [http://localhost:1841](http://localhost:1841).

### Client-side UI application documentation

View the latest docs online at [http://slatefoundation.github.io/slate-cbl/](http://slatefoundation.github.io/slate-cbl/)

To update these docs, run `build.sh` and then `publish.sh` within `sencha-workspace/docs`

### Connecting to a server
You can connect to any remote slate-cbl instance that has CORS enabled by appending the query
parameter `apiHost` when loading the page.


## Installing to a `v2.slate.is` server
1. Copy [sample `slate-cbl.php` git config script](https://github.com/SlateFoundation/slate-cbl/blob/releases/v2/php-config/Git.config.d/slate-cbl.php) into site
2. Visit `/site-admin/sources` and initialize the `slate-cbl` source
3. Return to `/site-admin/sources/slate-cbl` and click <kbd>Sync</kbd> → <kbd>Update emergence VFS</kbd> for the `slate-cbl` layer
4. Push sencha builds to instance, logging in with a developer account when prompted: `http://cbl.projects.jarv.us/push-builds?ref=releases/v2&host=SITE_HOSTNAME`
  - Alternatively, builds may be created locally and uploaded to `sencha-build/APP_NAME/production`

## Roadmap

### Current release

- [ ] Update tool URLs in php-config/Slate/UI/Tools.config.d/cbl.php
- [ ] Investigate baselines getting `NULL`d out: https://github.com/SlateFoundation/slate-fixtures/commit/74b14c13b783afed59463e90fb4770ae67f6745c
- [ ] Merge Ext JS code generator upstream
- [ ] Merge JSON override upstream
  - [ ] add HTTP header support
  - [ ] write blog post documenting $sql_queries option
  - [ ] Add `<debug> ... </debug>`-wrapped support to emergence-apikit to report on requests in console

### Next release

- [ ] Refactor TargetLevel -> Level and DemonstratedLevel -> Rating