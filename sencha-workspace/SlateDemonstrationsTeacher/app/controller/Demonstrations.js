Ext.define('SlateDemonstrationsTeacher.controller.Demonstrations', {
    extend: 'Ext.app.Controller',


    // controller configuration
    views: [
        'Window@Slate.ui',
        'DemonstrationForm@Slate.cbl.view.demonstrations'
    ],

    stores: [
        'Students'
    ],

    models: [
        'Demonstration@Slate.cbl.model.demonstrations'
    ],


    refs: {
        dashboardCt: 'slate-demonstrations-teacher-dashboard',
        createBtn: 'slate-demonstrations-teacher-dashboard slate-appheader button[action=create-demonstration]',

        demonstrationWindow: {
            autoCreate: true,

            xtype: 'slate-window',
            closeAction: 'hide',
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
        createBtn: {
            click: 'onCreateDemonstrationClick'
        },
        'slate-cbl-demonstrations-demonstrationform ^ window button[action=submit]': {
            click: 'onSubmitDemonstrationClick'
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

        // enable create button now that model is initialized
        this.getCreateBtn().enable();
    },

    onCreateDemonstrationClick: function(createBtn) {
        var me = this,
            demonstration = me.getDemonstrationModel().create({
                Demonstrated: new Date()
            }),
            demonstrationWindow = me.getDemonstrationWindow({
                ownerCmp: me.getDashboardCt(),
                animateTarget: createBtn,

                mainView: {
                    studentSelector: {
                        store: me.getStudentsStore(),
                        queryMode: 'local',
                        matchFieldWidth: true
                    }
                    // selectedStudent: context.student,
                    // selectedSkill: context.skill,
                    // selectedDemonstration: context.demonstrationId
                }
            }),
            formPanel = demonstrationWindow.getMainView();

        formPanel.loadRecord(demonstration);
        formPanel.reset();
        demonstrationWindow.show();
    },

    onSubmitDemonstrationClick: function(submitBtn) {
        var formPanel = submitBtn.up('window').getMainView(),
            demonstration = formPanel.getRecord();

        formPanel.updateRecord(demonstration);

        console.table([formPanel.getValues(), demonstration.getData()]);
    }
});