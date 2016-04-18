/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Recorder.UI.RecorderPanel', {
    extend : 'Ext.tree.Panel',

    alias : 'widget.recorderpanel',

    requires : [
        'Ext.grid.plugin.CellEditing'
    ],

    buttonAlign : 'left',
    border      : false,
    cls         : 'siesta-recorderpanel',
    selModel    : {
        mode : 'MULTI'
    },

    store : {
        type : 'actionstore'
    },

    rootVisible : false,

    viewConfig : {
        markDirty  : false,
        stripeRows : false,
        allowCopy  : true,
        plugins    : {
            ptype : 'treeviewdragdrop'
        }
    },


    newActionDefaults : {
        action : 'click'
    },
    lines             : false,
    test              : null,
    recorder          : null,
    harness           : null,
    domContainer      : null,
    recorderConfig    : null,
    editing           : null,
    enableColumnMove  : false,
    bufferedRenderer  : false,
    recorderClass     : 'Siesta.Recorder.ExtJS',

    enableContextMenu : true,
    showToolbars      : true,
    enableEditing     : true,
    playbackOnly      : false,

    /**
     * @event startrecord
     * Fires when a recording is started
     * @param {Siesta.Recorder.UI.RecorderPanel} this
     * @param {Siesta.Test} test The test instance to which the recorder is attached
     */
    /**
     * @event stoprecord
     * Fires when a recording is stopped
     * @param {Siesta.Recorder.UI.RecorderPanel} this
     */
    /**
     * @event play
     * Fires when a recording is being played back
     * @param {Siesta.Recorder.UI.RecorderPanel} this
     */

    initComponent : function () {
        var me             = this;
        var R              = Siesta.Resource('Siesta.Recorder.UI.RecorderPanel');
        var recorderConfig = this.recorderConfig || {};

        if (this.enableEditing) {
            me.plugins = me.plugins ? [].concat(me.plugins) : [];

            me.editing = me.editing || new Ext.grid.plugin.CellEditing({
                clicksToEdit : 1
            });

            me.editing.on({
                beforeedit   : me.onBeforeEdit,
                validateedit : me.onValidateEdit,
                edit         : me.afterEdit,
                canceledit   : me.afterEdit,
                scope        : me
            });

            this.relayEvents(me.editing, ['beforeedit', 'afteredit', 'validateedit'])

            me.plugins.push(me.editing);

            this.on('hide', function () {
                if (this.editing) {
                    this.editing.completeEdit();
                }
            });

            this.on({
                afteredit    : this.onAfterEdit,
                validateedit : this.onAfterEdit,
                canceledit   : this.onAfterEdit,
                scope        : this,
                buffer       : 200
            });
        }

        Ext.applyIf(me, {

            columns : [
                {
                    xtype : 'recorderactioniconcolumn'
                },
                {
                    xtype : 'recorderactioncolumn'
                },
                {
                    xtype           : 'targetcolumn',
                    highlightTarget : this.highlightTarget.bind(this)
                }
            ].concat(
                recorderConfig.recordOffsets !== false ? {
                    header       : R.get('offsetColumnHeader'),
                    dataIndex    : '__offset__',
                    width        : 60,
                    sortable     : false,
                    menuDisabled : true,
                    tdCls        : 'siesta-recorderpanel-offsetcolumn',
                    renderer     : function (value, meta, record) {
                        var target = record.getTarget()

                        if (target && target.offset) {
                            return target.offset + '<div class="siesta-recorderpanel-clearoffset fa fa-close"></div>'
                        }
                    },
                    editor       : 'textfield'
                } : []
            ).concat({
                    xtype        : 'actioncolumn',
                    width        : 55,
                    align        : 'center',
                    sortable     : false,
                    menuDisabled : true,
                    tdCls        : 'siesta-recorderpanel-actioncolumn',

                    items : [
                        {
                            iconCls : 'step-icon fa fa-close icon-delete-row',
                            tooltip : 'Delete this action',
                            handler : this.onDeleteStepClick,
                            scope   : this
                        },
                        {
                            iconCls : 'step-icon fa fa-play icon-play-row',
                            tooltip : 'Play this action',
                            handler : this.onPlaySingleStepClick,
                            scope   : this
                        },
                        {
                            iconCls : 'step-icon fa fa-forward icon-play-from-row',
                            tooltip : 'Play from this action',
                            handler : this.onPlayFromStepClick,
                            scope   : this
                        }]
                })
        });

        if (this.showToolbars) {
            me.createToolbars();
        }

        if (!this.playbackOnly) {
            var recorder = me.recorder = me.recorder || new Siesta.Recorder.ExtJS(
                this.recorderConfig || {}
            );

            recorder.on("actionadd", this.onActionAdded, this)
            recorder.on("actionremove", this.onActionRemoved, this)
            recorder.on("actionupdate", this.onActionUpdated, this)
            recorder.on("clear", this.onRecorderClear, this)

            recorder.on("start", this.onRecorderStart, this)
            recorder.on("stop", this.onRecorderStop, this)
        }

        me.callParent();

        this.mon(Ext.getBody(), 'mousedown', this.onBodyMouseDown, this, { delegate : '.target-inspector-label' })

        if (this.enableContextMenu) {
            this.contextMenu = new Siesta.Recorder.UI.ContextMenu({
                panel : this
            });
        }
    },

    onAfterEdit : function () {
        if (!this.editing.editing) {
            this.hideHighlighter();
        }
    },

    onBodyMouseDown : function (e, t) {
        var focusedEl = document.activeElement;

        if (Ext.fly(focusedEl).up('.siesta-targeteditor')) {
            e.stopEvent();
            e.preventDefault();
            focusedEl.value = Ext.htmlDecode(t.innerHTML);
        }
    },


    onRecorderStart : function () {

        this.fireEvent('startrecord', this, this.test);

        this.addCls('recorder-recording');
    },


    onRecorderStop : function () {

        this.fireEvent('stoprecord', this);

        this.removeCls('recorder-recording');
    },


    hideHighlighter : function () {
        if (this.test && this.domContainer) {
            this.domContainer.clearHighlight();
        }
    },


    highlightTarget : function (target, offset) {
        if (!target) {
            // Pass no target => simply hide highlighter
            this.hideHighlighter();
            return;
        }

        var test = this.test;

        if (!test) {
            this.hideHighlighter();
            return { success : true }
        }

        var R = Siesta.Resource('Siesta.Recorder.UI.RecorderPanel');
        var resolved, el

        try {
            resolved = this.test.normalizeElement(target, true, true, true);

            el = resolved.el
        } catch (e) {
            // sizzle may break on various characters in the query (=, $, etc)
        } finally {
            if (!el) {
                return { success : false, warning : R.get('queryMatchesNothing') }
            }
        }

        var warning = resolved.matchingMultiple ? R.get('queryMatchesMultiple') : ''

        if (test.isElementVisible(el) && this.domContainer) {
            var pointToVisualize = Ext.isArray(target) ? target : (offset || ['50%', '50%']);

            this.domContainer.highlightTarget(el, '<span class="target-inspector-label">' + target + '</span>', pointToVisualize);
        } else {
            // If target was provided but no element could be located, return false so
            // caller can get a hint there is potential trouble
            warning = warning || R.get('noVisibleElsFound')
        }

        return {
            success : !warning,
            message : warning
        };
    },


    createToolbars : function () {
        var me = this;
        var R  = Siesta.Resource('Siesta.Recorder.UI.RecorderPanel');

        me.dockedItems = [
            {
                xtype   : 'toolbar',
                padding : '3 5',
                cls     : 'siesta-toolbar recorder-toolbar',
                dock    : 'top',
                height  : 45,
                style   : 'border-color:transparent',
                items   : [
                    {
                        xtype      : 'textfield',
                        itemId     : 'recording-name',
                        fieldLabel : 'Name',
                        height     : 30,
                        width      : 200,
                        labelWidth : 50,
                        value      : R.get('newRecording')
                    },
                    {
                        xtype           : 'textfield',
                        itemId          : 'pageUrl',
                        height          : 30,
                        flex            : 1,
                        labelWidth      : 70,
                        fieldLabel      : R.get('pageUrl'),
                        enableKeyEvents : true,
                        listeners       : {
                            keyup : function (field, e) {
                                if (e.getKey() == e.ENTER) {
                                    this.onPageUrlFieldEnterKey();
                                }
                            },
                            scope : this
                        }
                    }
                ]
            },
            {
                xtype    : 'toolbar',
                cls      : 'siesta-toolbar',
                style    : 'border-color:transparent',
                dock     : 'top',
                height   : 45,
                defaults : {
                    scale       : 'medium',
                    tooltipType : 'title',
                    scope       : me
                },
                items    : [
                    {
                        iconCls  : 'fa fa-circle icon-record',
                        action   : 'recorder-start',
                        cls      : 'recorder-tool',
                        whenIdle : true,
                        tooltip  : R.get('recordTooltip'),
                        handler  : me.onRecordClick
                    },
                    {
                        iconCls : 'fa fa-square',
                        cls     : 'recorder-tool',
                        action  : 'recorder-stop',
                        handler : me.stop,
                        tooltip : R.get('stopTooltip')
                    },
                    {
                        iconCls : 'fa fa-play',
                        action  : 'recorder-play',
                        cls     : 'recorder-tool',
                        handler : me.onPlayClick,
                        tooltip : R.get('playTooltip')
                    },
                    {
                        iconCls : 'fa fa-close',
                        action  : 'recorder-remove-all',
                        cls     : 'recorder-tool icon-clear',
                        handler : function () {
                            var me = this;

                            if (me.store.getCount() === 0) return;

                            Ext.Msg.confirm(R.get('removeAllPromptTitle'), R.get('removeAllPromptMessage'), function (btn) {
                                if (btn == 'yes') {
                                    // process text value and close...
                                    me.clear();
                                }
                            });
                        },
                        tooltip : R.get('clearTooltip')
                    },
                    {
                        iconCls     : 'fa fa-plus',
                        action      : 'recorder-add-step',
                        tooltip     : R.get('addNewTooltip'),
                        cls         : 'recorder-tool',
                        tooltipType : 'title',
                        scope       : me,
                        handler     : function () {
                            var store    = me.store;
                            var selected = me.getSelectionModel().selected.first();
                            var model    = new store.model(Ext.apply({}, this.newActionDefaults));

                            if (selected && selected.isVisible()) {
                                selected.parentNode.insertChild(selected.get('index') + 1, model);
                            } else {
                                store.getRootNode().appendChild(model);
                            }

                            me.editing.startEdit(model, 1);
                        }
                    },
                    '->',
                    {
                        xtype   : 'splitbutton',
                        text    : 'Show source',
                        cls     : 'recorder-tool',
                        action  : 'recorder-generate-code',
                        handler : this.onGenerateCodeClick,
                        scope   : this,
                        menu    : {
                            items : [
                                {
                                    text    : R.get('showSourceInNewWindow'),
                                    scope   : this,
                                    handler : function () {
                                        var win           = window.open(null);
                                        var body          = win.document.body;
                                        var recordingName = this.getRecordingName();
                                        var code          = this.store.generateCode(recordingName);

                                        body.innerHTML = '<pre>' + code + '</pre>';
                                    }
                                }
                            ]
                        }
                    },

                    me.closeButton
                ]
            }];

        me.bbar = {
            xtype  : 'component',
            cls    : 'cheatsheet',
            height : 70,
            html   : '<table><tr><td class="cheatsheet-type">CSS Query:</td><td class="cheatsheet-sample"> .x-btn</td></tr>' +
            '<tr><td class="cheatsheet-type">Component Query:</td><td class="cheatsheet-sample"> &gt;&gt;toolbar button</td></tr>' +
            '<tr><td class="cheatsheet-type">Composite Query:</td><td class="cheatsheet-sample"> toolbar =&gt; .x-btn</td></tr></table>'
        };
    },

    // Attach to a test (and optionally a specific iframe, only used for testing)
    attachTo : function (test, iframe) {
        var me       = this;
        var doClear  = me.test && me.test.url !== test.url;
        var recorder = this.recorder

        this.setTest(test);

        var recWindow = (iframe && iframe.contentWindow) || (test.scopeProvider && test.scopeProvider.scope);

        if (recWindow) {
            me.recorder.attach(recWindow);
        }

        if (doClear) me.clear();
    },

    onPageUrlFieldEnterKey : function () {
        var descriptor = this.getRecorderTestDescriptor();

        if (descriptor && (descriptor.hostPageUrl || descriptor.pageUrl)) {
            this.harness.startSingle(descriptor);

            this.harness.on('teststart', function (event, test) {

                if (test.url === descriptor.url) {

                    // To ensure test is visible
                    this.fireEvent('play', this, test, 0);
                }

            }, this, { single : true });
        }
    },

    onRecordClick : function () {
        var test = this.test;

        if (!this.test) return;

        var R          = Siesta.Resource('Siesta.Recorder.UI.RecorderPanel');
        var descriptor = this.getRecorderTestDescriptor();

        if (descriptor) {

            if (this.isRecording()) {
                this.stop();
            } else {
                var harness = this.harness;
                var pageUrl = this.down('#pageUrl').getValue();

                // Grab a new test reference from harness in case test was rerun while recorder was open
                test = harness.getTestByURL(test.url);

                this.setTest(test);

                var scopeProvider = harness.getTestByURL(test.url).scopeProvider;

                // If we're recording a new URL, or the test has no window (already was cleaned up) -
                // first launch the test to load the URL into the test iframe
                if (!scopeProvider || pageUrl && scopeProvider.sourceURL !== pageUrl) {
                    harness.on('teststart', function (event, test) {

                        if (test.url === descriptor.url) {
                            this.attachTo(test);
                            this.recorder.start();
                        }

                    }, this, { single : true });

                    harness.startSingle(descriptor);
                } else if (test && test.global) {
                    this.attachTo(test);
                    this.recorder.start();
                }
            }

        } else {
            Ext.Msg.alert('Error', R.get('noTestStarted'))
        }
    },


    onPlayClick : function () {
        var me         = this;
        var descriptor = this.getRecorderTestDescriptor();

        if (descriptor) {
            me.stop();

            var testStartListener = function (ev, runningTestInstance) {
                if (runningTestInstance.url === descriptor.url) {
                    me.fireEvent('play', this, runningTestInstance);

                    runningTestInstance.on('beforetestfinalizeearly', testFinalizeListener, null, { single : true });
                }
            };

            var testFinalizeListener = function (ev, test2) {
                // important, need to update our reference to the test
                me.setTest(test2);

                // Run test first, and before it ends - fire off the recorded steps
                test2.chain(me.generateSteps());
            };

            var harness = me.harness;

            harness.on('teststart', testStartListener, null, { single : true });

            if (this.store.getCount() > 0) {
                this.scrollRecordIntoView( this.store.getAt(0));
            }

            harness.startSingle(descriptor);
        }
    },


    stop : function () {
        this.recorder.stop();
    },


    clear : function () {
        this.recorder.clear();
    },


    onRecorderClear : function () {
        this.store.getRootNode().removeAll();
    },


    getRecorderTestDescriptor : function () {
        var harness     = this.harness;
        var pageUrl     = this.down('#pageUrl').getValue();
        var test        = this.test;
        var descriptor  = test && harness.getScriptDescriptor(test.url);
        var testHostUrl = descriptor && harness.getDescriptorConfig(descriptor, 'pageUrl');

        // If user changes target page URL - use an empty virtual test descriptor
        return pageUrl && testHostUrl !== pageUrl ? {
            url      : '/',
            testCode : 'StartTest(function(t) {})',
            pageUrl  : pageUrl
        } : (test ? descriptor : null);
    },


    setTest : function (test) {
        var harness = this.harness;
        var field   = this.down('#pageUrl');

        if (this.test) {
            this.test.un('beforechainstep', this.onBeforeActionExecute, this);
        }
        this.test = test;

        if (test) {
            test.on('beforechainstep', this.onBeforeActionExecute, this);
        }
        if (field && test.scopeProvider) {
            field.setValue(test.scopeProvider.sourceURL || '');
        }
    },


    generateSteps : function (events) {
        var me    = this;
        var t     = me.test;

        return (events || this.store.getRange()).map(function (action, index) {
            if (action.isLeaf()) {
                var step = action.asStep(t);
                // wait for targets when playing entire test,
                // and
                // when playing actions manually from a certain step, wait for all steps but the first one
                if (action.getTarget()) step.waitForTarget = !events || index > 0;

                return [
                    function(next) {
                        index = events ? me.store.indexOf(action) : index;
                        t.fireEvent('beforechainstep', t, index, step);
                        next();
                    },
                    step
                ]
            } else {
               return me.generateSteps(action.childNodes);
            }
        }).concat(function(next) {
            me.fireEvent('stop', t);
            next();
        });
    },

    onBeforeActionExecute : function(event, test, index, step) {
        var count = this.store.getCount();

        this.getSelectionModel().select(index);

        if (index < count - 2) {
            this.scrollRecordIntoView( this.store.getAt(index + 2));
        }
    },

    onActionAdded : function (event, action) {
        var root         = this.store.getRootNode();
        var targetParent = (root.lastChild && root.lastChild.parentNode) || root;

        var newRecord = targetParent.appendChild(action);

        this.scrollRecordIntoView(newRecord)
    },


    onActionRemoved : function (event, action) {
        this.store.getNodeById(action.id).remove();
    },


    onActionUpdated : function (event, action) {
        var model = this.store.getNodeById(action.id);
        model.callJoined('afterEdit', [['target', 'action', '__offset__']])
    },

    getActions : function (asJooseInstances) {
        var actionModels = this.store.getRange()

        return asJooseInstances ? Ext.Array.pluck(actionModels, 'data') : actionModels
    },


    onDestroy : function () {
        if (this.recorder) {
            this.recorder.stop();
        }

        this.callParent(arguments);
    },

    scrollRecordIntoView : function (record) {
        if (this.view.rendered) {
            this.ensureVisible(record, { animate : { duration : 100 } });
        }
    },


    onBeforeEdit : function (cellEditing, editingContext) {

        var column = editingContext.column;
        var editor;

        if (column.xtype === "targetcolumn") {
            cellEditing.completeEdit();

            column.setTargetEditor(editingContext.record);

            editingContext.value = editingContext.record.get(column.dataIndex);
        } else {
            editor = editingContext.column.getEditor();

            if (editor.xtype === 'typeeditor') {
                // Can't populate until we have a test bound
                editor.populate(this.test);
            }
        }

        if (editingContext.column.dataIndex === 'target' && this.domContainer) {
            this.domContainer.startInspection(false);
        }

        // Offset only relevant for mouseinput actions
        return editingContext.field !== '__offset__' || editingContext.record.isMouseAction();
    },


    afterEdit : function (plug, e) {

        if (e.field === 'action') {
            var store = e.column.field.store;
            store.clearFilter();

            if (store.getById(e.value).get('type') !== store.getById(e.originalValue).get('type')) {
                e.record.resetValues();
            }
        }
    },


    onValidateEdit : function (plug, e) {
        var value = e.value;

        if (e.field === 'action' && !value) return false;

        if (e.field === '__offset__') {
            e.cancel = true;

            if (value) {
                var parsed = e.record.parseOffset(value);

                if (parsed) {
                    e.record.setTargetOffset(parsed);
                }
            } else {
                e.record.clearTargetOffset();
            }
        } else if (e.column.getEditor().applyChanges) {
            e.cancel = true;

            e.column.getEditor().applyChanges(e.record);
        }

        // Trigger manual refresh of node when 'set' operation is more complex
        if (e.cancel) {
            this.afterEdit(plug, e);
            this.getView().refreshNode(e.record);
        }
    },


    afterRender : function () {
        this.callParent(arguments);

        var view = this.getView();

        view.el.on({
            mousedown : function (e, t) {
                var record = view.getRecord(view.findItemByChild(t));

                record.clearTargetOffset()
                view.refreshNode(record);

                e.stopEvent();
            },
            delegate  : '.siesta-recorderpanel-clearoffset'
        })
    },

    isRecording : function () {
        return this.recorder.active;
    },

    onGenerateCodeClick : function () {

        var R = Siesta.Resource('Siesta.Recorder.UI.RecorderPanel');

        var win = new Ext.Window({
            title       : R.get('codeWindowTitle'),
            layout      : 'fit',
            itemId      : 'codeWindow',
            height      : 400,
            width       : 600,
            autoScroll  : true,
            autoShow    : true,
            constrain   : true,
            closeAction : 'destroy',
            items       : {
                xtype : 'jseditor',
                mode  : 'text/javascript'
            }
        });

        var field         = win.items.first();
        var recordingName = this.getRecordingName();
        var code          = this.store.generateCode(recordingName);

        field.setValue(code);
        field.editor.focus();
    },

    getRecordingName : function () {
        return this.down('#recording-name').getValue();
    },

    onDeleteStepClick : function (grid, rowIndex, colIndex, item, e, record) {
        this.editing && this.editing.completeEdit();

        record.remove();
    },

    onPlaySingleStepClick : function (cmp, rowIndex) {
        this.playSingle(rowIndex);
    },

    onPlayFromStepClick : function (cmp, rowIndex) {
        this.playFromStep(rowIndex);
    },

    playSingle : function(index) {
        if (this.test) {
            var action = this.store.getAt(index);

            this.fireEvent('play', this, this.test, index);
            this.test.chain(this.generateSteps([action]));
        }
    },

    playFromStep : function (startIndex) {
        if (this.test) {
            this.playRange(startIndex);
        }
    },

    playRange : function (startIndex, endIndex) {
        if (this.test) {
            this.fireEvent('play', this, this.test, startIndex, endIndex);
            this.test.chain(this.generateSteps(this.store.getRange(startIndex, endIndex)));
        }
    },

    getRecorder : function () {
        return this.recorder;
    }
});
