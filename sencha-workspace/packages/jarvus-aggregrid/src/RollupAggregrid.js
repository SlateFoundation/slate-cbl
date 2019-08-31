/**
 * TODO:
 * - [X] Apply refined lifecycle from Aggregrid
 *      - [X] repaintSubGrid -> repaintSubCells
 *      - [X] new rendering flow
 * - [X] Continuously update aggregate subRow groups after initial aggregation
 *      - [X] Eliminate aggregate function in favor of groupSubRecords()
 *      - [X] Implement regroupSubRecords and ungroupSubRecords, wire to store events
 * - [X] Continuously update subrow data cell renderings
 * - [X] Add new rows incrementally instead of redrawing
 *      - [X] Eliminate groupSubRows, maintain metadata continously in response to subRowsStore events
 * - [X] Track ungrouped subrecords and re-process on subrow add
 * - [X] Continuously remove rows
 * - [ ] Continuously update rows
 *
 * MAYBEDO:
 * - [ ] Move some of expander lifecycle up to base class
 */
Ext.define('Jarvus.aggregrid.RollupAggregrid', {
    extend: 'Jarvus.aggregrid.Aggregrid',
    xtype: 'jarvus-rollupaggregrid',


    config: {
        subRowsStore: null,
        subDataStore: null,

        parentRowMapper: 'parent_row_id',
        subRowMapper: 'sub_row_id',

        subRowHeaderField: null,
        subRowHeaderTpl: null,

        subCellTpl: null,
        subCellRenderer: null,

        expandable: true,
        expanderHeadersTpl: [
            '<table class="jarvus-aggregrid-expander-table">',
                '<tbody>',
                    '<tpl for="subRows">',
                        '<tr class="jarvus-aggregrid-subrow" data-subrow-id="{$id}">',
                            '<th class="jarvus-aggregrid-rowheader">',
                                '<span class="jarvus-aggregrid-header-text">',
                                    '{% values.$rowHeaderTpl.applyOut(values, out, parent) %}',
                                '</span>',
                            '</th>',
                        '</tr>',
                    '</tpl>',
                '</tbody>',
            '</table>'
        ],
        expanderBodyTpl: [
            '<table class="jarvus-aggregrid-expander-table">',
                '<tbody>',
                    '<tpl for="subRows">',
                        '<tr class="jarvus-aggregrid-subrow" data-subrow-id="{$id}">',
                            '<tpl for="$columns">',
                                '<td class="jarvus-aggregrid-cell {$cls}" data-column-id="{$id}">{text}</td>',
                            '</tpl>',
                        '</tr>',
                    '</tpl>',
                '</tbody>',
            '</table>'
        ]
    },


    // config handlers
    applySubRowsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateSubRowsStore: function(store, oldStore) {
        var me = this,
            listeners = {
                scope: me,
                refresh: 'onSubRowsStoreRefresh',
                add: 'onSubRowsStoreAdd',
                remove: 'onSubRowsStoreRemove',
                update: 'onSubRowsStoreUpdate'
            };

        if (oldStore) {
            oldStore.un(listeners);
        }

        if (store) {
            store.on(listeners);
        }
    },

    applySubDataStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateSubDataStore: function(store, oldStore) {
        var me = this,
            listeners = {
                scope: me,
                refresh: 'onSubDataStoreRefresh',
                add: 'onSubDataStoreAdd',
                remove: 'onSubDataStoreRemove',
                update: 'onSubDataStoreUpdate'
            };

        if (oldStore) {
            oldStore.un(listeners);
        }

        if (store) {
            store.on(listeners);
        }
    },

    applySubRowHeaderTpl: function(tpl) {
        if (!tpl) {
            tpl = new Ext.XTemplate(
                '{[typeof values === "string" ? values : values["' + this.getSubRowHeaderField() + '"]]}'
            );
        } else if (!tpl.isTemplate) {
            tpl = new Ext.XTemplate(tpl);
        }

        return tpl;
    },

    applyParentRowMapper: function(mapper) {
        if (!Ext.isString(mapper)) {
            return mapper;
        }

        return function(subRowRecord, rowsStore) {
            return rowsStore.getById(subRowRecord.get(mapper));
        };
    },

    applySubRowMapper: function(mapper) {
        if (!Ext.isString(mapper)) {
            return mapper;
        }

        return function(dataRecord, subRowsStore) {
            return subRowsStore.getById(dataRecord.get(mapper));
        };
    },

    applySubCellTpl: function(tpl) {
        if (tpl && !tpl.isTemplate) {
            tpl = new Ext.XTemplate(tpl);
        }

        return tpl;
    },

    applyExpanderHeadersTpl: function(tpl) {
        if (tpl && !tpl.isTemplate) {
            tpl = new Ext.XTemplate(tpl);
        }

        return tpl;
    },

    applyExpanderBodyTpl: function(tpl) {
        if (tpl && !tpl.isTemplate) {
            tpl = new Ext.XTemplate(tpl);
        }

        return tpl;
    },


    // event handlers
    onSubRowsStoreRefresh: function(subRowsStore) {
        this.mapSubRows(subRowsStore.getRange());
    },

    onSubRowsStoreAdd: function(subRowsStore, subRows) {
        this.mapSubRows(subRows);
        this.refreshGrid(); // TODO: support incremental update
    },

    onSubRowsStoreRemove: function(subRowsStore, subRows) {
        this.unmapSubRows(subRows);
    },

    onSubRowsStoreUpdate: function(subRowsStore, subRows) {
        this.remapSubRows(subRows);
    },

    onSubDataStoreRefresh: function(subDataStore) {
        this.groupSubRecords(subDataStore.getRange());
    },

    onSubDataStoreAdd: function(subDataStore, subRecords) {
        this.groupSubRecords(subRecords);
    },

    onSubDataStoreRemove: function(subDataStore, subRecords) {
        this.ungroupSubRecords(subRecords);
    },

    onSubDataStoreUpdate: function(subDataStore, subRecords) {
        this.regroupSubRecords([subRecords], false);
        this.invalidateSubRecordGroups([subRecords]);
    },

    // override of parent method
    onRowsStoreAdd: function(rowsStore, rows) {
        var me = this,
            rollupRows = me.rollupRows,
            rowsLength = rows.length,
            rowIndex = 0, row, rowId;

        me.callParent(arguments);

        for (; rowIndex < rowsLength; rowIndex++) {
            row = rows[rowIndex];
            rowId = row.getId();

            rollupRows[rowId] = {
                row: row,
                rowId: rowId,
                subRows: [],
                groups: {}
            };
        }

        // remap subRows
        me.mapUnmappedSubRows(false);

        // regroup data
        me.groupUngroupedSubRecords(false);
    },

    // override of parent method
    onRowsStoreRemove: function(rowsStore, rows) {
        var me = this,
            rollupRows = me.rollupRows,
            subRowParents = me.subRowParents,
            rowsLength = rows.length,
            rowIndex = 0, row, rowId,
            groups, subRowId, rollupRow,
            columns, columnId, group,
            staleRecords = [];

        me.callParent(arguments);

        for (; rowIndex < rowsLength; rowIndex++) {
            row = rows[rowIndex];
            rowId = row.getId();
            rollupRow = rollupRows[rowId];
            groups = rollupRow.groups;

            for (subRowId in groups) { // eslint-disable-line guard-for-in
                columns = groups[subRowId];

                delete subRowParents[subRowId];

                for (columnId in columns) { // eslint-disable-line guard-for-in
                    group = columns[columnId];
                    Ext.Array.push(staleRecords, Ext.Array.pluck(group.records, 'record'));
                }
            }

            delete rollupRows[rowId];
        }

        me.ungroupSubRecords(staleRecords, false);
    },

    // override of parent method
    onClick: function(ev, target) {
        var me = this,
            containerEl = me.el;

        if (target = ev.getTarget('.jarvus-aggregrid-subrow .jarvus-aggregrid-rowheader', containerEl, true)) { // eslint-disable-line no-cond-assign
            return me.onSubRowHeaderClick(
                parseInt(target.up('.jarvus-aggregrid-subrow').getAttribute('data-subrow-id'), 10),
                target,
                ev
            );
        }

        if (target = ev.getTarget('.jarvus-aggregrid-subrow .jarvus-aggregrid-cell', containerEl, true)) { // eslint-disable-line no-cond-assign
            return me.onSubCellClick(
                parseInt(target.up('.jarvus-aggregrid-subrow').getAttribute('data-subrow-id'), 10),
                parseInt(target.getAttribute('data-column-id'), 10),
                target,
                ev
            );
        }

        return me.callParent(arguments);
    },

    onSubRowHeaderClick: function(subRowId, el, ev) {
        this.fireEvent('subrowheaderclick', this, subRowId, el, ev);
    },

    onSubCellClick: function(subRowId, columnId, el, ev) {
        this.fireEvent('subcellclick', this, subRowId, columnId, el, ev);
    },

    // Aggregrid lifecycle overrides
    doRefreshGrid: function(me) {
        var rollupRows = me.rollupRows = {},
            rowsStore = me.getRowsStore(),
            rowsCount = rowsStore.getCount(),
            rowIndex = 0, row, rowId,

            subRowsStore = me.getSubRowsStore(),
            subDataStore = me.getSubDataStore();

        me.callParent(arguments);

        // initialize subrows data structure
        for (; rowIndex < rowsCount; rowIndex++) {
            row = rowsStore.getAt(rowIndex);
            rowId = row.getId();

            rollupRows[rowId] = {
                row: row,
                rowId: rowId,
                subRows: [],
                groups: {}
            };
        }

        // reset subRow parents cache
        me.subRowParents = {};
        me.unmappedSubRows = [];

        // reset grouped records by-id cache
        me.groupedSubRecords = {};
        me.ungroupedSubRecords = [];

        // group any initial subrows
        if (subRowsStore && subRowsStore.getCount()) {
            me.mapSubRows(subRowsStore.getRange());
        }

        // group any initial data records
        if (subDataStore && subDataStore.getCount()) {
            me.groupSubRecords(subDataStore.getRange());
        }
    },

    doExpand: function(me, rowId) {
        var rollupRow = me.rollupRows[rowId];

        console.info('%s.doExpand(%o)', me.getId(), rowId);

        if (rollupRow && !rollupRow.gridPainted) {
            me.repaintSubGrid(rowId);
        }

        me.callParent(arguments);
    },

    // RollupAggregrid methods
    repaintSubGrid: function(rowId) {
        var me = this,
            rollupRow = me.rollupRows[rowId];

        if (!rollupRow || !rollupRow.groups) {
            return;
        }

        me.fireEventedAction('repaintsubgrid', [me, rowId], 'doRepaintSubGrid', me);
    },

    doRepaintSubGrid: function(me, rowId) {
        var rollupRow = me.rollupRows[rowId],
            groups = rollupRow.groups,
            expanderTplData = me.buildExpanderTplData(rowId),

            subRowEls = rollupRow.subRowEls = {},
            subRowHeaderEls = rollupRow.subRowHeaderEls = {},
            headersEl, bodyEl,

            subRows = rollupRow.subRows,
            subRowsCount = subRows.length,
            subRowIndex = 0, subRow, subRowId, subRowGroups, subRowEl,

            columnsStore = me.getColumnsStore(),
            columnsCount = columnsStore.getCount(),
            columnIndex, column, columnId,
            group;

        console.info('%s.doRepaintSubGrid(%o)', this.getId(), rowId);

        // render templates against generated template data
        headersEl = rollupRow.headersEl = me.getExpanderHeadersTpl().overwrite(me.headerRowExpanderEls[rowId], expanderTplData, true);
        bodyEl = rollupRow.bodyEl = me.getExpanderBodyTpl().overwrite(me.rowExpanderEls[rowId], expanderTplData, true);

        // READ phase: query dom to collect references to key elements
        for (; subRowIndex < subRowsCount; subRowIndex++) {
            subRow = subRows[subRowIndex];
            subRowId = subRow.getId();
            subRowGroups = groups[subRowId] || (groups[subRowId] = {});

            subRowHeaderEls[subRowId] = headersEl.down('.jarvus-aggregrid-subrow[data-subrow-id="'+subRowId+'"]');
            subRowEl = subRowEls[subRowId] = bodyEl.down('.jarvus-aggregrid-subrow[data-subrow-id="'+subRowId+'"]');

            for (columnIndex = 0; columnIndex < columnsCount; columnIndex++) {
                column = columnsStore.getAt(columnIndex);
                columnId = column.getId();

                group = subRowGroups[columnId] || (subRowGroups[columnId] = { records: [] });
                group.cellEl = subRowEl.down('.jarvus-aggregrid-cell[data-column-id="'+columnId+'"]');
                group.row = subRow;
                group.subRowId = subRowId;
                group.column = column;
                group.columnId = columnId;
                group.rendered = group.dirty = false;
            }
        }

        // READ->WRITE phase: sync row heights
        me.syncSubRowHeights(rowId);

        rollupRow.gridPainted = true;

        // recompile and repaint data
        me.repaintSubCells(rowId);
    },

    buildExpanderTplData: function(rowId) {
        var me = this,
            rollupRows = me.rollupRows = me.rollupRows || (me.rollupRows = {}),

            columnsStore = me.getColumnsStore(),
            columnsCount = columnsStore.getCount(),
            columnIndex = 0,

            subRows = rollupRows[rowId].subRows,
            subRowsCount = subRows.length,
            subRowIndex = 0,

            data = {},
            columnsData = data.columns = [],
            subRowsData = data.subRows = [];

        // generate columns and rows render data
        for (; columnIndex < columnsCount; columnIndex++) {
            columnsData.push(me.buildColumnTplData(columnsStore.getAt(columnIndex)));
        }

        for (; subRowIndex < subRowsCount; subRowIndex++) {
            subRowsData.push(me.buildSubRowTplData(subRows[subRowIndex], columnsData));
        }

        return data;
    },

    buildSubRowTplData: function(row, columns) {
        return Ext.apply({
            $id: row.getId(),
            $rowHeaderTpl: this.getSubRowHeaderTpl() || this.getRowHeaderTpl(),
            $columns: columns
        }, row.getData());
    },

    mapSubRows: function(subRows, repaint) {
        var me = this,
            rollupRows = me.rollupRows || (me.rollupRows = {}),
            subRowParents = me.subRowParents || (me.subRowParents = {}),
            unmappedSubRows = me.unmappedSubRows || (me.unmappedSubRows = []),

            rowsStore = me.getRowsStore(),
            parentRowMapper = me.getParentRowMapper(),
            subRowsLength = subRows.length,
            subRowIndex = 0, subRow, parentRow, rollupRow;

        for (; subRowIndex < subRowsLength; subRowIndex++) {
            subRow = subRows[subRowIndex];
            parentRow = parentRowMapper(subRow, rowsStore);

            if (!parentRow) {
                unmappedSubRows.push(subRow);
                continue;
            }

            if (!(rollupRow = rollupRows[parentRow.getId()])) {
                rollupRows[parentRow.getId()] = rollupRow = {
                    subRows: [],
                    groups: {}
                };
            }

            subRowParents[subRow.getId()] = parentRow;
            rollupRow.subRows.push(subRow);
        }

        me.groupUngroupedSubRecords(repaint);
    },

    unmapSubRows: function(subRows) {
        this.refreshGrid(); // TODO: support incremental update
    },

    remapSubRows: function(subRows) {
        this.refreshGrid(); // TODO: support incremental update
    },

    mapUnmappedSubRows: function(repaint) {
        var me = this,
            unmappedSubRows = me.unmappedSubRows;

        if (!unmappedSubRows.length) {
            return;
        }

        me.unmappedSubRows = [];
        me.mapSubRows(unmappedSubRows, repaint);
    },

    /**
     * @public
     * Synchronizes the heights of rows between the headers and data tables
     */
    syncSubRowHeights: function(rowId) {
        var me = this,
            rollupRow = me.rollupRows[rowId],
            subRowEls = rollupRow.subRowEls,
            subRowHeaderEls = rollupRow.subRowHeaderEls,
            table1RowHeights = {},
            table2RowHeights = {},
            rowKey, maxHeight;

        Ext.batchLayouts(function() {
            // read all the row height in batch first for both tables
            for (rowKey in subRowHeaderEls) { // eslint-disable-line guard-for-in
                table1RowHeights[rowKey] = subRowHeaderEls[rowKey].getHeight();
                table2RowHeights[rowKey] = subRowEls[rowKey].getHeight();
            }

            // write all the max row heights
            for (rowKey in subRowHeaderEls) { // eslint-disable-line guard-for-in
                maxHeight = Math.max(table1RowHeights[rowKey], table2RowHeights[rowKey]);
                subRowHeaderEls[rowKey].select('td, th').setHeight(maxHeight);
                subRowEls[rowKey].select('td, th').setHeight(maxHeight);
            }
        });
    },

    groupSubRecords: function(subRecords, repaint) {
        var me = this,
            rollupRows = me.rollupRows,
            subRowParents = me.subRowParents,
            groupedSubRecords = me.groupedSubRecords,
            ungroupedSubRecords = me.ungroupedSubRecords,

            subRowsStore = me.getSubRowsStore(),
            subRowMapper = me.getSubRowMapper(),
            columnsStore = me.getColumnsStore(),
            columnMapper = me.getColumnMapper(),

            subRecordsCount = subRecords.length,
            subRecordIndex = 0, subRecord, subRecordId, subRecordGroupData,
            subRow, subRowId, parentRow, parentRowId, column, columnId, group, groupRecords,
            repaintRows = {};

        if (!groupedSubRecords) {
            return repaintRows;
        }

        for (; subRecordIndex < subRecordsCount; subRecordIndex++) {
            subRecord = subRecords[subRecordIndex];
            subRecordId = subRecord.getId();

            // get target row and column for this record
            subRow = subRowMapper(subRecord, subRowsStore);
            parentRow = subRow && subRowParents[subRow.getId()];
            column = columnMapper(subRecord, columnsStore);

            if (!subRow || !parentRow || !column) {
                ungroupedSubRecords.push(subRecord);
                continue;
            }

            // create metadata container for record indexed by its id
            subRecordGroupData = groupedSubRecords[subRecordId] = {
                record: subRecord,
                subRow: subRow,
                parentRow: parentRow,
                column: column
            };

            // push record to records array for group at [rowId][columnId]
            parentRowId = parentRow.getId();
            group = rollupRows[parentRowId].groups;

            subRowId = subRow.getId();
            group = group[subRowId] || (group[subRowId] = {});

            columnId = column.getId();
            group = group[columnId] || (group[columnId] = { records: [] });
            groupRecords = group.records;

            subRecordGroupData.group = group;
            groupRecords.push(subRecordGroupData);

            // mark group dirty
            group.dirty = true;

            // mark parent row for repaint
            repaintRows[parentRowId] = true;

            me.fireEvent('subrecordgrouped', me, subRecordGroupData, group);
        }

        if (repaint !== false) {
            for (parentRowId in repaintRows) {
                if (rollupRows[parentRowId].cellsPainted) {
                    me.repaintSubCells(parentRowId);
                }
            }
        }

        return repaintRows;
    },

    ungroupSubRecords: function(subRecords, repaint) {
        var me = this,
            rollupRows = me.rollupRows,
            groupedSubRecords = me.groupedSubRecords,
            subRecordsLength = subRecords.length,
            i = 0, subRecord, subRecordId, subRecordGroupData, group,
            repaintRows = {}, parentRowId;

        if (!groupedSubRecords) {
            return repaintRows;
        }

        for (; i < subRecordsLength; i++) {
            subRecord = subRecords[i];
            subRecordId = subRecord.getId();
            subRecordGroupData = groupedSubRecords[subRecordId];

            if (!subRecordGroupData) {
                continue; // this record was not rendered into a group
            }

            group = subRecordGroupData.group;

            // remove from group
            Ext.Array.remove(subRecordGroupData.group.records, subRecordGroupData);
            delete subRecordGroupData.group;

            // remove metadata
            delete groupedSubRecords[subRecordId];

            // mark group dirty
            group.dirty = true;

            // mark parent row for repaint
            repaintRows[subRecordGroupData.parentRow.getId()] = true;

            me.fireEvent('subrecordungrouped', me, subRecordGroupData, group);
        }

        if (repaint !== false) {
            for (parentRowId in repaintRows) {
                if (rollupRows[parentRowId].cellsPainted) {
                    me.repaintSubCells(parentRowId);
                }
            }
        }

        return repaintRows;
    },

    regroupSubRecords: function(subRecords, repaint) {
        var me = this,
            subRowParents = me.subRowParents,
            rollupRows = me.rollupRows,
            groupedSubRecords = me.groupedSubRecords,

            subRowsStore = me.getSubRowsStore(),
            subRowMapper = me.getSubRowMapper(),
            columnsStore = me.getColumnsStore(),
            columnMapper = me.getColumnMapper(),

            subRecordsCount = subRecords.length,
            subRecordIndex = 0, subRecord, subRecordId, subRecordGroupData, previousGroup,
            subRow, subRowId, parentRow, parentRowId, column, columnId, group, groupRecords,
            repaintRows = {},
            ungroupedSubRecords = [],
            staleRecords = [];

        if (!groupedSubRecords) {
            return repaintRows;
        }

        for (; subRecordIndex < subRecordsCount; subRecordIndex++) {
            subRecord = subRecords[subRecordIndex];
            subRecordId = subRecord.getId();
            subRecordGroupData = groupedSubRecords[subRecordId];

            if (!subRecordGroupData) {
                ungroupedSubRecords.push(subRecord);
                continue;
            }

            previousGroup = subRecordGroupData.group;

            // get updated target row and column for this record
            subRow = subRowMapper(subRecord, subRowsStore);
            parentRow = subRow && subRowParents[subRow.getId()];
            column = columnMapper(subRecord, columnsStore);

            if (!subRow || !parentRow || !column) {
                staleRecords.push(subRecord);
                continue;
            }

            // check if subRecord needs to be moved to a new group
            if (subRow === subRecordGroupData.subRow && column === subRecordGroupData.column) {
                continue;
            }

            // update subRow and column
            subRecordGroupData.subRow = subRow;
            subRecordGroupData.parentRow = parentRow;
            subRecordGroupData.column = column;

            // get new group
            parentRowId = parentRow.getId();
            group = rollupRows[parentRowId].groups;

            subRowId = subRow.getId();
            group = group[subRowId] || (group[subRowId] = {});

            columnId = column.getId();
            group = group[columnId] || (group[columnId] = { records: [] });
            groupRecords = group.records;

            // move subRecord to new group
            Ext.Array.remove(previousGroup.records, subRecordGroupData);
            subRecordGroupData.previousGroup = previousGroup;
            subRecordGroupData.group = group;
            groupRecords.push(subRecordGroupData);

            // mark both group dirty
            group.dirty = true;
            previousGroup.dirty = true;

            // mark parent row for repaint
            repaintRows[parentRowId] = true;

            me.fireEvent('subrecordregrouped', me, subRecordGroupData, group, previousGroup);
        }

        if (ungroupedSubRecords.length) {
            Ext.apply(repaintRows, me.groupSubRecords(ungroupedSubRecords, false));
        }

        if (staleRecords.length) {
            Ext.apply(repaintRows, me.ungroupSubRecords(staleRecords, false));
        }

        if (repaint !== false) {
            for (parentRowId in repaintRows) {
                if (rollupRows[parentRowId].cellsPainted) {
                    me.repaintSubCells(parentRowId);
                }
            }
        }

        return repaintRows;
    },

    invalidateSubRecordGroups: function(subRecords, repaint) {
        var me = this,
            rollupRows = me.rollupRows,
            groupedSubRecords = me.groupedSubRecords,

            subRecordsLength = subRecords.length,
            i = 0, subRecordGroupData,
            repaintRows = {}, parentRowId;

        if (!groupedSubRecords) {
            return repaintRows;
        }

        for (; i < subRecordsLength; i++) {
            subRecordGroupData = groupedSubRecords[subRecords[i].getId()];

            if (!subRecordGroupData) {
                continue;
            }

            subRecordGroupData.group.dirty = true;

            // mark parent row for repaint
            repaintRows[subRecordGroupData.parentRow.getId()] = true;
        }

        if (repaint !== false) {
            for (parentRowId in repaintRows) {
                if (rollupRows[parentRowId].cellsPainted) {
                    me.repaintSubCells(parentRowId);
                }
            }
        }

        return repaintRows;
    },

    groupUngroupedSubRecords: function(repaint) {
        var me = this,
            ungroupedSubRecords = me.ungroupedSubRecords || [];

        if (!ungroupedSubRecords.length) {
            return;
        }

        me.ungroupedSubRecords = [];
        me.groupSubRecords(ungroupedSubRecords, repaint);
    },

    repaintSubCells: function(rowId) {
        var me = this,
            bufferedRepaintSubCells = me.bufferedRepaintSubCells || (me.bufferedRepaintSubCells = {}),
            repaint = bufferedRepaintSubCells[rowId];

        if (!repaint) {
            repaint = bufferedRepaintSubCells[rowId] = Ext.Function.createBuffered(me.fireEventedAction, 10, me, ['repaintsubcells', [me, rowId], 'doRepaintSubCells', me]);
        }

        repaint();
    },

    doRepaintSubCells: function(me, rowId) {
        var rollupRow = me.rollupRows[rowId],
            groups = rollupRow.groups,
            subCellTpl = me.getSubCellTpl(),
            subCellRenderer = me.getSubCellRenderer(),
            subRowId, columns, columnId, group, cellEl, rendered, dirty;

        console.info('%s.doRepaintSubCells(%o)', this.getId(), rowId);

        // default to cell* if null
        if (subCellTpl === null) {
            subCellTpl = me.getCellTpl();
        }

        if (subCellRenderer === null) {
            subCellRenderer = me.getCellRenderer();
        }


        // abort repaint if no methods available
        if (!subCellTpl && !subCellRenderer) {
            return;
        }


        // paint cells
        rollupRow.cellsPainted = true;

        for (subRowId in groups) { // eslint-disable-line guard-for-in
            columns = groups[subRowId];

            for (columnId in columns) { // eslint-disable-line guard-for-in
                group = columns[columnId];
                if (!group.cellEl) {
                    me.repaintSubGrid(rowId);
                    return;
                }
                cellEl = group.cellEl;
                rendered = group.rendered;
                dirty = group.dirty;


                // apply cellTpl if this is the first render OR there's no cellRenderer and the group is dirty
                if (!rendered || (!subCellRenderer && dirty)) {
                    group.tplNode = subCellTpl && subCellTpl.overwrite(cellEl, group);
                }

                if (!rendered || dirty) {
                    group.rendered = subCellRenderer && subCellRenderer.call(me, group, cellEl, rendered || false) || true;
                    group.dirty = false;
                }
            }
        }
    }
});