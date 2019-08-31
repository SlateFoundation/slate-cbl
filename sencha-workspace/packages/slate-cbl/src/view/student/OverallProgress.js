/**
 * A static mockup for a view that shows a student's progress across
 * all content areas.
 *
 * Not currently implemented
 */
Ext.define('Slate.cbl.view.student.OverallProgress', {
    extend: 'Ext.Component',
    xtype: 'slate-cbl-student-overallprogress',
    requires:[
    ],

    config: {
    },

    componentCls: 'slate-cbl-student-overallprogress',

    data: [
        {
            title: 'Overall Progress',
            segments: [
                {
                    level: 'overall',
                    complete: (1/3)
                }
            ]
        },
        {
            title: 'ELA',
            segments: [
                {
                    level: 9,
                    complete: 1
                },
                {
                    level: 10,
                    complete: (2/5)
                },
                {
                    level: 11,
                    complete: (1/4)
                },
                {
                    level: 12,
                    complete: (1/5)
                }
            ]
        },
        {
            title: 'Science',
            segments: [
                {
                    level: 9,
                    complete: 1
                },
                {
                    level: 10,
                    complete: 1
                },
                {
                    level: 11,
                    complete: (2/5)
                }
            ]
        },
        {
            title: 'Social Studies',
            segments: [
                {
                    level: 9,
                    complete: 1
                },
                {
                    level: 10,
                    complete: (3/4)
                },
                {
                    level: 11,
                    complete: (1/2)
                },
                {
                    level: 12,
                    complete: 0
                }
            ]
        }
    ],

    tpl: [
        '<div class="slate-cbl-sutdent-overallprogress-cursor"></div>',

        '<ul class="slate-cbl-student-overallprogress-courses">',
            '<tpl for=".">',
                '<li class="slate-cbl-student-overallprogress-course">',
                    '<h4 class="slate-cbl-student-overallprogress-course-title">{title}</h4>',
                    '<div class="slate-progress-meter-stack">',
                        '<tpl for="segments">',
                            '<div class="slate-progress-meter slate-progress-color-{level}">',
                                '<div class="slate-progress-bar" style="width: {[ 100 * values.complete ]}%"></div>',
                            '</div>',
                        '</tpl>',
                    '</div>',
                '</li>',
            '</tpl>',
        '</ul>'
    ]
});