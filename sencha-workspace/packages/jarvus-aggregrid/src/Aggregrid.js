/**
 * ## Lifecycle
 * See https://docs.google.com/drawings/d/1zOGHU8kRRCXe4SwyS6UOtjKA7cvWaWJ4t9BS-wWbyLU/edit?usp=sharing
 *
 * ## TODO
 * - [X] Continuously update data cell renderings
 * - [X] Continuously add rows
 * - [X] Implement scroll locking
 * - [ ] Process data changes immediately and serially, only buffer UI updates
 * - [ ] Continuously update/remove rows without refresh
 * - [ ] Ensure that refresh firing on data store to to sort/filter handles re-grouping already-grouped records
 */
Ext.define('Jarvus.aggregrid.Aggregrid', {
    extend: 'Ext.Component',
    xtype: 'jarvus-aggregrid',


    config: {
        columnsStore: null,
        rowsStore: null,
        dataStore: null,

        columnHeaderField: 'title',
        columnHeaderTpl: false,
        columnHeaderLinkTpl: '{$href:defaultValue("#")}',
        columnMapper: 'column_id',

        rowHeaderField: 'title',
        rowHeaderTpl: false,
        rowMapper: 'row_id',
        expandable: false,

        cellTpl: '{records.length}',
        cellRenderer: false,

        componentCls: 'jarvus-aggregrid',
        listeners: {
            click: {
                element: 'el',
                fn: 'onClick'
            }
        }
    },


    tpl: [
        '<div class="jarvus-aggregrid-rowheaders-ct">',
            '<table class="jarvus-aggregrid-rowheaders-table">',
                '<thead>',
                    '<tr>',
                        '<td class="jarvus-aggregrid-cornercell">',
                            '&nbsp;',
                        '</td>',
                    '</tr>',
                '</thead>',

                '<tbody>{% values.headerRowsTpl.applyOut(values.rows, out) %}</tbody>',
            '</table>',
        '</div>',

        '<div class="jarvus-aggregrid-scroller">',
            '<div class="jarvus-aggregrid-data-ct">',
        // TODO: hide/show dynamically based on scroll position and wire clicking
        // '        <div tabindex="0" class="jarvus-aggregrid-scroll-control is-disabled scroll-left"></div>',
        // '        <div tabindex="0" class="jarvus-aggregrid-scroll-control is-disabled scroll-right"></div>',

                '<table class="jarvus-aggregrid-data-table">',
                    '<thead>',
                        '<tr>',
                            '<tpl for="columns">',
                                '<th class="jarvus-aggregrid-colheader" data-column-id="{$id}">',
                                    '<div class="jarvus-aggregrid-header-clip">',
                                        '<a class="jarvus-aggregrid-header-link" href="{% values.$columnHeaderLinkTpl.applyOut(values, out) %}" target="_blank">',
                                            '<span class="jarvus-aggregrid-header-text">',
                                                '{% values.$columnHeaderTpl.applyOut(values, out) %}',
                                            '</span>',
                                        '</a>',
                                    '</div>',
                                '</th>',
                            '</tpl>',
                        '</tr>',
                    '</thead>',

                    '<tbody>{% values.rowsTpl.applyOut(values.rows, out) %}</tbody>',
                '</table>',
            '</div>',
        '</div>'
    ],

    headerRowsTpl: [
        '<tpl for=".">',
            '<tr class="jarvus-aggregrid-row <tpl if="$expandable">is-expandable</tpl>" data-row-id="{$id}">',
                '<th class="jarvus-aggregrid-rowheader">',
                    '<div class="jarvus-aggregrid-header-text">',
                        '{% values.$rowHeaderTpl.applyOut(values, out) %}',
                    '</div>',
                '</th>',
            '</tr>',

        // expander infrastructure
            '<tpl if="$expandable">',
                '<tr class="jarvus-aggregrid-expander" data-row-id="{$id}">',
                    '<td class="jarvus-aggregrid-expander-cell">',
                        '<div class="jarvus-aggregrid-expander-ct"></div>',
                    '</td>',
                '</tr>',
            '</tpl>',
        '</tpl>'
    ],

    rowsTpl: [
        '<tpl for=".">',
            '<tr class="jarvus-aggregrid-row <tpl if="$expandable">is-expandable</tpl>" data-row-id="{$id}">',
                '<tpl for="$columns">',
                    '<td class="jarvus-aggregrid-cell {$cls}" data-column-id="{$id}">{text}</td>',
                '</tpl>',
            '</tr>',

        // expander infrastructure
            '<tpl if="$expandable">',
                '<tr class="jarvus-aggregrid-expander" data-row-id="{$id}">',
                    '<td class="jarvus-aggregrid-expander-cell" colspan="{$columns.length}">',
                        '<div class="jarvus-aggregrid-expander-ct"></div>',
                    '</td>',
                '</tr>',
            '</tpl>',
        '</tpl>'
    ],


    // component lifecycle
    afterRender: function() {
        this.callParent(arguments);
        this.repaintGrid();
    },


    // config handlers
    applyColumnsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateColumnsStore: function(store, oldStore) {
        var me = this;

        if (oldStore) {
            oldStore.un('datachanged', 'refreshGrid', me);
        }

        if (store) {
            me.refreshGrid();
            store.on('datachanged', 'refreshGrid', me);
        }
    },

    applyRowsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateRowsStore: function(store, oldStore) {
        var me = this,
            listeners = {
                scope: me,
                refresh: 'onRowsStoreRefresh',
                add: 'onRowsStoreAdd',
                remove: 'onRowsStoreRemove',
                update: 'onRowsStoreUpdate',
                clear: 'onRowsStoreClear'
            };

        if (oldStore) {
            oldStore.un(listeners);
        }

        if (store) {
            me.refreshGrid();
            store.on(listeners);
        }
    },

    applyDataStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateDataStore: function(store, oldStore) {
        var me = this,
            listeners = {
                scope: me,
                refresh: 'onDataStoreRefresh',
                add: 'onDataStoreAdd',
                remove: 'onDataStoreRemove',
                update: 'onDataStoreUpdate',
                idchanged: 'onDataStoreIdChanged',
                clear: 'onDataStoreClear'
            };

        if (oldStore) {
            oldStore.un(listeners);
        }

        if (store) {
            store.on(listeners);
        }
    },

    applyColumnHeaderTpl: function(tpl) {
        if (!tpl) {
            tpl = new Ext.XTemplate(
                '{[typeof values === "string" ? values : values["' + this.getColumnHeaderField() + '"]]}'
            );
        } else if (!tpl.isTemplate) {
            tpl = new Ext.XTemplate(tpl);
        }

        return tpl;
    },

    applyColumnHeaderLinkTpl: function(tpl) {
        if (!tpl.isTemplate) {
            tpl = new Ext.XTemplate(tpl);
        }

        return tpl;
    },

    applyRowHeaderTpl: function(tpl) {
        if (!tpl) {
            tpl = new Ext.XTemplate(
                '{[typeof values === "string" ? values : values["' + this.getRowHeaderField() + '"]]}'
            );
        } else if (!tpl.isTemplate) {
            tpl = new Ext.XTemplate(tpl);
        }

        return tpl;
    },

    applyColumnMapper: function(mapper) {
        if (!Ext.isString(mapper)) {
            return mapper;
        }

        return function(dataRecord, columnsStore) {
            return columnsStore.getById(dataRecord.get(mapper));
        };
    },

    applyRowMapper: function(mapper) {
        if (!Ext.isString(mapper)) {
            return mapper;
        }

        return function(dataRecord, rowsStore) {
            return rowsStore.getData().get(dataRecord.get(mapper));
        };
    },

    applyCellTpl: function(tpl) {
        if (tpl && !tpl.isTemplate) {
            tpl = new Ext.XTemplate(tpl);
        }

        return tpl;
    },


    // event handlers
    onRowsStoreRefresh: function() {
        this.refreshGrid();
    },

    onRowsStoreAdd: function(rowsStore, rows, index) {
        var me = this,
            expandable = me.getExpandable(),
            rendered = me.rendered,
            groups = me.groups,
            rowHeadersCt = me.rowHeadersCt,
            dataCellsCt = me.dataCellsCt,
            headerRowEls = me.headerRowEls,
            rowEls = me.rowEls,
            headerRowExpanderEls = me.headerRowExpanderEls,
            rowExpanderEls = me.rowExpanderEls,

            headerRowsTpl = me.lookupTpl('headerRowsTpl'),
            rowsTpl = me.lookupTpl('rowsTpl'),
            rowsLength = rows.length, rowIndex, previousRowId, row, rowId, rowGroups, rowEl,
            rowsTplData = [],
            renderedRowIds = [],

            columnsData = (me.getData()||{}).columns || [],
            columnsStore = me.getColumnsStore(),
            columnsCount = columnsStore.getCount(),
            columnIndex, column, columnId;

        // WRITE PHASE: execute rows tpl data array against templates
        if (rendered) {
            for (rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
                rowsTplData.push(me.buildRowTplData(rows[rowIndex], columnsData));
            }

            if (index == 0) {
                headerRowsTpl.insertFirst(rowHeadersCt, rowsTplData);
                rowsTpl.insertFirst(dataCellsCt, rowsTplData);
            } else {
                previousRowId = rowsStore.getAt(index-1).getId();
                headerRowsTpl.insertAfter(headerRowEls[previousRowId], rowsTplData);
                rowsTpl.insertAfter(rowEls[previousRowId], rowsTplData);
            }
        }

        // READ phase: query DOM to collect references to key elements
        for (rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
            row = rows[rowIndex];
            rowId = row.getId();
            rowGroups = groups[rowId] = {};

            if (rendered) {
                headerRowEls[rowId] = rowHeadersCt.down('.jarvus-aggregrid-row[data-row-id="'+rowId+'"]');
                rowEl = rowEls[rowId] = dataCellsCt.down('.jarvus-aggregrid-row[data-row-id="'+rowId+'"]');

                rowExpanderEls[rowId] = expandable && dataCellsCt.down('.jarvus-aggregrid-expander[data-row-id="'+rowId+'"] .jarvus-aggregrid-expander-ct');
                headerRowExpanderEls[rowId] = expandable && rowHeadersCt.down('.jarvus-aggregrid-expander[data-row-id="'+rowId+'"] .jarvus-aggregrid-expander-ct');

                renderedRowIds.push(rowId);
            }

            for (columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
                column = columnsStore.getAt(columnIndex);
                columnId = column.getId();

                rowGroups[columnId] = {
                    records: [],
                    row: row,
                    rowId: rowId,
                    column: column,
                    columnId: columnId,
                    cellEl: rendered && rowEl.down('.jarvus-aggregrid-cell[data-column-id="'+columnId+'"]') || null
                };
            }
        }

        // regroup data
        me.groupUngroupedRecords(false);

        // no futher work is needed if the grid has not rendered yet
        if (!rendered) {
            return;
        }

        // READ->WRITE phase: sync row heights
        me.syncRowHeights(renderedRowIds);

        // repaint cells
        me.repaintCells(renderedRowIds);
    },

    onRowsStoreRemove: function(rowsStore, rows) {
        this.refreshGrid();
    },

    onRowsStoreUpdate: function(rowsStore, rows) {
        this.refreshGrid();
    },

    onRowsStoreClear: function() {
        this.groups = null;
        this.gridPainted = false;
        this.refreshGrid();
    },

    onDataStoreRefresh: function(dataStore) {
        this.regroupRecords(dataStore.getRange());
    },

    onDataStoreAdd: function(dataStore, records) {
        this.groupRecords(records);
    },

    onDataStoreRemove: function(dataStore, records) {
        this.ungroupRecords(records);
    },

    onDataStoreUpdate: function(dataStore, records) {
        this.regroupRecords([records], false);
        this.invalidateRecordGroups([records]);
    },

    onDataStoreIdChanged: function(dataStore, record, oldId, newId) {
        var groupedRecords = this.groupedRecords;

        groupedRecords[newId] = groupedRecords[oldId];
        delete groupedRecords[oldId];
    },

    onDataStoreClear: function() {
        this.groupedRecords = null;
    },

    onClick: function(ev, target) {
        var me = this,
            containerEl = me.el;

        if (target = ev.getTarget('.jarvus-aggregrid-rowheader', containerEl, true)) { // eslint-disable-line no-cond-assign
            return me.onRowHeaderClick(
                parseInt(target.up('.jarvus-aggregrid-row').getAttribute('data-row-id'), 10),
                target,
                ev
            );
        }

        if (target = ev.getTarget('.jarvus-aggregrid-colheader', containerEl, true)) { // eslint-disable-line no-cond-assign
            // cancel navigation to dummy anchor
            if (ev.getTarget('a[href="#"]')) {
                ev.preventDefault();
            }

            return me.onColumnHeaderClick(
                parseInt(target.getAttribute('data-column-id'), 10),
                target,
                ev
            );
        }

        if (target = ev.getTarget('.jarvus-aggregrid-cell', containerEl, true)) { // eslint-disable-line no-cond-assign
            return me.onCellClick(
                parseInt(target.up('.jarvus-aggregrid-row').getAttribute('data-row-id'), 10),
                parseInt(target.getAttribute('data-column-id'), 10),
                target,
                ev
            );
        }

        return null;
    },

    onRowHeaderClick: function(rowId, el, ev) {
        var me = this,
            isExpand;

        if (me.fireEvent('rowheaderclick', this, rowId, el, ev) === false) {
            return;
        }

        if (me.isRowExpandable(me.getRowsStore().getById(rowId))) {
            isExpand = !me.rowsExpanded[rowId];
            me.fireEventedAction(isExpand ? 'expand' : 'collapse', [me, rowId, el, ev], isExpand ? 'doExpand' : 'doCollapse', me);
        }
    },

    onColumnHeaderClick: function(columnId, el, ev) {
        this.fireEvent('columnheaderclick', this, columnId, el, ev);
    },

    onCellClick: function(rowId, columnId, el, ev) {
        this.fireEvent('cellclick', this, rowId, columnId, el, ev);
    },

    onDataScroll: function(ev, t) {
        this.rowHeadersScrollerEl.dom.scrollTop = t.scrollTop;
    },


    // component methods
    refreshGrid: function() {
        var me = this,
            columnsStore = me.getColumnsStore(),
            rowsStore = me.getRowsStore(),
            bufferedRefreshGrid = me.bufferedRefreshGrid;

        if (
            !columnsStore || !rowsStore
            || !columnsStore.isLoaded() || !rowsStore.isLoaded()
        ) {
            return;
        }

        if (!bufferedRefreshGrid) {
            bufferedRefreshGrid = me.bufferedRefreshGrid = Ext.Function.createBuffered(me.fireEventedAction, 10, me, ['refreshgrid', [me], 'doRefreshGrid', me]);
        }

        bufferedRefreshGrid();
    },

    /**
     * @private
     * Refresh the internal data structures for rows and columns
     */
    doRefreshGrid: function(me) {
        var groups = me.groups = {},

            rowsStore = me.getRowsStore(),
            rowsCount = rowsStore.getCount(),
            rowIndex = 0, row, rowId, rowGroups,

            columnsStore = me.getColumnsStore(),
            columnsCount = columnsStore.getCount(),
            columnIndex, column, columnId,

            dataStore = me.getDataStore();

        console.info('%s.doRefreshGrid', this.getId());

        me.gridPainted = false;

        // initialize row x column groups map
        for (; rowIndex < rowsCount; rowIndex++) {
            row = rowsStore.getAt(rowIndex);
            rowId = row.getId();
            rowGroups = groups[rowId] = {};

            for (columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
                column = columnsStore.getAt(columnIndex);
                columnId = column.getId();

                rowGroups[columnId] = {
                    records: [],
                    row: row,
                    rowId: rowId,
                    column: column,
                    columnId: columnId
                };
            }
        }

        // reset grouped records by-id cache
        me.groupedRecords = {};
        me.ungroupedRecords = [];

        // group any initial data records
        if (dataStore && dataStore.getCount()) {
            me.groupRecords(dataStore.getRange());
        }

        // repaint grid
        me.repaintGrid();
    },

    repaintGrid: function() {
        var me = this;

        if (!me.groups || !me.rendered) {
            return;
        }

        me.fireEventedAction('repaintgrid', [me], 'doRepaintGrid', me);
    },

    /**
     * @private
     * Render the main scaffolding of the aggregrid by columns and rows
     */
    doRepaintGrid: function(me) {
        var expandable = me.getExpandable(),
            groups = me.groups,
            el = me.el,

            columnsStore = me.getColumnsStore(),
            columnsCount = columnsStore.getCount(),
            rowsStore = me.getRowsStore(),
            rowsCount = rowsStore.getCount(),

            rowEls = me.rowEls = {},
            headerRowEls = me.headerRowEls = {},
            rowExpanderEls = me.rowExpanderEls = {},
            headerRowExpanderEls = me.headerRowExpanderEls = {},
            columnHeaderEls = me.columnHeaderEls = {},
            rowHeadersScrollerEl,
            dataCellsScrollerEl = me.dataCellsScrollerEl,
            rowHeadersCt, columnHeadersCt, dataCellsCt,

            rowIndex, row, rowId, rowEl, rowGroups,
            columnIndex, column, columnId,
            group;

        console.info('%s.doRepaintGrid', this.getId());

        // clear any existing scroll listener
        if (dataCellsScrollerEl) {
            dataCellsScrollerEl.un('scroll', 'onDataScroll', me);
        }

        // WRITE PHASE: generate template data structure and execute against tpl
        me.setData(me.buildTplData());

        // reset expansion state
        me.rowsExpanded = {};

        // READ PHASE: query DOM for references to top-level containers
        rowHeadersScrollerEl = me.rowHeadersScrollerEl = el.down('.jarvus-aggregrid-rowheaders-ct');
        dataCellsScrollerEl = me.dataCellsScrollerEl = el.down('.jarvus-aggregrid-scroller');

        rowHeadersCt = me.rowHeadersCt = rowHeadersScrollerEl.down('.jarvus-aggregrid-rowheaders-table tbody');
        columnHeadersCt = me.columnHeadersCt = el.down('.jarvus-aggregrid-data-table thead');
        dataCellsCt = me.dataCellsCt = dataCellsScrollerEl.down('.jarvus-aggregrid-data-table tbody');

        // attach scroll listener
        dataCellsScrollerEl.on('scroll', 'onDataScroll', me);

        // READ phase: query DOM to collect references to key elements
        for (rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
            row = rowsStore.getAt(rowIndex);
            rowId = row.getId();
            rowGroups = groups[rowId];
            rowEl = rowEls[rowId] = dataCellsCt.down('.jarvus-aggregrid-row[data-row-id="'+rowId+'"]');

            headerRowEls[rowId] = rowHeadersCt.down('.jarvus-aggregrid-row[data-row-id="'+rowId+'"]');

            rowExpanderEls[rowId] = expandable && dataCellsCt.down('.jarvus-aggregrid-expander[data-row-id="'+rowId+'"] .jarvus-aggregrid-expander-ct');
            headerRowExpanderEls[rowId] = expandable && rowHeadersCt.down('.jarvus-aggregrid-expander[data-row-id="'+rowId+'"] .jarvus-aggregrid-expander-ct');

            for (columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
                column = columnsStore.getAt(columnIndex);
                columnId = column.getId();

                columnHeaderEls[columnId] = columnHeadersCt.down('.jarvus-aggregrid-colheader[data-column-id="'+columnId+'"]');

                group = rowGroups[columnId];
                group.cellEl = rowEl.down('.jarvus-aggregrid-cell[data-column-id="'+columnId+'"]');
                group.rendered = group.dirty = false;
            }
        }

        for (columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
            columnId = columnsStore.getAt(columnIndex).getId();
            columnHeaderEls[columnId] = columnHeadersCt.down('.jarvus-aggregrid-colheader[data-column-id="'+columnId+'"]');
        }

        // READ->WRITE phase: sync row heights
        me.syncRowHeights();

        me.gridPainted = true;

        // repaint data
        me.repaintCells();
    },

    buildTplData: function() {
        var me = this,
            columnsStore = me.getColumnsStore(),
            columnsCount = columnsStore.getCount(),
            rowsStore = me.getRowsStore(),
            rowsCount = rowsStore.getCount(),
            data = {
                headerRowsTpl: me.lookupTpl('headerRowsTpl'),
                rowsTpl: me.lookupTpl('rowsTpl')
            },
            columns = data.columns = [],
            rows = data.rows = [],
            i;

        for (i = 0; i < columnsCount; i++) {
            columns.push(me.buildColumnTplData(columnsStore.getAt(i)));
        }

        for (i = 0; i < rowsCount; i++) {
            rows.push(me.buildRowTplData(rowsStore.getAt(i), columns));
        }

        return data;
    },

    buildColumnTplData: function(column) {
        return Ext.apply({
            $id: column.getId(),
            $columnHeaderTpl: this.getColumnHeaderTpl(),
            $columnHeaderLinkTpl: this.getColumnHeaderLinkTpl()
        }, column.getData());
    },

    buildRowTplData: function(row, columns) {
        return Ext.apply({
            $id: row.getId(),
            $rowHeaderTpl: this.getRowHeaderTpl(),
            $expandable: this.isRowExpandable(row),
            $columns: columns
        }, row.getData());
    },

    isRowExpandable: function(row) {
        return this.getExpandable();
    },

    /**
     * @public
     * Synchronizes the heights of rows between the headers and data tables
     */
    syncRowHeights: function(rowIds) {
        var me = this,
            headerRowEls = me.headerRowEls,
            rowEls = me.rowEls,
            table1RowHeights = {},
            table2RowHeights = {},
            rowsLength, rowIndex, rowKey, maxHeight;

        rowIds = rowIds || Ext.Object.getKeys(me.groups);
        rowsLength = rowIds.length;

        Ext.batchLayouts(function() {
            // read all the row height in batch first for both tables
            for (rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
                rowKey = rowIds[rowIndex];

                table1RowHeights[rowKey] = headerRowEls[rowKey].getHeight();
                table2RowHeights[rowKey] = rowEls[rowKey].getHeight();
            }

            // write all the max row heights
            for (rowIndex = 0; rowIndex < rowsLength; rowIndex++) {
                rowKey = rowIds[rowIndex];

                maxHeight = Math.max(table1RowHeights[rowKey], table2RowHeights[rowKey]);
                headerRowEls[rowKey].select('td, th').setHeight(maxHeight);
                rowEls[rowKey].select('td, th').setHeight(maxHeight);
            }
        });
    },

    groupRecords: function(records, repaint) {
        var me = this,
            groups = me.groups,
            groupedRecords = me.groupedRecords,
            ungroupedRecords = me.ungroupedRecords,

            rowsStore = me.getRowsStore(),
            rowMapper = me.getRowMapper(),
            columnsStore = me.getColumnsStore(),
            columnMapper = me.getColumnMapper(),

            recordsLength = records.length,
            i = 0, record, recordId, recordGroupData,
            row, column, rowId, columnId, group;

        if (!groupedRecords) {
            return;
        }

        for (; i < recordsLength; i++) {
            record = records[i];
            recordId = record.getId();

            // get target row and column for this record
            row = rowMapper(record, rowsStore);
            column = columnMapper(record, columnsStore);

            if (!row || !column) {
                ungroupedRecords.push(record);
                continue;
            }

            // create metadata container for record indexed by its id
            recordGroupData = groupedRecords[recordId] = {
                record: record,
                row: row,
                column: column
            };

            // push record to records array for group at [rowId][columnId]
            rowId = row.getId();
            columnId = column.getId();
            group = groups[rowId][columnId];

            recordGroupData.group = group;
            group.records.push(recordGroupData);

            // mark group dirty
            group.dirty = true;

            me.fireEvent('recordgrouped', me, recordGroupData, group);
        }

        if (repaint !== false) {
            me.repaintCells();
        }
    },

    ungroupRecords: function(records, repaint) {
        var me = this,
            groupedRecords = me.groupedRecords,
            recordsLength = records.length,
            i = 0, record, recordId, recordGroupData, group;

        if (!groupedRecords) {
            return;
        }

        for (; i < recordsLength; i++) {
            record = records[i];
            recordId = record.getId();
            recordGroupData = groupedRecords[recordId];

            if (!recordGroupData) {
                continue; // this record was not rendered into a group
            }

            group = recordGroupData.group;

            // remove from group
            Ext.Array.remove(recordGroupData.group.records, recordGroupData);
            delete recordGroupData.group;

            // remove metadata
            delete groupedRecords[recordId];

            // mark group dirty
            group.dirty = true;

            me.fireEvent('recordungrouped', me, recordGroupData, group);
        }

        if (repaint !== false) {
            me.repaintCells();
        }
    },

    regroupRecords: function(records, repaint) {
        var me = this,
            groups = me.groups,
            groupedRecords = me.groupedRecords,

            rowsStore = me.getRowsStore(),
            rowMapper = me.getRowMapper(),
            columnsStore = me.getColumnsStore(),
            columnMapper = me.getColumnMapper(),

            recordsLength = records.length,
            i = 0, record, recordId, recordGroupData, previousGroup,
            row, column, rowId, columnId, group,
            ungroupedRecords = [],
            staleRecords = [];

        if (!groupedRecords) {
            return;
        }

        for (; i < recordsLength; i++) {
            record = records[i];
            recordId = record.getId();
            recordGroupData = groupedRecords[recordId];

            if (!recordGroupData) {
                ungroupedRecords.push(record);
                continue;
            }

            previousGroup = recordGroupData.group;

            // get updated target row and column for this record
            row = rowMapper(record, rowsStore);
            column = columnMapper(record, columnsStore);

            if (!row || !column) {
                staleRecords.push(record);
                continue;
            }

            // check if record needs to be moved to a new group
            if (row === recordGroupData.row && column === recordGroupData.column) {
                continue;
            }

            // update row and column
            recordGroupData.row = row;
            recordGroupData.column = column;

            // get new group
            rowId = row.getId();
            columnId = column.getId();
            group = groups[rowId][columnId];

            // move record to new group
            Ext.Array.remove(previousGroup.records, recordGroupData);
            recordGroupData.previousGroup = previousGroup;
            recordGroupData.group = group;
            group.records.push(recordGroupData);

            // mark both groups dirty
            group.dirty = true;
            previousGroup.dirty = true;

            me.fireEvent('recordregrouped', me, recordGroupData, group, previousGroup);
        }

        if (ungroupedRecords.length) {
            me.groupRecords(ungroupedRecords, false);
        }

        if (staleRecords.length) {
            me.ungroupRecords(staleRecords, false);
        }

        if (repaint !== false) {
            me.repaintCells();
        }
    },

    invalidateRecordGroups: function(records, repaint) {
        var me = this,
            groupedRecords = me.groupedRecords,

            recordsLength = records.length,
            i = 0, recordGroupData;

        if (!groupedRecords) {
            return;
        }

        for (; i < recordsLength; i++) {
            recordGroupData = groupedRecords[records[i].getId()];

            if (recordGroupData) {
                recordGroupData.group.dirty = true;
            }
        }

        if (repaint !== false) {
            me.repaintCells();
        }
    },

    groupUngroupedRecords: function(repaint) {
        var me = this,
            ungroupedRecords = me.ungroupedRecords;

        if (!ungroupedRecords.length) {
            return;
        }

        me.ungroupedRecords = [];
        me.groupRecords(ungroupedRecords, repaint);
    },

    repaintCells: function(rowIds) {
        var me = this,
            bufferedRepaintCells = me.bufferedRepaintCells;

        if (!me.gridPainted) {
            return;
        }

        // skip buffering if this is a targetted repaint
        if (rowIds) {
            me.fireRepaintCells(rowIds);
            return;
        }

        if (!bufferedRepaintCells) {
            bufferedRepaintCells = me.bufferedRepaintCells = Ext.Function.createBuffered(me.fireRepaintCells, 10, me);
        }

        bufferedRepaintCells();
    },

    fireRepaintCells: function(rowIds) {
        var me = this;

        me.fireEventedAction('repaintcells', [me, rowIds], 'doRepaintCells', me);
    },

    doRepaintCells: function(me, rowIds) {
        var groups = me.groups,
            cellTpl = me.getCellTpl(),
            cellRenderer = me.getCellRenderer(),
            rowsLength, rowIndex = 0, rowId,
            columns, columnId, group, cellEl, rendered, dirty;

        console.info('%s.doRepaintCells(%o)', this.getId(), rowIds);

        if (!cellTpl && !cellRenderer) {
            return;
        }

        rowIds = rowIds || Ext.Object.getKeys(me.groups);
        rowsLength = rowIds.length;

        for (; rowIndex < rowsLength; rowIndex++) {
            rowId = rowIds[rowIndex];
            columns = groups[rowId];

            for (columnId in columns) { // eslint-disable-line guard-for-in
                group = columns[columnId];
                cellEl = group.cellEl;
                rendered = group.rendered;
                dirty = group.dirty;

                // apply cellTpl if this is the first render OR there's no cellRenderer and the group is dirty
                if (!rendered || (!cellRenderer && dirty)) {
                    group.tplNode = cellTpl && cellTpl.overwrite(cellEl, group);
                }

                if (!rendered || dirty) {
                    group.rendered = cellRenderer && cellRenderer.call(me, group, cellEl, rendered || false) || true;
                    group.dirty = false;
                }
            }
        }

        me.cellsPainted = true;
    },

    doExpand: function(me, rowId) {
        me.rowsExpanded[rowId] = true;
        me.syncExpanderHeight(rowId);
        me.rowEls[rowId].addCls('is-expanded');
        me.headerRowEls[rowId].addCls('is-expanded');
    },

    doCollapse: function(me, rowId) {
        me.rowsExpanded[rowId] = false;
        me.headerRowExpanderEls[rowId].setHeight(0);
        me.rowExpanderEls[rowId].setHeight(0);
        me.rowEls[rowId].removeCls('is-expanded');
        me.headerRowEls[rowId].removeCls('is-expanded');
    },

    syncExpanderHeight: function(rowId) {
        var me = this,
            rowHeaderExpanderEl = me.headerRowExpanderEls[rowId],
            rowExpanderEl = me.rowExpanderEls[rowId],

            rowHeaderExpanderHeight = rowHeaderExpanderEl.first().getHeight(),
            rowExpanderHeight = rowExpanderEl.first().getHeight(),
            maxHeight = Math.max(rowHeaderExpanderHeight, rowExpanderHeight);

        console.info('%s.syncExpanderHeight(%o) setting to max(%o, %o) = %o', this.getId(), rowId, rowHeaderExpanderHeight, rowExpanderHeight, maxHeight);

        rowHeaderExpanderEl.setHeight(maxHeight);
        rowExpanderEl.setHeight(maxHeight);
    }
});