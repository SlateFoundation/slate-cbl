Intro
---------

This guide shows how you to use the event recorder feature in Siesta.

What is the event recorder?
---------

The event recorder will save you lots of time as you create UI & application tests for your application (or individual UI components).
After hitting the record button, the recorder will record any interactions with the user interface and produce a runnable Siesta test case.
This means it will detect Sencha components such as grids, form fields and checkboxes etc. without you having to
manually type in each target in manually. Relying on Ext JS ComponentQuery instead of DOM node ID's (as seen in Selenium and other tools) is 
much more stable. Please note that the recorder may **not** produce a perfect test case at once, in reality
you will need to tweak its output to be as stable as possible for your test scenario. Regardless, it'll definitely save you time!



The event recorder interface
---------

The empty recorder looks like the below image. In the top left, the buttons are quite self explanatory: 'Record', 'Stop', 'Play', 'Clear actions' and 'Add action'. 
In the top right section, you can 'Show code' and 'Close' the recorder panel.

{@img images/recorder1.png autogen}

The grid has 3 columns:

* The 'Action' column is the type of action.
* The 'Target/Value' column contains the either the target of a UI action, the value
(when typing text) or source code for the special function step.
* The 'Offset' column allows you to set an offset for your action allowing you to click at a precise point inside your target.

Below the grid you can find a cheat sheet of the most common targets types (CSS query, Component Query and Composite Query).

Try hitting the record button and click somewhere in your application UI. You should see an entry show up in the recorder grid. The first thing to do
now is to verify that the recorder understood your intention. This means reading the target description and possibly adjusting it. The recorder
tries to understand your intention but it's **not** a mind reader (yet). Make sure to optimize the target to be as stable as possible. Having stable targets
is very important to keep tests passing as you modify your UI or upgrade to newer versions of the Sencha framework.

A simple example: Let's say you record a click on an Ext JS button, Siesta may suggest the following:

    Target : schedulergrid button[text=Seconds] => .x-btn-inner
    Offset : [27, 13]

This is a Composite Query, left side is a regular Component Query, and the part after => is a simple CSS selector. How do we make this the most stable
target selector? First of all, if all you wanted was to click anywhere on the button then the offset has no value so let's delete it. This makes
 sure that if the button dimensions change later (e.g. width lowered to 25px), the test will still work fine. The second thing to look at is the target itself. Unless you want to
 click at a specific HTML element inside the button, we don't really need the right side of the expression. This also protects you against the case where
 in a future Ext JS version, the .x-btn-inner class is renamed to something else (or removed). Converting the target to a Component Query is our best bet:

    Target : >>schedulergrid button[text=Seconds]
    Offset :

Now, Siesta will always click at the center of the Button component which normally is what you want for buttons anyway.
When you're done adjusting the target, try playing back the test to make sure all works fine. When playing back a recording, Siesta will first execute
the entire test and after the test has finalized, the recorder actions will be played back.


Recording an application test
---------
To record an application test, first of all make sure you have put Siesta somewhere on the same webserver (and port) as the application itself. 
Siesta is limited by the same-origin policy enforced by all web browsers. Open up your Siesta application and hit the recorder button. Now type the target page that you want to test into the "Page URL" field.

{@img images/pageUrlField.png autogen}

Hit ENTER and make sure your application loads correctly in the DOM view. Now you can simply hit the record button and produce your test case. After recording,
ensure that the test case does what you expect by replaying it. You can also select and group actions together by marking them and right clicking to avoid
having one huge flag list of actions. We recommend that you create logical groups in your recorded tests to make the whole test easier to maintain. 
Once you are happy with the result you can click the "Show source" to get the test source. Now you can create a new test file and paste the content into it. 

create-user.t.js

    describe('Your test scenario', function (t) {

        t.it('Login to application', function(t) {
            t.chain(
               // actions here... 
            );
        });
        
        t.it('Add a new user', function(t) {
            t.chain(
               // actions here... 
            );
        });

    });

You also need to add a test decriptor in your test suite.

    {
        group   : 'Application tests',
        items   : [
            {
                name        : 'Login and create user',
                pageUrl     : 'your-app.html',
                url         : 'createuser.t.js'
            }
        ]
    }


Testing a standalone UI component 
---------
This is very similar to testing an application, but instead of visiting a page to interact with - the test will create the UI. So - first of all you should prepare a test case which will produce the UI that you want the test to interact with.
After creating your test skeleton, run it and make sure the rendering completes without errors.

    StartTest(function (t) {

        var customerGrid = new App.grid.Customer({
            width    : 600,
            height   : 200,
            renderTo : document.body,
            cls      : 'myGrid'
        });

        t.chain(
            // Make sure some dummy test rows are rendered before test starts
            { waitFor : 'rowsVisible', args : customerGrid }
        );

    });

At this point, your test skeleton produces the UI you want to start testing. Depending on what you are trying to test, it might be wise you need to instruct the test to wait for a condition that proves the UI is ready to be
interacted with. This might be the presence of some CSS selector, or that a couple of Ext JS stores have been loaded. Now that we've instructed the test to wait for a stable condition, we can activate the recorder panel and proceed as instructed in the previous section.


Editing the target locator
---------
The fields in the grid are all editable, so it's easy for you to adjust the values inline. Clicking a **Target** cell allows you to either choose one of
the alternatives gathered by the recorder, or you can type any value you like. As you type, Siesta will try to highlight the target. You need to make sure
that you only target one thing on the screen, and make your target selector specific to that target. If you have 5 Ext JS buttons on the page, just
typing ">> button" won't work because the selector is too broad and matches any button on the page (Siesta will warn you in this case).

{@img images/editing_target.png autogen}


Waiting for async operations
---------
As you will see, just naively recording some clicks on the screen and playing them back won't always work. A lot of the times, a UI will contain
asynchronous behavior. A window might animate as it closes or a panel is collapsed with an animation etc. To make sure your tests aren't sensitive to these
async flows, you may need to wait in some scenarios. Siesta tries to help you as much as it can by always waiting for a target to appear, and also for any
ongoing animations to complete. So in theory you should not need to worry about these two cases.

Let's look at a simple example:

    StartTest(function (t) {
        Ext.getBody().update('<div id="client_list"></div>');

        var btn = new Ext.Button({
            text        : 'Load data',
            renderTo    : document.body,
            handler     : function() {

                // This Ajax request is obviously async
                Ext.Ajax.request({
                    url     : 'Customers/Get',
                    success : function(response) {
                        // Assuming an array is returned by server
                        var clients = Ext.decode(response.responseText);

                        Ext.get('client_list').update(clients.join('<br/'));
                    }
                });
            }
        });
    });

Let's say the test scenario is to click a button to load a client list into some DIV. After the Ajax request is done we want to assert 
that the list is updated correctly and contains some text. A nice solution would be to use the waitForTextPresent assertion method. 
Click the '+' button to add the new wait step, and drag it in between the two click steps.

    // Click the button using a Component Query
    { click : ">> button[text=Load data]" },

    { waitForTextPresent : 'Client A' }
    
After adding the wait step, this test sequence is now robust and it doesn't matter if the ajax request takes 5ms or 10 seconds.

The function step
---------
As you interact with your application UI you most likely want to perform some assertions along the way. While this is easier to do in your own IDE,
we've added a simple code editor to the recorder too. In the previous sample, we could have done it another wasy - using the 'contentLike' assertion. 
To add such a function step, select the 'fn' action in the list and hit TAB. Now we can execute any regular JS, and of course
use any of the {@link Siesta.Test} assertion methods.

Recording a move-cursor-to step
---------
Sometimes you want to simply move the cursor to certain place on the screen without doing any further action. Since the recorder doesn't record every
mouse movement, there is a special way to signal to Siesta that you want to move the cursor somewhere. Simply move the mouse to where it should be and
leave it for 3 seconds, you'll then see a **moveCursorTo** action added to the list. This is useful in lots of scenarios, for example when triggering
a grid column menu to show. You cannot click the menu icon right away, since it's hidden until you move the cursor over the grid column header.

Getting the generated source code
---------
When you feel done with your test recording, simply hit the **Show source** button and copy-paste the contents into your test file. That is all it takes
to generate a test.

{@img images/recorder_generated_code.png autogen}


Buy this product
---------

Visit our store: <http://bryntum.com/store/siesta>


Support
---------

Ask question in our community forum: <http://www.bryntum.com/forum/viewforum.php?f=20>

Share your experience in our IRC channel: [#bryntum](http://webchat.freenode.net/?randomnick=1&channels=bryntum&prompt=1)

Please report any bugs through the web interface at <https://www.assembla.com/spaces/bryntum/support/tickets>


See also
---------

Web page of this product: <http://bryntum.com/products/siesta>

Other Bryntum products: <http://bryntum.com/products>


COPYRIGHT AND LICENSE
---------

Copyright (c) 2009-2015, Bryntum & Nickolay Platonov

All rights reserved.