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
        'Comment@Slate.cbl.model.tasks'
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

        courseSelector: 'slate-tasks-teacher-appheader combo'
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
            subcellclick: 'onTasksGridCellClick'
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

        'slate-tasks-teacher-taskrater button[action=accept]': {
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
            return me.doRateStudentTask(studentTask, studentTask.get('TaskStatus') === 'completed'); // studentTask, readOnly
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
            studentTask = taskRater.getStudentTask();

        studentTask.set('TaskStatus', 'completed');

        me.doSaveStudentTask(studentTask, function() {
            taskRater.close();
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

    onRateSkillClick: function(ratingView, ratingObject) {
        var me = this,
            taskRater = me.getTaskRater(),
            studentTask = taskRater.getStudentTask();

        Slate.API.request({
            url: studentTask.toUrl() + '/rate',
            method: 'POST',
            params: {
                SkillID: ratingObject.SkillID,
                Score: ratingObject.rating
            },
            callback: function(opts, success) {
                if (!success) {
                    Ext.toast('Error. Please try again.');
                }
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
                StudentID: student.getId(),
                DueDate: taskAssignerValues.DueDate,
                ExpirationDate: taskAssignerValues.ExpirationDate,
                ExperienceType: taskAssignerValues.ExperienceType,
                CourseSectionID: me.getCourseSelector().getSelection().getId()
            });

        me.doSaveStudentTask(studentTask, function(rec) {
            taskAssigner.close();
            me.getTasksGrid().getDataStore().add(rec);
            Ext.toast(student.getFullName() + ' was assigned task: ' + task.get('Title'));
        });

    },

    onSaveTaskClick: function() {
        var me = this,
            taskEditor = me.getTaskEditor(),
            studentTask = taskEditor.getStudentTask();

        if (studentTask) {
            me.getTaskEditorForm().updateRecord(studentTask);

            return me.doSaveStudentTask(studentTask, function() {
                taskEditor.close();
                Ext.toast('Student task successfully updated.');
            });
        }

        return me.doSaveTask();
    },

    onCreateTaskClick: function() {
        var me = this;

        me.getTaskEditor().close();
        return me.doEditTask();
    },

    onSubCellRepainted: function(row, grid, rowId) {
        var me = this;

        if (rowId === row.getId()) {
            grid.syncExpanderHeight(row.getId());
            grid.un('repaintsubcells', me.onSubCellRepainted, me);
        }
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
            success: function(rec) {
                Ext.callback(callback, scope, [rec]);
            }
        });
    },

    doSaveTask: function() {
        var me = this,
            form = me.getTaskEditorForm(),
            skillsField = me.getSkillsField(),
            attachmentsField = me.getAttachmentsField(),
            assignmentsField = me.getAssignmentsField(),
            courseSection = me.getCourseSelector().getSelection(),
            record = form.updateRecord().getRecord(),
            wasPhantom = record.phantom,
            tasksGrid = me.getTasksGrid(),
            errors, row;

        record.set({
            Skills: skillsField.getSkills(false), // returnRecords
            Attachments: attachmentsField.getAttachments(false), // returnRecords
            Assignees: assignmentsField.getAssignees(false), // returnRecords
            CourseSectionID: courseSection.getId()
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
                    // Resize a row when it's children have updated.
                    if ((row = tasksGrid.rollupRows[rec.getId()]) || (row = tasksGrid.subRowParents[rec.getId()])) {
                        tasksGrid.on('repaintsubcells', me.onSubCellRepainted, me, { args: [row] });
                    }
                    // reload studenttasks, as new records may exist
                    me.getStudentTasksStore().reload();
                }
                Ext.toast('Task succesfully saved!');
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

    doRateStudentTask: function(studentTask, readOnly) {
        var me = this,
            taskRater = me.getTaskRater(),
            task = me.getTasksStore().getById(studentTask.get('TaskID'));

        // handle failure
        if (!task) {
            // how can this fail?
            Ext.Msg.alert('Task not found. Please refresh.');
            return;
        }

        taskRater.setTask(task);
        taskRater.setStudentTask(studentTask);
        taskRater.setReadOnly(readOnly);

        taskRater.show();
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
    }
});