/**
 * A static mockup for a view that shows a student's recently completed
 * tasks.
 *
 * Not currently implemented
 *
 * TODO:
 * - [ ] move into SlateTasksStudent app
 */
Ext.define('Slate.cbl.view.student.TaskHistory', {
    extend: 'Slate.ui.SimplePanel',
    xtype: 'slate-taskhistory',


    title: 'Past English Tasks',
    cls: 'slate-taskhistory',

    data: {
        tasks: [
            {
                title: 'Task title w/o subtasks',
                // TODO double-check what the colors in design are meant to indicate
                skills: {
                    'on-level': 4,
                    'off-level': 2
                },
                date: 'June 10'
            },
            {
                title: 'Task w/ subtasks',
                skills: {
                    'on-level': 3,
                    'off-level': 1
                },
                date: 'June 6',
                subtasks: [
                    {
                        title: 'Subtask lab report',
                        skills: {
                            'on-level': 7
                        },
                        date: 'June 1'
                    }
                ]
            },
            {
                title: 'Task w/ subtasks',
                skills: {
                    incomplete: 6
                },
                date: 'May 27',
                subtasks: [
                    {
                        title: 'Subtask lab report',
                        skills: {
                            'incomplete': 6
                        },
                        date: 'May 10'
                    }
                ]
            }
        ]
    },

    tpl: [
        '<table class="slate-taskhistory-table">',
            '<thead>',
                '<tr>',
                    '<th>Task</th>',
                    '<th class="text-center">Skills On Level</th>',
                    '<th class="text-center">Submitted Date</th>',
                '</tr>',
            '</thead>',

            '<tbody>',
                '<tpl for="tasks">',
                    // TODO wire collapsing
                    '<tr class="slate-taskhistory-row <tpl if="subtasks">is-expandable</tpl>">',
                        '<td class="slate-taskhistory-cell">',
                            '<span class="slate-taskhistory-taskbullet"></span>',
                            '<span class="slate-taskhistory-tasktitle">{title}</span>',
                        '</td>',

                        '<td class="slate-taskhistory-cell slate-taskhistory-skills-cell text-center">',
                            '<tpl foreach="skills">',
                                '{[ this.printSomeIndicators(values, xkey) ]}',
                            '</tpl>',
                            '<div class="slate-taskhistory-skills-overlay"><span class="slate-taskhistory-skills-caption">{[ this.printOverlayString(values.skills) ]}</span></div>',
                        '</td>',

                        '<td class="slate-taskhistory-cell text-center">',
                            '{date}',
                        '</td>',
                    '</tr>',

                    '<tpl if="subtasks">',
                        '<tr class="slate-taskhistory-row">',
                            '<td class="slate-taskhistory-subrow-cell" colspan="3">',
                                '<div class="slate-taskhistory-subrow-ct">',
                                    '<table class="slate-taskhistory-subrow-table">',
                                        '<tbody>',
                                            '<tpl foreach="subtasks">',
                                                '<tr class="slate-taskhistory-subrow <tpl if="subtasks"><tpl else>is-standalone</tpl>">',
                                                    '<td class="slate-taskhistory-cell">',
                                                        '<span class="slate-taskhistory-taskbullet"></span>',
                                                        '<span class="slate-taskhistory-tasktitle">{title}</span>',
                                                    '</td>',

                                                    '<td class="slate-taskhistory-cell slate-taskhistory-skills-cell text-center">',
                                                        '<tpl foreach="skills">',
                                                            '{[ this.printSomeIndicators(values, xkey) ]}',
                                                        '</tpl>',
                                                        '<div class="slate-taskhistory-skills-overlay"><span class="slate-taskhistory-skills-caption">{[ this.printOverlayString(values.skills) ]}</span></div>',
                                                    '</td>',

                                                    '<td class="slate-taskhistory-cell text-center">',
                                                        '{date}',
                                                    '</td>',
                                                '</tr>',
                                            '</tpl>',
                                        '</tbody>',
                                    '</table>',
                                '</div>',
                            '</td>',
                        '</tr>',
                    '</tpl>',
                '</tpl>',
            '</tbody>',
        '</table>',

        {
            printSomeIndicators: function(n, status) {
                var i = 0,
                    html = '';

                for (; i < n; i++) {
                    html += '<span class="slate-taskhistory-skillindicator status-' + status + '"><i class="fa fa-check"></i></span> ';
                }

                return html;
            },

            printOverlayString: function(skills) {
                var on          = skills['on-level'] || 0,
                    off         = skills['off-level'] || 0,
                    incomplete  = skills['incomplete'] || 0,
                    total       = on + off + incomplete,
                    html        = '';

                if (on || off) {
                    html += on + '/' + total + ' on level';
                }

                if (incomplete && (on || off)) {
                    html += ', ';
                }

                if (incomplete) {
                    html += incomplete + '/' + total + ' incomplete'
                }

                return html;
            }
        }
    ],

    listeners: {
        scope: 'this',
        click: {
            fn: 'onExpandClick',
            element: 'el',
            delegate: '.is-expandable .slate-taskhistory-taskbullet'
        }
    },

    onExpandClick: function(ev, t) {
        var target = Ext.get(t),
            row;

        if (target.is('.slate-taskhistory-taskbullet')) {
            row = target.up('.slate-taskhistory-row');

            row.toggleCls('is-expanded');
        }
    }
});