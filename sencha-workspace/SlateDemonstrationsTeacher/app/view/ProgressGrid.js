/**
 * Renders progress for a given list of students across a given list of competencies
 *
 * ## TODO
 *
 * - [ ] Migrade to aggregrid
 *
 */
/* eslint no-console: "off" */
Ext.define('SlateDemonstrationsTeacher.view.ProgressGrid', {
    extend: 'Ext.Component',
    xtype: 'slate-demonstrations-teacher-progressgrid',
    requires: [
        /* global Slate */
        'Slate.cbl.widget.Popover'
    ],

    config: {
        studentDashboardLink: null,
        averageFormat: '0.##',
        progressFormat: '0%',

        popover: true,

        studentsStore: 'Students',
        competenciesStore: 'Competencies',
        skillsStore: 'Skills',
        studentCompetenciesStore: 'StudentCompetencies'
    },

    componentCls: 'cbl-grid-cmp',

    tpl: [
        '{%var studentsCount = values.studentsCount%}',
        '{%var competenciesCount = values.competenciesCount%}',
        '<tpl if="competenciesCount === 0 || studentsCount === 0">',
            '<div class="cbl-grid-ct">',
                '<table class="cbl-grid cbl-grid-competencies"></table>',
            '</div>',
            '<div class="cbl-grid-ct">',
                '<table class="cbl-grid cbl-grid-main"></table>',
            '</div>',
        '<tpl else>',
            '<div class="cbl-grid-ct">',
                '<table class="cbl-grid cbl-grid-competencies">',
                    '<colgroup class="cbl-grid-competency-col"></colgroup>',

                    '<thead>',
                        '<tr>',
                            '<td class="cbl-grid-corner-cell">&nbsp;</td>',
                        '</tr>',
                    '</thead>',

                    '<tbody>',
                        '<tpl for="competencies">',
                            '<tpl for="competency">',
                                '<tr class="cbl-grid-progress-row" data-competency="{ID}">',
                                    '<th class="cbl-grid-competency-name"><div class="ellipsis">{Descriptor}</div></th>',
                                '</tr>',
                                '<tr class="cbl-grid-skills-row" data-competency="{ID}">',
                                    '<td class="cbl-grid-skills-cell">',
                                        '<div class="cbl-grid-skills-ct">',
                                            '<table class="cbl-grid-skills-grid">',
                                                '<colgroup class="cbl-grid-skill-col"></colgroup>',
                                                '<tbody></tbody>',
                                            '</table>',
                                        '</div>',
                                    '</td>',
                                '</tr>',
                            '</tpl>',
                        '</tpl>',
                    '</tbody>',
                '</table>',

                '<div class="cbl-grid-scroll-ct">',
                    '<table class="cbl-grid cbl-grid-main">',
                        '<colgroup span="{[studentsCount]}" class="cbl-grid-progress-col"></colgroup>',

                        '<thead>',
                            '<tr>',
                                '<tpl for="students">',
                                    '<th class="cbl-grid-student-name" data-student="{student.ID}">',
                                        '<tpl if="dashboardUrl"><a href="{dashboardUrl}" target="_blank"></tpl>',
                                            '{student.FirstName} {student.LastName}',
                                        '<tpl if="dashboardUrl"></a></tpl>',
                                    '</th>',
                                '</tpl>',
                            '</tr>',
                        '</thead>',

                        '<tbody>',
                            '<tpl for="competencies">',
                                '<tr class="cbl-grid-progress-row" data-competency="{competency.ID}">',
                                    '<tpl for="students">',
                                        '<td class="cbl-grid-progress-cell" data-student="{student.ID}">',
                                            '<span class="cbl-grid-progress-bar" style="width: 0%"></span>',
                                            '<span class="cbl-grid-progress-level"></span>',
                                            '<span class="cbl-grid-progress-percent"></span>',
                                            '<span class="cbl-grid-progress-average"></span>',
                                        '</td>',
                                    '</tpl>',
                                '</tr>',
                                '<tr class="cbl-grid-skills-row" data-competency="{competency.ID}">',
                                    '<td class="cbl-grid-skills-cell" colspan="{[studentsCount]}"">',
                                        '<div class="cbl-grid-skills-ct">',
                                            '<table class="cbl-grid-skills-grid">',
                                                '<colgroup span="{[studentsCount]}"" class="cbl-grid-demos-col"></colgroup>',
                                                '<tbody></tbody>',
                                            '</table>',
                                        '</div>',
                                    '</td>',
                                '</tr>',
                            '</tpl>',
                        '</tbody>',
                    '</table>',
                '</div>',
            '</div>',
            '<div class="cbl-grid-legend">',
                '<span class="cbl-grid-legend-label">Portfolios:&ensp;</span>',
                '<span class="cbl-grid-legend-item level-color cbl-level-9">Y1</span>',
                '<span class="cbl-grid-legend-item level-color cbl-level-10">Y2</span>',
                '<span class="cbl-grid-legend-item level-color cbl-level-11">Y3</span>',
                '<span class="cbl-grid-legend-item level-color cbl-level-12">Y4</span>',
            '</div>',

        '</tpl>'

    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onGridClick',
            element: 'el',
            delegate: '.cbl-grid-progress-row, .cbl-grid-demo'
        },
        mouseover: {
            fn: 'onSkillNameMouseOver',
            element: 'el'
        }
    },


    // local subtemplates
    competencySkillsTpl: [
        '<tpl for="skills">',
            '<tr class="cbl-grid-skill-row" data-skill="{skill.ID}">',
                '<th class="cbl-grid-skill-name" data-skill-name="{skill.Descriptor:htmlEncode}" data-skill-description="{skill.Statement:htmlEncode}">',
                    '<div class="ellipsis">{skill.Descriptor:htmlEncode}</div>',
                '</th>',
            '</tr>',
        '</tpl>'
    ],

    competencyDemonstrationsTpl: [
        '<tpl for="skills">',
            '<tr class="cbl-grid-skill-row" data-skill="{skill.ID}">',
                '<tpl for="students">',
                    '<td class="cbl-grid-demos-cell <tpl if="studentCompetency">cbl-level-{studentCompetency.Level}</tpl>" data-student="{student.ID}">',
                        '<ul class="cbl-grid-demos">',
                            '<tpl for="demonstrations">',
                                '<tpl if=".">',
                                    '<li ',
                                        'data-demonstration="{DemonstrationID}"',
                                        'class="',
                                            ' cbl-grid-demo',
                                            '<tpl if="Override">',
                                                ' cbl-grid-override',
                                                ' cbl-grid-span-{[xcount - xindex + 1]}',
                                            '</tpl>',
                                            '<tpl if="DemonstratedLevel || Override">',
                                                ' cbl-grid-demo-counted',
                                            '<tpl else>',
                                                ' cbl-grid-demo-uncounted',
                                            '</tpl>',
                                        '"',
                                    '>',
                                        '<tpl if="Override">',
                                            'O',
                                        '<tpl elseif="DemonstratedLevel == 0">',
                                            'M',
                                        '<tpl else>',
                                            '{DemonstratedLevel}',
                                        '</tpl>',
                                    '</li>',
                                    '{% if (values.Override) break; %}', // don't print any more blocks after override
                                '<tpl else>',
                                    '<li class="cbl-grid-demo cbl-grid-demo-uncounted">&nbsp;</li>',
                                '</tpl>',
                            '</tpl>',
                        '</ul>',
                    '</td>',
                '</tpl>',
            '</tr>',
        '</tpl>'
    ],


    // config handlers
    applyPopover: function(newPopover, oldPopover) {
        return Ext.factory(newPopover, 'Slate.cbl.widget.Popover', oldPopover);
    },

    applyAverageFormat: function(format) {
        return Ext.isString(format) ? Ext.util.Format.numberRenderer(format) : format;
    },

    applyProgressFormat: function(format) {
        return Ext.isString(format) ? Ext.util.Format.numberRenderer(format) : format;
    },

    applyStudentsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateStudentsStore: function(store) {
        if (store) {
            store.on('refresh', 'refresh', this);
        }
    },

    applyCompetenciesStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateCompetenciesStore: function(store) {
        if (store) {
            store.on('refresh', 'refresh', this);
        }
    },

    applyStudentCompetenciesStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateStudentCompetenciesStore: function(store) {
        if (store) {
            store.on({
                scope: this,
                refresh: 'onStudentCompetenciesStoreRefresh',
                update: 'onStudentCompetencyUpdate'
            });

            if (store.isLoaded()) {
                this.loadStudentCompetencies(store.getRange());
            }
        }
    },

    applySkillsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateSkillsStore: function(store) {
        if (store) {
            store.on('refresh', 'refresh', this);
        }
    },


    // component lifecycle
    afterRender: function() {
        var me = this;

        me.callParent(arguments);

        me.refresh();
    },


    // event handlers
    onGridClick: function(ev, targetEl) {
        var me = this;

        if (targetEl = ev.getTarget('.cbl-grid-progress-row', me.el, true)) { // eslint-disable-line no-cond-assign
            me.fireEvent(
                'competencyrowclick',
                me,
                me.getCompetenciesStore().getById(targetEl.getAttribute('data-competency'), 10),
                ev,
                targetEl
            );
        } else if (targetEl = ev.getTarget('.cbl-grid-demo', me.el, true)) { // eslint-disable-line no-cond-assign
            me.fireEvent('democellclick', me, ev, targetEl);
        }
    },

    onSkillNameMouseOver: function(ev) {
        var me = this,
            popover = me.getPopover(),
            dashboardEl = me.el,
            targetEl;

        if (targetEl = ev.getTarget('.cbl-grid-skill-name', dashboardEl, true)) { // eslint-disable-line no-cond-assign
            if (popover.hidden || popover.alignTarget !== targetEl) {
                popover.showBy(targetEl);
                popover.update({
                    title: targetEl.getAttribute('data-skill-name'),
                    body: targetEl.getAttribute('data-skill-description')
                });
            }
        } else if (!popover.hidden) {
            popover.hide();
        }
    },

    onStudentCompetenciesStoreRefresh: function(studentCompetenciesStore) {
        console.log('studentCompetenciesStore->refresh', arguments);

        this.loadStudentCompetencies(studentCompetenciesStore.getRange());
    },

    onStudentCompetencyUpdate: function(studentCompetenciesStore, studentCompetency, operation, modifiedFieldNames) {
        console.log('studentCompetency->update', studentCompetency, operation, modifiedFieldNames);

        this.loadStudentCompetencies(studentCompetency);
    },


    // public methods
    /**
     * Expand or collapse a give competency, loading and rendering associated skills if needed
     *
     * @param {Slate.cbl.model.Competency} competency
     */
    toggleCompetency: function(competency) {
        var me = this,
            competencyRenderData = me.getRenderDataForCompetency(competency),
            skillsRowEl = competencyRenderData.skillsRowEl,
            demonstrationsRowEl = competencyRenderData.demonstrationsRowEl,
            isExpand = !competencyRenderData.expanded,
            eventName = isExpand ? 'expand' : 'collapse',
            loadingCls = 'is-loading',
            expandedCls = 'is-expanded',
            skillsHeight = 0,
            _finishExpand, _finishToggle;


        if (me.fireEvent('beforecompetency'+eventName, me, competency) === false) {
            return;
        }


        Ext.suspendLayouts();


        _finishToggle = function() {
            skillsRowEl.down('.cbl-grid-skills-ct').setHeight(skillsHeight);
            demonstrationsRowEl.down('.cbl-grid-skills-ct').setHeight(skillsHeight);
            me.fireEvent('competency'+eventName, me, competency);
            Ext.resumeLayouts(true);
        };

        competencyRenderData.expanded = isExpand;


        // handle collapse
        if (!isExpand) {
            skillsRowEl.removeCls(expandedCls);
            demonstrationsRowEl.removeCls(expandedCls);
            _finishToggle();
            return;
        }


        // handle expand
        _finishExpand = function() {
            skillsHeight = skillsRowEl.down('.cbl-grid-skills-grid').getHeight();
            skillsRowEl.addCls(expandedCls);
            demonstrationsRowEl.addCls(expandedCls);
            _finishToggle();
        };

        // skills are already loaded & rendered, finish expand immediately
        if (competencyRenderData.skills) {
            _finishExpand();
            return;
        }

        // load demonstrations and skills
        skillsRowEl.addCls(loadingCls);
        demonstrationsRowEl.addCls(loadingCls);

        me.getSkillsStore().getAllByCompetency(competency, function(skillsCollection) {
            var renderData = me.getData(),
                skillsById = renderData.skillsById || (renderData.skillsById = {}),
                competencySkills = competencyRenderData.skills = [],
                demonstrationsBodyEl = demonstrationsRowEl.down('tbody'),

                studentsStore = me.getStudentsStore(),
                studentsCount = studentsStore.getCount(), studentIndex, student,

                skillsCount = skillsCollection.getCount(), skillIndex, skill, skillId,

                skillRenderData, studentsRenderData, studentRenderData, studentsById, skillRowEl, demonstrationsCellEl,
                studentCompetency, demonstrations;

            // build new skills render tree and update root skill index
            for (skillIndex = 0; skillIndex < skillsCount; skillIndex++) {
                skill = skillsCollection.getAt(skillIndex);
                skillId = skill.getId();
                skillRenderData = {
                    skill: skill.data,
                    students: studentsRenderData = [],
                    studentsById: studentsById = {}
                };

                competencySkills.push(skillRenderData);
                skillsById[skillId] = skillRenderData;

                for (studentIndex = 0; studentIndex < studentsCount; studentIndex++) {
                    student = studentsStore.getAt(studentIndex);
                    studentCompetency = competencyRenderData.studentsById[student.getId()].studentCompetency;
                    demonstrations = Ext.Array.clone(studentCompetency.effectiveDemonstrationsData[skillId] || []);

                    // fill demonstrations array with undefined items
                    demonstrations.length = skill.getTotalDemonstrationsRequired(studentCompetency ? studentCompetency.Level : null);

                    studentRenderData = {
                        student: student.data,
                        studentCompetency: studentCompetency,
                        demonstrations: demonstrations
                    };

                    studentsRenderData.push(studentRenderData);
                    studentsById[student.getId()] = studentRenderData;
                }
            }

            // remove loading state
            skillsRowEl.removeCls(loadingCls);
            demonstrationsRowEl.removeCls(loadingCls);

            // render skill subtables within expanded competency
            me.lookupTpl('competencySkillsTpl').overwrite(skillsRowEl.down('tbody'), competencyRenderData);
            me.lookupTpl('competencyDemonstrationsTpl').overwrite(demonstrationsBodyEl, competencyRenderData);

            // decorate renderData with instances
            for (skillIndex = 0; skillIndex < skillsCount; skillIndex++) {
                skillRenderData = competencySkills[skillIndex];
                skillRenderData.skillRowEl = skillRowEl = demonstrationsBodyEl.child('.cbl-grid-skill-row[data-skill="'+skillRenderData.skill.ID+'"]');
                studentsRenderData = skillRenderData.students;

                for (studentIndex = 0; studentIndex < studentsCount; studentIndex++) {
                    studentRenderData = studentsRenderData[studentIndex];
                    studentRenderData.demonstrationsCellEl = demonstrationsCellEl = skillRowEl.child('.cbl-grid-demos-cell[data-student="'+studentRenderData.student.ID+'"]');
                    studentRenderData.demonstrationBlockEls = demonstrationsCellEl.select('.cbl-grid-demo', true);
                }
            }

            // finish expand
            me.syncRowHeights(
                skillsRowEl.select('tr'),
                demonstrationsRowEl.select('tr')
            );

            _finishExpand();
        });
    },

    // /**
    //  * Read a new or updated demonstration model and apply it to the existing render
    //  *
    //  * @param {Slate.cbl.model.Demonstration} demonstration A new or updated demonstration model
    //  */
    // loadDemonstration: function(demonstration) {
    //     var me = this,
    //         studentCompetenciesStore = me.getStudentCompetenciesStoreStore(),
    //         skillsData = demonstration.get('Skills'),
    //         studentCompetencies = demonstration.get('studentCompetencies'),
    //         i = 0, studentCompetenciesLength = studentCompetencies.length,
    //         studentCompetencyData, studentCompetencyId, studentCompetencyRecord,
    //         newStudentCompetencies = [];

    //     for (; i < studentCompetenciesLength; i++) {
    //         studentCompetencyData = studentCompetencies[i];
    //         studentCompetencyId = Slate.cbl.model.Completion.getIdFromData(studentCompetencyData);
    //         studentCompetencyRecord = studentCompetenciesStore.getById(studentCompetencyId);

    //         if (studentCompetencyRecord) {
    //             studentCompetencyRecord.set(studentCompetencyData, {
    //                 dirty: false
    //             });
    //         } else {
    //             newStudentCompetencies.push(studentCompetencyData);
    //         }
    //     }

    //     if (newStudentCompetencies.length) {
    //         studentCompetenciesStore.add(newStudentCompetencies);
    //     }

    //     if (skillsData) {
    //         me.getDemonstrationSkillsStore().mergeRawData(skillsData, demonstration);
    //     }
    // },

    // /**
    //  * Delete a demonstration model and apply it to the existing render
    //  *
    //  * @param {Slate.cbl.model.Demonstration} demonstration The demonstration model that was deleted
    //  */
    // deleteDemonstration: function(demonstration) {
    //     var me = this,
    //         studentCompetenciesStore = me.getStudentCompetenciesStoreStore(),
    //         studentCompetencies = demonstration.get('studentCompetencies'),
    //         i = 0, studentCompetenciesLength = studentCompetencies.length,
    //         studentCompetencyData, studentCompetencyId, studentCompetencyRecord;

    //     for (; i < studentCompetenciesLength; i++) {
    //         studentCompetencyData = studentCompetencies[i];
    //         studentCompetencyId = Slate.cbl.model.Completion.getIdFromData(studentCompetencyData);
    //         studentCompetencyRecord = studentCompetenciesStore.getById(studentCompetencyId);

    //         if (studentCompetencyRecord) {
    //             studentCompetencyRecord.set(studentCompetencyData, {
    //                 dirty: false
    //             });
    //         }
    //     }

    //     me.getDemonstrationSkillsStore().mergeRawData([], demonstration);
    // },


    // protected methods

    /**
     * @protected
     * Redraw the dashboard's primary markup shell based on the already-loaded {@link #config-studentsStore} and {@link #config-competenciesStore}
     */
    refresh: function() {
        var me = this,
            studentsStore = me.getStudentsStore(),
            competenciesStore = me.getCompetenciesStore();

        if (!studentsStore.isLoaded() || !competenciesStore.isLoaded()) {
            return;
        }

        Ext.suspendLayouts();

        me.setData(me.buildRenderData());

        if (me.rendered) {
            me.finishRefresh();
        } else {
            me.on('render', 'finishRefresh', me, { single: true });
        }

        Ext.resumeLayouts(true);
    },

    /**
     * @protected
     * Builds render data tree for the progress table's top-level template, {@link #config-tpl}
     *
     * Each object directly within the `students` and `competencies` arrays is a unique instance to this render tree
     * but contains references to the `data` objects in the corresponding student/competency model instances. The top-
     * level objects may be modified to keep track of render state, but the referenced student/competency data should
     * be treated as read-only. Any changes that need to be made to the underlying student/competency models must be done
     * through the model instances loaded into {@link #config-studentsStore} or {@link #config-competenciesStore} and
     * then the render tree regenerated by calling {@link #method-refresh}
     *
     * @return {Object} renderData
     */
    buildRenderData: function() {
        var me = this,
            studentDashboardLink = me.getStudentDashboardLink(),

            students = me.getStudentsStore().getRange(),
            studentsLength = students.length, studentIndex, student,
            studentsData = [],

            competenciesStore = me.getCompetenciesStore(),
            competenciesLength = competenciesStore.getCount(), competencyIndex, competency, competencyStudentsData,
            competenciesData = [];


        // build array of students
        for (studentIndex = 0; studentIndex < studentsLength; studentIndex++) {
            student = students[studentIndex];
            studentsData.push({
                student: student.data,
                dashboardUrl: studentDashboardLink && Slate.API.buildUrl(Ext.String.urlAppend(studentDashboardLink, 'student=' + window.escape(student.get('Username'))))
            });
        }


        // build array of competencies
        for (competencyIndex = 0; competencyIndex < competenciesLength; competencyIndex++) {
            competency = competenciesStore.getAt(competencyIndex);

            competenciesData.push({
                competency: competency.data,
                students: competencyStudentsData = []
            });

            for (studentIndex = 0; studentIndex < studentsLength; studentIndex++) {
                student = students[studentIndex];
                competencyStudentsData.push({
                    student: student.data
                });
            }
        }


        return {
            students: studentsData,
            studentsCount: studentsLength,
            competencies: competenciesData,
            competenciesCount: competenciesLength
        };
    },

    /**
     * @protected
     * Decorates renderData after a redraw with indexes and element references that are useful
     * for applying updates
     *
     * Take care to keep the read and write phases batched for optimal performances, each flip-flop between reading
     * from the DOM and writing to the DOM forces the browser to do a layout run
     */
    finishRefresh: function() {
        var me = this,
            el = me.el,
            renderData = me.getData(),
            competenciesTableEl = renderData.competenciesTableEl = el.down('.cbl-grid-competencies'),
            studentsTableEl = renderData.competenciesTableEl = el.down('.cbl-grid-main'),

            competenciesById = renderData.competenciesById = {},
            competenciesRenderData = renderData.competencies,
            competenciesLength = competenciesRenderData.length, competencyIndex,
            competencyRenderData, competencyId, studentsById, competencySelector, progressRowEl, progressCellEl,

            competencyStudentsRenderData, studentsLength = renderData.students.length, studentIndex,
            studentRenderData, studentId;


        //
        // READ PHASE:
        //

        for (competencyIndex = 0; competencyIndex < competenciesLength; competencyIndex++) {
            competencyRenderData = competenciesRenderData[competencyIndex];
            competencyId = competencyRenderData.competency.ID;
            competencyStudentsRenderData = competencyRenderData.students;
            studentsById = competencyRenderData.studentsById = {};
            competenciesById[competencyId] = competencyRenderData;

            competencySelector = '[data-competency="'+competencyId+'"]';
            competencyRenderData.progressRowEl = progressRowEl = studentsTableEl.down('.cbl-grid-progress-row' + competencySelector);
            competencyRenderData.skillsRowEl = competenciesTableEl.down('.cbl-grid-skills-row' + competencySelector);
            competencyRenderData.demonstrationsRowEl = studentsTableEl.down('.cbl-grid-skills-row' + competencySelector);

            for (studentIndex = 0; studentIndex < studentsLength; studentIndex++) {
                studentRenderData = competencyStudentsRenderData[studentIndex];
                studentId = studentRenderData.student.ID;
                studentsById[studentId] = studentRenderData;

                studentRenderData.progressCellEl = progressCellEl = progressRowEl.down('.cbl-grid-progress-cell[data-student="'+studentId+'"]');
                studentRenderData.progressBarEl = progressCellEl.down('.cbl-grid-progress-bar');
                studentRenderData.progressLevelEl = progressCellEl.down('.cbl-grid-progress-level');
                studentRenderData.progressPercentEl = progressCellEl.down('.cbl-grid-progress-percent');
                studentRenderData.progressAverageEl = progressCellEl.down('.cbl-grid-progress-average');
            }
        }


        //
        // WRITE PHASE:
        //

        // syncRowHeights does a batch read followed by a batch write so it should remain as the first call in the write phase if possible
        me.syncRowHeights(
            competenciesTableEl.select('thead tr, .cbl-grid-progress-row'),
            studentsTableEl.select('thead tr, .cbl-grid-progress-row')
        );

    },

    /**
     * @protected
     * Gets the render object corresponding to the given competency from the render tree previously by
     * {@link #method-buildRenderData} and already loaded into {@link #config-data}. Properties
     * tracking the render state may be added to this object.
     *
     * @param {Slate.cbl.model.Competency} competency
     * @return {Object} competencyRenderData
     */
    getRenderDataForCompetency: function(competency) {
        return this.data.competencies[this.getCompetenciesStore().indexOf(competency)];
    },

    /**
     * @protected
     * Reads one or more new or updated student competency models and apply them to the existing render
     *
     * @param {Slate.cbl.model.StudentCompetency/Slate.cbl.model.StudentCompetency[]} studentCompetencies A new or updated student competency model or array of models
     */
    loadStudentCompetencies: function(studentCompetencies) {
        studentCompetencies = Ext.isArray(studentCompetencies) ? studentCompetencies : [studentCompetencies];

        // eslint-disable-next-line vars-on-top
        var me = this,
            // skillsStore = me.getSkillsStore(),
            averageFormat = me.getAverageFormat(),
            progressFormat = me.getProgressFormat(),
            studentCompetenciesLength = studentCompetencies.length, studentCompetencyIndex,
            competenciesById, studentCompetency, competencyData, competencyStudentData, progressCellEl, competencyId, studentId,
            count, average, level, renderedLevel,
            countDirty, averageDirty, levelDirty,
            percentComplete, demonstrationsRequired;

        if (!me.rendered) {
            me.on('afterrender', function() {
                me.loadStudentCompetencies(studentCompetencies);
            }, me, { single: true });
            return;
        }

        competenciesById = me.getData().competenciesById;

        for (studentCompetencyIndex = 0; studentCompetencyIndex < studentCompetenciesLength; studentCompetencyIndex++) {
            studentCompetency = studentCompetencies[studentCompetencyIndex];
            competencyId = studentCompetency.get('CompetencyID');
            competencyData = competenciesById[competencyId];
            studentId = studentCompetency.get('StudentID');
            competencyStudentData = competencyData.studentsById[studentId];
            progressCellEl = competencyStudentData.progressCellEl;

            count = studentCompetency.get('demonstrationsComplete');
            average = studentCompetency.get('demonstrationsAverage');
            level = studentCompetency.get('Level');
            renderedLevel = competencyStudentData.renderedLevel;

            countDirty = count != competencyStudentData.renderedCount;
            averageDirty = average != competencyStudentData.renderedAverage;
            levelDirty = level != renderedLevel;
            demonstrationsRequired = competencyData.competency.totalDemonstrationsRequired[studentCompetency.get('Level')] || competencyData.competency.totalDemonstrationsRequired.default;

            if (countDirty || averageDirty) {
                percentComplete = 100 * (count || 0) / demonstrationsRequired;
                progressCellEl.toggleCls('is-average-low', percentComplete >= 50 && average !== null && average < (level + competencyData.competency.minimumAverageOffset));
            }

            if (countDirty) {
                competencyStudentData.progressBarEl.setStyle('width', isNaN(percentComplete) ? '0' : Math.round(percentComplete) + '%');
                competencyStudentData.progressPercentEl.update(isNaN(percentComplete) ? '&mdash;' : progressFormat(percentComplete));

                competencyStudentData.renderedCount = count;
            }

            if (averageDirty) {
                competencyStudentData.progressAverageEl.update(averageFormat(average));

                competencyStudentData.renderedAverage = average;
            }

            if (levelDirty) {
                progressCellEl.addCls('cbl-level-'+level);

                if (renderedLevel) {
                    console.warn('TODO: handle transitioning to different level');
                    // progressCellEl.removeCls('cbl-level-'+renderedLevel);

                    // me.removeDemonstrationSkills(demoSkillsStore.query([
                    //     new Ext.util.Filter({
                    //         property: 'StudentID',
                    //         value: studentId
                    //     }),
                    //     new Ext.util.Filter({
                    //         property: 'SkillID',
                    //         operator: 'in',
                    //         value: skillsStore.query('CompetencyID', competencyId).collect('ID', 'data')
                    //     })
                    // ]).getRange(), false); // false to defer flushing demonstrations, we'll queue it for once at the end

                    // competencyStudentData.outgoingLevel = renderedLevel;
                }

                competencyStudentData.progressLevelEl.update('Y' + (level - 8));

                competencyStudentData.renderedLevel = level;
            }

            competencyStudentData.studentCompetency = studentCompetency.data;
        }
    },

    /**
     * @protected
     * Synchronizes the heights of two sets of table rows by setting the height of both to the max of the two
     *
     * @param {Ext.dom.CompositeElement/Ext.dom.CompositeElementLite} table1Rows
     * @param {Ext.dom.CompositeElement/Ext.dom.CompositeElementLite} table2Rows
     */
    syncRowHeights: function(table1Rows, table2Rows) {

        Ext.batchLayouts(function() {
            var table1RowHeights = [],
                table2RowHeights = [],
                rowCount, rowIndex, maxHeight;

            rowCount = table1Rows.getCount();

            if (table2Rows.getCount() != rowCount) {
                Ext.Logger.warn('tables\' row counts don\'t match');
            }

            // read all the row height in batch first for both tables
            for (rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                table1RowHeights.push(table1Rows.item(rowIndex).getHeight());
                table2RowHeights.push(table2Rows.item(rowIndex).getHeight());
            }

            // write all the max row heights
            for (rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                maxHeight = Math.max(table1RowHeights[rowIndex], table2RowHeights[rowIndex]);
                table1Rows.item(rowIndex).select('td, th').setHeight(maxHeight);
                table2Rows.item(rowIndex).select('td, th').setHeight(maxHeight);
            }
        });

    }
}, function(Class) {
    /* eslint-disable spaced-comment */
    //<debug>
    var monitoredMethods = ['refresh', 'finishRefresh', 'syncRowHeights', 'buildRenderData'];

    Ext.Array.each(monitoredMethods, function(functionName) {
        var origFn = Class.prototype[functionName];

        Class.prototype[functionName] = function() {
            var timeLabel = this.id + '.' + functionName,
                ret;

            console.groupCollapsed('%o.%s(%o) called from %o', this.id, functionName, arguments, arguments.callee.caller); // eslint-disable-line no-caller
            console.time(timeLabel);

            ret = origFn.apply(this, arguments);

            console.timeEnd(timeLabel);
            console.groupEnd();

            return ret;
        };
    });
    //</debug>
    /* eslint-enable spaced-comment */
});