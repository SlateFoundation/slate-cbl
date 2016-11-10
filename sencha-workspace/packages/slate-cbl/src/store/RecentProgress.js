/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.store.RecentProgress', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.Records'
    ],

    model: 'Slate.cbl.model.RecentProgress',
    pageSize: 0,

    proxy: {
        type: 'slate-records',
        url: '/cbl/dashboards/demonstrations/student/recent-progress'
    },

    /**
     * Loads recent progress for given student+content area
     *
     * @param {Number/Slate.cbl.model.Student} student
     * @param {Number/Slate.cbl.model.ContentArea} contentArea
     * @param {Object} [options]
     */
    loadByStudentAndContentArea: function(student, contentArea, options) {
        options = options || {};

        options.params = Ext.apply(options.params || {}, {
            student: student.isModel ? student.getId() : student,
            'content-area': contentArea.isModel ? contentArea.getId() : contentArea
        });

        return this.load(options);
    }
});