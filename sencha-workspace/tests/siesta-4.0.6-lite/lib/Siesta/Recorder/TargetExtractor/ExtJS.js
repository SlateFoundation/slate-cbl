/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Recorder.TargetExtractor.ExtJS

To resolve a component, this is done in the following prio list

1. Custom (non-auto-gen Id, client provided)
2. Custom field property (see componentIdentifier). User provides button with "foo : 'savebutton'", possibly add CSS selector
3. Custom xtype, user provides subclassed button for example, possibly combined with CSS selector (composite query)
3. For components, add some intelligence, user generated CSS properties win over Ext CSS properties
3a. Buttons could look for iconCls, text etc
3b. Menuitems same thing
3c. Grids and lists provide nth-child to know which position in the list
3d. Find extra non Ext classes (they start with "x-"), which of course have been put there by client
4. CSS selector (class names, nodeName DIV etc)
5. Coordinates

The type of target, possible options:

- 'cq'      component query
- 'csq'     composite query


*/
Class('Siesta.Recorder.TargetExtractor.ExtJS', {
    isa     : Siesta.Recorder.TargetExtractor,

    does    : [
        Siesta.Recorder.TargetExtractor.Recognizer.Grid,
        Siesta.Recorder.TargetExtractor.Recognizer.BoundList,
        Siesta.Recorder.TargetExtractor.Recognizer.DatePicker,
        Siesta.Recorder.TargetExtractor.Recognizer.NumberField,
        Siesta.Recorder.TargetExtractor.Recognizer.View,
        Siesta.Recorder.TargetExtractor.Recognizer.TimeAxisColumn
    ],


    has : {
        // An accessor method to get the relevant Ext JS object for the target (which could reside inside an iframe)
        Ext                     : null,
        baseCSSPrefix           : null,

        allowNodeNamesForTargetNodes : false,

        ignoreIdRegExp          : function () {
            return /^ext-/
        },

        // ?? probably meant to be used for DOM ids only.. Ext 4 vs  Ext 3
        compAutoGenIdRegExp     : /^ext-gen\d+|^ext-comp\d+/,

        uniqueComponentProperty : null,

        // Tell Siesta how components can be identified uniquely,
        // to make sure generated selectors target only a single place in the DOM
        // (sorted in order of relevance)
        componentIdentifiers    : function () {
            return [
                'id',
                'itemId',
                'text',         // menu items, buttons
                'dataIndex',    // Column component
                'iconCls',      // button/menuitem
                'type',         // Panel header tools
                'name',         // form fields
                'title',        // identifying panels, tab panels headers
//                'cls',        // Cmp, TODO discuss
                'inputType',
                'boxLabel',
                'fieldLabel'
            ];
        },

        /* Ignore all generic classes which will generate unstable selectors */
        ignoreClasses           : function () {
            return [
                '-focus$',
                '-over$',               // never use hover-specific CSS classes
                '-selected$',
                '-active$',
                '-default$',
                '-focused$',

                'x-body',
                'x-box-item',
                'x-btn-wrap',
                'x-component',      // too generic
                'x-datepicker-cell',
                'x-fit-item',
                'x-form-field',     // too generic
                'x-form-empty-field',
                'x-form-required-field',
                'x-grid-cell-inner',  // we prefer "x-grid-cell"
                'x-grid-view',
                'x-grid-resize-marker',
                'x-layout',
                'x-menu-item-link',
                'x-noicon',
                'x-resizable-overlay',
                'x-tab-noicon',
                'x-tab-default-noicon',
                'x-tab-default',
                'x-tab-inner',
                'x-tab-button',
                'x-tab-text',
                'x-tab-icon',
                'x-tab-wrap',
                'x-tree-icon',
                'x-trigger-index-',
                'x-unselectable',
                'x-grid-with-row-lines',
                '^x-autocontainer-',
                '^x-btn-inner',
                'x-column-header-text-inner',
                '^x-noborder',
                'x-box-inner',
                'x-monthpicker-item-inner',
                'x-box-target',
                'x-dd-drag-proxy',
                // Ext3 panel body classes
                'x-panel-bwrap',

                // Bryntum generic selectors
                'sch-gantt-terminal$',
                'sch-gantt-task-handle$',
                'sch-gantt-item',
                'sch-resizable-handle$',

                // In case someone left garbage in the DOM
                'null',
                'undefined'
            ];
        },

        // Table view is always in panel which seems more 'relevant'
        // headerContainer is rarely useful (remember though, a grid column is also a headercontainer)
        ignoreCQSelectors            : function () {
            return [
                'viewport',     // Adds no relevance, like matching BODY in a dom query
                'tableview',    // Always sits in a grid panel
                'treeview',     // Always sits in a tree panel
                'gridview',     // Always sits in a grid panel
                'surface',      // "belongs" to a chart but does not respond to CQ: https://www.sencha.com/forum/showthread.php?308911-Querying-chart-gt-surface-doesn-t-work&p=1128263#post1128263
                '>>headercontainer[isColumn=undefined]'
            ];
        },

        ignoreExtClassNamesRe : function () {
            return [
                'Ext.dd.StatusProxy'
            ].join('|');
        }
    },

    methods : {

        initialize : function () {
            var uniqueComponentProperty = this.uniqueComponentProperty

            if (uniqueComponentProperty) {
                this.componentIdentifiers.unshift.apply(
                    this.componentIdentifiers,
                    uniqueComponentProperty instanceof Array ? uniqueComponentProperty : [ uniqueComponentProperty ]
                )
            }

            this.SUPER()
        },

        setExt : function(node) {
            var doc = node.ownerDocument;
            this.Ext = (doc.defaultView || doc.parentWindow).Ext;

            if (this.Ext) {
                this.baseCSSPrefix = this.Ext.baseCSSPrefix || 'x';
            }
        },

        shouldUseContainsSelectorForComponent : function(comp) {
            var viewXtypes = [
                'dataview'
            ];

            return comp.is(viewXtypes.join(','));
        },

        getTargets : function (event, useContainsSelector, saveOffset) {
            var target      = event.target;

            this.setExt(target);

            var component;
            useContainsSelector = false;
            var hasCQ       = this.Ext && this.Ext.ComponentQuery && (this.Ext.versions && !this.Ext.versions.touch);

            if (hasCQ) {
                component = this.getComponentOfNode(target);

                useContainsSelector = !component || this.shouldUseContainsSelectorForComponent(component);
            }

            var result      = this.SUPER(event, useContainsSelector, saveOffset)

            // 1. Ext might not exist in the page,
            // 2. Ext JS < 4 has no support for ComponentQuery
            // 3. We don't support recording Touch applications
            if (!hasCQ) return result;

            // also try to find component/composite queries for the target
            if (component) {
                var componentQuery;

                if (this.swallowExceptions) {
                    try {
                        componentQuery = this.findComponentQueryFor(component)
                    } catch(e) {
                        this.exception = this.exception || e;
                    }
                } else {
                    componentQuery = this.findComponentQueryFor(component)
                }

                if (componentQuery) {
                    var el = (component.el || component.element).dom;

                    this.insertIntoTargets(result, {
                        type        : 'cq',
                        target      : componentQuery.query,
                        offset      : (saveOffset || !this.isElementReachableAtCenter(el)) ? this.findOffset(event.x, event.y, el) : null
                    }, target)

                    var compositeQuery  = this.findCompositeQueryFor(target, componentQuery, componentQuery.target)

                    if (compositeQuery)
                        this.insertIntoTargets(result, {
                            type        : 'csq',
                            target      : compositeQuery.query,
                            offset      : (saveOffset || !this.isElementReachableAtCenter(compositeQuery.target))? this.findOffset(event.x, event.y, compositeQuery.target) : null
                        }, target)
                }
            }

            return result
        },


        findCompositeQueryFor : function (node, componentQuery, component) {
            if (!componentQuery) {
                var component       = this.getComponentOfNode(node)

                if (component) {
                    componentQuery  = this.findComponentQueryFor(component)

                    if (!componentQuery) return null

                    // while finding the component query we've may actually switched to "parent matching" mode
                    // at changed the target component
                    component       = componentQuery.target
                }
            }

            var compEl              = (component.el || component.element)

            var compositeDomQuery   = this.findDomQueryFor(node, compEl.dom, 1)

            // if dom query contains an id - we don't need composite query at all?
            // if (compositeDomQuery && compositeDomQuery.foundId) return null

            return compositeDomQuery
                ?
                    { query : componentQuery.query + ' => ' + compositeDomQuery.query, target : compositeDomQuery.target }
                :
                    null
        },


        getComponentOfNode : function (node) {
            var body        = node.ownerDocument.body
            var Ext         = this.Ext

            while (node && node != body) {
                if (node.id && Ext.getCmp(node.id)) return Ext.getCmp(node.id)

                node        = node.parentNode
            }

            return null
        },

        ignoreDomId : function (id, node) {
            var Ext     = this.Ext;
            var prev    = this.SUPERARG(arguments)

            if (prev || !Ext || !Ext.getCmp) return prev

            // id of node in the dom can be formed from the id of the component this node belongs to
            // for example dom node `container-1019-innertCt` belonging to container-1019
            // such ids are considered auto-generated and should be ignored
            var comp    = this.getComponentOfNode(node)

            // 1. Ignore all autogenerated id's, and further - Ext JS prefixes child elements in certain components as:
            // #button1-btnInnerEl etc
            // Such suffixes should not be considered stable, even if "first half" is stable we filter them out here
            if (comp) {
                if (this.hasAutoGeneratedId(comp) || (id !== comp.id && id.indexOf(comp.id) > -1)) {
                    return true
                }
            }
            return false
        },

        /*
         * Some components rarely offer extra specificity, like grid view which always sits inside a more
         * 'public' grid panel, need to ignore such components
         */
        ignoreComponent   : function (cmp) {
            var Ext    = this.Ext;
            var ignore = (Ext.getClassName && Boolean(Ext.getClassName(cmp).match(this.ignoreExtClassNamesRe)));

            if (!ignore) {
                Joose.A.each(this.ignoreCQSelectors, function (xtype) {
                    var isQuery     = /^>>(.*)/.exec(xtype)

                    if (isQuery && Ext.ComponentQuery.is(cmp, isQuery[ 1 ]) || !isQuery && cmp.xtype == xtype) {
                        ignore = true;
                        return false;
                    }
                });
            }

            return ignore;
        },


        getComponentQuerySegmentForComponent : function (cmp) {
            var append      = '';

            // Figure out how best to identify this component, combobox lists, grid menus etc all need special treatment
            if (cmp.pickerField && cmp.pickerField.getPicker) {
                // Instead try to identify the owner picker field
                cmp         = cmp.pickerField;
                append      = '.getPicker()';
            }

            if (this.ignoreComponent(cmp)) return null;

            var Ext         = this.Ext

            if (Ext.ComponentQuery.is(cmp, 'menu')) {
                // We only care about visible menus
                append      = '{isVisible()}';
            }

            var xtype       = (cmp.getXType && cmp.getXType()) || cmp.xtype || cmp.xtypes[ 0 ]

            var dontNeedXType   = false
            var query           = ''

            for (var i = 0; i < this.componentIdentifiers.length; i++) {
                var attr    = this.componentIdentifiers[ i ]
                var value   = cmp[ attr ]

                if (
                    value && typeof value === 'string' && !(
                        (attr == 'id' && this.hasAutoGeneratedId(cmp)) ||

                        // ignore the "inputType" for sliders which is always a "text"
                        (attr == 'inputType' && Ext.slider && Ext.slider.Multi && (cmp instanceof Ext.slider.Multi)) ||

                        // Some Ext Components have an empty title/text - ignore
                        (value == '&#160;') ||

                        // Form fields can get a 'name' property auto generated, based on its own (or 2 lvls of parents) auto-gen id - ignore if true
                        (attr == 'name' && this.propertyIsAutoGenerated(cmp, 'name'))
                    )
                ) {
                    // Certain chars like commas and [] need to be escaped in Ext ComponentQuery attributes
                    value = value.replace(/,/g, '\\\\,').replace(/\[/g, '\\[').replace(/\]/g, '\\]');

                    if (attr === 'id') {
                        query           = '#' + value
                    } else if (attr === 'itemId') {
                        // Easier to read and xtype is irrelevant
                        // return itemId selector as starting with double ##
                        // this distinct it from the selector with global id and is corrected in the outer method
                        query           = '##' + value
                    } else {
                        query           = '[' + attr + '=' + value + ']'
                    }

                    if (attr === 'id' || attr == 'itemId') dontNeedXType = true

                    break
                }
            }

            if (!query && (xtype == 'component' || xtype == 'container' || xtype == 'toolbar')) return null

            return (dontNeedXType ? query : xtype + query) + append
        },


        // Ext JS 4+: Form fields sometimes get their 'name' generated based on a parent id
        // property is considered to be auto-generated if it contains an id string and id is in turn auto-generated
        propertyIsAutoGenerated : function (comp, prop) {
            // Not relevant for Ext < 4
            if (!comp.up) return false;

            if (comp.autoGenId && comp[ prop ].indexOf(comp.id) >= 0) {
                return true;
            }

            var parentWithAutoId = comp.up('[autoGenId=true]');

            return Boolean(parentWithAutoId) && comp[ prop ].indexOf(parentWithAutoId.id) >= 0
        },


        hasAutoGeneratedId      : function (component) {
            // Ext3 ?
            if (this.compAutoGenIdRegExp.test(component.id)) {
                return true;
            }

            // even if `autoGenId` can be set to false, the id of the component can be formed from the id
            // if its parent, like "window-1019-header_hd" (id of window header), where "window-1019" is autogenerated id 
            // of parent component
            return component.autoGenId || this.propertyIsAutoGenerated(component, 'id');
        },


        processCssClasses : function (classes) {
            var Ext         = this.Ext

            var prefix      = new RegExp('^' + this.baseCSSPrefix)

            var filtered    = classes.filter(function (cssClass) {
                return !prefix.test(cssClass)
            })

            // trying to find any non-Ext css class, if not found - return ext classes
            return filtered.length ? filtered : classes
        },


        findComponentQueryFor : function (comp, lookUpUntil) {
            var target              = comp
            var query               = []

            var foundGlobalId       = false
            // a size of array at which the last `itemId` segment was found
            // we want to include all `itemId` segments in the query, so later in the `for` loop
            // we start not from the last element, but from `last - foundLocalIdAt`
            var foundLocalIdAt      = 0

            var needToChangeTarget  = false

            var current             = target

            while (current && current != lookUpUntil) {
                var segment     = this.getComponentQuerySegmentForComponent(current)

                // can't reliably identify the target component - no query at all
                if (current == comp && !segment)
                    if (this.allowParentMatching) {
                        // switching to "parent matching" mode in which we are looking for some parent of original dom
                        needToChangeTarget  = true
                    } else
                        break

                if (segment) {
                    if (needToChangeTarget) {
                        target              = current
                        needToChangeTarget  = false
                    }

                    query.unshift(segment)

                    // no point in going further up, id is specific enough, return early
                    if (segment.match(/^#[^#]/)) {
                        foundGlobalId       = true
                        break
                    }

                    if (segment.match(/^##/) || segment.match(/^\[itemId=.*\]/)) {
                        foundLocalIdAt = query.length
                        // remove the double ## at the begining of the string, which was just indicating that this is 
                        // "local" item id, not global
                        query[ 0 ]  = query[ 0 ].replace(/^##/, '#')
                    }
                }

                do {
                    current         = current.ownerCt
                } while (current && current != lookUpUntil && this.ignoreComponent(current))
            }

            var resultQuery
            var hasUniqueMatch      = false

            for (var i = foundGlobalId ? 0 : (query.length - (foundLocalIdAt ? foundLocalIdAt : 1)); i >= 0; i--) {
                var parts               = query.slice(i)
                var subQuery            = parts.join(' ')
                var matchingComponents  = this.doNonStandardComponentQuery(subQuery)

                // if only part of the query already matches only one component, we treat this as specific enough query
                // and not using other segments
                if (matchingComponents.length == 1)
                    if (matchingComponents[ 0 ] == target) {
                        hasUniqueMatch  = true
                        resultQuery     = { query : subQuery, target : target, parts : parts }
                        break
                    } else
                        // found some query that matches a single component, not equal to original one - something went wrong
                        return null

                // at this point we are testing the whole query and if it matches more than 1 component
                // in general such query is not specific enough, the only exception is when our component
                // is the 1st one in the results
                // in all other cases return null (below) 
                if (i == 0 && matchingComponents[ 0 ] == target) return { query : subQuery, target : target }
            }

            if (hasUniqueMatch) {
                var matchingParts       = resultQuery.parts

                var index               = 1

                while (index < matchingParts.length - 1) {
                    if (this.componentSegmentIsNotSignificant(matchingParts[ index ])) {
                        var strippedParts   = matchingParts.slice()

                        strippedParts.splice(index, 1)

                        var matchingNodes   = this.doNonStandardComponentQuery(subQuery)

                        if (matchingNodes.length == 1) {
                            matchingParts.splice(index, 1)
                            // need to keep the index the same, so counter-adjust the following ++
                            index--
                        }
                    }

                    index++
                }

                resultQuery.query       = parts.join(' ')
                delete resultQuery.parts

                return resultQuery
            }

            var globalQuery = this.findGlobalQuery(comp);

            if (globalQuery) {
                return {
                    query  : globalQuery,
                    target : comp
                };
            }

            return null;
        },

        // As a fallback, if a component can not be uniquely identified with CQ - just use a
        // basic CQ based on the full tree hierarchy
        findGlobalQuery : function(comp) {
            var Ext   = this.Ext
            var parent;
            var parts = [];

            while(parent = comp.up()) {
                // Make sure parent is a container (could be a Combobox or something else)
                if(comp.xtype && ((parent.contains && parent.contains(comp)) || (parent.child && parent.child(comp)))) {
                    var index = parent.items ? parent.items.indexOf(comp) : -1;

                    if (index >= 0) {
                        parts.unshift(comp.xtype + ':nth-child(' + (index + 1) + ')');
                    } else {
                        parts.unshift(comp.xtype);
                    }

                    comp = parent;
                } else {
                    break;
                }
            }

            if (!comp.xtype) return null; // Failed to find a query

            if (!Ext.ComponentQuery.pseudos.root) {
                this.installRootPseudoCQ();
            }

            // Add a root level component which should make the result sufficiently unique
            var allRootComponentsOfType = Ext.ComponentQuery.query(comp.xtype  + '(true)' + ':root');
            var index = Ext.Array.indexOf(allRootComponentsOfType, comp);

            if (index < 0) {
                throw 'Could not find global CQ for xtype: ' + comp.xtype + ' , parts: ' + parts.join(' ');
            }

            parts.unshift(comp.xtype + '(true):root(' + (index + 1) + ')');

            return parts.join(' ');
        },


        componentSegmentIsNotSignificant : function () {
            return false
        },


        // Component Query with extensions - ".someMethod()" at the end
        doNonStandardComponentQuery : function (query, lookUpUntil) {
            var Ext             = this.Ext
            var match           = /(.+?)\.(\w+)\(\)/g.exec(query)

            var trimmedQuery    = ((match && match[ 1 ]) || query).trim();
            var methodName      = match && match[ 2 ]

            // Discard any hidden components, special treatment of Ext Widgets that don't yet implement isVisible.
            // https://www.sencha.com/forum/showthread.php?308370-CQ-crashes-if-widgets-are-used&p=1126410#post1126410
            var matchedComponents   = Ext.ComponentQuery.query(trimmedQuery + ':not([isVisible])').concat(
                Ext.ComponentQuery.query(trimmedQuery + '[isVisible]{isVisible()}')
            )

            if (methodName)
                for (var i = 0; i < matchedComponents.length; i++)
                    if (Object.prototype.toString.call(matchedComponents[ i ][ methodName ]) == '[object Function]')
                        matchedComponents[ i ] = matchedComponents[ i ][ methodName ]()

            return matchedComponents
        },


        resolveTarget : function (target) {
            if (target.type == 'cq') {
                var component   = this.doNonStandardComponentQuery(target.target)[ 0 ]
                var el          = component && (component.el || component.element)

                return el && el.dom
            }

            if (target.type == 'csq') {
                var parts   = target.target.split('=>')

                var compEl  = this.resolveTarget({ type : 'cq', target : parts[ 0 ] })

                var el      = compEl && Sizzle(parts[ 1 ], compEl)[0]

                return el
            }

            return this.SUPERARG(arguments)
        },


        getFirstNonExtCssClass : function (node) {
            var prefix      = this.baseCSSPrefix;
            var trimmed     = node.className.trim();
            var classes     = trimmed && trimmed.replace(/  +/g, ' ').split(' ') || [];

            for (var i = 0; i < classes.length; i++) {
                var cls     = classes[ i ].trim();

                if (cls.indexOf(prefix) != 0) return cls
            }

            return null;
        },


        // gets `node` itself (if it matches selector) or the neareset such parent  and returns the
        // index of that node in its parent child nodes list
        getNthPosition : function (node, selector) {
            // find item that has the given `cls` class, starting from given `node` and up in the dom tree
            var itemInList  = this.is(node, selector) ? node : this.closest(node, selector);

            // then find out, what index it has in its parent node
            var array       = Array.prototype.slice.apply(itemInList.parentNode.childNodes);

            return array.indexOf(itemInList)
        },

        // add :root pseudo CQ selector to be able to identify 'root' level components that don't have
        // parent containers. value is 1-based
        installRootPseudoCQ : function() {
            this.Ext.ComponentQuery.pseudos.root = function(items, value) {
                var i = 0, l = items.length, c, result = [];
                var findAllRoots = value === undefined

                if (!findAllRoots) {
                    value = Number(value) - 1;
                }

                for (; i < l; i++) {
                    c = items[i].up();
                    var hasParentContainer = c && c.contains && c.contains(items[i]);

                    if (!hasParentContainer) {
                        result.push(items[i]);
                    }
                }

                if (!findAllRoots) {
                    result = result[value] ? [result[value]] : [];
                }

                return result;
            };
        }
    }

//    ,
//    my : {
//        has : {
//            recognizers : Joose.I.Object
//        },
//
//        methods : {
//
//            addRecognizer : function (recognizer) {
//                this.recognizers[ recognizer.meta.name ] = recognizer.recognize;
//            }
//        }
//    }
});
