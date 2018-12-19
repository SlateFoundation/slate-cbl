Ext.define('Slate.cbl.field.SubmissionsField', {
    extend: 'Ext.form.field.Display',
    xtype: 'slate-cbl-submissionsfield',
    requires: [
        'Slate.cbl.model.tasks.Submission'
    ],


    config: {
        dateFormat: 'Y-m-d H:i:s',

        listeners: {
            detailsToggle: 'onDetailsToggle'
        }
    },


    componentCls: 'slate-cbl-submissionsfield',
    detailsTpl: [
        '<tpl if="currentSubmission">',
            '<details ontoggle="var cmp = Ext.getCmp(\'{id}\'); cmp.fireEvent(\'detailsToggle\', cmp, this.open)">',
                '<tpl for="currentSubmission">',
                    '<summary>{[parent.dateFormat(values.Created)]}</summary>',
                '</tpl>',
                '<ul>',
                    '<tpl for="previousSubmissions">',
                        '<li>{[parent.dateFormat(values.Created)]}</li>',
                    '</tpl>',
                '</ul>',
            '</details>',
        '<tpl else>',
            'None',
        '</tpl>'
    ],


    // field configuration
    name: 'Submissions',


    // field lifecycle
    renderer: function(submissions) {
        var dateFormat = this.getDateFormat();

        return Ext.XTemplate.getTpl(this, 'detailsTpl').apply({
            id: this.id,
            dateFormat: dateFormat,
            currentSubmission: submissions && submissions[0] || null,
            previousSubmissions: submissions && submissions.slice(1)
        });
    },

    onDetailsToggle: function(me) {
        me.updateLayout();
    },


    // config handlers
    applyDateFormat: function(format) {
        return Ext.isString(format) ? Ext.util.Format.dateRenderer(format) : format;
    }
});