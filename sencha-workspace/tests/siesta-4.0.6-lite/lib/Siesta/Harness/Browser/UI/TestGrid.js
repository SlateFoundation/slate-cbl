/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Harness.Browser.UI.TestGrid', {
    extend     : 'Ext.tree.Panel',
    alias      : 'widget.testgrid',
    controller : 'testgrid',
    requires   : [
        'Siesta.Harness.Browser.UI.FilterableTreeView'
    ],

    stateful    : true,
    rootVisible : false,
    header      : false,
    rowLines    : false,
    useArrows            : true,
    border               : false,
    cls                  : 'tr-testgrid',
    iconCls              : 'tr-status-neutral-small',
    width                : 340,
    collapsible          : true,
    expanded             : true,
    viewType             : 'filterabletreeview',
    enableColumnMove     : false,
    
    lines                : false,
    filter               : null,
    filterGroups         : false,
    resultSummary        : null,
    stateConfig          : null,
    showSizeControls     : false,
    
    coverageReportButton : null,

    viewConfig : {
        enableTextSelection : true,
        toggleOnDblClick    : false,
        markDirty           : false,
        trackOver           : false,
        getRowClass         : function(record) {
            if (record.get('descriptor').isSystemDescriptor) {
                return 'siesta-system-descriptor';
            }
        },

        // Avoid DOM updates when irrelevant
        shouldUpdateCell    : function(record, column, changedFieldNames) {

            if (column.dataIndex === 'passCount' &&
                changedFieldNames &&
                !(
                Ext.Array.contains(changedFieldNames, 'passCount') ||
                Ext.Array.contains(changedFieldNames, 'todoPassCount')
                )
            ) {
                return 0;
            }

            if (column.dataIndex === 'failCount' &&
                changedFieldNames &&
                !(
                Ext.Array.contains(changedFieldNames, 'failCount') ||
                Ext.Array.contains(changedFieldNames, 'todoFailCount')
                )
            ) {
                return 0;
            }


            return Ext.tree.View.prototype.shouldUpdateCell.apply(this, arguments);
        }
    },

    initComponent : function () {
        var me      = this;
        var R       = Siesta.Resource('Siesta.Harness.Browser.UI.TestGrid');
        var state   = this.stateConfig;

        Ext.apply(this, {
            title      : R.get('title'),

            columns : {
                // Hack, prevent Ext JS grid column to react to click/keys in filter field
                createFocusableContainerKeyNav                : Ext.emptyFn,
                // EOF Hack
                items                        : [
                    {
                        xtype : 'testnamecolumn',
                        store : this.store
                    },
                    {
                        header       : R.get('passText'),
                        width        : 50,
                        sortable     : false,
                        tdCls        : 'x-unselectable',
                        menuDisabled : true,
                        dataIndex    : 'passCount',
                        align        : 'center',
                        renderer     : this.passedColumnRenderer,
                        scope        : this
                    },
                    {
                        header       : R.get('failText'),
                        width        : 50,
                        sortable     : false,
                        tdCls        : 'x-unselectable',
                        menuDisabled : true,
                        dataIndex    : 'failCount',
                        align        : 'center',
                        renderer     : this.failedColumnRenderer,
                        scope        : this
                    }
                ]
            },

            bbar : {
                xtype    : 'toolbar',
                cls      : 'main-bbar siesta-toolbar',
                border   : false,
                height   : 45,
                defaults : {
                    scale       : 'large',
                    width       : 30,
                    tooltipType : 'title'
                },

                items : [
                    {
                        glyph      : 0xf04b,
                        cls        : 'run-checked',
                        text       : '<span class="subicon fa-check"></span>',
                        tooltip    : R.get('runCheckedText'),
                        actionName : 'run-checked'
                    },
                    {
                        glyph      : 0xf04e,
                        cls        : 'run-all',
                        tooltip    : R.get('runAllText'),
                        actionName : 'run-all'
                    },
                    {
                        glyph      : 0xf04b,
                        cls        : 'run-failed',
                        text       : '<span class="subicon fa-bug"></span>',
                        tooltip    : R.get('runFailedText'),
                        actionName : 'run-failed'
                    },
                    {
                        glyph      : 0xf02d,
                        tooltip    : R.get('showCoverageReportText'),
                        cls        : 'show-coverage',
                        actionName : 'show-coverage',
                        disabled   : true
                    },
                    {
                        glyph   : 0xf013,
                        tooltip : R.get('optionsText'),
                        cls     : 'options',
                        action  : 'options',
                        menu    : {
                            itemId : 'tool-menu',
                            items  : [
                                {
                                    text    : R.get('transparentExText'),
                                    option  : 'transparentEx',
                                    checked : state.transparentEx
                                },
                                {
                                    text    : R.get('cachePreloadsText'),
                                    option  : 'cachePreload',
                                    checked : state.cachePreload
                                },
                                {
                                    text    : R.get('autoLaunchText'),
                                    option  : 'autoRun',
                                    checked : state.autoRun
                                },
                                {
                                    text    : R.get('speedRunText'),
                                    option  : 'speedRun',
                                    checked : state.speedRun
                                },
                                {
                                    text    : R.get('breakOnFailText'),
                                    option  : 'breakOnFail',
                                    checked : state.breakOnFail
                                },
                                {
                                    text    : R.get('debuggerOnFailText'),
                                    option  : 'debuggerOnFail',
                                    checked : state.debuggerOnFail
                                },
                                { xtype : 'menuseparator' },
                                {
                                    text   : R.get('aboutText'),
                                    itemId : 'aboutSiesta'
                                },
                                {
                                    text       : R.get('documentationText'),
                                    href       : R.get('siestaDocsUrl'),
                                    hrefTarget : '_blank'
                                }
                            ]
                        }
                    },
                    '->',
                    {
                        xtype  : 'component',
                        cls    : 'summary-bar',
                        border : false,
                        width  : 55,
                        itemId : 'result-summary',
                        data   : {
                            pass : 0,
                            fail : 0
                        },
                        tpl    : '<div><span class="total-pass">{pass}</span><span class="icon fa-check"></span></div><div><span class="total-fail">{fail}</span><span class="icon fa-bug"></span></div>'
                    }
                ]
            },

            dockedItems : this.showSizeControls ? [
                {
                    xtype  : 'toolbar',
                    cls    : 'size-toolbar',
                    border : true,
                    dock   : 'bottom',
                    items  : [
                        {
                            xtype     : 'slider',
                            itemId    : 'framesizeSlider',
                            width     : 130,
                            value     : 3,
                            increment : 1,
                            minValue  : 0,
                            maxValue  : this.viewportSizes.length - 1,
                            listeners : {
                                change : this.onDimensionOrOrientationChange,
                                scope  : this
                            }
                        },
                        {
                            xtype  : 'label',
                            cls    : 'size-label',
                            itemId : 'sizeLabel',
                            width  : 65
                        },
                        {
                            boxLabel  : R.get('landscape'),
                            itemId    : 'orientationCheckbox',
                            xtype     : 'checkbox',
                            checked   : true,
                            listeners : {
                                change : this.onDimensionOrOrientationChange,
                                scope  : this
                            }
                        }
                    ]
                }
            ] : []
        })

        this.callParent(arguments);

        var me = this

        this.getView().on('beforerefresh', function () {
            var trigger = me.down('#trigger')

            if (me.filterGroups)    trigger.setFilterGroups(me.filterGroups)
            if (me.filter)          trigger.setValue(me.filter)

            // cancel refresh if there's a filter - in this case an additional refresh will be triggered by
            // the filtering which will be already not canceled since this is 1 time listener
            return !me.filter
        }, null, { single : true })

        this.on('afterrender', this.onMyViewReady, this);

        this.coverageReportButton = this.down('[actionName=show-coverage]');
    },

    onHistoryChange : function(token) {
        if (token) {
            var testFile = this.store.getNodeById(token)

            if (testFile) {
                this.selectTestFile(testFile);
            }
        }
    },

    onDimensionOrOrientationChange : function (slider, val) {
        var newSize = this.viewportSizes[this.framesizeSlider.getValue()];
        var landscape = this.orientationCheckbox.getValue();

        this.sizeLabel.setText(newSize.join('x'));
        this.fireEvent('framesizechange', slider, newSize[0], newSize[1], landscape);
    },


    getFilterValue : function () {
        return this.down('#trigger').getValue()
    },


    getFilterGroups : function () {
        return this.down('#trigger').getFilterGroups()
    },


    passedColumnRenderer : function (value, meta, record) {

        if (!record.isLeaf()) return ''

        if (record.data.todoPassCount > 0) {
            value += ' <span title="' + record.data.todoPassCount + ' ' + Siesta.Resource('Siesta.Harness.Browser.UI.TestGrid', 'todoPassedText') + '" class="tr-test-todo tr-test-todo-pass">+ ' + record.data.todoPassCount + '</span>';
        }

        return value;
    },


    failedColumnRenderer : function (value, meta, record) {

        if (!record.isLeaf()) return ''

        if (record.data.todoFailCount > 0) {
            value += ' <span title="' + record.data.todoFailCount + ' ' + Siesta.Resource('Siesta.Harness.Browser.UI.TestGrid', 'todoFailedText') + '" class="tr-test-todo tr-test-todo-fail">+ ' + record.data.todoFailCount + '</span>';
        }
        return value;
    },


    afterRender : function () {

        this.callParent(arguments);

        this.summaryPassEl = this.el.down('.total-pass');
        this.summaryFailEl = this.el.down('.total-fail');

        if (this.showSizeControls) {

            this.orientationCheckbox = this.down('#orientationCheckbox');
            this.sizeLabel = this.down('#sizeLabel');
            this.framesizeSlider = this.down('#framesizeSlider');

            var size = this.viewportSizes[this.framesizeSlider.getValue()];
            this.sizeLabel.setText(size.join('x'));
        }
    },

    onMyViewReady : function() {
        Ext.History.on('change', this.onHistoryChange, this);

        var hash = window.location.hash;

        if (hash) {
            this.onHistoryChange(hash.substring(1));
        }
    },

    updateStatus : function (pass, fail) {
        this.summaryPassEl.update(String(pass));
        this.summaryFailEl.update(String(fail));
    },

    enableCoverageButton : function () {
        this.coverageReportButton.enable()
    },

    disableCoverageButton : function () {
        this.coverageReportButton.disable()
    },
    
    
    setFilterValue : function (value) {
        this.down('treefilter').setValue(value)
    },

    selectTestFile : function(testFile) {
        if (testFile) {
            testFile.bubble(function(parent) { parent.expand(); });

            // Make sure test is not filtered out
            if (this.store.getById(testFile.id) && this.store.indexOf(testFile) >= 0 ) {
                if (!this.getCollapsed() && this.getView().getNodes().length > 0) {
                    this.ensureVisible(testFile);
                }
                this.getSelectionModel().select(testFile)
            }
        }
    }
})
