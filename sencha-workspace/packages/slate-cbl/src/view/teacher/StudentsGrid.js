/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true *//*global Ext,Slate*/
/**
 * Renders tasks for a given list of students across a given list of competencies
 */
Ext.define('Slate.cbl.view.teacher.StudentsGrid', {
    extend: 'Ext.Component',
    xtype: 'slate-studentsgrid',
    requires:[
    ],

    config: {
    },

    componentCls: 'slate-studentsgrid',

    data: {
        students: [
            { fullName: 'Jessica Alfred' },
            { fullName: 'Christian Bumble' },
            { fullName: 'David Calloway' },
            { fullName: 'William Christianson' },
            { fullName: 'Christian Davids' },
            { fullName: 'Johnathan Fazio' },
            { fullName: 'Tyler Fellows' },
            { fullName: 'Jessica Alfred' },
            { fullName: 'Christian Bumble' },
            { fullName: 'David Calloway' },
            { fullName: 'William Christianson' },
            { fullName: 'Christian Davids' },
            { fullName: 'Johnathan Fazio' },
            { fullName: 'Tyler Fellows' },
            { fullName: 'Jessica Alfred' },
            { fullName: 'Christian Bumble' },
            { fullName: 'David Calloway' },
            { fullName: 'William Christianson' },
            { fullName: 'Christian Davids' },
            { fullName: 'Johnathan Fazio' },
            { fullName: 'Tyler Fellows' },
            { fullName: 'Nafis Guthery' }
        ],
        rows: [
            {
                title: 'Performance Task 1',
                students: [
                    { text: 'Foo' },
                    { text: 'Foole' },
                    { text: 'Foo' },
                    { text: 'Fooianson' },
                    { text: 'Foods' },
                    { text: 'Fooo' },
                    { text: 'Foo' },
                    { text: 'Foo' },
                    { text: 'Foole' },
                    { text: 'Foo' },
                    { text: 'Fooianson' },
                    { text: 'Foods' },
                    { text: 'Fooo' },
                    { text: 'Foo' },
                    { text: 'Foo' },
                    { text: 'Foole' },
                    { text: 'Foo' },
                    { text: 'Fooianson' },
                    { text: 'Foods' },
                    { text: 'Fooo' },
                    { text: 'Foo' },
                    { text: 'Foo' }
                ],
                rows: [
                    {
                        title: 'Performance Task 1, Subtask 1',
                        students: [
                            { text: 'Foo' },
                            { text: 'Foole' },
                            { text: 'Foo' },
                            { text: 'Fooianson' },
                            { text: 'Foods' },
                            { text: 'Fooo' },
                            { text: 'Foo' },
                            { text: 'Foo' },
                            { text: 'Foole' },
                            { text: 'Foo' },
                            { text: 'Fooianson' },
                            { text: 'Foods' },
                            { text: 'Fooo' },
                            { text: 'Foo' },
                            { text: 'Foo' },
                            { text: 'Foole' },
                            { text: 'Foo' },
                            { text: 'Fooianson' },
                            { text: 'Foods' },
                            { text: 'Fooo' },
                            { text: 'Foo' },
                            { text: 'Foo' }
                        ]
                    },
                    {
                        title: 'Performance Task 1, Subtask 2',
                        students: [
                            { text: 'Foo' },
                            { text: 'Foole' },
                            { text: 'Foo' },
                            { text: 'Fooianson' },
                            { text: 'Foods' },
                            { text: 'Fooo' },
                            { text: 'Foo' },
                            { text: 'Foo' },
                            { text: 'Foole' },
                            { text: 'Foo' },
                            { text: 'Fooianson' },
                            { text: 'Foods' },
                            { text: 'Fooo' },
                            { text: 'Foo' },
                            { text: 'Foo' },
                            { text: 'Foole' },
                            { text: 'Foo' },
                            { text: 'Fooianson' },
                            { text: 'Foods' },
                            { text: 'Fooo' },
                            { text: 'Foo' },
                            { text: 'Foo' }
                        ]
                    },
                    {
                        title: 'Performance Task 1, Subtask 3',
                        students: [
                            { text: 'Foo' },
                            { text: 'Foole' },
                            { text: 'Foo' },
                            { text: 'Fooianson' },
                            { text: 'Foods' },
                            { text: 'Fooo' },
                            { text: 'Foo' },
                            { text: 'Foo' },
                            { text: 'Foole' },
                            { text: 'Foo' },
                            { text: 'Fooianson' },
                            { text: 'Foods' },
                            { text: 'Fooo' },
                            { text: 'Foo' },
                            { text: 'Foo' },
                            { text: 'Foole' },
                            { text: 'Foo' },
                            { text: 'Fooianson' },
                            { text: 'Foods' },
                            { text: 'Fooo' },
                            { text: 'Foo' },
                            { text: 'Foo' }
                        ]
                    },
                ]
            },
            {
                title: 'Performance Task 2',
                students: [
                    { text: 'Foo' },
                    { text: 'Foole' },
                    { text: 'Foo' },
                    { text: 'Fooianson' },
                    { text: 'Foods' },
                    { text: 'Fooo' },
                    { text: 'Foo' },
                    { text: 'Foo' },
                    { text: 'Foole' },
                    { text: 'Foo' },
                    { text: 'Fooianson' },
                    { text: 'Foods' },
                    { text: 'Fooo' },
                    { text: 'Foo' },
                    { text: 'Foo' },
                    { text: 'Foole' },
                    { text: 'Foo' },
                    { text: 'Fooianson' },
                    { text: 'Foods' },
                    { text: 'Fooo' },
                    { text: 'Foo' },
                    { text: 'Foo' }
                ],
            }
        ]
    },

    tpl: [
        '{% var studentsCount = values.students.length %}',

        '<div class="slate-studentsgrid-rowheaders-ct">',
            '<table class="slate-studentsgrid-rowheaders-table">',
                '<thead>',
                    '<tr>',
                        '<td class="slate-studentsgrid-cornercell">&nbsp;</td>',
                    '</tr>',
                '</thead>',

                '<tbody>',
                    '<tpl for="rows">',
                        '<tr class="slate-studentsgrid-row">',
                            '<th class="slate-studentsgrid-rowheader">',
                                '<div class="slate-studentsgrid-header-text">{title}</div>',,
                            '</th>',
                        '</tr>',

                        // expander infrastructure
                        '<tr class="slate-studentsgrid-expander">',
                            '<td class="slate-studentsgrid-expander-cell">',
                                '<div class="slate-studentsgrid-expander-ct">',
                                    '<table class="slate-studentsgrid-expander-table">',
                                        '<tbody>',
                                        //

                                            '<tpl for="rows">',
                                                '<tr class="slate-studentsgrid-subrow">',
                                                    '<th class="slate-studentsgrid-rowheader">',
                                                        '<span class="slate-studentsgrid-header-text">{title}</span>',
                                                    '</th>',
                                                '</tr>',
                                            '</tpl>',

                                        //
                                        '</tbody>',
                                    '</table>',
                                '</div>',
                            '</td>',
                        '</tr>',
                        //
                    '</tpl>',
                '</tbody>',
            '</table>',
        '</div>',

        '<div class="slate-studentsgrid-scroller">',
            '<div class="slate-studentsgrid-data-ct">',
                '<table class="slate-studentsgrid-data-table">',
                    '<thead>',
                        '<tr>',
                            '<tpl for="students">',
                                '<th class="slate-studentsgrid-colheader">',
                                    '<div class="slate-studentsgrid-header-clip">',
                                        '<a class="slate-studentsgrid-header-link" href="javascript:void(0)">',
                                            '<span class="slate-studentsgrid-header-text">{fullName}</span>',
                                        '</a>',
                                    '</div>',
                                '</th>',
                            '</tpl>',
                        '</tr>',
                    '</thead>',
    
                    '<tbody>',
                        '<tpl for="rows">',
                            '<tr class="slate-studentsgrid-row">',
                                '<tpl for="students">',
                                    '<td class="slate-studentsgrid-cell">{text}</td>',
                                '</tpl>',
                            '</tr>',
    
                            // expander infrastructure
                            '<tr class="slate-studentsgrid-expander">',
                                '<td class="slate-studentsgrid-expander-cell" colspan="{[ studentsCount ]}">',
                                    '<div class="slate-studentsgrid-expander-ct">',
                                        '<table class="slate-studentsgrid-expander-table">',
                                            '<tbody>',
                                            //
    
                                                '<tpl for="rows">',
                                                    '<tr class="slate-studentsgrid-subrow">',
                                                        '<tpl for="students">',
                                                            '<td class="slate-studentsgrid-cell">{text}</td>',
                                                        '</tpl>',
                                                    '</tr>',
                                                '</tpl>',
    
                                            //
                                            '</tbody>',
                                        '</table>',
                                    '</div>',
                                '</td>',
                            '</tr>',
                            //
                        '</tpl>',
                    '</tbody>',
                '</table>',
            '</div>',
        '</div>'
    ],

/*
    listeners: {
        scope: 'this',
        click: {
            fn: 'onGridClick',
            element: 'el',
            delegate: '.slate-studentsgrid-progress-row, .slate-studentsgrid-demo'
        },
        mouseover: {
            fn: 'onSkillNameMouseOver',
            element: 'el'
        },
        competencyrowclick: 'onCompetencyRowClick'
    }
*/
});