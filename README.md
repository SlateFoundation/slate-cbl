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
2. `git clone --recursive -b releases/v2/develop git@github.com:SlateFoundation/slate-cbl.git`
3. `cd ./slate-cbl`
4. `./build-all-apps.sh`

If you have a version of GIT older than 1.6, get a newer version of git.

Then run a web server from `sencha-workspace` or higher in your file tree and navigate to the subdirectory for the app you want to run in your browser. If you don't have a server you can run `sencha web start`
to run a basic local server at [http://localhost:1841](http://localhost:1841).

### Connecting to a server
You can connect to any remote slate-cbl instance that has CORS enabled by appending the query
parameter `apiHost` when loading the page.
