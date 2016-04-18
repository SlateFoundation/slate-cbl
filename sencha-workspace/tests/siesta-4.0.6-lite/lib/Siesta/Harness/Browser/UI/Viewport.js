/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
// workaround for: http://www.sencha.com/forum/showthread.php?299660-5.1.0.107-Exception-thrown-when-opening-any-example-in-Chrome-touch-simulation-mode&p=1094459#post1094459

// this condition seems to point that Chrome is opened in device simulation mode, w/o touch events enabled from command line
// seems "TouchEvents" + "!Touch" confuses Ext and exception is thrown
if (Ext.supports && Ext.supports.TouchEvents && !Ext.supports.Touch) {
    // w/o these, UI throws exceptions
    Ext.supports.Touch          = false
    Ext.supports.touchScroll    = false
}
// eof workaround


Ext.define('Siesta.Harness.Browser.UI.Viewport', {

    extend : 'Ext.container.Viewport',

    mixins     : [
        'Siesta.Harness.Browser.UI.CanFillAssertionsStore'
    ],
    controller : 'viewport',

    requires        : [
        'Ext.state.LocalStorageProvider',
        'Ext.state.CookieProvider',

        'ExtX.Reference.Slot',

        'Siesta.Harness.Browser.UI.TestGrid',
        'Siesta.Harness.Browser.UI.ResultPanel'
    ],

    title : null,

    harness      : null,

    // need to set stateful properties before `initComponent`
    stateful     : false,
    layout       : 'border',

    // stateful
    selection    : null,
    filter       : null,
    filterGroups : false,
    // eof stateful

    testsStore : null,

    contextMenu        : null,
    mouseVisualizer    : null,
    enableVersionCheck : true,

    collapsedNodes : null,

    showSizeControls : false,

    expectedExtJSVersion : '6.0.1.250',

    viewportSizes : [
        [640, 480],
        [800, 600],
        [1024, 768],
        [1920, 1080],
        [2048, 1536]
    ],

    initComponent : function () {
        var harness = this.harness;

        Ext.getBody().addCls('siesta')

        Ext.getBody().on('keydown', this.onBodyKeyDown, this)
        Ext.setGlyphFontFamily('FontAwesome');

        Ext.state.Manager.setProvider(Ext.supports.LocalStorage ? new Ext.state.LocalStorageProvider() : new Ext.state.CookieProvider())

        this.selection = {}

        if (harness.stateful) this.applyState(this.loadState())

        var data = this.buildTreeData({
            id    : 'root',
            group : 'test suite' + this.title,
            items : harness.descriptors
        }).children;

        var testsStore = this.testsStore = new Siesta.Harness.Browser.Model.FilterableTreeStore({
            model : 'Siesta.Harness.Browser.Model.TestFile',

            sortOnLoad : false,

            root : {
                expanded : true,

                children : data
            },

            proxy : 'memory',

            listeners : {
                nodecollapse : this.saveState,
                nodeexpand   : this.saveState,

                scope : this
            }
        })

        Ext.apply(this, {
            mouseVisualizer : Ext.isIE ? undefined : new Siesta.Harness.Browser.UI.MouseVisualizer({ harness : harness }),
            slots           : true,

            items : [
                {
                    region           : 'west',
                    xtype            : 'testgrid',
                    store            : testsStore,
                    slot             : 'filesTree',
                    id               : harness.id.replace(/\W/g, '_') + '-testTree',
                    showSizeControls : this.showSizeControls,
                    viewportSizes    : this.viewportSizes,
                    stateConfig      : this.getState(),

                    animate : !Ext.isIE,
                    split   : {
                        size : 7
                    },

                    filter       : this.filter,
                    filterGroups : this.filterGroups
                },
                {
                    xtype          : 'resultpanel',
                    region         : 'center',
                    slot           : 'resultPanel',
                    cls            : 'resultPanel-panel',
                    viewDOM        : this.getOption('viewDOM'),
                    id             : harness.id.replace(/\W/g, '_') + '-resultpanel',
                    harness        : harness,
                    recorderConfig : harness.recorderConfig,

                    maintainViewportSize    : harness.maintainViewportSize,
                    domContainerRegion      : harness.domContainerRegion
                }
            ]
            // eof main content area
        })

        this.callParent()

        // delay is required to avoid recursive loop
        this.on('afterlayout', this.onAfterLayout, this, { single : true, delay : 1 })

        this.slots.filesTree.store.on({
            'filter-set'   : this.saveState,
            'filter-clear' : this.saveState,

            scope : this
        })

        harness.on('testendbubbling', this.onEveryTestEnd, this)
        harness.on('hassomecoverageinfo', this.onHasSomeCoverageInfo, this)
        harness.on('nocoverageinfo', this.onNoCoverageInfo, this)
        harness.on('testsuitelaunch', this.onTestSuiteLaunch, this)
        harness.on('assertiondiscard', this.onAssertionDiscarded, this)

        if (this.mouseVisualizer) {
            this.slots.resultPanel.on('recorderplay', function(pnl, test) {
                this.mouseVisualizer.beginCursorVisualization(test);
            }, this);
        }

        if (window.location.href.match('^file:///')) {
            var R = Siesta.Resource('Siesta.Harness.Browser.UI.Viewport');

            Ext.Msg.alert(R.get('httpWarningTitle'), R.get('httpWarningDesc'))
        }
    },


    buildTreeData : function (descriptor) {
        var data = {
            id         : descriptor.id,
            title      : descriptor.group || descriptor.title || descriptor.name || descriptor.url.replace(/(?:.*\/)?([^/]+)$/, '$1'),
            descriptor : descriptor,

            // HACK, bypass Ext JS cloning
            nodeType   : 1,
            cloneNode  : function () {
                return this;
            }
        }


        var me              = this
        var prevId          = data.id
        var collapsedNodes  = this.collapsedNodes || {}

        if (descriptor.group) {

            var children = []

            Ext.each(descriptor.items, function (desc) {
                children.push(me.buildTreeData(desc))
            })

            Ext.apply(data, {
                expanded : (collapsedNodes[prevId] != null || descriptor.expanded === false) ? false : true,
                // || false is required for TreeView - it checks that "checked" field contains Boolean
                checked  : me.selection.hasOwnProperty(prevId) || false,

                folderStatus : 'yellow',

                children : children,
                leaf     : false
            })

        } else {
            Ext.apply(data, {
                url : descriptor.url,

                leaf    : true,
                // || false is required for TreeView - it checks that "checked" field contains Boolean
                checked : me.selection.hasOwnProperty(prevId) || false,

                passCount : 0,
                failCount : 0,

                time : 0,

                assertionsStore : new Siesta.Harness.Browser.Model.AssertionTreeStore({
                    //autoDestroy : true,
                    model : 'Siesta.Harness.Browser.Model.Assertion',

                    proxy : 'memory',

                    root : {
                        id       : '__ROOT__',
                        expanded : true
                    }
                })
            })
        }

        return data
    },


    onBodyKeyDown : function (e) {
        if (e.getKey() == Ext.EventObject[this.harness.rerunHotKey] && e.ctrlKey) {
            this.runTest();

            e.preventDefault();
        }
    },


    onAfterLayout : function () {
        if (this.getOption('autoRun')) {
            var checked = this.getChecked()

            // either launch the suite for checked tests or for all
            this.harness.launch(checked.length && checked || this.harness.descriptors)
        }
    },


    setNodeChecked : function (testFile, checked, doNotCascade, skipSave) {
        var me = this
        var id = testFile.getId()

        if (checked)
            this.selection[id] = 1
        else
            delete this.selection[id]


        testFile.set('checked', checked)

        // when unchecking the node - uncheck the parent node (folder) as well
        if (!checked && testFile.parentNode) me.setNodeChecked(testFile.parentNode, false, true, true)

        // only cascade for folders and when `doNotCascade` is false
        if (!testFile.isLeaf() && !doNotCascade) Ext.each(testFile.childNodes, function (childNode) {
            me.setNodeChecked(childNode, checked, false, true)
        })

        if (!skipSave) this.saveState()
    },


    forEachTestFile : function (func, scope) {
        this.testsStore.each(func, scope)
    },


    getChecked : function () {
        var descriptors = []

        this.forEachTestFile(function (testFileRecord) {
            if (testFileRecord.get('checked') && testFileRecord.isLeaf()) descriptors.push(testFileRecord.get('descriptor'))
        })

        return descriptors
    },

    runChecked : function () {
        var checked = this.getChecked();

        if (checked.length > 0) {
            this.harness.launch(this.getChecked())
        }
    },


    runFailed : function () {
        var descriptors = []

        this.forEachTestFile(function (testFileRecord) {
            var test = testFileRecord.get('test')

            if (test && test.isFailed()) descriptors.push(testFileRecord.get('descriptor'))
        })

        if (descriptors.length > 0) {
            this.harness.launch(descriptors)
        }
    },


    runAll : function () {
        var allDesc = []

        this.forEachTestFile(function (testFile) {
            if (testFile.isLeaf()) allDesc.push(testFile.get('descriptor'))
        })

        if (allDesc.length > 0) {
            this.harness.launch(allDesc)
        }
    },


    stopSuite : function (button) {
        this.performStop();
        button.disable()

        setTimeout(function () {

            button.enable()

        }, 1000)
    },

    performStop          : function () {
        this.harness.needToStop = true;

        this.testsStore.forEach(function (testFileRecord) {
            if (testFileRecord.get('isStarting') && !testFileRecord.get('isStarted')) {
                testFileRecord.set('isStarting', false);
            }
        });
    },


    // looks less nice than setting it only after preload for some reason
    onBeforeScopePreload : function (scopeProvider, url) {
        var testRecord = this.testsStore.getNodeById(url)

        // to avoid disturbing grid
        testRecord.data.isStarted = true
    },


    isTestRunningVisible : function (test) {
        // return false for test's running in popups (not iframes), since we can't show any visual accompaniment for them
        if (!(test.scopeProvider instanceof Scope.Provider.IFrame)) return false;

        // if there is a "forced to be on top" test then we only need to compare the tests instances
        if (this.harness.testOfForcedIFrame) {
            return this.harness.testOfForcedIFrame.isFromTheSameGeneration(test)
        }

        // otherwise the only possibly visible test is the one of the current assertion grid
        var resultPanel = this.slots.resultPanel;

        // if resultPanel has no testRecord it hasn't yet been assigned a test record
        if (!resultPanel.test || !resultPanel.test.isFromTheSameGeneration(test)) {
            return false;
        }

        // now we know that visible assertion grid is from our test and there is no "forced on top" test
        // we only need to check visibility (collapsed / expanded of the right panel
        return resultPanel.isFrameVisible()
    },


    resetDescriptors  : function (descriptors) {
        var testsStore = this.testsStore;

        Joose.A.each(this.harness.flattenDescriptors(descriptors), function (descriptor) {
            var testRecord = testsStore.getNodeById(descriptor.id);

            testRecord.get('assertionsStore').removeAll(true)
            testRecord.reject();
            // || false is required for TreeView - it checks that "checked" field contains Boolean
            testRecord.set('checked', this.selection.hasOwnProperty(descriptor.id) || false)
        }, this);
    },


    // method is called when test suite (any several tests) starts - before caching the script contents
    // at this point we don't know yet about missing test files
    onTestSuiteStart  : function (descriptors) {
        Ext.getBody().addCls('testsuite-running');

        var harness = this.harness
        var filesTree = this.slots.filesTree
        var selModel = filesTree.getSelectionModel()
        var prevSelection = selModel.getLastSelected()
        var testsStore = this.testsStore

        this.resetDescriptors(descriptors);

        // restore the selection after data reload
        if (prevSelection) selModel.select(testsStore.getNodeById(prevSelection.getId()))
    },


    // method is called when test suite (any several tests) launches - after the caching the script contents
    // has completed and 1st test is about to start
    // at this point we know about missing files and `desc.isMissing` property is set
    onTestSuiteLaunch : function (event, descriptors) {
        var testsStore = this.testsStore

        var updated = {}

        Joose.A.each(this.harness.flattenDescriptors(descriptors), function (descriptor) {
            var testRecord = testsStore.getNodeById(descriptor.id)

            testRecord.set({
                isMissing  : descriptor.isMissing,
                isStarting : true
            })

            var groupNode = testRecord.parentNode

            if (groupNode && !updated[groupNode.getId()]) {
                // trying hard to prevent extra updates
                for (var node = groupNode; node; node = node.parentNode) updated[node.getId()] = true

                groupNode.updateFolderStatus()
            }
        })
    },


    onTestSuiteEnd : function (descriptors) {
        Ext.getBody().removeCls('testsuite-running');

        this.updateStatusIndicator();

        // Without this the keyboard hotkey won't work (since one of the frames will steal focus likely)
        if (Ext.isChrome) {
            window.focus();
        } else {
            document.body.tabIndex = -1;
            document.body.focus();
        }
    },


    onTestStart        : function (test) {
        var testRecord = this.testsStore.getNodeById(test.url)

        testRecord.beginEdit()

        // will trigger an update in grid
        testRecord.set({
            test      : test,
            isRunning : true
        })

        testRecord.endEdit()

        var currentSelection = this.slots.filesTree.getSelectionModel().getLastSelected()

        // activate the assertions grid for currently selected row, or, if the main area is empty
        if (currentSelection && currentSelection.getId() == test.url) {
            var resultPanel = this.slots.resultPanel

            resultPanel.showTest(test, testRecord.get('assertionsStore'))
            resultPanel.setInitializing(false);
        }
    },


    // this method checks that test update, coming from given `test` is actual
    // update may be not actual, if user has re-launched the test, so new test already presents
    isTestUpdateActual : function (test, testRecord) {
        testRecord = testRecord || this.testsStore.getNodeById(test.url)

        var currentTest = testRecord.get('test')
        
        if (!currentTest) return true

        return currentTest && currentTest.isFromTheSameGeneration(test) && currentTest.launchId == test.launchId
    },


    onTestUpdate   : function (test, result, parentResult) {
        var testRecord = this.testsStore.getNodeById(test.url)

        // need to check that test record contains the same test instance as the test in arguments (or its sub-test)
        // test instance may change if user has restarted a test for example
        if (this.isTestUpdateActual(test, testRecord)) {
            this.processNewResult(testRecord.get('assertionsStore'), test, result, parentResult)

            if (this.getOption('breakOnFail') && test.getFailCount() > 0) {
                this.performStop();
                this.slots.filesTree.getSelectionModel().select(testRecord);
            }
        }
    },

    onAssertionDiscarded: function (event, test, result) {
        var testRecord = this.testsStore.getNodeById(test.url)

        // need to check that test record contains the same test instance as the test in arguments (or its sub-test)
        // test instance may change if user has restarted a test for example
        if (this.isTestUpdateActual(test, testRecord)) {
            var assertionStore = testRecord.get('assertionsStore')

            assertionStore.getNodeById(result.id).remove()
        }
    },


    // only triggered for "root" tests
    onTestEnd      : function (test) {
        var testRecord = this.testsStore.getNodeById(test.url)

        // need to check that test record contains the same test instance as the test in arguments (or its sub-test)
        // test instance may change if user has restarted a test for example
        if (this.isTestUpdateActual(test, testRecord)) {
            testRecord.beginEdit()

            testRecord.set({
                'passCount'     : test.getPassCount(),
                'failCount'     : test.getFailCount(),
                'todoPassCount' : test.getTodoPassCount(),
                'todoFailCount' : test.getTodoFailCount()
                // Not relevant for
                //,
                //'time'          : test.getDuration() + 'ms'
            });

            testRecord.endEdit()

            testRecord.parentNode && testRecord.parentNode.updateFolderStatus()
        }

        this.updateStatusIndicator()
    },


    // is bubbling and thus triggered for all tests (including sub-tests)
    onEveryTestEnd : function (event, test) {
        var testRecord = this.testsStore.getNodeById(test.url)

        // need to check that test record contains the same test instance as the test in arguments (or its sub-test)
        // test instance may change if user has restarted a test for example
        if (this.isTestUpdateActual(test, testRecord)) {
            this.processEveryTestEnd(testRecord.get('assertionsStore'), test)
        }
    },


    onTestFail : function (test, exception, stack) {
        var testRecord = this.testsStore.getNodeById(test.url)

        // need to check that test record contains the same test instance as the test in arguments
        // test instance may change if user has restarted a test for example
        if (this.isTestUpdateActual(test, testRecord) && !test.isTodo) {
            testRecord.set('isFailed', true)

            testRecord.parentNode && testRecord.parentNode.updateFolderStatus()
        }
    },


    getOption : function (name) {
        switch (name) {
            case 'selection'    :
                return this.selection

            default             :
                return this.harness[name]
        }
    },


    setOption : function (name, value) {
        switch (name) {
            case 'selection'    :
                return this.selection = value || {}

            case 'collapsedNodes':
                return this.collapsedNodes = value

            case 'filter'       :
                return this.filter = value
            case 'filterGroups' :
                return this.filterGroups = value

            default             :
                return this.harness[name] = value
        }
    },


    getState : function () {
        return {
            // harness configs
            autoRun        : this.getOption('autoRun'),
            speedRun       : this.getOption('speedRun'),
            viewDOM        : this.getOption('viewDOM'),
            cachePreload   : this.getOption('cachePreload'),
            transparentEx  : this.getOption('transparentEx'),
            breakOnFail    : this.getOption('breakOnFail'),
            debuggerOnFail : this.getOption('debuggerOnFail'),

            // UI configs
            selection      : this.getCheckedNodes(),
            collapsedNodes : this.getCollapsedFolders(),

            filter       : this.slots ? this.slots.filesTree.getFilterValue() : this.filter,
            filterGroups : this.slots ? this.slots.filesTree.getFilterGroups() : this.filterGroups
        }
    },


    getCheckedNodes : function () {
        var checked = {}

        this.testsStore.forEach(function (treeNode) {
            if (treeNode.get('checked')) checked[treeNode.getId()] = 1
        })

        return checked
    },


    getCollapsedFolders : function () {
        var collapsed = {}

        this.testsStore.forEach(function (treeNode) {
            if (!treeNode.isLeaf() && !treeNode.isExpanded()) collapsed[treeNode.getId()] = 1
        })

        return collapsed
    },


    applyState : function (state) {
        var me = this

        if (state) Joose.O.each(state, function (value, name) {
            me.setOption(name, value)
        })
    },


    getStateId : function () {
        return 'test-run-' + this.title
    },

    loadState : function () {
        var stateId = this.getStateId()
        var state = Ext.state.Manager.get(stateId)

        if (!state) return

        if (!state.collapsedNodes)  state.collapsedNodes = Ext.state.Manager.get(stateId + '-collapsed')
        if (!state.selection)       state.selection = Ext.state.Manager.get(stateId + '-selection')

        return state
    },

    saveState : function () {
        var stateId = this.getStateId()
        var state = this.getState()

        Ext.state.Manager.set(stateId + '-collapsed', state.collapsedNodes)
        Ext.state.Manager.set(stateId + '-selection', state.selection)

        delete state.collapsedNodes
        delete state.selection

        Ext.state.Manager.set(stateId, state)
    },


    uncheckAllExcept : function (testFile) {
        var me = this

        this.testsStore.forEach(function (node) {

            if (node != testFile) me.setNodeChecked(node, false, true)
        })
    },

    launchTest : function (testFile) {
        var resultPanel = this.slots.resultPanel
        var isLeaf = (testFile instanceof Ext.data.Model && testFile.data.leaf) || true;
        var descriptor = testFile instanceof Siesta.Test ? this.harness.getScriptDescriptor(testFile) : testFile.get('descriptor');

        // clear the content of the result panel when launching a single test
        if (isLeaf) {
            Ext.History.add(descriptor.url);
            // assertions of the tests being launched will be cleared in the `onTestSuiteStart` method
            resultPanel.setInitializing(true);
        }

        this.harness.launch([descriptor])
    },


    updateStatusIndicator : function () {
        // can remain neutral if all files are missing for example
//        var isNeutral       = true
//        var allGreen        = true
//        var hasFailures     = false

        var totalPassed = 0
        var totalFailed = 0

        this.testsStore.forEach(function (testFileRecord) {
            var test = testFileRecord.get('test')

            // if there's at least one test - state is not neutral
            if (test && test.isFinished()) {
//                isNeutral       = false

//                allGreen        = allGreen      && test.isPassed()
//                hasFailures     = hasFailures   || test.isFailed()

                totalPassed += test.getPassCount()
                totalFailed += test.getFailCount()
            }
        })

        this.slots.filesTree.updateStatus(totalPassed, totalFailed);
    },

    /**
     * Re-runs the latest executed test
     */
    runTest : function () {
        var toRun = this.slots.filesTree.getSelectionModel().getSelection()[0] ||
                    this.slots.resultPanel.test;

        if (toRun) {
            this.launchTest(toRun);
        }
    },

    
    afterRender : function () {
        this.callParent(arguments);

        if (!Ext.versions.extjs.equals(this.expectedExtJSVersion)) {
            Ext.Msg.alert('Wrong Ext JS version detected', 'The Siesta UI expects that you use Ext JS version: ' + this.expectedExtJSVersion + '. You may experience errors when using another version');
        }
        
        if (!this.harness.isAutomated) setTimeout(Ext.Function.bind(this.deferredSetup, this), 1000);
    },

    
    deferredSetup : function() {
        Ext.QuickTips && Ext.QuickTips.init();

        if (this.enableVersionCheck && Siesta.Harness.Browser.UI.VersionUpdateButton) {
            new Siesta.Harness.Browser.UI.VersionUpdateButton();
        }
    },

    
    onHasSomeCoverageInfo : function () {
        this.slots.filesTree.enableCoverageButton();
    },

    
    onNoCoverageInfo : function () {
        this.slots.filesTree.disableCoverageButton()
    },
    
    
    onManualCloseOfForcedIframe : function (test) {
        var domContainer        = this.down('domcontainer')
        
        if (domContainer && domContainer.test == test) domContainer.alignIFrame(true)
    }
})
//eof Siesta.Harness.Browser.UI.Viewport
