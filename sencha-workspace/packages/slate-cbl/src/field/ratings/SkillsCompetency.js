Ext.define('Slate.cbl.field.ratings.SkillsCompetency', {
    extend: 'Ext.container.Container',
    xtype: 'slate-cbl-ratings-skillscompetency',
    requires: [
        'Ext.util.Format',

        /* global Slate */
        'Slate.cbl.model.Competency',
        'Slate.sorter.Code',
        'Slate.ui.override.AddSorted'
    ],


    config: {
        selectedCompetency: null,
        loadedCompetency: null,
        showStatement: false
    },


    // container properties
    layout: 'anchor',
    defaultType: 'slate-cbl-ratings-slider',
    defaults: {
        anchor: '100%',
        excludeForm: true // exclude from any parent forms
    },


    // component properties
    componentCls: 'slate-cbl-ratings-skillscompetency',

    childEls: [
        'bodyWrap',
        'codeEl',
        'descriptorEl',
        'statementEl'
    ],

    renderTpl: [
        '<h4>',
            '<span class="competency-code" id="{id}-codeEl" data-ref="codeEl">{Code:htmlEncode}</span>',
            '<span class="competency-descriptor" id="{id}-descriptorEl" data-ref="descriptorEl">&nbsp;</span>',
        '</h4>',
        '<tpl if="values.$comp.getShowStatement()">',
            '<blockquote class="competency-statement" id="{id}-statementEl" data-ref="statementEl">&nbsp;</blockquote>',
        '</tpl>',
        '<div id="{id}-bodyWrap" data-ref="bodyWrap" class="slate-appcontainer-bodyWrap">',
            '{% this.renderContainer(out, values); %}',
        '</div>',
    ],


    // config handlers
    updateSelectedCompetency: function(selectedCompetency) {
        var me = this,
            loadedCompetency = me.getLoadedCompetency();

        if (loadedCompetency && loadedCompetency.get('Code') != selectedCompetency) {
            me.setLoadedCompetency(null);
        }

        me.loadIfNeeded();
    },

    applyLoadedCompetency: function(competency, oldCompetency) {
        if (!competency) {
            return null;
        }

        if (!competency.isModel) {
            if (oldCompetency && competency.ID == oldCompetency.getId()) {
                oldCompetency.set(competency, { dirty: false });
                return oldCompetency;
            }

            competency = Slate.cbl.model.Competency.create(competency);
        }

        return competency;
    },

    updateLoadedCompetency: function(competency) {
        if (competency) {
            this.setSelectedCompetency(competency.get('Code'));
        }

        this.refresh();
    },


    // component lifecycle
    initRenderData: function() {
        return Ext.apply(this.callParent(), {
            Code: this.getSelectedCompetency()
        });
    },

    afterRender: function() {
        this.callParent(arguments);
        this.refresh();
        this.loadIfNeeded();
    },


    // container lifecycle
    initItems: function() {
        this.callParent();

        this.items.setSorters([
            new Slate.sorter.Code({
                codeFn: function(item) {
                    return item.getSkill().get('Code');
                }
            })
        ]);
    },


    // local functions
    refresh: function() {
        var me = this,
            competency = me.getLoadedCompetency(),
            statementEl = me.statementEl,
            fm = Ext.util.Format;

        if (!me.rendered) {
            return;
        }

        if (competency) {
            Ext.suspendLayouts();

            me.codeEl.setHtml(fm.htmlEncode(competency.get('Code')));
            me.descriptorEl.setHtml(fm.htmlEncode(competency.get('Descriptor')));

            if (statementEl) {
                statementEl.setHtml(fm.htmlEncode(competency.get('Statement')));
            }

            Ext.resumeLayouts(true);
        }
    },

    loadIfNeeded: function() {
        var me = this,
            selectedCompetency = me.getSelectedCompetency(),
            loadedCompetency = me.getLoadedCompetency();

        // don't load if not rendered yet
        if (!me.rendered) {
            return;
        }

        // don't load until a competency is selected
        if (!selectedCompetency) {
            return;
        }

        // don't load if selected competency is already leaded
        if (loadedCompetency && loadedCompetency.get('Code') == selectedCompetency) {
            return;
        }

        // load StudentCompetency model
        Slate.cbl.model.Competency.loadByCode(selectedCompetency, {
            include: [],
            success: function(competency) {
                me.setLoadedCompetency(competency);
            }
        });
    }
});