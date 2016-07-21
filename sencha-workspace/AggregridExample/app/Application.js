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
        'app-myaggregrid': {
            beforerefresh: function() {
                console.info('app.myaggregrid->beforerefresh');
            },
            refresh: function() {
                console.info('app.myaggregrid->refresh');
            },
            beforeaggregate: function() {
                console.info('app.myaggregrid->beforeaggregate');
            },
            aggregate: function() {
                console.info('app.myaggregrid->aggregate');
            },
            beforerendercells: function() {
                console.info('app.myaggregrid->beforerendercells');
            },
            rendercells: function() {
                console.info('app.myaggregrid->rendercells');
            },
            aggregatechange: function(aggregrid, action, recordMetadata) {
                console.info('app.myaggregrid->aggregatechange: %s record %s in group %o at %sx%s', action, recordMetadata.record.getId(), recordMetadata.group, recordMetadata.row.getId(), recordMetadata.column.getId());
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
    }
});