Intro
-----

Most applications written with the Sencha libraries (Ext JS and Sencha Touch) are generated using Sencha Cmd. 
We therefore decided to write a 'How-to-guide' to get you started with your javascript testing. 

## Generating A Sencha Cmd 6 App

First of all, make sure you have the latest Cmd version installed. You can download it <a href="https://www.sencha.com/products/extjs/cmd-download/" target="_blank">here</a>. 
Let's start from scratch by generating a new Sencha Cmd 6 application, this is done by running the following on the command line (from the <a href="https://docs.sencha.com/extjs/6.0/getting_started/getting_started.html" target="_blank">Sencha getting started guide</a>):

    sencha -sdk /path/to/extjs/framework generate app MyApp MyApp
    cd MyApp
    sencha app watch

This will generate the following files in the MyApp folder in your file system.

<img src="guides/testing_cmd_application/images/filesystem.png" width="350" />

As you can see we get an app folder with 'model', 'store' and 'view' folders along with an app.js which bootstraps the application. 
If you navigate to <code>http://localhost:1841</code> in your browser, you'll see the sample application with a few tabs and a grid panel.

<img src="guides/testing_cmd_application/images/app.png" width="600" />

## Creating Your Test Harness

Now that the app is up and running, we create a tests folder in the root of the MyApp folder. Inside it we put our harness HTML page which contains the Siesta application, and a Harness JS file which contains details about the test suite:

 
<pre class="lang:xhtml decode:true " title="index.html" >&lt;!DOCTYPE html&gt;
&lt;html&gt;
    &lt;head&gt;
        &lt;link href="//cdn.sencha.com/ext/gpl/5.1.0/packages/ext-theme-crisp/build/resources/ext-theme-crisp-all.css" rel="stylesheet" type="text/css"/&gt;
        &lt;link rel="stylesheet" type="text/css" href="localhost/siesta/resources/css/siesta-all.css"&gt;

        &lt;script type="text/javascript" src="//cdn.sencha.com/ext/gpl/5.1.0/build/ext-all.js"&gt;&lt;/script&gt;
        &lt;script type="text/javascript" src="localhost/siesta/siesta-all.js"&gt;&lt;/script&gt;

        &lt;!-- The test harness --&gt;
        &lt;script type="text/javascript" src="index.js"&gt;&lt;/script&gt;
    &lt;/head&gt;
    &lt;body&gt;
    &lt;/body&gt;
&lt;/html&gt;</pre> 

This is the Harness JS file:
 
    var harness = new Siesta.Harness.Browser.ExtJS()
    
    harness.configure({
        title              : 'My Tests'
    });
    
    harness.start(
        {
            group       : 'Unit Tests',
            pageUrl     : '../index.html?unittest',
            items       : [
                'unit-tests/unit1.t.js'
            ]
        },
        {
            group : 'Application Tests',
            items : [
            ]
        }
    );

For our unit tests, we first need to make sure all our application JS classes get injected into each test. 
Instead of using {@link Siesta.Harness.Browser#preload} for this, with Ext JS 6 we use {@link Siesta.Harness.Browser#pageUrl} and set it to the root index.html page. 
By doing this, we let Ext JS choose and load the application files as it sees fit. 
We could've also selected to include only the JS classes being tested in each test, but this would require too much effort. 
If you run the test above, you'll note that the application will start which is of course not desirable when doing unit tests. 
To fix this, we simply modify our app.js a little bit.

    /*
     * This file is generated and updated by Sencha Cmd. You can edit this file as
     * needed for your application, but these edits will have to be merged by
     * Sencha Cmd when upgrading.
     */
    Ext.application({
        name: 'MyApp',
    
        extend: 'MyApp.Application',
    
        requires: [
            'MyApp.view.main.Main'
        ],
    
        // The name of the initial view to create. With the classic toolkit this class
        // will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
        // modern toolkit, the main view will be added to the Viewport.
        //
        mainView: location.search.match('unittest') ? null : 'MyApp.view.main.Main'
        
        //-------------------------------------------------------------------------
        // Most customizations should be made to MyApp.Application. If you need to
        // customize this file, doing so below this section reduces the likelihood
        // of merge conflicts when upgrading to new versions of Sencha Cmd.
        //-------------------------------------------------------------------------
    });

We simply add an inline check for the presence of a 'unittest' string in the query string. If this string exists, we prevent the application from starting. Now lets start writing a simple unit test. If you do it this way, each Ext JS class file will be loaded on demand which makes debugging very easy (compared to having one huge xx-all-debug.js). In your nightly builds, you should consider testing against a built test version of the app for faster test execution. You can build such a version by executing this Cmd statement:

    sencha app build testing

## Writing a Basic Unit Test

The Personnel store for the sample application looks like this:
 
    Ext.define('MyApp.store.Personnel', {
        extend: 'Ext.data.Store',
    
        alias: 'store.personnel',
    
        fields: [
            'name', 'email', 'phone'
        ],
    
        data: { items: [
            { name: 'Jean Luc', email: "jeanluc.picard@enterprise.com", phone: "555-111-1111" },
            { name: 'Worf',     email: "worf.moghsson@enterprise.com",  phone: "555-222-2222" },
            { name: 'Deanna',   email: "deanna.troi@enterprise.com",    phone: "555-333-3333" },
            { name: 'Data',     email: "mr.data@enterprise.com",        phone: "555-444-4444" }
        ]},
    
        proxy: {
            type: 'memory',
            reader: {
                type: 'json',
                rootProperty: 'items'
            }
        }
    });

It doesn't contain any logic yet, so let's add a simple <code>getUserByPhoneNumber</code> method:

    getUserByPhoneNumber : function(nbr) {
        // TODO
    }

For now, we'll just add a stub and focus on writing the test first. The test for this method will look like this:

    describe('My first unit test', function(t) {

        t.ok(MyApp.view.main.Main, 'Found mainview');
    
        var store;
    
        t.beforeEach(function(t) {
            store = new MyApp.store.Personnel({
                data : [
                    { name: 'Jean Luc', email: "jeanluc.picard@enterprise.com", phone: "555-111-1111" },
                    { name: 'Worf',     email: "worf.moghsson@enterprise.com",  phone: "555-222-2222" }
                ]
            });
        });
    
        t.it('Should support getting a user by phone number lookup', function(t) {
            t.expect(store.getUserByPhoneNumber('555-111-1111').get('name')).toBe('Jean Luc');
    
            t.expect(store.getUserByPhoneNumber('foo')).toBe(null);
        });
    });

This test asserts that we can lookup a valid phone number and get a user back, but also verifies that we get <code>null</code> when providing a non-existing phone number. Running this test confirms that we get failed assertions which is the first step of TDD. Now we can go ahead and write the simple implementation of the method:
 
    getUserByPhoneNumber : function(nbr) {
       var index = this.find('phone', nbr);
    
       if (index &lt; 0) return null;
    
       return this.getAt(index);
    }

After running this in Siesta, you should see a nice screen with all tests green. 

<img src="guides/testing_cmd_application/images/greentests.png" width="600" />

Let's continue looking at a more advanced type of test - application tests.

## Creating an Application Smoke Test

For our application tests, we create the following test group in our Harness JS file. 
 
    {
        group       : 'Application Tests',
        pageUrl     : '../index.html',
        items       : [
            'application-tests/smoketest.t.js'
        ]
    }

We also create a file called "smoketest.t.js" in the filesystem and place it in an "application-tests" folder.

    describe('My first application test', function (t) {
    
        t.it('Should be possible to open all tabs', function (t) {
            t.chain(
                { click : ">>tab[text=Users]" },
    
                { click : ">>tab[text=Groups]" },
    
                { click : ">>tab[text=Settings]" },
    
                { click : >>tab[text=Home]" }
            );
        });
    });


In this type of test we of course want the application to start normally so we just point the tests to the index.html file. The purpose of our smoke test is just to open each tab and make sure no exceptions are thrown.

## Verifying Presence Of an Alert Dialog

Now let's add one more test file, in which we assert that a popup is shown when clicking on a row in the Personnel grid:

<img src="guides/testing_cmd_application/images/popup.png" width="600" />
 
    describe('Personnel grid tests', function (t) {
    
        t.it('Should show a confirm popup when clicking grid row', function (t) {
            t.chain(
                { click : "mainlist[title=Personnel] => table.x-grid-item" },
    
                // Make sure we see a window with proper title on a row double click
                { waitForCQVisible : 'window[title=Confirm]' },
    
                { click : ">>[itemId=yes]" }
            );
        });
    });

## Try running the suite

We've put the <a href="http://bryntum.com/temp/testing-cmd/tests" target="_blank">runnable test suite online</a> if you want to try running these tests yourself. You can inspect the sources of each test and see how easy it is.

## Conclusion

Testing applications generated with Sencha Cmd is just as easy as testing any other code base. We recommend that you start with unit testing your core files such as stores, model and logic classes. Once you have good coverage there, then also invest in a few application tests covering your most common user scenarios. If you've encountered any issues or problems with your Sencha testing, please let us know and we'll try to help you. 



Buy this product
---------

Visit our store: <http://bryntum.com/store/siesta>


Support
---------

Ask a question in our community forum: <http://www.bryntum.com/forum/viewforum.php?f=20>

Share your experience in our IRC channel: [#bryntum](http://webchat.freenode.net/?randomnick=1&channels=bryntum&prompt=1)

Please report any bugs through the web interface at <https://www.assembla.com/spaces/bryntum/support/tickets>


See also
---------

Web page of this product: <http://bryntum.com/products/siesta>

Other Bryntum products: <http://bryntum.com/products>



Attribution
---------

This software contains icons from the following icon packs (licensed under Creative Common 2.5/3.0 Attribution licenses)

- <http://www.famfamfam.com/lab/icons/silk/>
- <http://led24.de/iconset/>
- <http://p.yusukekamiyamane.com/>
- <http://rrze-icon-set.berlios.de/index.html>
- <http://www.smashingmagazine.com/2009/05/20/flavour-extended-the-ultimate-icon-set-for-web-designers/>
- <http://www.doublejdesign.co.uk/products-page/icons/super-mono-icons/>
- <http://pixel-mixer.com/>

Thanks a lot to the authors of the respective icons packs.


COPYRIGHT AND LICENSE
---------

Copyright (c) 2009-2015, Bryntum & Nickolay Platonov

All rights reserved.