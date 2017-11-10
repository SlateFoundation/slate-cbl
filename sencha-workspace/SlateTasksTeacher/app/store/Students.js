Ext.define('SlateTasksTeacher.store.Students',{
    extend: 'Slate.cbl.store.Students',
    requires: [
        'Slate.proxy.Records'
    ],

    config: {
        courseSection: null,
        sectionCohort: null
    },

    proxy: {
        type: 'slate-records'
    },

    sorters: [{
        property: 'LastName',
        direction: 'ASC'
    }],

    updateCourseSection: function(courseSection) {
        var me = this,
            path = '/sections/'+courseSection+'/students';

        if (me.getProxy().getUrl() != path) {
            me.getProxy().setUrl(path);
            me.dirty = true;
        }

        return me;
    },

    updateSectionCohort: function(sectionCohort) {
        var me = this,
            proxy = me.getProxy();

        if (sectionCohort == 'undefined') {
            proxy.setExtraParam('cohort', null);

        } else if (me.getProxy().getExtraParams().cohort != sectionCohort) {
            proxy.setExtraParam('cohort', sectionCohort);
            me.dirty = true;
        }

        return me;
    },

    loadIfDirty: function() {
        if (this.dirty || !(this.isLoading() || this.isLoaded())) {
            this.load();
            this.dirty = false;
        }
    }
});