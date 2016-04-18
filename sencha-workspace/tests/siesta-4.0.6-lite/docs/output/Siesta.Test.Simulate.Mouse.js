Ext.data.JsonP.Siesta_Test_Simulate_Mouse({"tagname":"class","name":"Siesta.Test.Simulate.Mouse","autodetected":{},"files":[{"filename":"Mouse.js","href":"Mouse.html#Siesta-Test-Simulate-Mouse"}],"members":[{"name":"dragDelay","tagname":"cfg","owner":"Siesta.Test.Simulate.Mouse","id":"cfg-dragDelay","meta":{}},{"name":"moveCursorBetweenPoints","tagname":"cfg","owner":"Siesta.Test.Simulate.Mouse","id":"cfg-moveCursorBetweenPoints","meta":{}},{"name":"click","tagname":"method","owner":"Siesta.Test.Simulate.Mouse","id":"method-click","meta":{}},{"name":"doubleClick","tagname":"method","owner":"Siesta.Test.Simulate.Mouse","id":"method-doubleClick","meta":{}},{"name":"drag","tagname":"method","owner":"Siesta.Test.Simulate.Mouse","id":"method-drag","meta":{"deprecated":{"text":"<p>This method is deprecated in favor of <a href=\"#!/api/Siesta.Test.Simulate.Mouse-method-dragTo\" rel=\"Siesta.Test.Simulate.Mouse-method-dragTo\" class=\"docClass\">dragTo</a> and <a href=\"#!/api/Siesta.Test.Simulate.Mouse-method-dragBy\" rel=\"Siesta.Test.Simulate.Mouse-method-dragBy\" class=\"docClass\">dragBy</a> methods</p>\n"}}},{"name":"dragBy","tagname":"method","owner":"Siesta.Test.Simulate.Mouse","id":"method-dragBy","meta":{}},{"name":"dragTo","tagname":"method","owner":"Siesta.Test.Simulate.Mouse","id":"method-dragTo","meta":{}},{"name":"mouseDown","tagname":"method","owner":"Siesta.Test.Simulate.Mouse","id":"method-mouseDown","meta":{}},{"name":"mouseOut","tagname":"method","owner":"Siesta.Test.Simulate.Mouse","id":"method-mouseOut","meta":{}},{"name":"mouseOver","tagname":"method","owner":"Siesta.Test.Simulate.Mouse","id":"method-mouseOver","meta":{}},{"name":"mouseUp","tagname":"method","owner":"Siesta.Test.Simulate.Mouse","id":"method-mouseUp","meta":{}},{"name":"moveCursorBy","tagname":"method","owner":"Siesta.Test.Simulate.Mouse","id":"method-moveCursorBy","meta":{}},{"name":"moveCursorTo","tagname":"method","owner":"Siesta.Test.Simulate.Mouse","id":"method-moveCursorTo","meta":{}},{"name":"moveMouseBy","tagname":"method","owner":"Siesta.Test.Simulate.Mouse","id":"method-moveMouseBy","meta":{}},{"name":"moveMouseTo","tagname":"method","owner":"Siesta.Test.Simulate.Mouse","id":"method-moveMouseTo","meta":{}},{"name":"rightClick","tagname":"method","owner":"Siesta.Test.Simulate.Mouse","id":"method-rightClick","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-Siesta.Test.Simulate.Mouse","component":false,"superclasses":[],"subclasses":[],"mixedInto":["Siesta.Test.Browser"],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Mixed into</h4><div class='dependency'><a href='#!/api/Siesta.Test.Browser' rel='Siesta.Test.Browser' class='docClass'>Siesta.Test.Browser</a></div><h4>Files</h4><div class='dependency'><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse' target='_blank'>Mouse.js</a></div></pre><div class='doc-contents'><p>This is a mixin, providing the mouse events simulation functionality.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-dragDelay' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-cfg-dragDelay' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-cfg-dragDelay' class='name expandable'>dragDelay</a> : Int<span class=\"signature\"></span></div><div class='description'><div class='short'>The delay between individual drag events (mousemove) ...</div><div class='long'><p>The delay between individual drag events (mousemove)</p>\n<p>Defaults to: <code>25</code></p></div></div></div><div id='cfg-moveCursorBetweenPoints' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-cfg-moveCursorBetweenPoints' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-cfg-moveCursorBetweenPoints' class='name expandable'>moveCursorBetweenPoints</a> : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>True to move the mouse cursor between for example two clicks on\n separate elements (for better visual experience) ...</div><div class='long'><p>True to move the mouse cursor between for example two clicks on\n separate elements (for better visual experience)</p>\n<p>Defaults to: <code>true</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-click' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-method-click' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-method-click' class='name expandable'>click</a>( <span class='pre'>[el], [callback], [scope], [options], [offset]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method will simulate a mouse click in the center of the specified DOM/Ext element,\nor at current cursor position...</div><div class='long'><p>This method will simulate a mouse click in the center of the specified DOM/Ext element,\nor at current cursor position if no target is provided.</p>\n\n<p>Note, that it will first calculate the centeral point of the specified element and then\nwill pick the top-most DOM element from that point. For example, if you will provide a grid row as the <code>el</code>,\nthen click will happen on top of the central cell, and then will bubble to the row itself.\nIn most cases this is the desired behavior.</p>\n\n<p>The following events will be fired, in order:  <code>mouseover</code>, <code>mousedown</code>, <code>mouseup</code>, <code>click</code></p>\n\n<p>Example:</p>\n\n<pre><code> t.click(t.getFirstRow(grid), function () { ... })\n</code></pre>\n\n<p>The 1st argument for this method can be omitted. In this case, Siesta will use the current cursor position:</p>\n\n<pre><code> t.click(function () { ... })\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a> (optional)<div class='sub-desc'><p>One of the <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a> values to convert to DOM element</p>\n</div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>A function to call after click.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope for the callback</p>\n</div></li><li><span class='pre'>options</span> : Object (optional)<div class='sub-desc'><p>Any options to use for the simulated DOM event</p>\n</div></li><li><span class='pre'>offset</span> : Array (optional)<div class='sub-desc'><p>An X,Y offset relative to the target. Example: [20, 20] for 20px or [\"50%\", \"100%-2\"] to click in the center horizontally and 2px from the bottom edge.</p>\n</div></li></ul></div></div></div><div id='method-doubleClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-method-doubleClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-method-doubleClick' class='name expandable'>doubleClick</a>( <span class='pre'>[el], [callback], [scope], [options], [offset]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method will simulate a mouse double click in the center of the specified DOM/Ext element,\nor at current cursor p...</div><div class='long'><p>This method will simulate a mouse double click in the center of the specified DOM/Ext element,\nor at current cursor position if no target is provided.</p>\n\n<p>Note, that it will first calculate the centeral point of the specified element and then\nwill pick the top-most DOM element from that point. For example, if you will provide a grid row as the <code>el</code>,\nthen click will happen on top of the central cell, and then will bubble to the row itself.\nIn most cases this is the desired behavior.</p>\n\n<p>The following events will be fired, in order:  <code>mouseover</code>, <code>mousedown</code>, <code>mouseup</code>, <code>click</code>, <code>mousedown</code>, <code>mouseup</code>, <code>click</code>, <code>dblclick</code></p>\n\n<p>Example:</p>\n\n<pre><code> t.click(t.getFirstRow(grid), function () { ... })\n</code></pre>\n\n<p>The 1st argument for this method can be omitted. In this case, Siesta will use the current cursor position:</p>\n\n<pre><code> t.click(function () { ... })\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a> (optional)<div class='sub-desc'><p>One of the <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a> values to convert to DOM element</p>\n</div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>A function to call after click.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope for the callback</p>\n</div></li><li><span class='pre'>options</span> : Object (optional)<div class='sub-desc'><p>Any options to use for the simulated DOM event</p>\n</div></li><li><span class='pre'>offset</span> : Array (optional)<div class='sub-desc'><p>An X,Y offset relative to the target. Example: [20, 20] for 20px or [\"50%\", \"100%-2\"] to click in the center horizontally and 2px from the bottom edge.</p>\n</div></li></ul></div></div></div><div id='method-drag' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-method-drag' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-method-drag' class='name expandable'>drag</a>( <span class='pre'>source, [target], [delta], [callback], [scope], options</span> )<span class=\"signature\"><span class='deprecated' >deprecated</span></span></div><div class='description'><div class='short'>This method will simulate a drag and drop operation between either two points or two DOM elements. ...</div><div class='long'><p>This method will simulate a drag and drop operation between either two points or two DOM elements.\nThe following events will be fired, in order:  <code>mouseover</code>, <code>mousedown</code>, <code>mousemove</code> (along the mouse path), <code>mouseup</code></p>\n        <div class='rounded-box deprecated-box deprecated-tag-box'>\n        <p>This method has been <strong>deprected</strong> </p>\n        <p>This method is deprecated in favor of <a href=\"#!/api/Siesta.Test.Simulate.Mouse-method-dragTo\" rel=\"Siesta.Test.Simulate.Mouse-method-dragTo\" class=\"docClass\">dragTo</a> and <a href=\"#!/api/Siesta.Test.Simulate.Mouse-method-dragBy\" rel=\"Siesta.Test.Simulate.Mouse-method-dragBy\" class=\"docClass\">dragBy</a> methods</p>\n\n        </div>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>source</span> : <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a><div class='sub-desc'><p>Either an element, or [x,y] as the drag starting point</p>\n</div></li><li><span class='pre'>target</span> : <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a> (optional)<div class='sub-desc'><p>Either an element, or [x,y] as the drag end point</p>\n</div></li><li><span class='pre'>delta</span> : Array (optional)<div class='sub-desc'><p>the amount to drag from the source coordinate, expressed as [x,y]. [50, 10] will drag 50px to the right and 10px down.</p>\n</div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>To run this method async, provide a callback method to be called after the drag operation is completed.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>the scope for the callback</p>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>any extra options used to configure the DOM event</p>\n</div></li></ul></div></div></div><div id='method-dragBy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-method-dragBy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-method-dragBy' class='name expandable'>dragBy</a>( <span class='pre'>source, delta, [callback], [scope], options, dragOnly, [offset]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method will simulate a drag and drop operation from a point (or DOM element) and move by a delta. ...</div><div class='long'><p>This method will simulate a drag and drop operation from a point (or DOM element) and move by a delta.\nThe following events will be fired, in order:  <code>mouseover</code>, <code>mousedown</code>, <code>mousemove</code> (along the mouse path), <code>mouseup</code></p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>source</span> : <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a><div class='sub-desc'><p><a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a> value as the drag starting point</p>\n</div></li><li><span class='pre'>delta</span> : Array<div class='sub-desc'><p>The amount to drag from the source coordinate, expressed as [x,y]. E.g. [50, 10] will drag 50px to the right and 10px down.</p>\n</div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>To run this method async, provide a callback method to be called after the drag operation is completed.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>the scope for the callback</p>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>any extra options used to configure the DOM event</p>\n</div></li><li><span class='pre'>dragOnly</span> : Boolean<div class='sub-desc'><p>true to skip the mouseup and not finish the drop operation.</p>\n</div></li><li><span class='pre'>offset</span> : Array (optional)<div class='sub-desc'><p>An X,Y offset relative to the target. Example: [20, 20] for 20px or [\"50%\", \"100%-2\"] to click in the center horizontally and 2px from the bottom edge.</p>\n</div></li></ul></div></div></div><div id='method-dragTo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-method-dragTo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-method-dragTo' class='name expandable'>dragTo</a>( <span class='pre'>source, target, [callback], [scope], options, dragOnly, [sourceOffset], [targetOffset]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method will simulate a drag and drop operation between either two points or two DOM elements. ...</div><div class='long'><p>This method will simulate a drag and drop operation between either two points or two DOM elements.\nThe following events will be fired, in order:  <code>mouseover</code>, <code>mousedown</code>, <code>mousemove</code> (along the mouse path), <code>mouseup</code></p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>source</span> : <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a><div class='sub-desc'><p><a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a> value for the drag starting point</p>\n</div></li><li><span class='pre'>target</span> : <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a><div class='sub-desc'><p><a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a> value for the drag end point</p>\n</div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>To run this method async, provide a callback method to be called after the drag operation is completed.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>the scope for the callback</p>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>any extra options used to configure the DOM event</p>\n</div></li><li><span class='pre'>dragOnly</span> : Boolean<div class='sub-desc'><p>true to skip the mouseup and not finish the drop operation.</p>\n</div></li><li><span class='pre'>sourceOffset</span> : Array (optional)<div class='sub-desc'><p>An X,Y offset relative to the source. Example: [20, 20] for 20px or [\"50%\", \"100%-2\"] to click in the center horizontally and 2px from the bottom edge.</p>\n</div></li><li><span class='pre'>targetOffset</span> : Array (optional)<div class='sub-desc'><p>An X,Y offset relative to the target. Example: [20, 20] for 20px or [\"50%\", \"100%-2\"] to click in the center horizontally and 2px from the bottom edge.</p>\n</div></li></ul></div></div></div><div id='method-mouseDown' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-method-mouseDown' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-method-mouseDown' class='name expandable'>mouseDown</a>( <span class='pre'>el, options, [offset], [callback], [scope]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method will simulate a mousedown event in the center of the specified DOM element,\nor at current cursor position...</div><div class='long'><p>This method will simulate a mousedown event in the center of the specified DOM element,\nor at current cursor position if no target is provided.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a><div class='sub-desc'>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>any extra options used to configure the DOM event</p>\n</div></li><li><span class='pre'>offset</span> : Array (optional)<div class='sub-desc'><p>An X,Y offset relative to the target. Example: [20, 20] for 20px or [\"50%\", \"100%-2\"] to click in the center horizontally and 2px from the bottom edge.</p>\n</div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>A function to call after mousedown.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope for the callback</p>\n</div></li></ul></div></div></div><div id='method-mouseOut' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-method-mouseOut' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-method-mouseOut' class='name expandable'>mouseOut</a>( <span class='pre'>el, options</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method will simulate a mouseout event in the center of the specified DOM element. ...</div><div class='long'><p>This method will simulate a mouseout event in the center of the specified DOM element.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a><div class='sub-desc'>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>any extra options used to configure the DOM event</p>\n</div></li></ul></div></div></div><div id='method-mouseOver' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-method-mouseOver' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-method-mouseOver' class='name expandable'>mouseOver</a>( <span class='pre'>el, options</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method will simulate a mouseover event in the center of the specified DOM element. ...</div><div class='long'><p>This method will simulate a mouseover event in the center of the specified DOM element.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a><div class='sub-desc'>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>any extra options used to configure the DOM event</p>\n</div></li></ul></div></div></div><div id='method-mouseUp' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-method-mouseUp' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-method-mouseUp' class='name expandable'>mouseUp</a>( <span class='pre'>el, options, [offset]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method will simulate a mousedown event in the center of the specified DOM element,\nor at current cursor position...</div><div class='long'><p>This method will simulate a mousedown event in the center of the specified DOM element,\nor at current cursor position if no target is provided.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a><div class='sub-desc'>\n</div></li><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>any extra options used to configure the DOM event</p>\n</div></li><li><span class='pre'>offset</span> : Array (optional)<div class='sub-desc'><p>An X,Y offset relative to the target. Example: [20, 20] for 20px or [\"50%\", \"100%-2\"] to click in the center horizontally and 2px from the bottom edge.</p>\n</div></li></ul></div></div></div><div id='method-moveCursorBy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-method-moveCursorBy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-method-moveCursorBy' class='name expandable'>moveCursorBy</a>( <span class='pre'>delta, [callback], [scope]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method will simulate a mouse move by an x and y delta amount ...</div><div class='long'><p>This method will simulate a mouse move by an x and y delta amount</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>delta</span> : Array<div class='sub-desc'><p>The delta x and y distance to move, e.g. [20, 20] for 20px down/right, or [0, -10] for 10px up.</p>\n</div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>To run this method async, provide a callback method to be called after the operation is completed.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>the scope for the callback</p>\n</div></li></ul></div></div></div><div id='method-moveCursorTo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-method-moveCursorTo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-method-moveCursorTo' class='name expandable'>moveCursorTo</a>( <span class='pre'>target, [callback], [scope], [offset]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Alias for moveMouseTo, this method will simulate a mouse move to an xy-coordinate or an element (the center of it) ...</div><div class='long'><p>Alias for moveMouseTo, this method will simulate a mouse move to an xy-coordinate or an element (the center of it)</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>target</span> : <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a><div class='sub-desc'><p>Target point to move the mouse to.</p>\n</div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>To run this method async, provide a callback method to be called after the operation is completed.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>the scope for the callback</p>\n</div></li><li><span class='pre'>offset</span> : Array (optional)<div class='sub-desc'><p>An X,Y offset relative to the target. Example: [20, 20] for 20px or [\"50%\", \"50%\"] to click in the center.</p>\n</div></li></ul></div></div></div><div id='method-moveMouseBy' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-method-moveMouseBy' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-method-moveMouseBy' class='name expandable'>moveMouseBy</a>( <span class='pre'>delta, [callback], [scope]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method will simulate a mouse move by an x a y delta amount ...</div><div class='long'><p>This method will simulate a mouse move by an x a y delta amount</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>delta</span> : Array<div class='sub-desc'><p>The delta x and y distance to move, e.g. [20, 20] for 20px down/right, or [0, 10] for just 10px down.</p>\n</div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>To run this method async, provide a callback method to be called after the operation is completed.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>the scope for the callback</p>\n</div></li></ul></div></div></div><div id='method-moveMouseTo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-method-moveMouseTo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-method-moveMouseTo' class='name expandable'>moveMouseTo</a>( <span class='pre'>target, [callback], [scope], [offset]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method will simulate a mouse move to an xy-coordinate or an element (the center of it) ...</div><div class='long'><p>This method will simulate a mouse move to an xy-coordinate or an element (the center of it)</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>target</span> : <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a><div class='sub-desc'><p>Target point to move the mouse to.</p>\n</div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>To run this method async, provide a callback method to be called after the operation is completed.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>the scope for the callback</p>\n</div></li><li><span class='pre'>offset</span> : Array (optional)<div class='sub-desc'><p>An X,Y offset relative to the target. Example: [20, 20] for 20px or [\"50%\", \"50%\"] to click in the center.</p>\n</div></li></ul></div></div></div><div id='method-rightClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Siesta.Test.Simulate.Mouse'>Siesta.Test.Simulate.Mouse</span><br/><a href='source/Mouse.html#Siesta-Test-Simulate-Mouse-method-rightClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Siesta.Test.Simulate.Mouse-method-rightClick' class='name expandable'>rightClick</a>( <span class='pre'>[el], [callback], [scope], [options], [offset]</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>This method will simulate a mouse right click in the center of the specified DOM/Ext element,\nor at current cursor po...</div><div class='long'><p>This method will simulate a mouse right click in the center of the specified DOM/Ext element,\nor at current cursor position if no target is provided.</p>\n\n<p>Note, that it will first calculate the centeral point of the specified element and then\nwill pick the top-most DOM element from that point. For example, if you will provide a grid row as the <code>el</code>,\nthen click will happen on top of the central cell, and then will bubble to the row itself.\nIn most cases this is the desired behavior.</p>\n\n<p>The following events will be fired, in order:  <code>mouseover</code>, <code>mousedown</code>, <code>mouseup</code>, <code>contextmenu</code></p>\n\n<p>Example:</p>\n\n<pre><code> t.click(t.getFirstRow(grid), function () { ... })\n</code></pre>\n\n<p>The 1st argument for this method can be omitted. In this case, Siesta will use the current cursor position:</p>\n\n<pre><code> t.click(function () { ... })\n</code></pre>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>el</span> : <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a> (optional)<div class='sub-desc'><p>One of the <a href=\"#!/api/Siesta.Test.ActionTarget\" rel=\"Siesta.Test.ActionTarget\" class=\"docClass\">Siesta.Test.ActionTarget</a> values to convert to DOM element</p>\n</div></li><li><span class='pre'>callback</span> : Function (optional)<div class='sub-desc'><p>A function to call after click.</p>\n</div></li><li><span class='pre'>scope</span> : Object (optional)<div class='sub-desc'><p>The scope for the callback</p>\n</div></li><li><span class='pre'>options</span> : Object (optional)<div class='sub-desc'><p>Any options to use for the simulated DOM event</p>\n</div></li><li><span class='pre'>offset</span> : Array (optional)<div class='sub-desc'><p>An X,Y offset relative to the target. Example: [20, 20] for 20px or [\"50%\", \"100%-2\"] to click in the center horizontally and 2px from the bottom edge.</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});