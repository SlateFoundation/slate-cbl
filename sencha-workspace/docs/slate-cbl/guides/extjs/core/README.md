# Ext JS: The Core

## Loading the core
The bare minimum you need to load into your page to use Ext JS is `build/ext-debug.js` or it's minified
form `build/ext.js` from the framework's distribution archive.

The [HTML template](../eg-iframe.html) powering all the inline examples loads the Ext JS core JavaScript build
from Cloudflare's CDN:

    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/extjs/6.0.0/ext-debug.js"></script>

That HTML template _also_ loads a stock build of the `triton` theme for the `classic` UI toolkit, but that is only needed to
provide styling for later guides that get into using components from the UI toolkits. UI toolkit classes can be loaded by the
core builds but none are included in it and having a theme loaded is not a requirement for using any of the core JavaScript library
described in this guide.

To verify that the core is loaded, query `Ext.getVersion('core')` in your console or via a JavaScript snippet in your page:

    @example
    alert('Ext JS version: ' + Ext.getVersion('core').toString());


## Included in the core
- A manifest of all Ext.* classes for easy loading
- `Ext.Boot`: An undocumented low-level internal component of the framework that provides for basic
asset loading and platform detection
- `Ext.Logger`: Provides safe `log`/`verbose`/`info`/`warn`/`error`/`deprecate` methods that by default
just wrap around `window.console` but can be easily hooked into or replaced with more complicated
implementations in different environments
- [`Ext`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext): The root class of the framework
provides a grab-bag of core methods and properties
- [`Ext.Error`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.Error): A helpful wrapper around
JavaScript's underlying `Error` object
- [`Ext.Assert`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.Assert): An assertion toolkit
for embedding diagnostics within your code
- [`Ext.Version`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.Version): A class for working
with [semantic version numbers](http://semver.org)
- Useful static methods for working with all the core JavaScript types:
  - [`Ext.Array`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.Array)
  - [`Ext.String`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.String)
  - [`Ext.Date`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.Date)
  - [`Ext.Function`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.Function)
  - [`Ext.Number`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.Number)
  - [`Ext.Object`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.Object)
- The foundation for Ext JS' [class system](http://docs.sencha.com/extjs/6.0/core_concepts/classes.html)
  - [`Ext.Config`](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.Config): Manages `config` properties for classes and
  their workflows
  - [`Ext.Base`](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.Base): The root prototype of all Ext JS-defined
  JavaScript classes
  - [`Ext.Class`](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.Class): The low-level factory for setting up
  Ext JS JavaScript classes
  - [`Ext.ClassManager`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.ClassManager): Provides the high-level API
  for keeping track of and working with classes
- [`Ext.browser`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.browser): As instance of the `Ext.env.Browser` class
providing information about the current browser
- [`Ext.os`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.os): As instance of the `Ext.env.OS` class providing
information about the current operating system
- [`Ext.feature`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.feature) / [`Ext.supports`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.feature):
A collection of feature/bug detectors and API for testing them
- [`Ext.Loader`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.Loader): A highly configurable
class that provides for dynamic loading of JavaScript classes
- [`Ext.onReady()`](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext-method-onReady): Method for registering functions to run after
both the browser's "dom ready" event has fired and after `Ext.Loader` has finished loading all already-`require`d classes
- [`Ext.dom.Element`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.dom.Element): Class for wrapping DOM elements and providing
high-level manipulation of them
- [`Ext.application()`*](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext-method-application): A factory method for defining an
MVC application and loading all it's requirements

_Classes marked with __*__ have thorough documentation worth reviewing_