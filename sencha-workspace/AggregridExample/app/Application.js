/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
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
            },
            refresh: function(aggregrid) {
                this.logInfo('%s->refresh', aggregrid.getId());
            },
            beforeaggregate: function(aggregrid) {
                this.logInfo('%s->beforeaggregate', aggregrid.getId());
            },
            aggregate: function(aggregrid) {
                this.logInfo('%s->aggregate', aggregrid.getId());
            },
            beforerendercells: function(aggregrid) {
                this.logInfo('%s->beforerendercells', aggregrid.getId());
            },
            rendercells: function(aggregrid) {
                this.logInfo('%s->rendercells', aggregrid.getId());
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
                var pauseTime = Math.floor(Math.random() * 3000);

                this.logInfo('%s->beforexpand: row %s, pausing for %oms', aggregrid.getId(), rowId, pauseTime);

                controller.pause();
                Ext.defer(controller.resume, pauseTime, controller);
            },
            expand: function(aggregrid, rowId) {
                this.logInfo('%s->expand: row %s', aggregrid.getId(), rowId);
            },
            beforecollapse: function(aggregrid, rowId) {
                this.logInfo('%s->beforecollapse: row %s', aggregrid.getId(), rowId);
            },
            collapse: function(aggregrid, rowId) {
                this.logInfo('%s->collapse: row %s', aggregrid.getId(), rowId);
            }
        }
    },

    listen: {
        store: {
            '#Absences': {
                datachanged: 'onAbsencesDataChanged'
            }
        }
    },

    launch: function() {
        var me = this,
            amount = Math.floor(Math.random() * 500),
            i = 0,
            absences = [];

        // generate random absences
        for (; i < amount; i++) {
            absences.push({
                id: i + 1,
                student_id: Math.floor(Math.random() * 20) + 1,
                date: new Date(2016, Math.floor(Math.random() * 12), Math.floor(Math.random() * 30) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
            });
        }

        me.getAbsencesStore().loadData(absences);


        // export global references for testing/debugging, only because this is an example app
        window.mainView = me.getMainView();
        window.basicAggregrid = window.mainView.down('app-basicaggregrid');
        window.rollupAggregrid = window.mainView.down('app-rollupaggregrid');
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

    onAbsencesDataChanged: function(store) {
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
            month = date.getMonth() + 1 ;
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

    logInfo: function() {
        if (!window.console) {
            return;
        }

        var args = Array.prototype.slice.call(arguments);

        args[0] = '%c[APP] ' + args[0];
        Ext.Array.insert(args, 1, 'color: #999');

        console.info.apply(console, args);
    }
});