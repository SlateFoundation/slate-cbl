# Getting Started Guide


There are two basic scenarios of using the plugin in a project:

1. as a package in workspace
2. as a package in application

Both are very easy to use and both utilize `Sencha Cmd` to initially generate the application and workspace, maintain them during development and eventually build the application. `Cmd` takes care about identifying the package and its files and include them in bootstrap during development and in the final production build.

## Using in workspace (recommended)

Step by step instructions:

### 1.1 Create the workspace

You must download and unzip `Ext`, install and start an HTTP server and install `Sencha Cmd` if you don’t have them already installed. See [Setup instructions for your OS](http://extjs.eu/videos/) if you need a help with this step. 

Then use a terminal application of your choice and execute the following commands. 
Note: *The commands work literally in Mac OS X and Linux. You need to find equivalents for other operating systems.*

    cd /your/ext/path 
    sencha generate workspace /your/ws


### 1.2 Extract the plugin zip file
Download the plugin zip file to <code>packages</code> subfoder of your workspace. Then:

    cd /your/ws/packages
    unzip saki-grid-multisearch-5-x.y.z.zip

where x.y.z stands for the downloaded file version. You can remove or archive the original zip file if you will.

### 1.3 Build the examples (optional but recommended)
The included examples must be built before you can run them. To build execute:

    cd /your/ws/packages/saki-grid-multisearch-5/examples/gms
    sencha app build

You can see the examples at http://localhost/your/ws/packages/saki-grid-multisearch-5/examples/gms

### 1.4 Create your application (optional)
You would need this step if you do not already have an Ext application.

    cd /your/ws/ext
    sencha generate app MyApp ../myapp

This would generate application with name "MyApp" in folder <code>/your/ws/myapp</code>.

### 1.5 Add the package name to requires array in app.json
The example of app.json:

    {
        // other values

        "requires": [
            "saki-grid-multisearch-5“
        ],

		// other values
    }

### 1.6 For grid configuration see the documentation
See the {@link Ext.saki.grid.MultiSearch MultiSearch Documentation} to find out how to configure
your grids to use the MultiSearch plugin. Do not forget to add the plugin to grid's requires array.

    Ext.define('MyApp.view.MyGrid', {
         extend:'Ext.grid.Panel'
        ,requires:['Ext.saki.grid.MultiSearch']
    });


## Using in application, without workspace

Step by step instructions:

### 2.1 Create your application (optional)
You would need this step if you do not already have an Ext application.

    cd /your/ext/path
    sencha generate app MyApp /your/myapp

This would generate application with name "MyApp" in folder <code>/your/myapp</code>.


### 2.2 Extract the plugin zip file
Download the plugin zip file to <code>packages</code> subfoder of your application. Then:

    cd /your/myapp/packages
    unzip saki-grid-multisearch-5-x.y.z.zip

where x.y.z stands for the downloaded file version

### 2.3 Build the examples (optional)
The included examples must be built before you can run them. To build execute:

    cd /your/myapp/packages/saki-grid-multisearch-5/examples/gms
    sencha app build

You can see the examples at http://localhost/your/myapp/packages/saki-grid-multisearch-5/examples/gms

### 2.4 Add the package name to requires array in app.json
The example of app.json:

    {
        // other values

        "requires": [
            "saki-grid-multisearch-5”
        ],

		// other values
    }

### 2.5 For grid configuration see the documentation
See the {@link Ext.saki.grid.MultiSearch MultiSearch Documentation} to find out how to configure
your grids to use the MultiSearch plugin. Do not forget to add the plugin to grid's requires array.

    Ext.define('MyApp.view.MyGrid', {
         extend:'Ext.grid.Panel'
        ,requires:['Ext.saki.grid.MultiSearch']
    });

