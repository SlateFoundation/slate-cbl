/* jslint browser: true, undef: true, laxcomma:true *//* global Ext, Slate*/
/**
 * The Dashboard controller manages the main functionality of the SlateTasksTeacher application where teachers can
 * browse, search, create, edit, and assign tasks.
 *
 * ## Responsibilities
 * - Handle section/:sectionId route
 * - Handle CRUD operations for tasks/student tasks
 * - Filter StudentsGrid tasks/students by selected section
 */
Ext.define('SlateTasksTeacher.controller.Dashboard', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.window.Toast',
        'Ext.window.MessageBox'
    ],


    // dependencies
    views: [
        'Dashboard',
        'TaskEditor',
        'TaskRater',
        'TaskAssigner'
    ],
    stores: [
        'CourseSections',
        'Students',
        'StudentTasks',
        'Tasks'
    ],
    models: [
        'Task@Slate.cbl.model',
        'StudentTask@Slate.cbl.model',
        'Comment@Slate.cbl.model.tasks',
        'Demonstration@Slate.cbl.model'
    ],


    refs: {
        dashboardCt: {
            selector: 'slate-tasks-teacher-dashboard',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-dashboard'
        },
        tasksGrid: {
            selector: 'slate-studentsgrid',
            autoCreate: true,

            xtype: 'slate-studentsgrid'
        },
        taskAssigner: {
            selector: 'slate-tasks-teacher-taskassigner',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-taskassigner'
        },
        taskRater: {
            selector: 'slate-tasks-teacher-taskrater',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-taskrater'
        },
        taskEditor: {
            selector: 'slate-tasks-teacher-taskeditor',
            autoCreate: true,

            xtype: 'slate-tasks-teacher-taskeditor'
        },
        taskEditorForm: 'slate-tasks-teacher-taskeditor slate-modalform',
        skillsField: 'slate-tasks-teacher-taskeditor slate-skillsfield',
        commentsField: 'slate-tasks-teacher-taskrater slate-commentsfield',
        attachmentsField: 'slate-tasks-teacher-taskeditor slate-tasks-attachmentsfield',
        assignmentsField: 'slate-tasks-teacher-taskeditor slate-tasks-assignmentsfield',
        assignmentsComboField: 'slate-tasks-teacher-taskeditor slate-tasks-assignmentsfield combo',
        courseSelector: 'slate-tasks-teacher-appheader combo',
        acceptTaskBtn: 'slate-tasks-teacher-taskrater button[action=accept]',
        ratingView: 'slate-tasks-teacher-taskrater slate-ratingview',
        saveSkillsBtn: 'slate-tasks-teacher-taskrater #save-ratings-btn',
        resetSkillsBtn: 'slate-tasks-teacher-taskrater #reset-ratings-btn'
    },


    // entry points
    routes: {
        'section/:sectionId': {
            sectionId: '([a-zA-Z0-9])+',
            action: 'showCourseSection'
        }
    },

    control: {
        courseSelector: {
            select: 'onCourseSectionSelect'
        },
        dashboardCt: {
            coursesectionselect: 'onDashboardSectionChange'
        },
        tasksGrid: {
            cellclick: 'onTasksGridCellClick',
            subcellclick: 'onTasksGridCellClick',
            rowheaderclick: 'onTasksGridRowHeaderClick',
            subrowheaderclick: 'onTasksGridRowHeaderClick',
            beforeexpand: 'onBeforeRowHeaderToggle',
            beforecollapse: 'onBeforeRowHeaderToggle',
            columnheaderclick: 'onTasksGridColumnHeaderClick'
        },
        taskRater: {
            reassign: 'onReAssignStudentTaskClick'
        },
        assignmentsComboField: {
            render: 'onAssigneeComboRender'
        },
        commentsField: {
            publish: 'onCommentsFieldPublish'
        },

        acceptTaskBtn: {
            click: 'onAcceptTaskClick'
        },
        'slate-tasks-teacher-taskrater button[action=reassign]': {
            click: 'onAssignRevisionClick'
        },
        'slate-tasks-teacher-taskrater button[action=unassign]': {
            click: 'onUnassignStudentTaskClick'
        },
        'slate-tasks-teacher-taskrater button[action=edit]': {
            click: 'onEditStudentTaskClick'
        },
        'slate-tasks-teacher-taskrater slate-ratingview': {
            rateskill: 'onRateSkillClick'
        },
        'slate-tasks-teacher-taskassigner button[action=assign]': {
            click: 'onAssignTaskClick'
        },
        'slate-tasks-teacher-taskeditor button[action=save]': {
            click: 'onSaveTaskClick'
        },
        'slate-tasks-teacher-appheader button[action=create]': {
            click: 'onCreateTaskClick'
        },
        'slate-tasks-teacher-taskeditor slate-tasks-titlefield[clonable]': {
            select: 'onClonableTitleFieldSelect'
        },
        saveSkillsBtn: {
            click: 'onSaveRatingsClick'
        },
        resetSkillsBtn: {
            click: 'onResetSkillRatingsClick'
        }
    },


    // controller templates method overrides
    onLaunch: function () {
        this.getDashboardCt().render('slateapp-viewport');
    },

    // route handlers
    showCourseSection: function(sectionCode) {
        var me = this,
            courseSelector = me.getCourseSelector(),
            courseSectionsStore = courseSelector.getStore(),
            studentsStore = me.getStudentsStore(),
            tasksStore = me.getTasksStore(),
            studentTasksStore = me.getStudentTasksStore(),
            courseSection = courseSectionsStore.findRecord('Code', sectionCode);

        // select section
        if (!courseSection && courseSectionsStore.isLoaded()) {
            Ext.Msg.alert('Error', 'Course Section not found.');
            return;
        } else if (!courseSectionsStore.isLoaded()) {
            courseSectionsStore.load(function() {
                me.showCourseSection(sectionCode);
            });
            return;
        }
        if (!me.getDashboardCt().getCourseSection() || me.getDashboardCt().getCourseSection().getId() != sectionCode) {
            me.getDashboardCt().setCourseSection(courseSection);
        }
        courseSelector.setValue(courseSectionsStore.findRecord('Code', sectionCode));

        // update store urls
        studentsStore.setCourseSection(sectionCode).load();
        tasksStore.setCourseSection(sectionCode).load();
        studentTasksStore.setCourseSection(sectionCode).load();
    },

    // event handlers
    onCourseSectionSelect: function(combo, record) {
        var me = this;

        me.getDashboardCt().setCourseSection(record);
    },

    onDashboardSectionChange: function(dashboardView, record) {
        this.redirectTo('section/'+record.get('Code'));
    },

    onTasksGridCellClick: function(grid, taskId, studentId) {
        var me = this,
            dataStore = grid.getDataStore(),
            studentTask = dataStore.getAt(dataStore.findBy(function(r) {
                return r.get('TaskID') == taskId && r.get('StudentID') == studentId;
            }));

        if (studentTask) {
            return me.doRateStudentTask(studentTask);
        }

        return me.doAssignStudentTask(taskId, studentId);
    },

    onReAssignStudentTaskClick: function(taskRater, dateField, date) {
        var studentTask = taskRater.getStudentTask();

        studentTask.set({
            DueDate: date,
            TaskStatus: 're-assigned'
        });

        studentTask.save({
            success: function(rec) {
                taskRater.updateStudentTask(rec);
                dateField.setValue('');
            }
        });
    },

    onTasksGridRowHeaderClick: function(grid, rowId, el, ev) {
        var me = this,
            task;

        if (ev.getTarget('.jarvus-aggregrid-rowheader .edit-row')) {
            task = me.getTasksStore().getById(rowId);

            me.doEditTask(task);
        }

        return;
    },

    onTasksGridColumnHeaderClick: function(grid, columnId, el, ev) {
        var me = this,
            courseSection,
            student;

        if (ev.getTarget('.jarvus-aggregrid-colheader')) {
            student = me.getStudentsStore().getById(columnId);
            courseSection = me.getDashboardCt().getCourseSection();

            window.open(Slate.API.buildUrl('/cbl/dashboards/tasks/student')+'?student='+student.get('Username')+'&course_section='+courseSection.get('Code'), '_blank');
        }
    },

    onBeforeRowHeaderToggle: function(grid, rowId, el, ev) {
        if (ev.getTarget('.jarvus-aggregrid-rowheader .edit-row')) {
            return false;
        }
        return null;
    },

    onAssigneeComboRender: function(combo) {
        var me = this,
            comboStore = combo.getStore(),
            studentsStore = me.getStudentsStore();

        comboStore.removeAll();
        comboStore.add(studentsStore.getRange());
        combo.setValueOnData();
    },

    onCommentsFieldPublish: function(fieldContainer, field) {
        var me = this,
            record = fieldContainer.getRecord(),
            comment,
            originalComments = record.get('Comments') || [];

        comment = me.getCommentModel().create({
            Message: field.getValue(),
            ContextID: record.getId(),
            ContextClass: record.get('Class')
        });

        comment.save({
            success: function(rec) {
                originalComments.push(rec.getData({ serialize: true }));
                record.set('Comments', originalComments);
                fieldContainer.updateRecord(record);
                field.setValue('');
            }
        });
    },

    onAcceptTaskClick: function() {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask(),
            status = studentTask.get('TaskStatus') === 'completed' ? 're-assigned' : 'completed';

        studentTask.set('TaskStatus', status);

        me.doSaveStudentTask(studentTask, function(rec, request, success) {
            if (success) {
                taskRater.close();
                me.getStudentTasksStore().load({
                    id: studentTask.getId(),
                    addRecords: true
                });

                if (status === 're-assigned') {
                    me.doRateStudentTask(rec);
                }
            }
        });
    },

    onAssignRevisionClick: function(btn) {
        var me = this,
            coords = btn.getXY(),
            datepicker;

        if (btn.dateSelected) {
            me.doAssignStudentTaskRevision(btn.dateSelected);
        } else {
            datepicker = Ext.widget({
                xtype: 'datepicker',
                floating: true,
                handler: function(picker, date) {
                    picker.destroy();
                    btn.dateSelected = date;
                    return btn.setText('Re-Assign revision due on '+Ext.Date.format(date, 'm/d/y'));
                }
            });
            datepicker.show().showAt(coords[0], coords[1] - datepicker.getHeight()); // subtract datepicker height from y coord to show above button.
        }
    },

    onUnassignStudentTaskClick: function() {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask();

        Ext.Msg.confirm('Are you sure?', 'Do you want to unassign this student task? This can not be undone.', function(ans) {
            if (ans === 'yes') {
                me.doUnAssignStudentTask(studentTask);
            }
        });

    },

    onEditStudentTaskClick: function() {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask();

        taskRater.close();
        me.doEditStudentTask(studentTask);
    },

    onResetSkillRatingsClick: function(btn) {
        var me = this,
            ratingView = me.getRatingView(),
            taskRater = me.getTaskRater(),
            demonstration = taskRater.getDemonstration(),
            demonstrationSkills = demonstration.get('Skills'),
            defaultRatings = ratingView.getDefaultRatings(),
            i = 0;

        for (; i < demonstrationSkills.length; i++) {
            demonstrationSkills[i].DemonstratedLevel = defaultRatings[demonstrationSkills[i].SkillID];
        }

        ratingView.setDemonstrationSkills(demonstrationSkills);
        me.toggleRatingViewButtons();

    },

    onRateSkillClick: function(ratingView, ratingObject) {
        var me = this,
            demonstration = me.getTaskRater().getDemonstration(),
            indexedDemonstrationSkills = ratingView.getDemonstrationSkills(),
            skills = ratingView.getSkills(),
            skill, i = 0;

        if (indexedDemonstrationSkills.hasOwnProperty(ratingObject.SkillID)) {
            // remove rating, if exists
            if (ratingObject.rating === null) {
                delete indexedDemonstrationSkills[ratingObject.SkillID];
            } else {
                indexedDemonstrationSkills[ratingObject.SkillID].DemonstratedLevel = ratingObject.rating; // isNaN(ratingObject.rating) ? 0 : ratingObject.rating;
            }
        } else if (ratingObject.rating !== null) {
            for (; i < skills.length; i++) {
                if (skills[i].ID == ratingObject.SkillID) {
                    skill = skills[i];
                    break;
                }
            }

            indexedDemonstrationSkills[skill.ID] = {
                SkillID: ratingObject.SkillID,
                DemonstratedLevel: ratingObject.rating,
                TargetLevel: skill.currentLevel
            };

            if (!demonstration.phantom) {
                indexedDemonstrationSkills[skill.ID]['DemonstrationID'] = demonstration.getId();
            }
        }

        ratingView.setDemonstrationSkills(Object.values(indexedDemonstrationSkills));
        me.toggleRatingViewButtons();
    },

    onSaveRatingsClick: function() {
        return this.doSaveRatings();
    },

    doSaveRatings: function() {
        var me = this,
            taskRater = me.getTaskRater(),
            ratingView = me.getRatingView(),
            saveSkillsBtn = me.getSaveSkillsBtn(),
            resetSkillsBtn = me.getResetSkillsBtn(),
            demonstration = taskRater.getDemonstration(),
            demonstrationSkills = ratingView.getDemonstrationSkills(),
            i = 0,
            _onDemonstrationSave, _onDemonstrationSaveFailure;

        _onDemonstrationSave = function(savedDemonstration) {
            taskRater.updateDemonstration(savedDemonstration);
            me.toggleRatingViewButtons();
            ratingView.setLoading(false);
        };

        _onDemonstrationSaveFailure = function() {
            me.toggleRatingViewButtons();
        };

        demonstration.set('Skills', Object.values(demonstrationSkills));

        saveSkillsBtn.disable();
        resetSkillsBtn.disable();
        ratingView.setLoading({
            msg: 'Saving Ratings&hellip;'
        });

        // check if ratings will promote any competency levels
        Slate.API.request({
            url: '/cbl/dashboards/tasks/teacher/confirm-promotion',
            jsonData: {
                studentTaskId: taskRater.getStudentTask().getId(),
                'Skills': Object.values(demonstrationSkills)
            },
            callback: function(operation, success, request) {
                var promotableCompetencies = '';

                if (request.data.data.length) {
                    for (i = 0; i < request.data.data.length; i++) {
                        promotableCompetencies += '<strong>' + request.data.data[i].Code + '</strong>: ' + request.data.data[i].Descriptor + '<br>';
                    }
                    Ext.Msg.confirm('Warning', 'Student would be promoted for the following competencies: <br>' + promotableCompetencies, function(ans) {
                        if (ans === 'yes') {
                            demonstration.save({
                                success: _onDemonstrationSave,
                                failure: _onDemonstrationSaveFailure
                            });
                        } else {
                            ratingView.setLoading(false);
                            me.toggleRatingViewButtons();
                        }
                    });
                    return;
                }

                demonstration.save({
                    success: _onDemonstrationSave,
                    failure: _onDemonstrationSaveFailure
                });
            }
        });

    },

    onAssignTaskClick: function() {
        var me = this,
            taskAssigner = me.getTaskAssigner(),
            taskAssignerValues = taskAssigner.down('slate-modalform').getValues(),
            task = taskAssigner.getTask(),
            student = taskAssigner.getStudent(),
            studentTask = me.getStudentTaskModel().create({
                TaskID: task.getId(),
                Task: task.getData(),
                StudentID: student.getId(),
                Student: student.getData(),
                DueDate: taskAssignerValues.DueDate,
                ExpirationDate: taskAssignerValues.ExpirationDate,
                ExperienceType: taskAssignerValues.ExperienceType,
                SectionID: me.getCourseSelector().getSelection().getId()
            });

        me.doSaveStudentTask(studentTask, function(rec, request, success) {
            if (success) {
                taskAssigner.close();
                me.getStudentTasksStore().load({
                    id: studentTask.getId(),
                    addRecords: true
                });
                Ext.toast(student.getFullName() + ' was assigned task: ' + task.get('Title'));
            }
        });

    },

    onSaveTaskClick: function() {
        var me = this,
            taskEditor = me.getTaskEditor(),
            task = taskEditor.getTask(),
            studentTask = taskEditor.getStudentTask();

        if (studentTask) {
            me.getTaskEditorForm().updateRecord(studentTask);
            studentTask.set('SkillIDs', me.getSkillsField().getSkills(false, true)); // returnRecords, idsOnly
            return me.doSaveStudentTask(studentTask, function(rec, request, success) {
                if (success) {
                    me.getStudentTasksStore().load({
                        id: studentTask.getId(),
                        addRecords: true
                    });
                    taskEditor.close();
                    Ext.toast('Student task successfully updated.');
                }
            });
        }

        if (!task.phantom && task.getAssigneeIds().length) {
            return me.doConfirmTaskAssignees(task);
        }

        return me.doSaveTask();

    },

    onCreateTaskClick: function() {
        var me = this;

        me.getTaskEditor().close();
        return me.doEditTask();
    },

    onClonableTitleFieldSelect: function(combo) {
        var me = this,
            record = combo.getSelectedRecord(),
            title = 'New Task',
            message = 'Do you want to clone this task?<br><strong>' + record.get('Title') + '</strong>';

        Ext.Msg.confirm(title, message, function(btnId) {
            if (btnId === 'yes') {
                me.doCloneTask(record);
            }
        });
    },


    // custom methods
    doAssignStudentTaskRevision: function(date) {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask();

        studentTask.set('DueDate', date.getTime()/1000);
        studentTask.set('TaskStatus', 're-assigned');
        studentTask.save({
            callback: function() {
                taskRater.close();
                Ext.toast('Student task successfully updated.');
                me.doRateStudentTask(studentTask);
            }
        });
    },

    doUnAssignStudentTask: function(studentTask) {
        var me = this;

        studentTask.erase({
            callback: function(opts, success) {
                if (success) {
                    Ext.toast('Student task unassigned.');
                    me.getTaskRater().close();
                }
            }
        });
    },

    doSaveStudentTask: function(studentTask, callback, scope) {
        studentTask.save({
            callback: function(record, request, success) {
                var message = [],
                    response = request.getResponse().data,
                    validationErrors, key;

                if (!success) {
                    message.push(
                        '<p>',
                        'Unable to save task.',
                        '</p>'
                    );

                    if (response.failed && response.failed.length) {
                        validationErrors = response.failed[0].validationErrors;

                        for (key in validationErrors) {
                            if (validationErrors.hasOwnProperty(key)) {
                                message.push(
                                    '<p>',
                                    validationErrors[key],
                                    '</p>'
                                );
                            }
                        }
                        record.reject();
                        Ext.Msg.alert('Error', message.join(' '));
                    }
                }
                Ext.callback(callback, scope, arguments);
            }
        });
    },

    doSaveTask: function(forceReload) {
        var me = this,
            form = me.getTaskEditorForm(),
            skillsField = me.getSkillsField(),
            attachmentsField = me.getAttachmentsField(),
            assignmentsField = me.getAssignmentsField(),
            courseSection = me.getCourseSelector().getSelection(),
            record = form.updateRecord().getRecord(),
            wasPhantom = record.phantom,
            currentAssignees = assignmentsField.getAssignees(false),
            errors;

        record.set({
            Skills: skillsField.getSkills(false), // returnRecords
            Attachments: attachmentsField.getAttachments(false), // returnRecords
            Assignees: currentAssignees, // returnRecords
            SectionID: courseSection.getId()
        });

        errors = record.validate();

        if (errors.length) {
            Ext.each(errors.items, function(item) {
                var itemField = form.down('[name='+item.field +']');

                if (itemField) {
                    itemField.markInvalid(item.message);
                }
            });
            return;
        }

        record.save({
            success: function(rec) {
                me.getTaskEditor().close();

                if (wasPhantom) {
                    me.getTasksStore().add(rec);
                }
                // reload studenttasks, as new records may exist
                if (forceReload === true || wasPhantom) {
                    setTimeout(function() {
                        me.getStudentTasksStore().reload();
                        // reload record to ensure relationships are included.
                        // todo: remove this when API removes the need
                        rec.load();
                    }, 1000);
                }
                Ext.toast('Task succesfully saved!');
            }
        });
    },

    doConfirmTaskAssignees: function(task) {
        var me = this,
            assigneeIds = me.getAssignmentsField().getAssignees(false);

        Slate.API.request({
            url: task.toUrl() + '/assignees',
            callback: function(request, success, response) {
                var assigned = response.data.data,
                    unassigned = [],
                    i = 0,
                    message = 'Completing this action would result in un-assigning these students:';

                for (; i < assigned.length; i++) {
                    if (assigneeIds.indexOf(parseInt(assigned[i].ID, 10)) === -1) {
                        unassigned.push(assigned[i]);
                    }
                }

                if (unassigned.length) {
                    i = 0;
                    for (; i < unassigned.length; i++) {
                        message += '<br> ' + unassigned[i].FirstName + ' ' + unassigned[i].LastName;
                    }
                    message += '<br> Would you like to continue?';
                    Ext.Msg.confirm('Task Assignments', message, function(ans) {
                        if (ans === 'yes') {
                            me.doSaveTask(true);
                        }
                    });
                    return;
                }

                me.doSaveTask(true);
            }
        });
    },

    doEditStudentTask: function(studentTask) {
        var me = this,
            grid = me.getTasksGrid(),
            taskEditor = me.getTaskEditor(),
            task = grid.getRowsStore().getById(studentTask.get('TaskID'));

        if (!task || !studentTask) { // is this likely?
            Ext.Msg.error('Error', 'Unable to find task. Please refresh the page and try again.'); // is this optimal?
            return;
        }

        taskEditor.setTask(task);
        taskEditor.setStudentTask(studentTask);
        taskEditor.show();
    },

    doEditTask: function(taskRecord) {
        var me = this,
            taskEditor = me.getTaskEditor();

        if (!taskRecord) {
            taskRecord = me.getTaskModel().create();
        }

        taskEditor.setTask(taskRecord);
        taskEditor.setStudentTask(null);
        taskEditor.show();
    },

    doRateStudentTask: function(studentTask) {
        var me = this,
            taskRater = me.getTaskRater(),
            task = me.getTasksStore().getById(studentTask.get('TaskID')),
            courseSection = me.getDashboardCt().getCourseSection(),
            demonstrationModel = me.getDemonstrationModel(),
            readOnly = studentTask.get('TaskStatus') === 'completed',
            acceptTaskBtn;

        // handle failure
        if (!task) {
            // how can this fail?
            Ext.Msg.alert('Task not found. Please refresh.');
            return;
        }

        if (readOnly) {
            acceptTaskBtn = me.getAcceptTaskBtn();
            acceptTaskBtn.setDisabled(false);
            acceptTaskBtn.setText('UnAccept Task');
        }

        // load demonstration for ratings
        if (studentTask.get('DemonstrationID')) {
            demonstrationModel.load(studentTask.get('DemonstrationID'), {
                callback: function(record) {
                    taskRater.setDemonstration(record);
                }
            });
        } else {
            taskRater.setDemonstration(demonstrationModel.create({
                'StudentID': studentTask.get('StudentID'),
                'ExperienceType': studentTask.get('ExperienceType'),
                'PerformanceType': task.get('Title'),
                'Context': courseSection.get('Title')
            }));
        }

        taskRater.setTask(task);
        taskRater.setStudentTask(studentTask);
        taskRater.setReadOnly(readOnly);
        taskRater.show();

        // load skills with completion data
        Slate.API.request({
            method: 'GET',
            url: '/cbl/dashboards/tasks/teacher/skill-completions',
            params: {
                studentTaskId: studentTask.getId()
            },
            success: function(request) {
                var i = 0;

                if (request.data.skills && Ext.isArray(request.data.skills)) {
                    me.getRatingView().setSkills(request.data.skills);
                }
            }
        })
    },

    toggleRatingViewButtons: function() {
        var me = this,
            ratingView = me.getRatingView(),
            indexedDemonstrationSkills = ratingView.getDemonstrationSkills(),
            defaultRatings = ratingView.getDefaultRatings(),
            saveSkillsBtn = me.getSaveSkillsBtn(),
            resetSkillsBtn = me.getResetSkillsBtn(),
            ratingsDirty = false,
            key;

        for (key in indexedDemonstrationSkills) {
            if (!defaultRatings.hasOwnProperty(key)) {
                ratingsDirty = true;
                break;
            } else if (defaultRatings[key] != indexedDemonstrationSkills[key].DemonstratedLevel) {
                ratingsDirty = true;
                break;
            }
        }

        // check if skill ratings are dirty.
        if (ratingsDirty) {
            saveSkillsBtn.enable();
            resetSkillsBtn.enable();
        } else {
            saveSkillsBtn.disable();
            resetSkillsBtn.disable();
        }
    },

    doAssignStudentTask: function(taskId, studentId) {
        var me = this,
            taskAssigner = me.getTaskAssigner(),
            student = me.getStudentsStore().getById(studentId),
            task = me.getTasksStore().getById(taskId);

        if (!task) {
            // handle failure / how can this fail?
            Ext.Msg.alert('Task not found. Please refresh.');
            return;
        }

        taskAssigner.setStudent(student);
        taskAssigner.setTask(task);
        taskAssigner.show();
    },

    doCloneTask: function(taskRecord) {
        var me = this,
            taskCopy = taskRecord.copy(null),
            copiedAttachments = taskCopy.get('Attachments'),
            attachments = [],
            i = 0;


        for (; i < copiedAttachments.length; i++) {
            attachments.push(Ext.apply(copiedAttachments[i], {
                ID: null,
                ContextID: null,
                ContextClass: null
            }));
        }

        taskCopy.set({
            Title: taskCopy.get('Title') + ' Clone',
            Attachments: attachments
        });

        me.doEditTask(taskCopy);
    }
});