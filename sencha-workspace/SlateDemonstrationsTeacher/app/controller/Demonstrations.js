Ext.define('SlateDemonstrationsTeacher.controller.Demonstrations', {
    extend: 'Ext.app.Controller',


    // controller configuration
    views: [
        'Window@Slate.ui',
        'DemonstrationForm@Slate.cbl.view.demonstrations'
    ],

    models: [
        'Demonstration@Slate.cbl.model.demonstrations'
    ],


    refs: {
        dashboardCt: 'slate-demonstrations-teacher-dashboard',

        demonstrationWindow: {
            forceCreate: true,

            xtype: 'slate-window',
            defaultType: 'slate-cbl-demonstrations-demonstrationform',
            modal: true,
            layout: 'fit',
            minWidth: 300,
            width: 600,
            minHeight: 600
        }
    },


    // entry points
    listen: {
        controller: {
            '#': {
                bootstrapdataload: 'onBootstrapDataLoad'
            }
        }
    },

    control: {
        'slate-demonstrations-teacher-dashboard slate-appheader button[action=create-demonstration]': {
            click: 'onCreateDemonstrationClick'
        }
    },


    // event handlers
    onBootstrapDataLoad: function(app, bootstrapData) {
        var Model = this.getDemonstrationModel(),
            fieldsConfig = bootstrapData.demonstrationFields,
            fieldName, fieldConfig, field;

        // configure model defaults from server configuration
        if (fieldsConfig) {
            for (fieldName in fieldsConfig) {
                if (!fieldsConfig.hasOwnProperty(fieldName)) {
                    continue;
                }

                fieldConfig = fieldsConfig[fieldName];
                field = Model.getField(fieldName);

                if (!field) {
                    continue;
                }

                if (fieldConfig.default) {
                    field.defaultValue = fieldConfig.default;
                }

                if (fieldConfig.values) {
                    field.values = fieldConfig.values;
                }
            }
        }
    },

    onCreateDemonstrationClick: function(createBtn) {
        this.getDemonstrationWindow({
            ownerCmp: this.getDashboardCt(),
            autoShow: true,
            animateTarget: createBtn,

            mainView: {
                // selectedStudent: context.student,
                // selectedSkill: context.skill,
                // selectedDemonstration: context.demonstrationId
            }
        });
    }
});