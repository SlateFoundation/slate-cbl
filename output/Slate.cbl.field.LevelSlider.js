Ext.data.JsonP.Slate_cbl_field_LevelSlider({"tagname":"class","name":"Slate.cbl.field.LevelSlider","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"LevelSlider.js","href":"LevelSlider.html#Slate-cbl-field-LevelSlider"}],"aliases":{"widget":["slate-cbl-levelsliderfield"]},"alternateClassNames":[],"extends":"Ext.slider.Single","mixins":[],"requires":[],"uses":["Ext.tip.ToolTip"],"members":[{"name":"parkedValue","tagname":"cfg","owner":"Slate.cbl.field.LevelSlider","id":"cfg-parkedValue","meta":{"private":true}},{"name":"thumbValue","tagname":"cfg","owner":"Slate.cbl.field.LevelSlider","id":"cfg-thumbValue","meta":{"private":true}},{"name":"componentCls","tagname":"property","owner":"Slate.cbl.field.LevelSlider","id":"property-componentCls","meta":{"private":true}},{"name":"listeners","tagname":"property","owner":"Slate.cbl.field.LevelSlider","id":"property-listeners","meta":{"private":true}},{"name":"maxValue","tagname":"property","owner":"Slate.cbl.field.LevelSlider","id":"property-maxValue","meta":{"private":true}},{"name":"minValue","tagname":"property","owner":"Slate.cbl.field.LevelSlider","id":"property-minValue","meta":{"private":true}},{"name":"thumbTpl","tagname":"property","owner":"Slate.cbl.field.LevelSlider","id":"property-thumbTpl","meta":{"private":true}},{"name":"useTips","tagname":"property","owner":"Slate.cbl.field.LevelSlider","id":"property-useTips","meta":{"private":true}},{"name":"getLevel","tagname":"method","owner":"Slate.cbl.field.LevelSlider","id":"method-getLevel","meta":{"private":true}},{"name":"getParkedValue","tagname":"method","owner":"Slate.cbl.field.LevelSlider","id":"method-getParkedValue","meta":{}},{"name":"getThumbValue","tagname":"method","owner":"Slate.cbl.field.LevelSlider","id":"method-getThumbValue","meta":{}},{"name":"onRender","tagname":"method","owner":"Slate.cbl.field.LevelSlider","id":"method-onRender","meta":{"private":true}},{"name":"onThumbClick","tagname":"method","owner":"Slate.cbl.field.LevelSlider","id":"method-onThumbClick","meta":{"private":true}},{"name":"setLevel","tagname":"method","owner":"Slate.cbl.field.LevelSlider","id":"method-setLevel","meta":{"private":true}},{"name":"setParkedValue","tagname":"method","owner":"Slate.cbl.field.LevelSlider","id":"method-setParkedValue","meta":{}},{"name":"setThumbValue","tagname":"method","owner":"Slate.cbl.field.LevelSlider","id":"method-setThumbValue","meta":{}},{"name":"updateParkedValue","tagname":"method","owner":"Slate.cbl.field.LevelSlider","id":"method-updateParkedValue","meta":{"private":true}},{"name":"updateThumbValue","tagname":"method","owner":"Slate.cbl.field.LevelSlider","id":"method-updateThumbValue","meta":{"private":true}}],"code_type":"ext_define","id":"class-Slate.cbl.field.LevelSlider","short_doc":"TODO: convert to a direct decendent for sliderfield that appends the label element instead of using container+compone...","component":false,"superclasses":["Ext.slider.Single"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.slider.Single<div class='subclass '><strong>Slate.cbl.field.LevelSlider</strong></div></div><h4>Uses</h4><div class='dependency'>Ext.tip.ToolTip</div><h4>Files</h4><div class='dependency'><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider' target='_blank'>LevelSlider.js</a></div></pre><div class='doc-contents'><p>TODO: convert to a direct decendent for sliderfield that appends the label element instead of using container+component and burying the form api</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-cfg'>Config options</h3><div class='subsection'><div id='cfg-parkedValue' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-cfg-parkedValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-cfg-parkedValue' class='name expandable'>parkedValue</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='cfg-thumbValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-cfg-thumbValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-cfg-thumbValue' class='name expandable'>thumbValue</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-componentCls' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-property-componentCls' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-property-componentCls' class='name expandable'>componentCls</a> : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>&#39;cbl-level-slider-field&#39;</code></p></div></div></div><div id='property-listeners' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-property-listeners' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-property-listeners' class='name expandable'>listeners</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>\n</div><div class='long'>\n</div></div></div><div id='property-maxValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-property-maxValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-property-maxValue' class='name expandable'>maxValue</a> : Number<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>13</code></p></div></div></div><div id='property-minValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-property-minValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-property-minValue' class='name expandable'>minValue</a> : Number<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>7</code></p></div></div></div><div id='property-thumbTpl' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-property-thumbTpl' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-property-thumbTpl' class='name expandable'>thumbTpl</a> : Array<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>[&#39;&lt;span class=&quot;value&quot;&gt;&#39;, &#39;&lt;tpl if=&quot;value === null&quot;&gt;&#39;, &#39;&lt;small class=&quot;muted&quot;&gt;N/A&lt;/small&gt;&#39;, &#39;&lt;tpl elseif=&quot;value === 0&quot;&gt;&#39;, &#39;M&#39;, &#39;&lt;tpl else&gt;&#39;, &#39;{value}&#39;, &#39;&lt;/tpl&gt;&#39;, &#39;&lt;/span&gt;&#39;]</code></p></div></div></div><div id='property-useTips' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-property-useTips' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-property-useTips' class='name expandable'>useTips</a> : Boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>false</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-getLevel' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-method-getLevel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-method-getLevel' class='name expandable'>getLevel</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-getParkedValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-cfg-parkedValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-method-getParkedValue' class='name expandable'>getParkedValue</a>( <span class='pre'></span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the value of parkedValue. ...</div><div class='long'><p>Returns the value of <a href=\"#!/api/Slate.cbl.field.LevelSlider-cfg-parkedValue\" rel=\"Slate.cbl.field.LevelSlider-cfg-parkedValue\" class=\"docClass\">parkedValue</a>.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getThumbValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-cfg-thumbValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-method-getThumbValue' class='name expandable'>getThumbValue</a>( <span class='pre'></span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Returns the value of thumbValue. ...</div><div class='long'><p>Returns the value of <a href=\"#!/api/Slate.cbl.field.LevelSlider-cfg-thumbValue\" rel=\"Slate.cbl.field.LevelSlider-cfg-thumbValue\" class=\"docClass\">thumbValue</a>.</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-onRender' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-method-onRender' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-method-onRender' class='name expandable'>onRender</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onThumbClick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-method-onThumbClick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-method-onThumbClick' class='name expandable'>onThumbClick</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-setLevel' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-method-setLevel' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-method-setLevel' class='name expandable'>setLevel</a>( <span class='pre'>level</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>level</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-setParkedValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-cfg-parkedValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-method-setParkedValue' class='name expandable'>setParkedValue</a>( <span class='pre'>parkedValue</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the value of parkedValue. ...</div><div class='long'><p>Sets the value of <a href=\"#!/api/Slate.cbl.field.LevelSlider-cfg-parkedValue\" rel=\"Slate.cbl.field.LevelSlider-cfg-parkedValue\" class=\"docClass\">parkedValue</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>parkedValue</span> : Object<div class='sub-desc'><p>The new value.</p>\n</div></li></ul></div></div></div><div id='method-setThumbValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-cfg-thumbValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-method-setThumbValue' class='name expandable'>setThumbValue</a>( <span class='pre'>thumbValue</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the value of thumbValue. ...</div><div class='long'><p>Sets the value of <a href=\"#!/api/Slate.cbl.field.LevelSlider-cfg-thumbValue\" rel=\"Slate.cbl.field.LevelSlider-cfg-thumbValue\" class=\"docClass\">thumbValue</a>.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>thumbValue</span> : Object<div class='sub-desc'><p>The new value.</p>\n</div></li></ul></div></div></div><div id='method-updateParkedValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-method-updateParkedValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-method-updateParkedValue' class='name expandable'>updateParkedValue</a>( <span class='pre'>value</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-updateThumbValue' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Slate.cbl.field.LevelSlider'>Slate.cbl.field.LevelSlider</span><br/><a href='source/LevelSlider.html#Slate-cbl-field-LevelSlider-method-updateThumbValue' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Slate.cbl.field.LevelSlider-method-updateThumbValue' class='name expandable'>updateThumbValue</a>( <span class='pre'>value, oldValue</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>value</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>oldValue</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div></div></div></div>","meta":{}});