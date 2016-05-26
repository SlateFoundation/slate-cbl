Ext.data.JsonP.getting_started({"guide":"<h1 id='getting_started-section-getting-started-guide'>Getting Started Guide</h1>\n<div class='toc'>\n<p><strong>Contents</strong></p>\n<ol>\n<li><a href='#!/guide/getting_started-section-using-in-workspace-%28recommended%29'>Using in workspace (recommended)</a></li>\n<li><a href='#!/guide/getting_started-section-using-in-application%2C-without-workspace'>Using in application, without workspace</a></li>\n</ol>\n</div>\n\n<p>There are two basic scenarios of using the plugin in a project:</p>\n\n<ol>\n<li>as a package in workspace</li>\n<li>as a package in application</li>\n</ol>\n\n\n<p>Both are very easy to use and both utilize <code>Sencha Cmd</code> to initially generate the application and workspace, maintain them during development and eventually build the application. <code>Cmd</code> takes care about identifying the package and its files and include them in bootstrap during development and in the final production build.</p>\n\n<h2 id='getting_started-section-using-in-workspace-%28recommended%29'>Using in workspace (recommended)</h2>\n\n<p>Step by step instructions:</p>\n\n<h3 id='getting_started-section-1.1-create-the-workspace'>1.1 Create the workspace</h3>\n\n<p>You must download and unzip <code>Ext</code>, install and start an HTTP server and install <code>Sencha Cmd</code> if you don’t have them already installed. See <a href=\"http://extjs.eu/videos/\">Setup instructions for your OS</a> if you need a help with this step.</p>\n\n<p>Then use a terminal application of your choice and execute the following commands.\nNote: <em>The commands work literally in Mac OS X and Linux. You need to find equivalents for other operating systems.</em></p>\n\n<pre><code>cd /your/ext/path \nsencha generate workspace /your/ws\n</code></pre>\n\n<h3 id='getting_started-section-1.2-extract-the-plugin-zip-file'>1.2 Extract the plugin zip file</h3>\n\n<p>Download the plugin zip file to <code>packages</code> subfoder of your workspace. Then:</p>\n\n<pre><code>cd /your/ws/packages\nunzip saki-grid-multisearch-5-x.y.z.zip\n</code></pre>\n\n<p>where x.y.z stands for the downloaded file version. You can remove or archive the original zip file if you will.</p>\n\n<h3 id='getting_started-section-1.3-build-the-examples-%28optional-but-recommended%29'>1.3 Build the examples (optional but recommended)</h3>\n\n<p>The included examples must be built before you can run them. To build execute:</p>\n\n<pre><code>cd /your/ws/packages/saki-grid-multisearch-5/examples/gms\nsencha app build\n</code></pre>\n\n<p>You can see the examples at http://localhost/your/ws/packages/saki-grid-multisearch-5/examples/gms</p>\n\n<h3 id='getting_started-section-1.4-create-your-application-%28optional%29'>1.4 Create your application (optional)</h3>\n\n<p>You would need this step if you do not already have an Ext application.</p>\n\n<pre><code>cd /your/ws/ext\nsencha generate app MyApp ../myapp\n</code></pre>\n\n<p>This would generate application with name \"MyApp\" in folder <code>/your/ws/myapp</code>.</p>\n\n<h3 id='getting_started-section-1.5-add-the-package-name-to-requires-array-in-app.json'>1.5 Add the package name to requires array in app.json</h3>\n\n<p>The example of app.json:</p>\n\n<pre><code>{\n    // other values\n\n    \"requires\": [\n        \"saki-grid-multisearch-5“\n    ],\n\n    // other values\n}\n</code></pre>\n\n<h3 id='getting_started-section-1.6-for-grid-configuration-see-the-documentation'>1.6 For grid configuration see the documentation</h3>\n\n<p>See the <a href=\"#!/api/Ext.saki.grid.MultiSearch\" rel=\"Ext.saki.grid.MultiSearch\" class=\"docClass\">MultiSearch Documentation</a> to find out how to configure\nyour grids to use the MultiSearch plugin. Do not forget to add the plugin to grid's requires array.</p>\n\n<pre><code>Ext.define('MyApp.view.MyGrid', {\n     extend:'<a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Ext.grid.Panel</a>'\n    ,requires:['<a href=\"#!/api/Ext.saki.grid.MultiSearch\" rel=\"Ext.saki.grid.MultiSearch\" class=\"docClass\">Ext.saki.grid.MultiSearch</a>']\n});\n</code></pre>\n\n<h2 id='getting_started-section-using-in-application%2C-without-workspace'>Using in application, without workspace</h2>\n\n<p>Step by step instructions:</p>\n\n<h3 id='getting_started-section-2.1-create-your-application-%28optional%29'>2.1 Create your application (optional)</h3>\n\n<p>You would need this step if you do not already have an Ext application.</p>\n\n<pre><code>cd /your/ext/path\nsencha generate app MyApp /your/myapp\n</code></pre>\n\n<p>This would generate application with name \"MyApp\" in folder <code>/your/myapp</code>.</p>\n\n<h3 id='getting_started-section-2.2-extract-the-plugin-zip-file'>2.2 Extract the plugin zip file</h3>\n\n<p>Download the plugin zip file to <code>packages</code> subfoder of your application. Then:</p>\n\n<pre><code>cd /your/myapp/packages\nunzip saki-grid-multisearch-5-x.y.z.zip\n</code></pre>\n\n<p>where x.y.z stands for the downloaded file version</p>\n\n<h3 id='getting_started-section-2.3-build-the-examples-%28optional%29'>2.3 Build the examples (optional)</h3>\n\n<p>The included examples must be built before you can run them. To build execute:</p>\n\n<pre><code>cd /your/myapp/packages/saki-grid-multisearch-5/examples/gms\nsencha app build\n</code></pre>\n\n<p>You can see the examples at http://localhost/your/myapp/packages/saki-grid-multisearch-5/examples/gms</p>\n\n<h3 id='getting_started-section-2.4-add-the-package-name-to-requires-array-in-app.json'>2.4 Add the package name to requires array in app.json</h3>\n\n<p>The example of app.json:</p>\n\n<pre><code>{\n    // other values\n\n    \"requires\": [\n        \"saki-grid-multisearch-5”\n    ],\n\n    // other values\n}\n</code></pre>\n\n<h3 id='getting_started-section-2.5-for-grid-configuration-see-the-documentation'>2.5 For grid configuration see the documentation</h3>\n\n<p>See the <a href=\"#!/api/Ext.saki.grid.MultiSearch\" rel=\"Ext.saki.grid.MultiSearch\" class=\"docClass\">MultiSearch Documentation</a> to find out how to configure\nyour grids to use the MultiSearch plugin. Do not forget to add the plugin to grid's requires array.</p>\n\n<pre><code>Ext.define('MyApp.view.MyGrid', {\n     extend:'<a href=\"#!/api/Ext.grid.Panel\" rel=\"Ext.grid.Panel\" class=\"docClass\">Ext.grid.Panel</a>'\n    ,requires:['<a href=\"#!/api/Ext.saki.grid.MultiSearch\" rel=\"Ext.saki.grid.MultiSearch\" class=\"docClass\">Ext.saki.grid.MultiSearch</a>']\n});\n</code></pre>\n","title":"Getting Started"});