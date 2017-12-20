Ext.data.JsonP.SlateTasksTeacher_controller_Dashboard({"tagname":"class","name":"SlateTasksTeacher.controller.Dashboard","autodetected":{"aliases":true,"alternateClassNames":true,"extends":true,"mixins":true,"requires":true,"uses":true,"members":true,"code_type":true},"files":[{"filename":"Dashboard.js","href":"Dashboard8.html#SlateTasksTeacher-controller-Dashboard"}],"aliases":{},"alternateClassNames":[],"extends":"Ext.app.Controller","mixins":[],"requires":[],"uses":[],"members":[{"name":"control","tagname":"property","owner":"SlateTasksTeacher.controller.Dashboard","id":"property-control","meta":{"private":true}},{"name":"listen","tagname":"property","owner":"SlateTasksTeacher.controller.Dashboard","id":"property-listen","meta":{"private":true}},{"name":"refs","tagname":"property","owner":"SlateTasksTeacher.controller.Dashboard","id":"property-refs","meta":{"private":true}},{"name":"routes","tagname":"property","owner":"SlateTasksTeacher.controller.Dashboard","id":"property-routes","meta":{"private":true}},{"name":"stores","tagname":"property","owner":"SlateTasksTeacher.controller.Dashboard","id":"property-stores","meta":{"private":true}},{"name":"views","tagname":"property","owner":"SlateTasksTeacher.controller.Dashboard","id":"property-views","meta":{"private":true}},{"name":"onCohortSelectorClear","tagname":"method","owner":"SlateTasksTeacher.controller.Dashboard","id":"method-onCohortSelectorClear","meta":{"private":true}},{"name":"onCohortSelectorSelect","tagname":"method","owner":"SlateTasksTeacher.controller.Dashboard","id":"method-onCohortSelectorSelect","meta":{"private":true}},{"name":"onLaunch","tagname":"method","owner":"SlateTasksTeacher.controller.Dashboard","id":"method-onLaunch","meta":{"private":true}},{"name":"onSectionCohortsLoad","tagname":"method","owner":"SlateTasksTeacher.controller.Dashboard","id":"method-onSectionCohortsLoad","meta":{"private":true}},{"name":"onSectionSelectorSelect","tagname":"method","owner":"SlateTasksTeacher.controller.Dashboard","id":"method-onSectionSelectorSelect","meta":{"private":true}},{"name":"onSectionsLoad","tagname":"method","owner":"SlateTasksTeacher.controller.Dashboard","id":"method-onSectionsLoad","meta":{"private":true}},{"name":"onSelectedCohortChange","tagname":"method","owner":"SlateTasksTeacher.controller.Dashboard","id":"method-onSelectedCohortChange","meta":{"private":true}},{"name":"onSelectedSectionChange","tagname":"method","owner":"SlateTasksTeacher.controller.Dashboard","id":"method-onSelectedSectionChange","meta":{"private":true}},{"name":"showDashboard","tagname":"method","owner":"SlateTasksTeacher.controller.Dashboard","id":"method-showDashboard","meta":{"private":true}}],"code_type":"ext_define","id":"class-SlateTasksTeacher.controller.Dashboard","short_doc":"The Dashboard controller manages the main functionality of the SlateTasksTeacher application where teachers can\nbrows...","component":false,"superclasses":["Ext.app.Controller"],"subclasses":[],"mixedInto":[],"parentMixins":[],"html":"<div><pre class=\"hierarchy\"><h4>Hierarchy</h4><div class='subclass first-child'>Ext.app.Controller<div class='subclass '><strong>SlateTasksTeacher.controller.Dashboard</strong></div></div><h4>Files</h4><div class='dependency'><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard' target='_blank'>Dashboard.js</a></div></pre><div class='doc-contents'><p>The Dashboard controller manages the main functionality of the SlateTasksTeacher application where teachers can\nbrowse, search, create, edit, and assign tasks.</p>\n\n<h2>Responsibilities</h2>\n\n<ul>\n<li>Handle section/:sectionId route</li>\n<li>Handle CRUD operations for tasks/student tasks</li>\n<li>Filter StudentsGrid tasks/students by selected section</li>\n</ul>\n\n\n<h2>TODO</h2>\n\n<ul>\n<li>[X] sort refs by parent</li>\n<li>[X] ensure no extra autoCreate refs</li>\n<li>[X] match dependencies to controller refs</li>\n<li>[X] change route format to ':sectionCode'</li>\n<li>[X] mediate state through dashboard view config</li>\n<li>[X] drive <code>setSection</code>/<code>sectionchange</code> and <code>setCohort</code>/<code>cohortchange</code> state via dashboard view config</li>\n<li>[X] drive store and view config from change events in controller</li>\n<li>[ ] ensure Navigation <-> State flow</li>\n<li>[ ] ensure requires include all and only the views being create within the same file</li>\n<li>[ ] Update controller descriptions/responsibilities</li>\n</ul>\n\n\n<h2>Roadmap</h2>\n\n<ul>\n<li>Break out sibling controllers for post-navigation workflows like drive integration, task editing</li>\n</ul>\n\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-control' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-property-control' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-property-control' class='name expandable'>control</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{dashboardCt: {selectedsectionchange: &#39;onSelectedSectionChange&#39;, selectedcohortchange: &#39;onSelectedCohortChange&#39;}, sectionSelector: {select: &#39;onSectionSelectorSelect&#39;}, cohortSelector: {select: &#39;onCohortSelectorSelect&#39;, clear: &#39;onCohortSelectorClear&#39;}}</code></p></div></div></div><div id='property-listen' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-property-listen' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-property-listen' class='name expandable'>listen</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>{store: {&#39;#Sections&#39;: {load: &#39;onSectionsLoad&#39;}, &#39;#SectionCohorts&#39;: {load: &#39;onSectionCohortsLoad&#39;}}}</code></p></div></div></div><div id='property-refs' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-property-refs' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-property-refs' class='name expandable'>refs</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>component factories and selectors ...</div><div class='long'><p>component factories and selectors</p>\n<p>Defaults to: <code>{dashboardCt: {selector: &#39;slate-tasks-teacher-dashboard&#39;, autoCreate: true, xtype: &#39;slate-tasks-teacher-dashboard&#39;}, sectionSelector: &#39;slate-tasks-teacher-appheader slate-section-selector&#39;, cohortSelector: &#39;slate-tasks-teacher-appheader slate-cohort-selector&#39;}</code></p></div></div></div><div id='property-routes' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-property-routes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-property-routes' class='name expandable'>routes</a> : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>entry points ...</div><div class='long'><p>entry points</p>\n<p>Defaults to: <code>{&#39;:sectionCode/:cohortName&#39;: {action: &#39;showDashboard&#39;, conditions: {&#39;:sectionCode&#39;: &#39;([^/]+)&#39;, &#39;:cohortName&#39;: &#39;([^/]+)&#39;}}}</code></p></div></div></div><div id='property-stores' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-property-stores' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-property-stores' class='name expandable'>stores</a> : Array<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<p>Defaults to: <code>[&#39;Sections@Slate.store.courses&#39;, &#39;SectionCohorts@Slate.store.courses&#39;, &#39;SectionParticipants&#39;]</code></p></div></div></div><div id='property-views' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-property-views' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-property-views' class='name expandable'>views</a> : Array<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>dependencies ...</div><div class='long'><p>dependencies</p>\n<p>Defaults to: <code>[&#39;Dashboard&#39;]</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-onCohortSelectorClear' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-method-onCohortSelectorClear' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-method-onCohortSelectorClear' class='name expandable'>onCohortSelectorClear</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n</div></div></div><div id='method-onCohortSelectorSelect' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-method-onCohortSelectorSelect' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-method-onCohortSelectorSelect' class='name expandable'>onCohortSelectorSelect</a>( <span class='pre'>cohortSelector, cohort</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cohortSelector</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>cohort</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-onLaunch' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-method-onLaunch' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-method-onLaunch' class='name expandable'>onLaunch</a>( <span class='pre'></span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>controller templates method overrides ...</div><div class='long'><p>controller templates method overrides</p>\n</div></div></div><div id='method-onSectionCohortsLoad' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-method-onSectionCohortsLoad' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-method-onSectionCohortsLoad' class='name expandable'>onSectionCohortsLoad</a>( <span class='pre'>store, records, success</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>store</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>records</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>success</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-onSectionSelectorSelect' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-method-onSectionSelectorSelect' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-method-onSectionSelectorSelect' class='name expandable'>onSectionSelectorSelect</a>( <span class='pre'>sectionSelector, section</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>sectionSelector</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>section</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-onSectionsLoad' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-method-onSectionsLoad' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-method-onSectionsLoad' class='name expandable'>onSectionsLoad</a>( <span class='pre'>sectionsStore</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>event handlers ...</div><div class='long'><p>event handlers</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>sectionsStore</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-onSelectedCohortChange' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-method-onSelectedCohortChange' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-method-onSelectedCohortChange' class='name expandable'>onSelectedCohortChange</a>( <span class='pre'>dashboardCt, cohortName</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>dashboardCt</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>cohortName</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-onSelectedSectionChange' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-method-onSelectedSectionChange' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-method-onSelectedSectionChange' class='name expandable'>onSelectedSectionChange</a>( <span class='pre'>dashboardCt, sectionCode</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>dashboardCt</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>sectionCode</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-showDashboard' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='SlateTasksTeacher.controller.Dashboard'>SlateTasksTeacher.controller.Dashboard</span><br/><a href='source/Dashboard8.html#SlateTasksTeacher-controller-Dashboard-method-showDashboard' target='_blank' class='view-source'>view source</a></div><a href='#!/api/SlateTasksTeacher.controller.Dashboard-method-showDashboard' class='name expandable'>showDashboard</a>( <span class='pre'>sectionCode, cohortName</span> )<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>route handlers ...</div><div class='long'><p>route handlers</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>sectionCode</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>cohortName</span> : Object<div class='sub-desc'></div></li></ul></div></div></div></div></div></div></div>","meta":{}});