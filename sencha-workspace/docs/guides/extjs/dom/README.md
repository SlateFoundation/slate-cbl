# Ext JS: Manipulating the DOM

The [`Ext.dom.Element`](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext.dom.Element) class wraps around DOM elements
and provides high-level methods for manipulating them.


## Getting an `Ext.dom.Element` reference
Ext JS provides two basic methods for getting an `Ext.dom.Element` instance attached to a DOM element:

- [`Ext.get(element)`](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext-method-get): Accepts either a string matching the `id`
attribute of an existing page element or a raw `HTMLElement` instance from the browser
- [`Ext.fly(element)`](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext-method-fly): Similar to `Ext.get()`, but instead of
creating a new `Ext.dom.Element` instance it updates a globally shared instance called the _flyweight Element_ and returns that. Be
sure to **never** store a reference to the `Ext.dom.Element` instance returned by this method, as it is liable to be pointing at a
different DOM element next time you use it. Using `Ext.fly()` is optimal when you only need one-time access to an element, for
example: `Ext.fly('myelement').hide().addCls('is-myelement')`

Additionally, the following convenience methods are available for getting `Ext.dom.Element` wrappers for the foundational DOM
elements of the page:

- [`Ext.getWin()`](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext-method-getWin): Shortcut for `Ext.get(window)`
- [`Ext.getDoc()`](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext-method-getDoc): Shortcut for `Ext.get(window.document)`
- [`Ext.getHead()`](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext-method-getHead): Shortcut for `Ext.get(window.document.getElementsByTagName('head')[0])`
- [`Ext.getBody()`](http://docs.sencha.com/extjs/6.0/6.0.0-classic/#!/api/Ext-method-getBody): Shortcut for `Ext.get(window.document.body)`


## Chaining `Ext.dom.Element` methods
Nearly all methods under `Ext.dom.Element` return a reference to the same `Ext.dom.Element`, allowing you to chain together calls:

    @example
    Ext.require('Ext.dom.Element', function() {
        Ext.getBody().removeCls('is-loading').addCls('is-loaded').setStyle('background', 'pink');
    });


