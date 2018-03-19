Ext.define('Slate.cbl.store.StudentCompetencies', {
    extend: 'Ext.data.Store',
    alias: 'store.slate-cbl-studentcompetencies',
    requires: [
        /* global Slate */
        'Slate.cbl.model.demonstrations.Demonstration'
    ],


    model: 'Slate.cbl.model.StudentCompetency',
    config: {
        student: null,
        studentsList: null,
        contentArea: null,

        pageSize: 0,
        remoteFilter: false,
        remoteSort: false
    },


    constructor: function() {
        this.callParent(arguments);
        this.dirty = true;
    },


    // config handlers
    updateStudent: function(student) {
        if (student) {
            this.setStudentsList(null);
        }

        this.getProxy().setExtraParam('student', student || null);
        this.dirty = true;
    },

    updateStudentsList: function(studentsList) {
        if (studentsList) {
            this.setStudent(null);
        }

        this.getProxy().setExtraParam('students', studentsList || null);
        this.dirty = true;
    },

    updateContentArea: function(contentArea) {
        this.getProxy().setExtraParam('content_area', contentArea || null);
        this.dirty = true;
    },


    // member methods
    loadIfDirty: function() {
        if (!this.dirty) {
            return;
        }

        this.dirty = false;
        this.load();
    },

    unload: function() {
        this.loadCount = 0;
        this.removeAll();
    },

    getByCompetencyId: function(competencyId) {
        var me = this,
            index;

        if (!me.getStudent()) {
            Ext.Logger.warn('getByCompetencyId is only available when filtering by student');
            return null;
        }

        index = competencyId ? me.findExact('CompetencyID', competencyId) : -1;
        return index == -1 ? null : me.getAt(index);
    },

    buildDemonstrationInclude: function(demonstrationProxy) {
        var proxyInclude = this.getProxy().getInclude();

        if (!demonstrationProxy) {
            demonstrationProxy = Slate.cbl.model.demonstrations.Demonstration.getProxy();
        }

        return Ext.Array.merge(
            demonstrationProxy.getInclude(),
            Ext.Array.map(proxyInclude, function(include) {
                return 'AffectedStudentCompetencies.'+include;
            }),
            Ext.Array.map(proxyInclude, function(include) {
                return 'AffectedStudentCompetencies.next.'+include;
            })
        );
    },

    mergeDemonstration: function(demonstration) {
        var studentCompetencies = demonstration.get('AffectedStudentCompetencies') || [],
            studentCompetenciesLength = studentCompetencies.length,
            studentCompetencyIndex = 0, nextStudentCompetency;


        // collapse any embedded "next" records into main array
        for (; studentCompetencyIndex < studentCompetenciesLength; studentCompetencyIndex++) {
            nextStudentCompetency = studentCompetencies[studentCompetencyIndex].next;

            if (nextStudentCompetency) {
                studentCompetencies.push(nextStudentCompetency);
            }
        }

        // merge combined raw data
        this.mergeData(studentCompetencies);
    },

    saveDemonstration: function(demonstration, options) {
        var me = this;

        options = options || {};

        demonstration.save(Ext.applyIf({
            include: me.buildDemonstrationInclude(demonstration.getProxy()),
            success: function(savedDemonstration) {
                me.mergeDemonstration(savedDemonstration);

                // call original callback
                Ext.callback(options.success, options.scope, arguments);
            }
        }, options));
    },

    eraseDemonstration: function(demonstration, options) {
        var me = this,
            originalCallback,
            scope;


        // initialize common options
        options = Ext.applyIf({
            include: me.buildDemonstrationInclude(demonstration.isModel ? demonstration.getProxy() : null)
        }, options);

        scope = options.scope || me;


        // erase model or id
        if (demonstration.isModel) {
            originalCallback = options.success;

            options.success = function(erasedDemonstration, operation) {
                var responseDemonstration = operation.getResultSet().getRecords()[0];

                me.mergeDemonstration(responseDemonstration || erasedDemonstration);

                // call original callback
                Ext.callback(originalCallback, scope, arguments);
            };

            demonstration.erase(options);
        } else {
            originalCallback = options.callback;

            options.id = demonstration;
            options.callback = function(records, operation, success) {
                var responseDemonstration = records && records[0] || null;

                if (success) {
                    me.mergeDemonstration(responseDemonstration);
                    Ext.callback(options.success, scope, [responseDemonstration, operation]);
                } else {
                    Ext.callback(options.failure, scope, [responseDemonstration, operation]);
                }

                // call original callback
                Ext.callback(originalCallback, options.scope, arguments);
            };

            Slate.cbl.model.demonstrations.Demonstration.getProxy().createOperation('destroy', options).execute();
        }
    }
});