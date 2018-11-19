/**
 * A static mockup for a view that shows a student's
 * recently activity
 *
 * Not currently implemented
 */
Ext.define('SlateTasksStudent.view.RecentActivity', {
    extend: 'Ext.window.Window',
    xtype: 'slate-tasks-student-recentactivity',
    requires:[
    ],

    title: 'Recent Activity',

    componentCls: 'slate-recentactivity',

    closable: false,
    closeAction: 'hide',

    data: [
        {
            date: '1/10',
            title: 'Senior Thesis Project Synopsis',
            context: 'English',
            skills: [
                {
                    level: 10,
                    title: 'Cite evidence'
                },
                {
                    level: 10,
                    title: 'Use evidence to develop claims and counterclaims'
                },
                {
                    level: 10,
                    title: 'Identify central idea'
                }
            ]
        },
        {
            date: '12/20',
            title: 'Position Paper',
            context: 'C. Kunkel',
            skills: [
                {
                    level: 9,
                    title: 'Identify central theme/ideas'
                },
                {

                    level: 9,
                    title: 'Analyze developments'
                },
                {

                    level: 9,
                    title: 'Interpret words and phrases'
                },
                {

                    level: 9,
                    title: 'Assess point of view'
                }
            ]
        },
        {
            status: 'due',
            date: '12/20',
            title: 'Submitted Gravity Lab Report',
            context: 'Science'
        },
        {
            status: 'revision',
            date: '12/20',
            title: 'Submitted Gravity Lab Report',
            context: 'Science'
        },
        {
            status: 'late',
            date: '12/20',
            title: 'Submitted Gravity Lab Report',
            context: 'Science'
        }
    ],

    tpl: [
        '<ul class="slate-recentactivity-list">',
            '<tpl for=".">',
                '<li class="slate-recentactivity-item">',
                    '<div class="slate-recentactivity-status <tpl if="status">slate-recentactivity-status-{status}</tpl>">',
                        '<tpl if="status"><div class="sr-only">{status}</div></tpl>',
                    '</div>',
                    '<div class="slate-recentactivity-info">',
                        '<div class="slate-recentactivity-meta">',
                            '<div class="slate-recentactivity-date">{date}</div>',
                            '<div class="slate-recentactivity-title">{title}</div>',
                            '<div class="slate-recentactivity-context">{context}</div>',
                        '</div>',
                        '<tpl if="skills">',
                            '<ul class="slate-recentactivity-skills">',
                                '<tpl for="skills">',
                                    '<li class="slate-recentactivity-skill">',
                                        '<div class="slate-recentactivity-skill-title">{title}</div>',
                                        '<div class="slate-recentactivity-skill-level slate-level-{level}">{level}</div>',
                                    '</li>',
                                '</tpl>',
                            '</ul>',
                        '</tpl>',
                    '</div>',
                '</li>',
            '</tpl>',
        '</ul>'
    ]
});
