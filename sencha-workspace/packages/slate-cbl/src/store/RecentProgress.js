/*jslint browser: true, undef: true *//*global Ext,Slate*/
Ext.define('Slate.cbl.store.RecentProgress', {
    extend: 'Ext.data.Store',

    model: 'Slate.cbl.model.RecentProgress',
    pageSize: 0,

    proxy: {
        type: 'api',
        connection: 'Slate.cbl.API',
        url: '/cbl/student-dashboard/recent-progress',
        reader: {
            rootProperty: 'data'
        }
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