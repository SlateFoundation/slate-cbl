Ext.define('Slate.cbl.store.StudentCompetencies', {
    extend: 'Ext.data.Store',
    alias: 'store.slate-cbl-studentcompetencies',


    model: 'Slate.cbl.model.StudentCompetency',
    config: {
        student: null,
        studentsList: null,
        contentArea: null,

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

    saveDemonstration: function(demonstration, options) {
        options = options || {};

        // eslint-disable-next-line vars-on-top
        var me = this,
            proxyInclude = me.getProxy().getInclude();

        demonstration.save(Ext.applyIf({
            include: Ext.Array.merge(
                demonstration.getProxy().getInclude(),
                Ext.Array.map(proxyInclude, function(include) {
                    return 'StudentCompetencies.'+include;
                }),
                Ext.Array.map(proxyInclude, function(include) {
                    return 'StudentCompetencies.next.'+include;
                })
            ),
            success: function(savedDemonstration) {
                var studentCompetencies = savedDemonstration.get('StudentCompetencies') || [],
                    studentCompetenciesLength = studentCompetencies.length,
                    studentCompetencyIndex = 0, nextStudentCompetency;


                // collapse any embedded "next" records into main array
                for (; studentCompetencyIndex < studentCompetenciesLength; studentCompetencyIndex++) {
                    nextStudentCompetency = studentCompetencies[studentCompetencyIndex].next;

                    if (nextStudentCompetency) {
                        studentCompetencies.push(nextStudentCompetency);
                    }
                }


                // update grid
                me.mergeData(studentCompetencies);


                // call original callback
                Ext.callback(options.success, options.scope, arguments);
            }
        }, options));
    }
});