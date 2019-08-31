Ext.define('Slate.cbl.view.CompetenciesGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'slate-cbl-competenciesgrid',
    requires: [
        'Ext.util.Filter',
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
        searchField: true,
        queryFilter: null,
        excludeFilter: null
    },


    componentCls: 'slate-cbl-competenciesgrid',
    height: 300,
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
            include: 'skillIds',
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
        activate: 'onActivate',
        rowclick: 'onRowClick'
    },


    // config handlers
    applySearchField: function(searchField, oldSearchField) {
        if (!searchField || typeof searchField == 'boolean') {
            searchField = {
                hidden: !searchField
            };
        }

        if (typeof searchField == 'object' && !searchField.isComponent && !oldSearchField) {
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

    applyQueryFilter: function(query, oldFilter) {
        var filter = Ext.String.trim(query);

        if (!filter) {
            return null;
        }

        if (oldFilter && oldFilter.query == query) {
            return oldFilter;
        }

        filter = Ext.String.createRegex(filter, false, false);

        return new Ext.util.Filter({
            query: query,
            filterFn: function(competency) {
                return (
                    filter.test(competency.get('Code'))
                    || filter.test(competency.get('Descriptor'))
                );
            }
        });
    },

    updateQueryFilter: function(filter, oldFilter) {
        var me = this,
            store = me.getStore(),
            groupingFeature;

        me.getSearchField().setValue(filter ? filter.query : null);

        if (!store.isStore) {
            return;
        }

        groupingFeature = me.getView().getFeature('grouping');

        if (oldFilter) {
            store.removeFilter(oldFilter, Boolean(filter));
        }

        if (filter) {
            store.addFilter(filter);

            if (store.getCount()) {
                groupingFeature.expandAll();
                me.getSelectionModel().select(store.getAt(0), false, true);
            }
        } else {
            groupingFeature.collapseAll();
        }
    },

    applyExcludeFilter: function(filter) {
        if (!filter) {
            return null;
        }

        return new Ext.util.Filter({
            property: 'Code',
            operator: 'notin',
            value: filter
        });
    },

    updateExcludeFilter: function(filter, oldFilter) {
        var store = this.getStore();

        if (!store.isStore) {
            return;
        }

        if (oldFilter) {
            store.removeFilter(oldFilter, Boolean(filter));
        }

        if (filter) {
            store.addFilter(filter);
        }
    },


    // container lifecycle
    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        me.getStore().setFilters(Ext.Array.clean([
            me.getExcludeFilter(),
            me.getQueryFilter()
        ]));
    },

    initItems: function() {
        var me = this,
            searchField = me.getSearchField();

        me.callParent(arguments);

        if (searchField) {
            me.addDocked(searchField);
        }
    },


    // event handlers
    onActivate: function() {
        // only direct focus on subsequent activations
        if (this.activated) {
            this.getSearchField().focus();
        }

        this.activated = true;
    },

    onSearchFieldChange: function(searchField, query) {
        this.setQueryFilter(query);
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
    }
});