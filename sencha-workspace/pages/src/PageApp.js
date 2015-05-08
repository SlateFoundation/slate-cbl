/*jslint browser: true, undef: true *//*global Ext*/
Ext.define('Site.PageApp', {
	extend: 'Ext.app.Application',
	namespace: 'Site',

	// overwrite apps forced setting of $namespace to app.name if the pageapp defines namespace
	onClassExtended: function(cls, data, hooks) {
		if (data.namespace) {
			data.$namespace = data.namespace;
		}
	},
	
	constructor: function(config) {
		var me = this,
			constructor = me.superclass.superclass.constructor;

		// defer app construction until onReady
		Ext.onReady(function() {
			constructor.call(me, config);
		});
	}
});