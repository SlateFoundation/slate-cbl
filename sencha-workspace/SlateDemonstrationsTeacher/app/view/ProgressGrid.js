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
        'Ext.util.Format',

        /* global Slate */
        'Slate.cbl.widget.Popover',
        'Slate.cbl.util.Config'
    ],

    config: {
        averageFormat: '0.#',
        progressFormat: '0%',
        contentArea: null,

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
                                        '<td class="cbl-grid-progress-cell cbl-level-progress-meter" data-student="{student.ID}">',
                                            '<span class="cbl-grid-progress-bar cbl-level-progress-bar" style="width: 0%"></span>',
                                            '<span class="cbl-grid-progress-level cbl-level-progress-label"></span>',
                                            '<span class="cbl-grid-progress-percent cbl-level-progress-percent"></span>',
                                            '<span class="cbl-grid-progress-average cbl-level-progress-average"></span>',
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
        '</tpl>'
    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onGridClick',
            element: 'el',
            delegate: '.cbl-grid-progress-row, .cbl-skill-demo'
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
                        '<ul class="cbl-skill-demos">',
                            '<tpl for="demonstrations">',
                                '<tpl if=".">',
                                    '<li',
                                        ' data-demonstration="{DemonstrationID}"',
                                        '<tpl if="Override"> data-span="{[xcount - xindex + 1]}"</tpl>',
                                        ' title="',
                                            '<tpl if="Override">',
                                                '[Overridden]',
                                            '<tpl else>',
                                                '{[fm.htmlEncode(Slate.cbl.util.Config.getTitleForRating(values.DemonstratedLevel))]}',
                                            '</tpl>',
                                        '"',
                                        ' class="',
                                            ' cbl-skill-demo',
                                            '<tpl if="Override">',
                                                ' cbl-skill-demo-override',
                                            '<tpl else>',
                                                ' cbl-rating-{DemonstratedLevel}',
                                            '</tpl>',
                                            '<tpl if="DemonstratedLevel || Override">',
                                                ' cbl-skill-demo-counted',
                                            '<tpl elseif="DemonstratedLevel == 0">',
                                                ' cbl-skill-demo-missed',
                                            '<tpl else>',
                                                ' cbl-skill-demo-uncounted',
                                            '</tpl>',
                                        '"',
                                    '>',
                                        '<tpl if="Override">',
                                            '<i class="fa fa-check"></i>',
                                        '<tpl else>',
                                            '{[fm.htmlEncode(Slate.cbl.util.Config.getAbbreviationForRating(values.DemonstratedLevel))]}',
                                        '</tpl>',
                                    '</li>',
                                    '{% if (values.Override) break; %}', // don't print any more blocks after override
                                '<tpl else>',
                                    '<li class="cbl-skill-demo cbl-skill-demo-uncounted">&nbsp;</li>',
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
                add: 'onStudentCompetencyAdd',
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
    onGridClick: function(ev, target) {
        var me = this,
            competenciesStore = me.getCompetenciesStore();

        target = Ext.get(target);

        if (target.is('.cbl-grid-progress-row')) { // eslint-disable-line no-cond-assign
            me.fireEvent(
                'competencyrowclick',
                me,
                {
                    targetEl: target,
                    competency: competenciesStore.getById(target.getAttribute('data-competency'))
                },
                ev
            );
        } else if (target.is('.cbl-skill-demo')) { // eslint-disable-line no-cond-assign
            me.fireEvent(
                'democellclick',
                me,
                {
                    blockEl: target,
                    cellEl: target.up('.cbl-grid-demos-cell'),
                    competency: competenciesStore.getById(target.up('.cbl-grid-skills-row').getAttribute('data-competency')),
                    skill: me.getSkillsStore().getById(target.up('.cbl-grid-skill-row').getAttribute('data-skill')),
                    student: me.getStudentsStore().getById(target.up('.cbl-grid-demos-cell').getAttribute('data-student')),
                    demonstrationId: parseInt(target.getAttribute('data-demonstration'), 10)
                },
                ev
            );
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

    onStudentCompetencyAdd: function(studentCompetenciesStore, studentCompetencies) {
        this.loadStudentCompetencies(studentCompetencies);
    },

    onStudentCompetencyUpdate: function(studentCompetenciesStore, studentCompetency, operation, modifiedFieldNames) {
        this.loadStudentCompetencies(studentCompetency, true);
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
            var competencySkills = competencyRenderData.skills = [],

                demonstrationsBodyEl = demonstrationsRowEl.down('tbody'),

                studentsStore = me.getStudentsStore(),
                studentsCount = studentsStore.getCount(), studentIndex, student,

                skillsCount = skillsCollection.getCount(), skillIndex, skill, skillId,

                skillRenderData, studentsRenderData, studentSkillRenderData, studentsById, skillRowEl, demonstrationsCellEl,
                node, level, studentCompetency, demonstrations;

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

                for (studentIndex = 0; studentIndex < studentsCount; studentIndex++) {
                    student = studentsStore.getAt(studentIndex);
                    node = competencyRenderData.studentsById[student.getId()];
                    level = node.maxLevel;

                    if (level) {
                        studentCompetency = node.studentCompetencies[level];
                        demonstrations = Ext.Array.clone(studentCompetency.get('effectiveDemonstrationsData')[skillId] || []);
                    } else {
                        studentCompetency = null;
                        demonstrations = [];
                    }

                    // fill demonstrations array with undefined items
                    demonstrations.length = skill.getTotalDemonstrationsRequired(level);

                    // format render data for skills sub-table
                    studentSkillRenderData = {
                        student: student.data,
                        studentCompetency: studentCompetency ? studentCompetency.data : null,
                        skill: skill,
                        demonstrations: demonstrations
                    };

                    // add to students array and table under competencyRenderData.skills[i]
                    studentsRenderData.push(studentSkillRenderData);
                    studentsById[student.getId()] = studentSkillRenderData;

                    // add to skills array at (competencyRenderData.students[i].skills
                    node.skills.push(studentSkillRenderData);
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
                    studentSkillRenderData = studentsRenderData[studentIndex];
                    studentSkillRenderData.demonstrationsCellEl = demonstrationsCellEl = skillRowEl.child('.cbl-grid-demos-cell[data-student="'+studentSkillRenderData.student.ID+'"]');
                    studentSkillRenderData.demonstrationsListEl = demonstrationsCellEl.down('.cbl-skill-demos');
                    studentSkillRenderData.demonstrationBlockEls = demonstrationsCellEl.select('.cbl-skill-demo', true);
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
            contentArea = me.getContentArea(),
            studentDashboardLink = location.pathname.match(/^\/Slate([A-Z][a-z]+)+\/$/) ? ('../SlateDemonstrationsStudent/' + location.search) : Slate.API.buildUrl('/cbl/dashboards/demonstrations/student'), // eslint-disable-line no-extra-parens

            students = me.getStudentsStore().getRange(),
            studentsLength = students.length, studentIndex, student,
            studentsData = [],

            competenciesStore = me.getCompetenciesStore(),
            competenciesLength = competenciesStore.getCount(), competencyIndex, competency, competencyNodes,
            competenciesData = [];


        // build array of students
        for (studentIndex = 0; studentIndex < studentsLength; studentIndex++) {
            student = students[studentIndex];
            studentsData.push({
                student: student.data,
                dashboardUrl: studentDashboardLink + '#' + student.get('Username') + '/' + contentArea.get('Code')
            });
        }


        // build array of competencies
        for (competencyIndex = 0; competencyIndex < competenciesLength; competencyIndex++) {
            competency = competenciesStore.getAt(competencyIndex);

            competenciesData.push({
                competency: competency.data,
                students: competencyNodes = []
            });

            for (studentIndex = 0; studentIndex < studentsLength; studentIndex++) {
                student = students[studentIndex];
                competencyNodes.push({
                    student: student.data,
                    competency: competency.data,
                    studentCompetencies: {},
                    skills: [],
                    maxLevel: null
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

            competencyNodes, studentsLength = renderData.students.length, studentIndex,
            studentRenderData, studentId;


        //
        // READ PHASE:
        //

        for (competencyIndex = 0; competencyIndex < competenciesLength; competencyIndex++) {
            competencyRenderData = competenciesRenderData[competencyIndex];
            competencyId = competencyRenderData.competency.ID;
            competencyNodes = competencyRenderData.students;
            studentsById = competencyRenderData.studentsById = {};
            competenciesById[competencyId] = competencyRenderData;

            competencySelector = '[data-competency="'+competencyId+'"]';
            competencyRenderData.progressRowEl = progressRowEl = studentsTableEl.down('.cbl-grid-progress-row' + competencySelector);
            competencyRenderData.skillsRowEl = competenciesTableEl.down('.cbl-grid-skills-row' + competencySelector);
            competencyRenderData.demonstrationsRowEl = studentsTableEl.down('.cbl-grid-skills-row' + competencySelector);

            for (studentIndex = 0; studentIndex < studentsLength; studentIndex++) {
                studentRenderData = competencyNodes[studentIndex];
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

    /* eslint-disable complexity, max-depth */
    /**
     * @protected
     * Reads one or more new or updated student competency models and apply them to the existing render
     *
     * @param {Slate.cbl.model.StudentCompetency/Slate.cbl.model.StudentCompetency[]} studentCompetencies A new or updated student competency model or array of models
     */
    loadStudentCompetencies: function(studentCompetencies, forceDirty) {
        studentCompetencies = Ext.isArray(studentCompetencies) ? studentCompetencies : [studentCompetencies];

        // eslint-disable-next-line vars-on-top
        var me = this,
            htmlEncode = Ext.util.Format.htmlEncode,
            competenciesById,

            studentCompetenciesLength = studentCompetencies.length,
            studentCompetencyIndex, studentCompetency, competencyId, competencyData, studentId, node, competency,

            dirtyNodes = [],
            dirtyNodesLength, dirtyNodeIndex,

            progressCellEl, count, average, level, effectiveDemonstrations, renderedLevel,
            countDirty, averageDirty, levelDirty,
            percentComplete, demonstrationsRequired,

            averageFormat = me.getAverageFormat(),
            progressFormat = me.getProgressFormat(),

            studentSkills, studentSkillsLength, studentSkillIndex, studentSkill, demonstrationsCellEl,
            skillId, skill, demonstrations, renderedDemonstrations, demonstrationBlockEls,
            demonstrationsLength, demonstrationIndex, demonstration,
            renderedDemonstrationsLength, renderedDemonstration, renderedDemonstrationRating, demonstrationBlockEl,
            demonstrationRating, demonstrationOverride, demonstrationId,
            demonstrationRatingDirty, demonstrationOverrideDirty,
            demonstrationHtml;


        if (!me.rendered) {
            me.on('afterrender', function() {
                me.loadStudentCompetencies(studentCompetencies);
            }, me, { single: true });
            return;
        }


        // reference competencies+students tree from main render tree
        competenciesById = me.getData().competenciesById;


        // pass 1: sort StudentCompetency records into competencies+students tree and queue those needing re-render
        for (studentCompetencyIndex = 0; studentCompetencyIndex < studentCompetenciesLength; studentCompetencyIndex++) {
            studentCompetency = studentCompetencies[studentCompetencyIndex];
            competencyId = studentCompetency.get('CompetencyID');
            competencyData = competenciesById[competencyId];

            // skip StudentCompetency if not found in loaded competencies
            if (!competencyData) {
                continue;
            }

            studentId = studentCompetency.get('StudentID');
            node = competencyData.studentsById[studentId];
            level = studentCompetency.get('Level');

            node.studentCompetencies[level] = studentCompetency;

            if (level > node.maxLevel || forceDirty) {
                node.maxLevel = level;
                node.dirty = true;
                dirtyNodes.push(node);
            }
        }


        // pass 2: update dirty nodes
        for (dirtyNodesLength = dirtyNodes.length, dirtyNodeIndex = 0; dirtyNodeIndex < dirtyNodesLength; dirtyNodeIndex++) {
            node = dirtyNodes[dirtyNodeIndex];
            competency = node.competency;


            // the same node could be in the queue more than once, but only needs to be processed once
            if (!node.dirty) {
                continue;
            }

            node.dirty = false;


            studentCompetency = node.studentCompetencies[node.maxLevel];
            progressCellEl = node.progressCellEl;

            count = studentCompetency.get('demonstrationsComplete');
            average = studentCompetency.get('demonstrationsAverage');
            level = studentCompetency.get('Level');
            effectiveDemonstrations = studentCompetency.get('effectiveDemonstrationsData');
            renderedLevel = node.renderedLevel;

            countDirty = count != node.renderedCount;
            averageDirty = average != node.renderedAverage;
            levelDirty = level != renderedLevel;
            demonstrationsRequired = competency.totalDemonstrationsRequired[level];
            if (typeof demonstrationsRequired == 'undefined') {
                demonstrationsRequired = competency.totalDemonstrationsRequired.default;
                if (typeof demonstrationsRequired == 'undefined') {
                    demonstrationsRequired = 1;
                }
            }

            if (countDirty || averageDirty) {
                percentComplete = demonstrationsRequired === 0 ? 100 : 100 * (count || 0) / demonstrationsRequired;
                progressCellEl.toggleCls('is-average-low', percentComplete >= 50 && average !== null && average < studentCompetency.get('minimumAverage')); // eslint-disable-line no-extra-parens
            }

            if (countDirty) {
                node.progressBarEl.setStyle('width', isNaN(percentComplete) ? '0' : Math.round(percentComplete) + '%');
                node.progressPercentEl.update(isNaN(percentComplete) ? '&mdash;' : progressFormat(percentComplete));

                node.renderedCount = count;
            }

            if (averageDirty) {
                node.progressAverageEl.update(averageFormat(average));

                node.renderedAverage = average;
            }

            if (levelDirty) {
                if (renderedLevel) {
                    progressCellEl.removeCls('cbl-level-'+renderedLevel);
                }

                progressCellEl.addCls('cbl-level-'+level);

                node.progressLevelEl
                    .set({ title: Slate.cbl.util.Config.getTitleForLevel(level) })
                    .update(htmlEncode(Slate.cbl.util.Config.getAbbreviationForLevel(level)));

                node.renderedLevel = level;
            }


            // loop through rendered skill rows (empty if not yet expanded) and update demonstration blocks
            studentSkills = node.skills;
            studentSkillsLength = studentSkills.length;
            studentSkillIndex = 0;

            for (; studentSkillIndex < studentSkillsLength; studentSkillIndex++) {
                studentSkill = studentSkills[studentSkillIndex];
                skill = studentSkill.skill;
                skillId = skill.getId();
                demonstrations = Ext.Array.clone(effectiveDemonstrations[skillId] || []); // TODO only use of skillId?

                if (levelDirty) {
                    demonstrationsCellEl = studentSkill.demonstrationsCellEl;

                    if (renderedLevel) {
                        demonstrationsCellEl.removeCls('cbl-level-'+renderedLevel);
                    }

                    demonstrationsCellEl.addCls('cbl-level-'+level);
                }

                // fill demonstrations array with undefined items
                demonstrationsLength = demonstrations.length = skill.getTotalDemonstrationsRequired(level);

                renderedDemonstrations = studentSkill.demonstrations;
                renderedDemonstrationsLength = renderedDemonstrations.length;
                demonstrationBlockEls = studentSkill.demonstrationBlockEls;

                demonstrationIndex = 0;
                for (; demonstrationIndex < demonstrationsLength; demonstrationIndex++) {
                    // gather information about incoming demonstration data
                    demonstration = demonstrations[demonstrationIndex];
                    demonstrationRating = demonstration ? demonstration.DemonstratedLevel : null;
                    demonstrationOverride = demonstration ? demonstration.Override : null;
                    demonstrationId = demonstration ? demonstration.DemonstrationID : null;

                    // gather information about previous render
                    if (demonstrationIndex <= renderedDemonstrationsLength) {
                        renderedDemonstration = renderedDemonstrations[demonstrationIndex];
                        renderedDemonstrationRating = renderedDemonstration ? renderedDemonstration.DemonstratedLevel : null;
                    } else {
                        renderedDemonstration = null;
                        renderedDemonstrationRating = null;
                    }

                    // get or create block element
                    demonstrationBlockEl = demonstrationBlockEls.item(demonstrationIndex);
                    if (!demonstrationBlockEl) {
                        demonstrationBlockEl = studentSkill.demonstrationsListEl.appendChild({
                            tag: 'li',
                            cls: 'cbl-skill-demo'
                        }, false);
                        demonstrationBlockEls.add(demonstrationBlockEl);
                    }

                    // detect changes from previous rendering
                    if (renderedDemonstration) {
                        demonstrationRatingDirty = renderedDemonstrationRating != demonstrationRating;
                        demonstrationOverrideDirty = renderedDemonstration.Override != demonstrationOverride;
                    } else {
                        demonstrationRatingDirty = true;
                        demonstrationOverrideDirty = true;
                    }


                    // update bits of infos
                    if (demonstrationRatingDirty || demonstrationOverrideDirty) {
                        // TODO: use a global template
                        if (demonstrationOverride) {
                            demonstrationHtml = '<i class="fa fa-check"></i>';
                        } else {
                            demonstrationHtml = htmlEncode(Slate.cbl.util.Config.getTitleForRating(demonstrationRating));
                        }

                        demonstrationBlockEl.update(demonstrationHtml);
                        demonstrationBlockEl.toggleCls('cbl-skill-demo-counted', Boolean(demonstrationRating || demonstrationOverride));
                    }

                    if (demonstrationRatingDirty) {
                        demonstrationBlockEl.toggleCls('cbl-skill-demo-missed', demonstrationRating === 0 && !demonstrationOverride);
                    }

                    if (demonstrationOverrideDirty) {
                        demonstrationBlockEl.toggleCls('cbl-skill-demo-override', demonstrationOverride);
                        demonstrationBlockEl.set({
                            'data-span': demonstrationOverride ? demonstrationsLength - demonstrationIndex : ''
                        });
                    }

                    if (!renderedDemonstration || renderedDemonstration.DemonstrationID != demonstrationId) {
                        demonstrationBlockEl.set({
                            'data-demonstration': demonstrationId || ''
                        });
                    }

                    // remove any existing subsequent blocks and skip rest of loop
                    if (demonstrationOverride || demonstrationIndex + 1 >= demonstrationsLength) {
                        while (demonstrationBlockEls.getCount() > demonstrationIndex + 1) {
                            demonstrationBlockEls.removeElement(demonstrationIndex + 1, true);
                        }
                        break;
                    }
                }

                // update reference for rendered demonstrations data to new data
                studentSkill.demonstrations = demonstrations;
            }
        }
    },
    /* eslint-enable complexity, max-depth */

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
    var monitoredMethods = ['refresh', 'finishRefresh', 'syncRowHeights', 'buildRenderData', 'loadStudentCompetencies'];

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
