/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.TestGridContextMenu', {
    extend : 'Ext.menu.Menu',
    xtype  : 'testgridcontextmenu',

    items : [
        {
            itemId : 'uncheckOthers',
            text   : Siesta.Resource('Siesta.Harness.Browser.UI.Viewport').get('uncheckOthersText')
        },
        {
            itemId : 'uncheckAll',
            text   : Siesta.Resource('Siesta.Harness.Browser.UI.Viewport').get('uncheckAllText')
        },
        {
            itemId : 'checkAll',
            text   : Siesta.Resource('Siesta.Harness.Browser.UI.Viewport').get('checkAllText')
        },
        {
            itemId : 'runThis',
            text   : Siesta.Resource('Siesta.Harness.Browser.UI.Viewport').get('runThisText')
        },
        {
            itemId : 'viewSource',
            text   : Siesta.Resource('Siesta.Harness.Browser.UI.Viewport').get('viewSource')
        },
        { xtype   : 'menuseparator' },
        {
            itemId : 'expandAll',
            text   : Siesta.Resource('Siesta.Harness.Browser.UI.Viewport').get('expandAll')
        },
        {
            itemId : 'collapseAll',
            text   : Siesta.Resource('Siesta.Harness.Browser.UI.Viewport').get('collapseAll')
        },
        { xtype   : 'menuseparator' },
        {
            itemId : 'filterToCurrentGroup',
            text   : Siesta.Resource('Siesta.Harness.Browser.UI.Viewport').get('filterToCurrentGroup')
        },
        {
            itemId : 'filterToFailed',
            text   : Siesta.Resource('Siesta.Harness.Browser.UI.Viewport').get('filterToFailed')
        }
    ]
})
