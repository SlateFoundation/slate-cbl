Ext.define('Slate.cbl.view.CompetenciesGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'slate-cbl-competenciesgrid',
    requires: [
        'Ext.grid.column.Template',
        'Ext.grid.feature.Grouping',
        'Ext.form.field.Text',

        'Slate.cbl.store.Competencies'
    ],


    /**
     * @event competencyselect
     * Fires when a competency is selected
     * @param {Slate.cbl.view.CompetenciesGrid} competenciesGrid
     * @param {Slate.cbl.model.Competency} competency
     */


    config: {
        searchField: true
    },


    componentCls: 'slate-cbl-ratingsfield-competenciesgrid',
    hideHeaders: true,
    viewConfig: {
        emptyText: 'No competencies match your search.',
        stripeRows: false
    },
    store: {
        type: 'slate-cbl-competencies',
        groupField: 'ContentAreaID',
        autoLoad: true,
        proxy: {
            type: 'slate-cbl-competencies',
            include: null,
            relatedTable: 'ContentArea'
        }
    },
    columns: [
        {
            flex: 1,

            xtype: 'templatecolumn',
            text: 'Competency',
            tpl: [
                '<span class="descriptor">{Descriptor}</span>',
                '<small class="code">{Code}</small>',
            ]
        }
    ],
    features: [
        {
            id: 'grouping',
            ftype: 'grouping',
            groupHeaderTpl: [
                '<tpl for="values.children[0].get(\'ContentArea\')">',
                    '<span class="title">{Title}</span>',
                    '<small class="code">{Code}</small>',
                '</tpl>'
            ],
            enableGroupingMenu: false,
            startCollapsed: true
        }
    ],
    listeners: {
        rowclick: 'onRowClick'
    },


    // config handlers
    applySearchField: function(searchField, oldSearchField) {
        if (!searchField || typeof searchField == 'boolean') {
            searchField = {
                hidden: !searchField
            };
        }

        if (typeof searchField == 'object' && !searchField.isComponent) {
            searchField = Ext.apply({
                margin: '6 12',
                emptyText: 'Type competency code or statement&hellip;',
                excludeForm: true // exclude from any parent forms
            }, searchField, { dock: 'top' });
        }

        return Ext.factory(searchField, 'Ext.form.field.Text', oldSearchField);
    },

    updateSearchField: function(searchField) {
        searchField.on({
            scope: this,
            change: 'onSearchFieldChange',
            specialkey: 'onSearchFieldSpecialKey'
        });
    },


    // container lifecycle
    initItems: function() {
        var me = this,
            searchField = me.getSearchField();

        me.callParent(arguments);

        if (searchField) {
            me.addDocked(searchField);
        }
    },


    // event handlers
    onSearchFieldChange: function() {
        this.syncFilter();
    },

    onSearchFieldSpecialKey: function(searchField, ev) {
        var me = this,
            selectionModel = me.getSelectionModel(),
            selectMethod = 'selectPrevious',
            selectedCompetency;

        switch (ev.getKey()) {
            case ev.ENTER:
                ev.stopEvent();
                selectedCompetency = selectionModel.getLastSelected();
                if (selectedCompetency) {
                    selectionModel.deselectAll();
                    me.fireEvent('competencyselect', me, selectedCompetency);
                }
                break;
            case ev.DOWN:
                selectMethod = 'selectNext';
                // eslint-disable-next-line no-fallthrough
            case ev.UP:
                ev.stopEvent();
                if (selectionModel[selectMethod](false, true)) {
                    me.ensureVisible(selectionModel.getLastSelected());
                }
                break;
            default:
                return;
        }
    },

    onRowClick: function(view, competency) {
        this.getSelectionModel().deselectAll();
        this.fireEvent('competencyselect', this, competency);
    },


    // local methods
    syncFilter: function() {
        var me = this,
            store = me.getStore(),
            groupingFeature = me.getView().getFeature('grouping'),
            query = Ext.String.trim(me.getSearchField().getValue()),
            regex = query && Ext.String.createRegex(query, false, false);


        Ext.suspendLayouts();


        store.clearFilter(false);
        if (query) {
            store.filterBy(function(competency) {
                return (
                    // isCompetencyAvailable(competency) && (
                        regex.test(competency.get('Code')) ||
                        regex.test(competency.get('Descriptor'))
                    // )
                );
            });

            if (store.getCount()) {
                groupingFeature.expandAll();
                me.getSelectionModel().select(store.getAt(0), false, true);
            }
        } else {
            // store.filterBy(isCompetencyAvailable);
            groupingFeature.collapseAll();
        }


        Ext.resumeLayouts(true);
    }
});