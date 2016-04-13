/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.TestNameColumn', {
    extend       : 'Ext.tree.Column',
    xtype        : 'testnamecolumn',
    
    sortable     : false,
    dataIndex    : 'title',
    menuDisabled : true,
    flex         : 1,
    tdCls        : 'test-name-cell',
    
    scope        : this,
    filterGroups : null,
    store        : null,

    initComponent : function () {

        var R = Siesta.Resource('Siesta.Harness.Browser.UI.TestGrid');

        Ext.apply(this, {
            items : [
                {
                    xtype        : 'treefilter',
                    emptyText    : R.get('filterTestsText'),
                    margins      : '0 0 0 10',
                    itemId       : 'trigger',
                    filterGroups : this.filterGroups,
                    filterField  : 'title',
                    store        : this.store,
                    tipText      : R.get('filterFieldTooltip')
                }
            ]
        });

        this.callParent(arguments);
    },

    // HACK OVERRIDE
    treeRenderer : function (value, metaData, testFile) {
        var cls = '';
        var folderIcon = '';

        metaData.tdCls = 'test-name-cell-' + (testFile.data.leaf ? 'leaf' : 'parent');

        if (testFile.isLeaf()) {

            var test = testFile.get('test')

            if (test) {

                if (testFile.get('isFailed'))
                    testFile.data.iconCls = 'siesta-test-failed fa-flag'

                else if (testFile.get('isRunning') && !test.isFinished())
                    testFile.data.iconCls = 'fa-flash siesta-running-not-finished'
                else if (test.isFinished()) {

                    if (test.isPassed())
                        testFile.data.iconCls = 'fa-check siesta-test-passed'
                    else
                        testFile.data.iconCls = 'fa-bug siesta-test-failed'
                } else
                    testFile.data.iconCls = 'fa-hourglass-o siesta-test-starting'

            } else {

                if (testFile.get('isMissing'))
                    testFile.data.iconCls = 'fa-close siesta-test-file-missing'
                else if (testFile.get('isStarting'))
                    testFile.data.iconCls = 'fa-hourglass-o siesta-test-starting'
                else
                    testFile.data.iconCls = 'fa-file-o siesta-test-file'
            }
        } else {
            var status = testFile.get('folderStatus');

            if (status == 'working') {
                testFile.data.iconCls = ' fa-hourglass-o siesta-folder-running';
            } else if (status == 'green') {
                testFile.data.iconCls = ' fa-check siesta-folder-pass';
            } else if (status == 'red') {
                testFile.data.iconCls = ' fa-bug siesta-folder-fail';
            } else {
                testFile.data.iconCls = '';
            }
        }

        return this.callParent(arguments);
    },

    renderer : function(v, m, r) {return v;}
})
