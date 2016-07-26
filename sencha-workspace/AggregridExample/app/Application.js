/**
 * TODO:
 * - [ ] Batch update summary store when absences are added or removed, verify update handler for rollup grid
 * - [ ] Add a rollup example that uses the same data store for main and subrows
 */
/* eslint no-console: "off" */
Ext.define('AggregridExample.Application', {
    extend: 'Ext.app.Application',
    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox'
    ],


    name: 'AggregridExample',

    views: [
        'Main'
    ],

    stores: [
        'Students',
        'TimePeriods',
        'Absences',

        'SummaryTimePeriods',
        'SummaryAbsences'
    ],

    mainView: 'Main',

    control: {
        'jarvus-aggregrid': {
            // lifecycle events
            beforerefresh: function(aggregrid) {
                this.logInfo('%s->beforerefresh', aggregrid.getId());
                console.time('Refreshing grid');
            },
            refresh: function(aggregrid) {
                this.logInfo('%s->refresh', aggregrid.getId());
                console.timeEnd('Refreshing grid');
            },
            beforeaggregate: function(aggregrid) {
                this.logInfo('%s->beforeaggregate', aggregrid.getId());
                console.time('Aggregating groups');
            },
            aggregate: function(aggregrid) {
                this.logInfo('%s->aggregate', aggregrid.getId());
                console.timeEnd('Aggregating groups');
            },
            beforerendercells: function(aggregrid) {
                this.logInfo('%s->beforerendercells', aggregrid.getId());
                console.time('Rendering cells');
            },
            rendercells: function(aggregrid) {
                this.logInfo('%s->rendercells', aggregrid.getId());
                console.timeEnd('Rendering cells');
            },
            aggregatechange: function(aggregrid, action, recordMetadata) {
                this.logInfo('%s->aggregatechange: %s record %s in group %o at %sx%s', aggregrid.getId(), action, recordMetadata.record.getId(), recordMetadata.group, recordMetadata.row.getId(), recordMetadata.column.getId());
            },

            // interaction events
            rowheaderclick: function(aggregrid, rowId) {
                this.logInfo('%s->rowheaderclick: row %s', aggregrid.getId(), rowId);
            },
            columnheaderclick: function(aggregrid, columnId) {
                this.logInfo('%s->columnheaderclick: column %s', aggregrid.getId(), columnId);
            },
            cellclick: function(aggregrid, rowId, columnId) {
                this.logInfo('%s->cellclick: row %s, column %s', aggregrid.getId(), rowId, columnId);
            },
            beforeexpand: function(aggregrid, rowId, el, ev, controller) {
                var pauseTime = Math.floor(Math.random() * 500);

                this.logInfo('%s->beforexpand: row %s, pausing for %oms', aggregrid.getId(), rowId, pauseTime);

                // controller.pause();
                // Ext.defer(controller.resume, pauseTime, controller);
                console.time('Expanding row '+rowId);
            },
            expand: function(aggregrid, rowId) {
                this.logInfo('%s->expand: row %s', aggregrid.getId(), rowId);
                console.timeEnd('Expanding row '+rowId);
            },
            beforecollapse: function(aggregrid, rowId) {
                this.logInfo('%s->beforecollapse: row %s', aggregrid.getId(), rowId);
            },
            collapse: function(aggregrid, rowId) {
                this.logInfo('%s->collapse: row %s', aggregrid.getId(), rowId);
            }
        },

        'button[action=add-absences]': {
            click: 'onAddAbsencesClick'
        },
        'button[action=remove-absences]': {
            click: 'onRemoveAbsencesClick'
        },
        'button[action=shuffle-absences]': {
            click: 'onShuffleAbsencesClick'
        }
    },

    listen: {
        store: {
            '#Absences': {
                refresh: 'onAbsencesRefresh',
                add: 'onAbsencesAdd',
                update: 'onAbsencesUpdate'
            }
        }
    },

    launch: function() {
        console.time('Launching application');

        var me = this;

        // generate random absences
        me.getAbsencesStore().loadData(me.generateAbsences(Math.floor(Math.random() * 500)));

        // export global references for testing/debugging, only because this is an example app
        window.mainView = me.getMainView();
        window.basicAggregrid = window.mainView.down('app-basicaggregrid');
        window.rollupAggregrid = window.mainView.down('app-rollupaggregrid');

        console.timeEnd('Launching application');
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    },

    onAbsencesRefresh: function(store) {
        var count = store.getCount(),
            yearMonthStudentAbsences = {},
            summaryData = [],
            i = 0, absence,
            date, year, month, studentId,
            yearMonths, yearMonthStudents;

        for (; i < count; i++) {
            absence = store.getAt(i);
            date = absence.get('date');
            year = date.getFullYear();
            month = this.getWeekStartingMonth(date);
            studentId = absence.get('student_id');

            yearMonths = yearMonthStudentAbsences[year] || (yearMonthStudentAbsences[year] = {});
            yearMonthStudents = yearMonths[month] || (yearMonths[month] = {});

            if (studentId in yearMonthStudents) {
                yearMonthStudents[studentId]++;
            } else {
                yearMonthStudents[studentId] = 1;
            }
        }

        for (year in yearMonthStudentAbsences) { // eslint-disable-line guard-for-in
            yearMonths = yearMonthStudentAbsences[year];

            for (month in yearMonths) { // eslint-disable-line guard-for-in
                yearMonthStudents = yearMonths[month];

                for (studentId in yearMonthStudents) { // eslint-disable-line guard-for-in
                    summaryData.push({
                        year: parseInt(year, 10),
                        month: parseInt(month, 10),
                        student_id: parseInt(studentId, 10),
                        absences: yearMonthStudents[studentId]
                    })
                }
            }
        }

        this.getSummaryAbsencesStore().loadData(summaryData);
    },

    onAbsencesAdd: function(store, absences) {
        var me = this,
            summaryStore = me.getSummaryAbsencesStore(),
            count = absences.length,
            i = 0, absence,
            date, summaryRecord;

        summaryStore.beginUpdate();

        for (; i < count; i++) {
            absence = absences[i];
            date = absence.get('date');

            summaryRecord = me.getOrCreateSummaryRecord(absence.get('student_id'), date.getFullYear(), me.getWeekStartingMonth(date));

            summaryRecord.set('absences', summaryRecord.get('absences') + 1, { dirty: false });
        }

        summaryStore.endUpdate();
    },

    /**
     * Only safe for date changes
     */
    onAbsencesUpdate: function(store, absence, operation, modifiedFieldNames, details) {
        if (operation != 'edit' || modifiedFieldNames.indexOf('date') == -1) {
            return;
        }

        var me = this,
            summaryStore = me.getSummaryAbsencesStore(),
            studentId = absence.get('student_id'),

            newDate = absence.get('date'),
            newYear = newDate.getFullYear(),
            newMonth = me.getWeekStartingMonth(newDate),
            newSummaryRecord,

            oldDate = absence.getModified('date'),
            oldYear = oldDate.getFullYear(),
            oldMonth = me.getWeekStartingMonth(oldDate),
            oldSummaryRecord;

        if (newYear == oldYear && newMonth == oldMonth) {
            return;
        }

        newSummaryRecord = me.getOrCreateSummaryRecord(studentId, newYear, newMonth);
        oldSummaryRecord = me.getOrCreateSummaryRecord(studentId, oldYear, oldMonth);

        summaryStore.beginUpdate();
        newSummaryRecord.set('absences', newSummaryRecord.get('absences') + 1, { dirty: false });
        oldSummaryRecord.set('absences', oldSummaryRecord.get('absences') - 1, { dirty: false });
        summaryStore.endUpdate();

        absence.commit();
    },

    onAddAbsencesClick: function() {
        this.getAbsencesStore().add(this.generateAbsences(100));
    },

    onRemoveAbsencesClick: function() {
        var store = this.getAbsencesStore(),
            count = store.getCount(),
            records = [],
            removeCount = Math.min(50, count),
            i = 0;

        for (; i < removeCount; i++) {
            records.push(store.getAt(Math.floor(Math.random() * count)));
        }

        store.remove(Ext.Array.unique(records));
    },

    onShuffleAbsencesClick: function() {
        var store = this.getAbsencesStore(),
            count = store.getCount(),
            removeCount = Math.min(20, count),
            i = 0;

        store.beginUpdate();

        for (; i < removeCount; i++) {
            store.getAt(Math.floor(Math.random() * count)).set('date', this.generateAbsenceDate());
        }

        store.endUpdate();
    },

    logInfo: function() {
        if (!window.console) {
            return;
        }

        var args = Array.prototype.slice.call(arguments);

        args[0] = '%c[APP] ' + args[0];
        Ext.Array.insert(args, 1, 'color: #999');

        console.info.apply(console, args);
    },

    generateAbsences: function(amount) {
        var firstId = (this.getAbsencesStore().max('id') || 0) + 1,
            i = 0,
            absences = [];

        // generate random absences
        for (; i < amount; i++) {
            absences.push({
                id: i + firstId,
                student_id: Math.floor(Math.random() * 20) + 1,
                date: this.generateAbsenceDate()
            });
        }

        return absences;
    },

    generateAbsenceDate: function() {
        return new Date(2016, Math.floor(Math.random() * 12), Math.floor(Math.random() * 30) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    },

    getWeekStartingMonth: function(date) {
        return Ext.Date.parse(date.getFullYear()+Ext.String.leftPad(Ext.Date.getWeekOfYear(date), 2, '0'), 'YW').getMonth() + 1;
    },

    getOrCreateSummaryRecord: function(studentId, year, month) {
        var summaryStore = this.getSummaryAbsencesStore(),
            summaryRecord = summaryStore.getAt(summaryStore.findBy(function(r) {
                return r.get('year') == year
                        && r.get('month') == month
                        && r.get('student_id') == studentId;
            }));

        if (!summaryRecord) {
            summaryRecord = summaryStore.add({
                year: year,
                month: month,
                student_id: studentId,
                absences: 0
            })[0];
        }

        return summaryRecord;
    }
});