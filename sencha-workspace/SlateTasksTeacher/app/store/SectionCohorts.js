Ext.define('SlateTasksTeacher.store.SectionCohorts', {
    extend: 'Ext.data.Store',
    requires: [
        'Slate.proxy.Records'
    ],


    remoteSort: false,

    fields: [
        'Cohort'
    ],

    setCourseSection: function(sectionCode) {
        var me = this,
            path = '/sections/'+sectionCode+'/cohorts';

        if (me.getProxy().getUrl() != path) {
            me.getProxy().setUrl('/sections/'+sectionCode+'/cohorts');
            me.dirty = true;
        }

        return me;
    },

    loadIfDirty: function() {
        if (this.dirty || !(this.isLoading() || this.isLoaded())) {
            this.load();
            this.dirty = false;
        }
    },

    proxy: {
        type: 'slate-records',
        reader: {
            type: 'json',
            transform: function(response) {
                return Ext.Array.map(response.data, function(cohort) {
                    return {
                        'Cohort': cohort
                    }
                });
            }
        }
    }
});