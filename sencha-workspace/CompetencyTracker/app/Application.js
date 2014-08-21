/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('CompetencyTracker.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'Slate.cbl.view.teacher.Dashboard',
        'Ext.plugin.Viewport'
    ],
    
    launch: function () {
        Ext.create('Slate.cbl.view.teacher.Dashboard', {
            plugins: 'viewport'
        });
    }
});
