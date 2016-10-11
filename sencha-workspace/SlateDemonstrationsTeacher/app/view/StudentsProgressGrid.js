/**
 * Renders progress for a given list of students across a given list of competencies
 */
Ext.define('SlateDemonstrationsTeacher.view.StudentsProgressGrid', {
    extend: 'Ext.Component',
    xtype: 'slate-demonstrations-teacher-studentsprogressgrid',
    requires:[
        'Slate.cbl.Util',

        'Slate.cbl.widget.Popover',

        'Slate.cbl.store.Students',
        'Slate.cbl.store.Competencies',
        'Slate.cbl.store.Completions',
        'Slate.cbl.store.DemonstrationSkills',

        'Slate.cbl.data.Skills'
    ],

    config: {
        studentDashboardLink: null,
        averageFormat: '0.##',
        progressFormat: '0%',
        flushDemonstrationsBuffer: 10,

        popover: true,

        studentsStore: {
            xclass: 'Slate.cbl.store.Students'
        },

        competenciesStore: {
            xclass: 'Slate.cbl.store.Competencies'
        },

        completionsStore: {
            xclass: 'Slate.cbl.store.Completions'
        },

        skillsStore: 'cbl-skills',

        demonstrationSkillsStore: {
            xclass: 'Slate.cbl.store.DemonstrationSkills'
        }
    },

    componentCls: 'cbl-grid-cmp',

    tpl: [
        '{%var studentsCount = values.students.length%}',
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
                                    '<tpl if="dashboardUrl"><a href="{dashboardUrl}"></tpl>',
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
        '</div>'
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
                    '<td class="cbl-grid-demos-cell <tpl if="completion">cbl-level-{completion.currentLevel}</tpl>" data-student="{student.ID}">',
                        '<ul class="cbl-grid-demos">',
                            '<tpl for="demonstrationBlocks">',
                                '<li class="cbl-grid-demo cbl-grid-demo-empty"></li>',
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

    applyCompletionsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateCompletionsStore: function(store) {
        if (store) {
            store.on({
                scope: this,
                refresh: 'onCompletionsRefresh',
                update: 'onCompletionUpdate'
            });
        }
    },

    applySkillsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    applyDemonstrationSkillsStore: function(store) {
        return Ext.StoreMgr.lookup(store);
    },

    updateDemonstrationSkillsStore: function(store) {
        if (store) {
            store.on({
                scope: this,
                refresh: function() { console.log('ds->refresh', arguments); },
                load: 'onDemonstrationSkillsLoad',
                add: 'onDemonstrationSkillsAdd',
                update: 'onDemonstrationSkillUpdate',
                remove: 'onDemonstrationSkillsRemove'
            });
        }
    },


    // component lifecycle
    afterRender: function() {
        var me = this;

        me.callParent(arguments);

        me.refresh();

        // create an instance-specific buffer for flushing demonstrations
        me.flushDemonstrations = Ext.Function.createBuffered(me.flushDemonstrations, me.getFlushDemonstrationsBuffer(), me);
    },


    // event handlers
    onGridClick: function(ev, targetEl) {
        var me = this;

        if (targetEl = ev.getTarget('.cbl-grid-progress-row', me.el, true)) {
            me.fireEvent(
                'competencyrowclick',
                me,
                me.getCompetenciesStore().getById(targetEl.getAttribute('data-competency'), 10),
                ev,
                targetEl
            );
        } else if (targetEl = ev.getTarget('.cbl-grid-demo', me.el, true)) {
            me.fireEvent('democellclick', me, ev, targetEl);
        }
    },

    onSkillNameMouseOver: function(ev) {
        var me = this,
            popover = me.getPopover(),
            dashboardEl = me.el,
            targetEl;

        if (targetEl = ev.getTarget('.cbl-grid-skill-name', dashboardEl, true)) {
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

    onCompletionsRefresh: function(completionsStore) {
        console.log('completions->refresh', arguments);

        this.loadCompletions(completionsStore.getRange());
    },

    onCompletionUpdate: function(completionsStore, completion, operation, modifiedFieldNames, details) {
        console.log('completion->update', completion, operation, modifiedFieldNames);

        this.loadCompletions(completion);
    },

    onDemonstrationSkillsLoad: function(demoSkillsStore, demoSkills) {
        console.log('ds->load', demoSkills);

        this.addDemonstrationSkills(demoSkills);
    },

    onDemonstrationSkillsAdd: function(demoSkillsStore, demoSkills) {
        console.log('ds->add', demoSkills);

        this.addDemonstrationSkills(demoSkills);
    },

    onDemonstrationSkillUpdate: function(demoSkillsStore, demoSkill, operation, modifiedFieldNames, details) {
        console.log('ds->update', demoSkill, operation, modifiedFieldNames);

        if (modifiedFieldNames.indexOf('DemonstratedLevel') != -1) {
            this.updateDemonstrationSkills([demoSkill]);
        }
    },

    onDemonstrationSkillsRemove: function(demoSkillsStore, demoSkills) {
        console.log('ds->remove', demoSkills);

        this.removeDemonstrationSkills(demoSkills);
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

        me.getDemonstrationSkillsStore().loadByStudentsAndCompetencies(me.getStudentsStore().collect('ID'), competency.getId());

        me.getSkillsStore().getAllByCompetency(competency, function(skillsCollection) {
            var renderData = me.getData(),
                skillsById = renderData.skillsById || (renderData.skillsById = {}),
                competencySkills = competencyRenderData.skills = [],
                demonstrationsBodyEl = demonstrationsRowEl.down('tbody'),

                studentsStore = me.getStudentsStore(),
                studentsCount = studentsStore.getCount(), studentIndex, student,

                skillsCount = skillsCollection.getCount(), skillIndex, skill,

                skillRenderData, studentsRenderData, studentRenderData, studentsById, skillRowEl, demonstrationsCellEl,
                studentCompletion, demonstrationsRequired;

            // build new skills render tree and update root skill index
            for (skillIndex = 0; skillIndex < skillsCount; skillIndex++) {
                skill = skillsCollection.getAt(skillIndex);
                skillRenderData = {
                    skill: skill.data,
                    students: studentsRenderData = [],
                    studentsById: studentsById = {}
                };

                competencySkills.push(skillRenderData);
                skillsById[skill.getId()] = skillRenderData;

                for (studentIndex = 0; studentIndex < studentsCount; studentIndex++) {
                    student = studentsStore.getAt(studentIndex);
                    studentCompletion = competencyRenderData.studentsById[student.getId()].completion;

                    studentRenderData = {
                        student: student.data,
                        completion: studentCompletion,
                        demonstrationBlocks: Slate.cbl.Util.padArray([], skill.getTotalDemonstrationsRequired(studentCompletion ? studentCompletion.currentLevel : null), true)
                    };

                    studentsRenderData.push(studentRenderData);
                    studentsById[student.getId()] = studentRenderData;
                }
            }

            // remove loading state
            skillsRowEl.removeCls(loadingCls);
            demonstrationsRowEl.removeCls(loadingCls);

            // render skill subtables within expanded competency
            me.getTpl('competencySkillsTpl').overwrite(skillsRowEl.down('tbody'), competencyRenderData);
            me.getTpl('competencyDemonstrationsTpl').overwrite(demonstrationsBodyEl, competencyRenderData);

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
            Slate.cbl.Util.syncRowHeights(
                skillsRowEl.select('tr'),
                demonstrationsRowEl.select('tr')
            );

            // write any pending demonstrations to the DOM
            me.flushDemonstrations();

            _finishExpand();
        });
    },

    /**
     * Read a new or updated demonstration model and apply it to the existing render
     *
     * @param {Slate.cbl.model.Demonstration} demonstration A new or updated demonstration model
     */
    loadDemonstration: function(demonstration) {
        var me = this,
            completionsStore = me.getCompletionsStore(),
            skillsData = demonstration.get('Skills'),
            competencyCompletions = demonstration.get('competencyCompletions'),
            i = 0, competencyCompletionsLength = competencyCompletions.length,
            competencyCompletionData, competencyCompletionId, competencyCompletionRecord,
            newCompletions = [];

        for(; i < competencyCompletionsLength; i++) {
            competencyCompletionData = competencyCompletions[i];
            competencyCompletionId = Slate.cbl.model.Completion.getIdFromData(competencyCompletionData);
            competencyCompletionRecord = completionsStore.getById(competencyCompletionId);

            if (competencyCompletionRecord) {
                competencyCompletionRecord.set(competencyCompletionData, {
                    dirty: false
                });
            } else {
                newCompletions.push(competencyCompletionData);
            }
        }

        if (newCompletions.length) {
            completionsStore.add(newCompletions);
        }

        if (skillsData) {
            me.getDemonstrationSkillsStore().mergeRawData(skillsData, demonstration);
        }
    },

    /**
     * Delete a demonstration model and apply it to the existing render
     *
     * @param {Slate.cbl.model.Demonstration} demonstration The demonstration model that was deleted
     */
    deleteDemonstration: function(demonstration) {
        var me = this,
            completionsStore = me.getCompletionsStore(),
            competencyCompletions = demonstration.get('competencyCompletions'),
            i = 0, competencyCompletionsLength = competencyCompletions.length,
            competencyCompletionData, competencyCompletionId, competencyCompletionRecord;

        for(; i < competencyCompletionsLength; i++) {
            competencyCompletionData = competencyCompletions[i];
            competencyCompletionId = Slate.cbl.model.Completion.getIdFromData(competencyCompletionData);
            competencyCompletionRecord = completionsStore.getById(competencyCompletionId);

            if (competencyCompletionRecord) {
                competencyCompletionRecord.set(competencyCompletionData, {
                    dirty: false
                });
            }
        }

        me.getDemonstrationSkillsStore().mergeRawData([], demonstration);
    },


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

        // TODO: should this be in finishRefresh instead? what happens if refresh called before render?
        me.getCompletionsStore().loadByStudentsAndCompetencies(
            me.getStudentsStore().collect('ID'),
            me.getCompetenciesStore().collect('ID')
        );

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
                dashboardUrl: studentDashboardLink && Ext.String.urlAppend(studentDashboardLink, 'student=' + window.escape(student.get('Username')))
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
            competencies: competenciesData
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
        Slate.cbl.Util.syncRowHeights(
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
     * Reads one or more new or updated completion model and apply them to the existing render
     *
     * @param {Slate.cbl.model.Completion/Slate.cbl.model.Completion[]} completions A new or updated completion model or array of models
     */
    loadCompletions: function(completions) {
        completions = Ext.isArray(completions) ? completions : [completions];

        var me = this,
            skillsStore = me.getSkillsStore(),
            demoSkillsStore = me.getDemonstrationSkillsStore(),
            competenciesById = me.getData().competenciesById,
            averageFormat = me.getAverageFormat(),
            progressFormat = me.getProgressFormat(),
            completionsLength = completions.length, completionIndex,
            needsFlush = false,
            completion, competencyData, competencyStudentData, progressCellEl, competencyId, studentId,
            count, average, level, renderedLevel,
            countDirty, averageDirty, levelDirty,
            percentComplete, demonstrationsRequired;

        for (completionIndex = 0; completionIndex < completionsLength; completionIndex++) {
            completion = completions[completionIndex];
            competencyId = completion.get('CompetencyID');
            competencyData = competenciesById[competencyId];
            studentId = completion.get('StudentID');
            competencyStudentData = competencyData.studentsById[studentId];
            progressCellEl = competencyStudentData.progressCellEl;

            count = completion.get('demonstrationsComplete');
            average = completion.get('demonstrationsAverage');
            level = completion.get('currentLevel');
            renderedLevel = competencyStudentData.renderedLevel;

            countDirty = count != competencyStudentData.renderedCount;
            averageDirty = average != competencyStudentData.renderedAverage;
            levelDirty = level != renderedLevel;
            demonstrationsRequired = competencyData.competency.totalDemonstrationsRequired[completion.get('currentLevel')] || competencyData.competency.totalDemonstrationsRequired.default;

            if (countDirty || averageDirty) {
                percentComplete = 100 * (count || 0) / demonstrationsRequired;
                progressCellEl.toggleCls('is-average-low', percentComplete >= 50 && average !== null && average < (level + competencyData.competency.minimumAverageOffset));
            }

            if (countDirty) {
                competencyStudentData.progressBarEl.setStyle('width', Math.round(percentComplete) + '%');
                competencyStudentData.progressPercentEl.update(progressFormat(percentComplete));

                competencyStudentData.renderedCount = count;
            }

            if (averageDirty) {
                competencyStudentData.progressAverageEl.update(averageFormat(average));

                competencyStudentData.renderedAverage = average;
            }

            if (levelDirty) {
                progressCellEl.addCls('cbl-level-'+level);

                if (renderedLevel) {
                    progressCellEl.removeCls('cbl-level-'+renderedLevel);

                    me.removeDemonstrationSkills(demoSkillsStore.query([
                        new Ext.util.Filter({
                            property: 'StudentID',
                            value: studentId
                        }),
                        new Ext.util.Filter({
                            property: 'SkillID',
                            operator: 'in',
                            value: skillsStore.query('CompetencyID', competencyId).collect('ID', 'data')
                        })
                    ]).getRange(), false); // false to defer flushing demonstrations, we'll queue it for once at the end

                    needsFlush = true;

                    competencyStudentData.outgoingLevel = renderedLevel;
                }

                competencyStudentData.progressLevelEl.update('Y' + level - 8);

                competencyStudentData.renderedLevel = level;
            }

            competencyStudentData.completion = completion.data;
        }

        if (needsFlush) {
            me.flushDemonstrations();
        }
    },

    /**
     * @protected
     * Adds new demoonstration skills blocks
     *
     * @param {Slate.cbl.model.DemonstrationSkill[]} demoSkills An array of demonstration skills
     * @param {Boolean} [flush=true] True to call {@link #method-flushDemonstrations} after queing changes
     */
    addDemonstrationSkills: function(demoSkills, flush) {
        var me = this,
            renderData = me.getData();

        renderData.incomingDemonstrationSkills = (renderData.incomingDemonstrationSkills || []).concat(Ext.pluck(demoSkills, 'data'));

        if (flush !== false) {
            me.flushDemonstrations();
        }
    },

    /**
     * @protected
     * Update already-rendered demonstration skill blocks
     *
     * @param {Slate.cbl.model.DemonstrationSkill[]} demoSkills An array of demonstration skills
     * @param {Boolean} [flush=true] True to call {@link #method-flushDemonstrations} after queing changes
     */
    updateDemonstrationSkills: function(demoSkills, flush) {
        var me = this,
            renderData = me.getData();

        renderData.updatedDemonstrationSkills = (renderData.updatedDemonstrationSkills || []).concat(Ext.pluck(demoSkills, 'data'));

        if (flush !== false) {
            me.flushDemonstrations();
        }
    },

    /**
     * @protected
     * Remove already-rendered demonstration skills blocks
     *
     * @param {Slate.cbl.model.DemonstrationSkill[]} demoSkills An array of demonstration skills
     * @param {Boolean} [flush=true] True to call {@link #method-flushDemonstrations} after queing changes
     */
    removeDemonstrationSkills: function(demoSkills, flush) {
        var me = this,
            renderData = me.getData();

        renderData.removedDemonstrationSkills = (renderData.removedDemonstrationSkills || []).concat(Ext.pluck(demoSkills, 'data'));

        if (flush !== false) {
            me.flushDemonstrations();
        }
    },

    /**
     * @protected
     * Writes any pending changes to demonstrations to the DOM.
     *
     * This method must not trigger any reads from the DOM
     */
    flushDemonstrations: function() {
        var me = this,
            renderData = me.getData(),
            skillsById = renderData.skillsById,
            demoSkillsStore = me.getDemonstrationSkillsStore(),

            updatedDemonstrationSkills = renderData.updatedDemonstrationSkills || [],
            updatedDemonstrationSkillsLength = updatedDemonstrationSkills.length,

            incomingDemonstrationSkills = renderData.incomingDemonstrationSkills || [],
            incomingDemonstrationSkillsLength = incomingDemonstrationSkills.length,

            removedDemonstrationSkills = renderData.removedDemonstrationSkills || [],
            removedDemonstrationSkillsLength = removedDemonstrationSkills.length,

            skillDemonstrationIndex, skillDemonstration, unsortedDemonstrationSkills,

            competenciesRenderData = renderData.competencies,
            competenciesLength = competenciesRenderData.length, competencyIndex, competencyRenderData, competencyStudentsById,

            skillsRenderData, skillsLength, skillIndex, skillRenderData,
            skillDemonstrationsRequired, studentSkillDemonstrationsRequired,
            skillStudentsRenderData, skillStudentsLength, skillStudentIndex, skillStudentRenderData,
            skillDemonstrationBlocks, skillDemonstrationBlocksById, skillDemonstrationsChanged, oldSkillDemonstration, outgoingLevel,
            competencyStudentData,

            skillDemonstrationBlockEls, skillDemonstrationBlockEl,
            skillDemonstrationsOverridden, renderedOverridden,
            skillDemonstrationDemonstratedLevel, renderedDemonstrationLevel,
            skillDemonstrationOverride, renderedOverride,
            skillDemonstrationOverrideSpan, renderedOverrideSpan,
            skillDemonstrationDemonstrationID,

            competencyStudentLevelsFlushed = [], competencyStudentLevelsFlushedLength, competencyStudentLevelsIndex, competencyStudentCompletion;

        // nothing can be flushed if no skills are loaded yet
        if (!skillsById) {
            return;
        }


    	// sort any incoming skill demonstrations that can be into skills->students render objects
        unsortedDemonstrationSkills = [];

        for (skillDemonstrationIndex = 0; skillDemonstrationIndex < incomingDemonstrationSkillsLength; skillDemonstrationIndex++) {
            skillDemonstration = incomingDemonstrationSkills[skillDemonstrationIndex];

            if (
                (skillRenderData = skillsById[skillDemonstration.SkillID]) &&
                (skillStudentRenderData = skillRenderData.studentsById[skillDemonstration.StudentID])
            ) {
                // discard demoSkills that match a loaded skill+student but aren't of the current level
                if (skillStudentRenderData.completion.currentLevel == skillDemonstration.TargetLevel) {
                    (skillStudentRenderData.incomingDemonstrationSkills || (skillStudentRenderData.incomingDemonstrationSkills = [])).push(skillDemonstration);
                }
            } else {
                unsortedDemonstrationSkills.push(skillDemonstration);
            }
        }

        renderData.incomingDemonstrationSkills = unsortedDemonstrationSkills;


    	// sort any updated skill demonstrations that can be into skills->students render objects
        unsortedDemonstrationSkills = [];

        for (skillDemonstrationIndex = 0; skillDemonstrationIndex < updatedDemonstrationSkillsLength; skillDemonstrationIndex++) {
            skillDemonstration = updatedDemonstrationSkills[skillDemonstrationIndex];

            if (
                (skillRenderData = skillsById[skillDemonstration.SkillID]) &&
                (skillStudentRenderData = skillRenderData.studentsById[skillDemonstration.StudentID])
            ) {
                // discard demoSkills that match a loaded skill+student but aren't of the current level
                if (skillStudentRenderData.completion.currentLevel == skillDemonstration.TargetLevel) {
                    (skillStudentRenderData.updatedDemonstrationSkills || (skillStudentRenderData.updatedDemonstrationSkills = [])).push(skillDemonstration);
                }
            } else {
                unsortedDemonstrationSkills.push(skillDemonstration);
            }
        }

        renderData.updatedDemonstrationSkills = unsortedDemonstrationSkills;


    	// sort any removed skill demonstrations that can be into skills->students render objects
        unsortedDemonstrationSkills = [];

        for (skillDemonstrationIndex = 0; skillDemonstrationIndex < removedDemonstrationSkillsLength; skillDemonstrationIndex++) {
            skillDemonstration = removedDemonstrationSkills[skillDemonstrationIndex];

            if (
                (skillRenderData = skillsById[skillDemonstration.SkillID]) &&
                (skillStudentRenderData = skillRenderData.studentsById[skillDemonstration.StudentID])
            ) {
                (skillStudentRenderData.removedDemonstrationSkills || (skillStudentRenderData.removedDemonstrationSkills = [])).push(skillDemonstration);
            } else {
                unsortedDemonstrationSkills.push(skillDemonstration);
            }
        }

        renderData.removedDemonstrationSkills = unsortedDemonstrationSkills;


        // consume all pending changes, generate new demonstrationBlocks arrays, and render them
        for (competencyIndex = 0; competencyIndex < competenciesLength; competencyIndex++) {
            competencyRenderData = competenciesRenderData[competencyIndex];
            skillsRenderData = competencyRenderData.skills;
            competencyStudentsById = competencyRenderData.studentsById;

            if (!skillsRenderData) {
                continue;
            }

            for (skillIndex = 0, skillsLength = skillsRenderData.length; skillIndex < skillsLength; skillIndex++) {
                skillRenderData = skillsRenderData[skillIndex];
                skillStudentsRenderData = skillRenderData.students;
                skillDemonstrationsRequired = skillRenderData.skill.DemonstrationsRequired;

                for (skillStudentIndex = 0, skillStudentsLength = skillStudentsRenderData.length; skillStudentIndex < skillStudentsLength; skillStudentIndex++) {
                    skillStudentRenderData = skillStudentsRenderData[skillStudentIndex];
                    competencyStudentData = competencyStudentsById[skillStudentRenderData.student.ID];
                    skillDemonstrationBlocks = skillStudentRenderData.demonstrationBlocks;
                    skillDemonstrationBlocksById = skillStudentRenderData.demonstrationBlocksById || {};
                    updatedDemonstrationSkills = skillStudentRenderData.updatedDemonstrationSkills || [];
                    incomingDemonstrationSkills = skillStudentRenderData.incomingDemonstrationSkills || [];
                    removedDemonstrationSkills = skillStudentRenderData.removedDemonstrationSkills || [];
                    skillDemonstrationsChanged = false;
                    outgoingLevel = competencyStudentData.outgoingLevel;

                    if (skillDemonstrationsRequired[skillStudentRenderData.completion.currentLevel] !== undefined) {
                        studentSkillDemonstrationsRequired = skillDemonstrationsRequired[skillStudentRenderData.completion.currentLevel];
                    } else {
                        studentSkillDemonstrationsRequired = skillDemonstrationsRequired.default;
                    }

                    // apply updated skill demonstrations
                    if (updatedDemonstrationSkills.length) {
                        skillDemonstrationIndex = 0;
                        updatedDemonstrationSkillsLength = updatedDemonstrationSkills.length;
                        for (; skillDemonstrationIndex < updatedDemonstrationSkillsLength; skillDemonstrationIndex++) {
                            skillDemonstration = updatedDemonstrationSkills[skillDemonstrationIndex];
                            oldSkillDemonstration = skillDemonstrationBlocksById[skillDemonstration.ID];

                            if (oldSkillDemonstration) {
                                if (oldSkillDemonstration !== skillDemonstration) {
                                    Ext.apply(oldSkillDemonstration, skillDemonstration);
                                }
                                skillDemonstrationsChanged = true;
                            } else {
                                incomingDemonstrationSkills.push(skillDemonstration);
                            }
                        }
                        skillStudentRenderData.updatedDemonstrationSkills = null;
                    }

                    // append any incoming skill demonstrations
                    if (incomingDemonstrationSkills.length) {
                        skillDemonstrationBlocks = skillDemonstrationBlocks.concat(skillStudentRenderData.incomingDemonstrationSkills);
                        skillStudentRenderData.incomingDemonstrationSkills = null;
                        skillDemonstrationsChanged = true;
                    }

                    // delete removed skill demonstrations
                    if (removedDemonstrationSkills.length) {
                        skillDemonstrationIndex = 0;
                        removedDemonstrationSkillsLength = removedDemonstrationSkills.length;
                        for (; skillDemonstrationIndex < removedDemonstrationSkillsLength; skillDemonstrationIndex++) {
                            Ext.Array.remove(skillDemonstrationBlocks, skillDemonstrationBlocksById[removedDemonstrationSkills[skillDemonstrationIndex].ID]);
                        }
                        skillStudentRenderData.removedDemonstrationSkills = null;
                        skillDemonstrationsChanged = true;
                    }

                    // if demonstrations have changed, prepare new blocks array and patch the DOM
                    if (skillDemonstrationsChanged) {
                        skillDemonstrationBlocks = Slate.cbl.Util.sortDemonstrations(skillDemonstrationBlocks, studentSkillDemonstrationsRequired);
                        Slate.cbl.Util.padArray(skillDemonstrationBlocks, studentSkillDemonstrationsRequired);
                        skillStudentRenderData.demonstrationBlocks = skillDemonstrationBlocks;
                        skillDemonstrationsOverridden = false;

                        // reset block index
                        skillDemonstrationBlocksById = skillStudentRenderData.demonstrationBlocksById = {};

                        skillDemonstrationBlockEls = skillStudentRenderData.demonstrationBlockEls;
                        for (skillDemonstrationIndex = 0; skillDemonstrationIndex < studentSkillDemonstrationsRequired; skillDemonstrationIndex++) {
                            skillDemonstration = skillDemonstrationBlocks[skillDemonstrationIndex];
                            skillDemonstrationDemonstratedLevel = skillDemonstration.DemonstratedLevel;
                            skillDemonstrationOverride = skillDemonstration.Override;
                            skillDemonstrationOverrideSpan = skillDemonstrationOverride ? studentSkillDemonstrationsRequired - skillDemonstrationIndex : undefined;
                            skillDemonstrationDemonstrationID = skillDemonstration.DemonstrationID;

                            skillDemonstrationBlockEl = skillDemonstrationBlockEls.item(skillDemonstrationIndex);
                            renderedDemonstrationLevel = skillDemonstrationBlockEl.renderedDemonstrationLevel;
                            renderedOverridden = skillDemonstrationBlockEl.renderedOverridden;
                            renderedOverride = skillDemonstrationBlockEl.renderedOverride;
                            renderedOverrideSpan = skillDemonstrationBlockEl.renderedOverrideSpan;

                            // apply overridden class to all blocks following an override block
                            if (renderedOverridden != skillDemonstrationsOverridden) {
                                skillDemonstrationBlockEl.renderedOverridden = skillDemonstrationsOverridden;

                                if (skillDemonstrationsOverridden) {
                                    skillDemonstrationBlockEl.addCls('cbl-grid-demo-overridden');
                                    console.log("%o.addCls('cbl-grid-demo-overridden')", skillDemonstrationBlockEl.dom);

                                    continue; // an overridden block doesn't need any further updates because it'll be hidden
                                } else if (renderedOverridden) {
                                    skillDemonstrationBlockEl.removeCls('cbl-grid-demo-overridden');
                                    console.log("%o.removeCls('cbl-grid-demo-overridden')", skillDemonstrationBlockEl.dom);
                                }
                            }

                            skillDemonstrationsOverridden = skillDemonstrationsOverridden || skillDemonstrationOverride;

                            // apply override class to an override block
                            if (renderedOverride != skillDemonstrationOverride) {
                                skillDemonstrationBlockEl.renderedOverride = skillDemonstrationOverride;

                                if (skillDemonstrationOverride) {
                                    skillDemonstrationBlockEl.addCls('cbl-grid-override');
                                } else if (renderedOverride) {
                                    skillDemonstrationBlockEl.removeCls('cbl-grid-override');
                                }
                            }

                            // apply override span
                            if (renderedOverrideSpan != skillDemonstrationOverrideSpan) {
                                skillDemonstrationBlockEl.renderedOverrideSpan = skillDemonstrationOverrideSpan;

                                if (skillDemonstrationOverrideSpan) {
                                    skillDemonstrationBlockEl.addCls('cbl-grid-span-' + skillDemonstrationOverrideSpan);
                                } else if (renderedOverrideSpan) {
                                    skillDemonstrationBlockEl.removeCls('cbl-grid-span-' + renderedOverrideSpan);
                                }
                            }

                            // normalize level to output code
                            if (skillDemonstrationOverride) {
                                skillDemonstrationDemonstratedLevel = 'O'; // letter O for override
                            } else if (skillDemonstrationDemonstratedLevel === 0) {
                                skillDemonstrationDemonstratedLevel = 'M';
                            }

                            // apply demonstrated level change
                            if (renderedDemonstrationLevel !== skillDemonstrationDemonstratedLevel) {
                                skillDemonstrationBlockEl.renderedDemonstrationLevel = skillDemonstrationDemonstratedLevel;

                                if (renderedDemonstrationLevel === undefined) {
                                    skillDemonstrationBlockEl.removeCls('cbl-grid-demo-empty');
                                } else if (skillDemonstrationDemonstratedLevel === undefined) {
                                    skillDemonstrationBlockEl.addCls('cbl-grid-demo-empty');
                                }

                                if (renderedDemonstrationLevel === 'M') {
                                    skillDemonstrationBlockEl.removeCls('cbl-grid-demo-uncounted');
                                } else if (skillDemonstrationDemonstratedLevel === 'M') {
                                    skillDemonstrationBlockEl.addCls('cbl-grid-demo-uncounted');
                                }

                                if (skillDemonstrationDemonstratedLevel && skillDemonstrationDemonstratedLevel != 'M') {
                                    skillDemonstrationBlockEl.addCls('cbl-grid-demo-counted');
                                } else if (renderedDemonstrationLevel) {
                                    skillDemonstrationBlockEl.removeCls('cbl-grid-demo-counted');
                                }

                                skillDemonstrationBlockEl.update(skillDemonstrationDemonstratedLevel === undefined ? '' : skillDemonstrationDemonstratedLevel);

                            }

                            // apply demo ID change
                            if (skillDemonstrationBlockEl.renderedDemonstrationId != skillDemonstrationDemonstrationID) {
                                skillDemonstrationBlockEl.renderedDemonstrationId = skillDemonstrationDemonstrationID;
                                skillDemonstrationBlockEl.set({'data-demonstration': skillDemonstrationDemonstrationID || ''});
                            }

                            // add reference to index
                            skillDemonstrationBlocksById[skillDemonstration.ID] = skillDemonstration;
                        }
                    }

                    // apply changed target level
                    if (outgoingLevel) {
                        skillStudentRenderData.demonstrationsCellEl.removeCls('cbl-level-'+outgoingLevel).addCls('cbl-level-'+competencyStudentData.renderedLevel);
                        Ext.Array.include(competencyStudentLevelsFlushed, competencyStudentData);
                    }
                }
            }
        }

        // remove outgoingLevel flag on any flushed student competencies and trigger demo reload
        competencyStudentLevelsIndex = 0;
        competencyStudentLevelsFlushedLength = competencyStudentLevelsFlushed.length;
        for (; competencyStudentLevelsIndex < competencyStudentLevelsFlushedLength; competencyStudentLevelsIndex++) {
            competencyStudentData = competencyStudentLevelsFlushed[competencyStudentLevelsIndex];
            competencyStudentCompletion = competencyStudentData.completion;
            competencyStudentData.outgoingLevel = null;

            demoSkillsStore.loadByStudentsAndCompetencies(competencyStudentCompletion.StudentID, competencyStudentCompletion.CompetencyID);
        }
    }
}, function(Class) {
    //<debug>
    var monitoredMethods = ['refresh', 'finishRefresh', 'syncRowHeights', 'buildRenderData', 'flushDemonstrations'];

    Ext.Array.each(monitoredMethods, function(functionName) {
        var origFn = Class.prototype[functionName];

        Class.prototype[functionName] = function() {
            var timeLabel = this.id + '.' + functionName,
                ret;

            console.groupCollapsed('%o.%s(%o) called from %o', this.id, functionName, arguments, arguments.callee.caller);
            console.time(timeLabel);

            ret = origFn.apply(this, arguments);

            console.timeEnd(timeLabel);
            console.groupEnd();

            return ret;
        };
    });
    //</debug>
});