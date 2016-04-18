Intro
---------

Running the test suite manually in browsers is very convenient as it allows you to easily debug your tests. However, when
setting up a continuous integration process, it quickly becomes time-consuming - ideally you should to run the test suite
in each and every browser after (or before) each and every commit.

This guide describes how you can automate the launching of a Siesta test suite.

**Please note:** This functionality is only available in the Siesta Standard package.  


Running tests using Selenium WebDriver
---------

**Important**. Using the WebDriver requires some manual configuration steps for IE and Safari. Please refer to these pages <http://code.google.com/p/selenium/wiki/InternetExplorerDriver> and
<http://code.google.com/p/selenium/wiki/SafariDriver>. Also, when running test suite in IE, make sure the IE window is focused (on top of other windows) and 
mouse cursor is outside of the IE window.

You can automate the launching of your test suite in several browsers, using Selenium WebDriver. Unlike SlimerJS, it requires the presence of actual browsers in the operation system.  

On MacOS and Linux:

    > __SIESTA__/bin/webdriver http://yourproject/tests/index.html [OPTIONS]
    
On Windows:

    > __SIESTA__\bin\webdriver http://yourproject/tests/index.html [OPTIONS]
    
Here, the `__SIESTA__` placeholder is the path to your Siesta package. The launcher script `bin/webdriver` accepts the URL to your html wrapper for the Siesta harness (`index.html`)
and several optional options.

All options should start with double minus, e.g: `--browser chrome` or `--browser=chrome`. Most important options (see bin/webdriver --help for all):

- `help` - prints help message with all available options
- `browser browsername` - can be one of "firefox / chrome / ie / safari"'.
- `max-workers` - maximum number of parallel testing "threads" that can be opened simultaneously. **Note**, that if your tests involves focusing
of the DOM elements (as most UI tests do) then this option should be probably kept at value 1, unless you are using a cloud-based 
testing infrastructure. See also a "Parallelization" section below.
- `include regexp`      - a regexp to filter the urls of tests. When provided, only the tests with urls matching this filter be executed
- `verbose` - will include the information about every individual assertions to the output. By default, only failed assertions will be shown
- `debug` - will enable various debugging messages
- `report-format` - the format of the report, see the "Reporting the results of a test suite execution in a structured format" section below
- `report-file` - the file to save the report to

In case of any failures in the test suite the command will exit with non-zero exit code. See "Exit codes" section for details.


Running tests using SlimerJS
---------

SlimerJS is a semi-headless FireFox browser. It is called "semi-headless" because it requires the `xvfb` utility to run on systems w/o 
graphical environment. In fact, even on systems with graphical environment, we also recommend to use `xvfb` to isolate Slimer launcher
from the other windows, so that it will have exclusive focus.

SlimerJS uses real rendering engine of the Firefox browser - you can trust the results from SlimerJS as if they were received from "real" Firefox.

SlimerJS is now a recommended headless launcher for Siesta.

On MacOS and Linux:

    > __SIESTA__/bin/slimerjs http://yourproject/tests/index.html [OPTIONS]
    
On Windows:

    > __SIESTA__\bin\slimerjs http://yourproject/tests/index.html [OPTIONS]
    
Here, the `__SIESTA__` placeholder is the path to your Siesta package. The launcher script `bin/slimerjs` accepts the URL to your html wrapper for the Siesta harness (`index.html`)
and several optional options.

All options should start with double minus, e.g: `--browser chrome` or `--browser=chrome`. Most important options (see bin/slimerjs --help for all):

- `help` - prints help message with all available options
- `browser browsername` - can be one of "firefox / chrome / ie / safari"'.
- `max-workers` - maximum number of parallel testing "threads" that can be opened simultaneously. **Note**, that if your tests involves focusing
of the DOM elements (as most UI tests do) then this option should be probably kept at value 1, unless you are using a cloud-based 
testing infrastructure. See also a "Parallelization" section below.
- `include regexp`      - a regexp to filter the urls of tests. When provided, only the tests with urls matching this filter be executed
- `verbose` - will include the information about every individual assertions to the output. By default, only failed assertions will be shown
- `debug` - will enable various debugging messages
- `report-format` - the format of the report, see the "Reporting the results of a test suite execution in a structured format" section below
- `report-file` - the file to save the report to

In case of any failures in the test suite the command will exit with non-zero exit code. See "Exit codes" section for details.


Running tests using remote Selenium WebDriver server
---------

You can launch the test suite (and receive the results) on one machine, but physically open the browsers on some other machine using RemoteWebDriver server.
To do that, first start the RemoteWebDriver server on target machine:

On MacOS and Linux:

    > __SIESTA__/bin/webdriver-server [OPTIONS]
    
On Windows:

    > __SIESTA__\bin\webdriver-server [OPTIONS]
 
"webdriver-server" is a very thin wrapper around "selenium-server-standalone-xx.jar" which just specifies the location of binaries for various browsers. It bypass
any command line options to that jar file. For example, to specify the port of server (default value is 4444), specify it as:

    > __SIESTA__/bin/webdriver-server -port 4444

For a list of available options for server, launch it with "-help" switch:

    > __SIESTA__/bin/webdriver-server -help

Also, please refer to: <http://code.google.com/p/selenium/wiki/RemoteWebDriverServer> 

Then, when launching the test suite with "webdriver" launcher, specify an additional "--host" option:

    > __SIESTA__/bin/webdriver http://my.harness.url/tests --host remote.webdriver.host --port 4444
    
You can use the "--cap" switch to specify various Selenium capabilities for example "--cap browserName=firefox --cap platform=XP",
see <https://code.google.com/p/selenium/wiki/DesiredCapabilities>


Running tests in PhantomJS
---------

**Important** It seems, the PhantomJS project is no longer actively maintained (the last release with several major known issues 
made Jan 23 2015). Plus, the architecture of the project is not ideal. Instead of including real rendering engine of some browser
(for example as SlimerJS does), Phantom is based on some snapshot of the WebKit project, that is used in the Qt framework.
We recommend you to use PhantomJS only for quick non-DOM testing, and use Selenium WebDriver / SlimerJS launchers for UI testing.

PhantomJS allows you to run your tests in a headless Webkit browser. It's quite suitable for Linux servers w/o any graphical interface or browsers installed.

{@img images/phantomjs.png}

To launch the test suite in PhantomJS, run the following command.

On MacOS and Linux:

    > __SIESTA__/bin/phantomjs http://yourproject/tests/index.html [OPTIONS]
    
On Windows:

    > __SIESTA__\bin\phantomjs http://yourproject/tests/index.html [OPTIONS]
    
Here, the `__SIESTA__` placeholder is the path to your siesta package. The launch script `bin/phantomjs` accepts 2 arguments - the URL to your html wrapper for the Siesta harness (`index.html`)
and an several optional options.

All options should start with double minus, e.g: `--report-format JSON` or `--report-format=JSON`. Most important options (see bin/phantomjs --help for all):

- `help` - prints help message with all available options
- `max-workers` - maximum number of parallel testing "threads" that can be opened simultaneously. **Note**, that if your tests involves focusing
of the DOM elements (as most UI tests do) then this option should be probably kept at value 1 (unless you are using cloud-based infrastructure)
- `include regexp`      - a regexp. When provided, only the tests with matching urls will be executed. This option has an alias - "filter"
- `exclude regexp`      - a regexp. When provided, the tests with matching urls will not be executed.
- `verbose` - will include the information about every individual assertions to the output. By default, only failed assertions will be shown
- `report-format` - the format of the report, see the "Reporting the results of a test suite execution in a structured format" section below
- `report-file` - the file to save the report to
    
In case of any failures in the test suite, the command will exit with a non-zero exit code. See "Exit codes" section for details.


Parallelization
---------------

When using cloud-based infrastructure, each test page is running inside of the own VM, which guarantees the exclusive focus owning 
and allows us to run several test pages in parallel. Naturally, that speed ups the test execution, by the number of parallel sessions
we can run.

This can be done using the `--max-workers` option, that specifies the maximum number of parallel sessions.

**Important**. When value of this option is more than 1, the order of tests execution is not defined. A test, that goes lower
in the `harness.start()` list, can be executed before the test above it. This is simply because all tests are divided in several
"threads" and all threads are executed simultaneously. You should not rely on some test being run after another, instead, 
every test should execute standalone (allocate exclusive resources, perform all necessary setup).


Reporting the results of a test suite execution in a structured format.
---------

You can easily export the results of a test suite execution in the structured format. To do that, provide the `--report-format` option to the PhantomJS or Selenium launcher.
When providing this option for phantomjs you also need to provide the `--report-file` option, indicating the filename of the report to be written.

Currently the only supported formats are "JSON" and "JUnit". Using the JSON option looks like this:

	C:\siesta\phantomjs http://localhost/YourApplication/tests --report-format JSON --report-file foo.json

And this will generate a file named foo.json containing the following JSON structure:

    {
        "testSuiteName" : "Siesta self-hosting test suite",
        "startDate"     : 1343114314723,
        "endDate"       : 1343114315401,
        "passed"        : true,
        "testCases"     : [{
            "url"           : "010_sanity.t.js",
            "startDate"     : 1343114315390,
            "endDate"       : 1343114315396,
            "passed"        : true,
            "assertions"    : [{
                "passed"        : true,
                "description"   : "Siesta is here",
                "type"          : "Siesta.Result.Assertion"
            }, {
                "passed"        : true,
                "description"   : "Siesta.Test is here",
                "type"          : "Siesta.Result.Assertion"
            }, {
                "passed"        : true,
                "description"   : "Siesta.Harness is here",
                "type"          : "Siesta.Result.Assertion"
            }, {
                "passed"        : false,
                "description"   : "Field 1 focused",
                "annotation"    : "Failed assertion `ok` at line 27 of keyevents/050_tab_key_focus2.t.js\nGot: false\nNeed \"truthy\" value",
                "sourceLine"    : "27",
                "name"          : "ok"
                "type"          : "Siesta.Result.Assertion"
            }]
        }]
    }

Using the JUnit report option looks like this:

	C:\siesta\phantomjs http://localhost/YourApplication/tests --report-format JUnit --report-file foo.xml

This will generate a file named foo.xml containing the following JUnit XML structure:

	<testsuite errors="0" failures="1" hostname="localhost:8085" name="Ext Scheduler Test Suite" tests="2" time="3.594" timestamp="2012-06-06T08:55:21.520">
		
		<testcase classname="Bryntum.Test" name="lifecycle/040_schedulergrid.t.js" time="1.238">
			<failure message="Oops" type="FAIL"></failure>
		</testcase>

		<testcase classname="Bryntum.Test" name="lifecycle/042_schedulergrid_right_columns.t.js" time="0.818"></testcase>
	</testsuite>

When providing this option for Selenium you will also need to provide the `--report-file-prefix` option. It has a slightly different meaning compared to PhantomJS, since the Selenium launcher can run the
test suite in several browsers which generates several reports. These reports will be saved into different files, and the first part of the filename will be specified with the `report-file-prefix`
option, and the browser name will also be included in the filename. The value for this option may have an extension, which will be preserved.

For example, specifying: `--report-file-prefix=report_.json` will save the reports to: `report_firefox.json`, `report_ie.json`, etc.

 
Exit codes
----------

- 0 - All tests passed successfully
- 1 - Some tests failed
- 3 - No supported browsers available on this machine
- 4 - No tests to run (probably filter doesn't match any test url)
- 5 - Can't open harness page
- 6 - Wrong command line arguments
- 8 - Exit after showing the Siesta version (when `--version` is provided on the command line)


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


COPYRIGHT AND LICENSE
---------

Copyright (c) 2009-2015, Bryntum AB & Nickolay Platonov

All rights reserved.