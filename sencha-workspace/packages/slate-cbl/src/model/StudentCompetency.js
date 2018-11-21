Ext.define('Slate.cbl.model.StudentCompetency', {
    extend: 'Ext.data.Model',
    requires: [
        'Slate.cbl.proxy.StudentCompetencies',
        'Ext.data.identifier.Negative',
        'Ext.data.validator.Range'
    ],


    // model config
    idProperty: 'ID',
    identifier: 'negative',

    fields: [

        // ActiveRecord fields
        {
            name: 'ID',
            type: 'int',
            allowNull: true
        },
        {
            name: 'Class',
            type: 'string',
            defaultValue: 'Slate\\CBL\\StudentCompetency'
        },
        {
            name: 'Created',
            type: 'date',
            dateFormat: 'timestamp',
            allowNull: true,
            persist: false
        },
        {
            name: 'CreatorID',
            type: 'int',
            allowNull: true,
            persist: false
        },

        // StudentCompetency fields
        {
            name: 'StudentID',
            type: 'int'
        },
        {
            name: 'CompetencyID',
            type: 'int'
        },
        {
            name: 'Level',
            type: 'int'
        },
        {
            name: 'EnteredVia',
            type: 'string'
        },
        {
            name: 'BaselineRating',
            type: 'float',
            allowNull: true
        }
    ],

    proxy: 'slate-cbl-studentcompetencies',

    validators: [
        {
            field: 'StudentID',
            type: 'range',
            min: 1,
            emptyMessage: 'StudentID is required'
        },
        {
            field: 'CompetencyID',
            type: 'range',
            min: 1,
            emptyMessage: 'CompetencyID is required'
        }
    ],


    // static methods
    inheritableStatics: {
        load: function(options, session) {
            var record = new this({}, session),
                student = options.student,
                competency = options.competency,
                contentArea = options.contentArea,
                level = options.level,
                params;

            options = Ext.Object.chain(options);
            params = options.params = Ext.Object.chain(options.params || null);

            if (student || student === false) {
                params.student = student || '*current';
            }

            if (competency) {
                params.competency = competency;
            }

            if (contentArea) {
                params.content_area = contentArea; // eslint-disable-line camelcase
            }

            if (level) {
                params.level = level;
            }

            record.load(options);

            return record;
        },
        loadHighestLevel: function(options, session) {
            var params;

            options = Ext.Object.chain(options);
            params = options.params = Ext.Object.chain(options.params || null);

            params.limit = 1;
            params.sort = 'Level';
            params.dir = 'desc';

            return this.load(options, session);
        }
    }
});