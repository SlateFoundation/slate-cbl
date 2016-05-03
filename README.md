slate-cbl
=========
Provides server-side extensions for slate-v2, several [Ext JS 6 Classic](http://docs.sencha.com/extjs/6.0/) UI applications, and a Sencha CMD package called `slate-cbl` containing common components for the UI applications.


## Getting started with development
1. [Install latest 6.x Sencha CMD](https://www.sencha.com/products/extjs/cmd-download/)
2. `git clone --recursive -b releases/v2/develop git@github.com:SlateFoundation/slate-cbl.git`
3. `cd ./slate-cbl`
4. `./build-all-apps.sh`

If you have a version of GIT older than 1.6, get a newer version of git.

Then run a web server from `sencha-workspace` or higher in your file tree and navigate to the subdirectory for the app you want to run in your browser. If you don't have a server you can run `sencha web start`
to run a basic local server at [http://localhost:1841](http://localhost:1841).


## Connecting to a server
You can connect to any remote slate-cbl instance that has CORS enabled by appending the query
parameter `apiHost` when loading the page.
