// vim: sw=4:ts=4:nu:nospell:fdc=4
/*global Ext:true */
/*jslint browser: true, devel:true, sloppy: true, white: true, plusplus: true */

/*
 This file is part of Saki Grid MultiSearch Package

 Copyright (c) 2014, Jozef Sakalos, Saki

 Package:  saki-grid-multisearch
 Author:   Jozef Sakalos, Saki
 Contact:  http://extjs.eu/contact
 Date:     7. December 2014
 Version:  2.2.0

 Commercial License
 Developer, or the specified number of developers, may use this file in any number
 of projects during the license period in accordance with the license purchased.

 Uses other than including the file in the project are prohibited.
 See http://extjs.eu/licensing for details.

 Change Log:
   2.2.0 - 7. December 2014
     * added support for grouped headers
     * added support for checkbox selection model
     * fixed some bugs and improved stability

   2.1.2 - 16. October 2014
     * added filterField synonym for filter config option
       this is required for Architect as it already recognizes "filter"
     * fixed tabbing-caused misalignment bug
     * merged Ext 4 and 5 versions into one file

   2.0.1 - 14. September 2014
     * added getFilter method to store because Ext 4.2.2 does not
       create this method by default
     * added config option parseOperator to make parsing operators optional
       this is required for Ext 4.2.2 because it does not send operators to
       server - see proxy.Server::encodeFilters()

   2.0.0 - 11. September 2014
     * initial release
 */

/**
 *
 * This plugin adds a row of form fields between the grid header and
 * view where user can type filter values on per-column basis. Text
 * fields are created by default but any form field type can
 * be configured.
 *
 * ##Usage - simple config scenario:
 *
 *      Ext.define('MyApp.view.GridView', {
 *           extend:'Ext.grid.Panel'
 *          ,requires:['Ext.saki.grid.MultiSearch']
 *          ,plugins:[{
 *               ptype:'saki-gms'
 *              ,filterOnEnter:false
 *              // other valid MultiSearch options
 *          }]
 *          ,bind:{
 *              store:'{cities}'
 *          }
 *          ,columns:[{
 *               text:'City'
 *              ,dataIndex:'name'
 *              ,sortable:true
 *              ,filterField:{
 *                  // any form field xtype
 *                  xtype:'textfield'
 *              }
 *          },{
 *               text:'Country'
 *              ,dataIndex:'countryCode'
 *              ,sortable:true
 *              // boolean true creates textfield
 *              ,filterField:true
 *          }]
 *          // ... etc
 *      });
 *
 *
 *
 * ##Usage - initComponent scenario:
 *
 *      Ext.define('MyApp.view.GridView', {
 *           extend:'Ext.grid.Panel'
 *          ,requires:['Ext.saki.grid.MultiSearch']
 *          ,initComponent:function() {
 *               var  me = this
 *                   ,config = {
 *                       store:Ext.create('MyApp.store.MyStore', {
 *                            pageSize:15
 *                           ,remoteSort:true
 *                           ,remoteFilter:true
 *                       })
 *                       ,plugins:[{
 *                            ptype:'saki-gms'
 *                           ,filterOnEnter:false
 *                           // other valid MultiSearch options
 *                       }]
 *                       ,columns:[{
 *                            text:'City'
 *                           ,dataIndex:'name'
 *                           ,sortable:true
 *                           ,filterField:{
 *                               // any form field xtype
 *                               xtype:'textfield'
 *                           }
 *                       },{
 *                            text:'Country'
 *                           ,dataIndex:'countryCode'
 *                           ,sortable:true
 *                           // boolean true creates textfield
 *                           ,filterField:true
 *                       }]
 *                       // ... etc
 *                    } // eo config
 *              ;
 *              Ext.apply(me, config);
 *              me.callParent(arguments);
 *
 *          } // eo function initComponent
 *      }); // eo define
 *
 */
Ext.define('Ext.saki.grid.MultiSearch', {
     extend:'Ext.container.Container'
    ,alternateClassName:'Ext.ux.grid.MultiSearch'
    ,alias:['plugin.saki-gms', 'plugin.ux-gms']

    // see also custom methods:
    // applyStore, updateStore, updateColumns
    ,config:{
        /**
         * @private
         * @cfg {Ext.data.Store} store Automatically set from the parent grid
         */
        store:null

        /**
         * @private
         * @cfg {Ext.grid.header.Column[]} columns Automatically
         * set from the parent grid
         */
        ,columns:null
    }

    /**
     * @hide
     * @private
     * @cfg {String} layout
     */
    ,layout:'hbox'

    /**
     * @hide
     * @private
     * @cfg {String} dock Determines where to put filter fields. The only tested
     * and reasonable position is 'top'
     */
    ,dock:'top'

    ,baseCls:'saki-gms-ct'

    /**
     * @cfg {Number}
     * Time in milliseconds to wait after the user stops typing, before
     * triggering the filtering
     */
    ,buffer:500

    /**
     * @cfg {String} clearItemIconCls CSS class to use for "Clear Filter" menu item.
     */
    ,clearItemIconCls:'icon-clear-filter'

    /**
     * @cfg {String} clearItemT Text to use for "Clear Filter" menu item.
     * This text can be localized by an override.
     */
    ,clearItemT:'Clear Filter'

    /**
     * @cfg {Boolean}
     * If true, filtering is not triggered as user types but
     * after he presses Enter key
     */
    ,filterOnEnter:false

    /**
     * @cfg {Number}
     * Height of the row with filter fields. Best to leave this null and let the framework 
     * measure the rendered form components naturally.
     */
    ,height:null

    /**
     * @cfg {Boolean}
     * Set it to false if you do not want column with multisearch settings menu
     */
    ,iconColumn:true

    /**
     * @cfg {String} inSeparator Character used as separator to delimit "in" operator
     * items.
     */
    ,inSeparator:','

    /**
     * @cfg {RegExp} operatorRe Regular expression of recognized operators
     */
    ,operatorRe:/^(=|!=|<=|>=|<|>|in |like )/

    /**
     * @cfg {String} parseOperator Set it to false to not parse operator from the
     * user-typed value. Normally, operator is sent to the server separate from the
     * value, however, if you use the plugin with Ext 4.x, or if your server parses
     * operators itself, set parseOperator to false.
     */
    ,parseOperator:true

    /**
     * @cfg {Number}
     * Must be high enough to render the filter row under the grid header
     */
    ,weight:1000

    /**
     * called from setStore
     * @param {[Ext.data.Store]} store
     * @returns {Ext.data.Store}
     * @private
     */
    ,applyStore:function(store) {
        store = store || this.grid.getStore();

        // Ext 4.x compatibility
        // Ext 4 Store does not have getFilters method, so add it
        if(!store.getFilters) {
            store.getFilters = function() {
                return this.filters;
            };
        }

        return store;
    } // eo function applyStore

    /**
     * called from setStore
     * @param {Ext.data.Store} newStore
     * @param {Ext.data.Store} oldStore
     */
    ,updateStore:function(newStore, oldStore) {
        // handling necessary on store change comes here
        var  me = this
            ,cfg = {
            filterchange:{
                 scope:this
                ,fn:me.onStoreFilterChange
            }
        };
        if(oldStore) {
            oldStore.un(cfg);
        }
        if(newStore) {
            newStore.on(cfg);

            // new store can be filtered so we set
            // values of our fields from store filters
            me.setValuesFromStore();
        }
    } // updateStore

    /**
     * store filterchange handler. Updates filter form fields from
     * filters applied to the store.
     * @private
     */
    ,onStoreFilterChange:function() {
        var me = this;
        if(!me.filtering) {
            me.setValuesFromStore();
        }
    } // eo function onStoreFilterChange

    /**
     * Sets values of filter fields based on the
     * filtering status of the store
     * @private
     */
    ,setValuesFromStore:function() {
        var  me = this
            ,values = me.getStoreFilters()
        ;
        if(values) {
            me.setValues(values, true);
        }
        else {
            me.clearValues(true);
        }
    } // eo function setValuesFromStore

    /**
     * Iterates through store filters and creates the values object
     * that is suitable as argument of setValues(values) call
     * @returns {Object|null} values
     */
    ,getStoreFilters:function() {

        var  me = this
            ,store = me.getStore()
            ,values = null
        ;
        if(store) {

            store.getFilters().each(function (filter) {
                var  property = filter.getProperty ? filter.getProperty() : filter.property
                    ,operator = filter.getOperator ? filter.getOperator() : filter.operator
                    ,value = filter.getValue ? filter.getValue() : filter.value
                    ,space = ''
                ;
                if ('in' === operator) {
                    value = value.join(',');
                }
                if (Ext.Array.contains(['in', 'like'], operator)) {
                    space = ' ';
                }
                values = values || {};
                values[property] = (operator ? operator + space : '') + value;
            });
        }

        return values;

    } // eo function getStoreFilters

    /**
     * called from setColumns
     * @private
     */
    ,updateColumns:function() {
        var  me = this
            ,headerCt = me.headerCt
            ,selModel = me.grid.getSelectionModel()
        ;

        // don't get interrupted by events
        headerCt.suspendEvents();

        // re-add column for icon in header
        if (me.iconColumn) {
            me.iconCol = headerCt.add(me.getIconCol());
        }

        // remove old and add new columns
        me.removeAll(true);
        me.add(me.getFields());

        // inject space for checkbox selection model
        if('Ext.selection.CheckboxModel' === selModel.$className) {
            //console.log('pushing checkbox column')
            me.items.insert(selModel.injectCheckbox, Ext.widget({
                 itemId:'item-' + selModel.injectCheckbox
                ,xtype:'component'
                ,cls:'saki-gms-nofilter'
                ,height:me.height
            }));
        }

        // ok for events now
        headerCt.resumeEvents();

        // full update of UI
        me.setValuesFromStore();

        me.grid.getView().refresh();

        // let dom settle
        Ext.Function.defer(function(){
            me.syncCols();
            me.syncUi();
        }, 1);

    } // eo function updateColumns

    /**
     * Called automatically by the framework as part of the plugins initialization.
     * @private
     * @param {Ext.grid.Panel} grid The grid this plugin is in.
     */
    ,init:function(grid) {
        var  me = this
            ,headerCt = grid.getView().getHeaderCt()
            ,extVersion = Ext.versions.extjs.major
        ;

        // safety check (mainly) for Architect who does not have RegExp type, only string
        if(Ext.isString(me.operatorRe)) {
            me.operatorRe = new RegExp(me.operatorRe.replace(/(^\/|\/$)/g,''));
        }

        // save some vars in the instance
        Ext.apply(me, {
             grid:grid
            ,headerCt:headerCt
            ,extVersion:extVersion
        });

        // install listeners on headerCt to sync sizes and positions
        headerCt.on({
            afterlayout:{
                 fn:me.afterHdLayout
                ,scope:me
            }
            ,afterrender:{
                 fn:me.afterHdRender
                ,scope:me
                ,single:true
            }
            ,columnmove:{
                 fn:me.onColumnMove
                ,scope:me
            }
        });

        grid.on({
             scope:me
            ,reconfigure:me.onReconfigure
        });

        me.on({
             afterrender:{
                  fn:me.onAfterRender
                 ,scope:me
                 ,single:true
             }
        });

        me.onReconfigure(grid, grid.store, grid.columns);

        // install convenience method(s) on the grid
        /**
         * MultiSearch plugin getter
         * @member Ext.grid.Panel
         * @returns {Ext.saki.grid.MultiSearch}
         */
        grid.getFilter = function() {
            return me;
        };

    } // eo function init


    /**
     * Grid reconfigure event listener. Main entry point
     * of the plugin creation and reconfiguration.
     * @private
     * @param {Ext.grid.column.Column[]} columns
     * @param {Ext.data.Store} store
     */
    ,onReconfigure:function(grid, store, columns) {

        // first we need to set new columns
        this.setColumns(columns);

        // then new store
        this.setStore(store);

    } // eo function onReconfigure

    /**
     * Generates array of instances of fields to be used as items
     * in the filter row.
     * @private
     * @returns {Ext.form.Field[]} Array of instantiated fields
     */
    ,getFields:function() {
        var  me = this
            ,items = []
            ,gridCols = me.headerCt.getGridColumns()
            ,selModel = me.grid.getSelectionModel()
        ;

        Ext.Array.each(gridCols, function(item, i) {
            var  filter = item.filterField || item.filter
                ,cfg = {xtype:'component'}
                ,field = null
            ;

            // filter:true - create textfield
            if(true === filter) {
                cfg.xtype = 'textfield';
            }

            // filter is an instance of component
            else if(filter && filter.isComponent) {
                cfg = filter;
            }

            // filter is string - that's xtype in fact
            else if('string' === typeof filter) {
                cfg.xtype = filter;
            }

            // filter is a config object
            else if(Ext.isObject(filter)) {
                Ext.apply(cfg, filter);
            }

            // otherwise column shouldn't be filtered
            else {
                cfg.cls = 'saki-gms-nofilter';
                cfg.height = me.height;
            }
            if('iconCol' === item.itemId) {
                Ext.apply(cfg, me.getIcon());
            }
            //if('component' !== cfg.xtype) {
                Ext.apply(cfg, {
                     itemId:item.itemId ? item.itemId : item.dataIndex || 'item' + i
                });
            //}

            field = Ext.widget(cfg);

            if(me.filterOnEnter) {
                field.on('specialkey', me.onSpecialKey, me);
            }
            else {
                field.on('change', me.onChange, me, {buffer:me.buffer});
            }

            items.push(field);
        });

        return items;
    } // eo function getFields

    /**
     * change handler. Triggers filtering and resets dirty state of the field.
     * @private
     * @param {Ext.form.Field} field Field firing the event
     */
    ,onChange:function(field) {
        var  me = this;

        // do nothing if not dirty
        if(field.isDirty()){
            field.resetOriginalValue();
            me.doFieldChange(field);
        }
    } // eo function onChange

    /**
     * Sets the underlying filter to the parsed value of the field.
     * That can include adding an operator or removing the filter.
     * @private
     * @param {Ext.form.field.Field} field
     */
    ,doFieldChange:function(field) {
        var  me = this
            ,value = field.getSubmitValue()
            ,property = field.getItemId()
            ,parse = me.parseOperator
            ,filter
        ;

        filter = parse ? me.parseUserValue(value) : {value:value};
        filter.property = property;

        // Ext 4 compat
        filter.id = property;

        me.setFilter(filter);
        me.updateClearIcon(field);

    } // eo function doFieldChange

    /**
     * Returns array of filter config objects from values in filter fields
     * @private
     * @returns {Ext.util.Filter[]} Config objects
     */
    ,getFilters:function() {
        var  me = this
            ,filters = []
        ;
        me.items.each(function(item){
            var filter;
            if(item.isFormField) {
                filter = me.getFilterFromField(item);
                if(filter) {
                    filters.push(filter);
                }
            }
        });
        return filters;
    } // eo function getFilters

    /**
     * Get filter configuration from the passed form field
     * @private
     * @param {Ext.form.field.Field} field
     * @returns {null|Ext.util.Filter} Filter config object
     */
    ,getFilterFromField:function(field) {
        var  me = this
            ,value = field.getSubmitValue()
            ,filter
        ;
        if(value) {
            filter = me.parseUserValue(value);
            filter.property = field.getItemId();
            return filter;
        }
        return null;

    } // eo function getFilterFromField

    /**
     * @private
     * @param {Ext.util.Filter|Ext.util.Filter[]} filter Filter config object
     * or array of them. If it is an array, existing filtering is cleared first
     * before the passed array of filters is applied.
     *
     * When argument is a single (non-array) filter, it's value is checked and
     * if empty then the the filter is removed. Otherwise it is added or updated.
     *
     * This method should not be called from outside as it does not update
     * filter form fields. Use {@link #setValues setValues} instead.
     */
    ,setFilter:function(filter) {
        var  me = this
            ,store = me.getStore()
        ;

        if(Ext.isArray(filter)) {
            store.clearFilter(0 < filter.length);
            store.addFilter(filter);
        }
        else {
            me.filtering = true;
            if(!filter.value) {
                if(4 === me.extVersion) {
                    store.filters.removeAtKey(filter.property);
                    if(store.filters.getCount()) {
                        store.filter();
                    }
                    else {
                        store.clearFilter();
                    }
                }
                else {
                    store.removeFilter(filter.property);
                }
            }
            else {
                store.addFilter(filter);
            }
            me.filtering = false;
        }

    } // eo function setFilter

    /**
     * Clears the passed field by setting its value to '' (empty string).
     * It also triggers filtering unless prevented by the second argument.
     * @param {Ext.form.Field} field
     * @param {Boolean} preventFilter True to NOT trigger filtering
     */
    ,clearField:function(field, preventFilter) {
        var  me = this;

        if(field && Ext.isFunction(field.setValue) && !field.readOnly && !field.disabled) {


            if(true === preventFilter) {
                field.suspendEvents();
            }
            field.setValue(null);
            field.resetOriginalValue();

            if(true === preventFilter) {
                field.resumeEvents();
            }

            if(true !== preventFilter) {
                me.doFieldChange(field);
            }
        }
    } // eo function clearField

    /**
     * Sets values of filter fields from the passed objects
     * and, by default, filters the store accordingly
     * @param {Object} values Object name/value pairs
     * @param {Boolean} preventFilter Set it to true
     * if you do not want to trigger the filtering
     */
    ,setValues:function(values, preventFilter) {
        var  me = this
            ,field
        ;
        if(values && Ext.isObject(values)) {
            me.clearValues(true);
            Ext.Object.each(values, function(key, value){
                field = me.items.get(key);
                if(field && Ext.isFunction(field.setValue)) {

                    if(true === preventFilter) {
                        field.suspendEvents();
                    }
                    field.setValue(value);
                    field.resetOriginalValue();

                    if(true === preventFilter) {
                        field.resumeEvents();
                    }
                }
            });
        }
    }

    /**
     * Clears values and, by default, clears also store filtering
     * @param {Boolean} [preventFilter] True to prevent the
     * actual filtering from occurring
     */
    ,clearValues:function(preventFilter) {
        var me = this;
        me.items.each(function(field){
            me.clearField(field, preventFilter);
        });
        if(!preventFilter) {
            me.getStore().clearFilter();
        }
    } // eo function clearValues


    // ============================== UI related methods ==============================

    /**
     * Installs event handler to handle scrolling caused
     * by tabbing through filter fields
     * @private
     */
    ,onAfterRender:function() {
        var  me = this
            ,scrollerEl
            ,event
            ;

        // Ext 4 does not have getScrollerEl function
        if(!Ext.isFunction(me.getScrollerEl)) {
            me.getScrollerEl = function() {
                return me.layout.innerCt;
            };
        }

        scrollerEl = me.getScrollerEl();

        // different events are listend to for Ext 5 and Ext 4
        event = 5 === me.extVersion ? 'scroll' : 'keyup';

        scrollerEl.on(event, me.onFilterScroll, me);
    } // eo function onAfterRender

    /**
     * Called when tabbing-through-fields induced scrolling occurred.
     * Scrolls grid view in sync with GMS scroll
     * @private
     */
    ,onFilterScroll:function() {
        var  me = this
            ,scrollLeft = me.getScrollerEl().getScrollLeft()
        ;

        if(5 === me.extVersion) {
            me.grid.getView().scrollTo(scrollLeft, 0);
        }
        else {
            me.grid.getView().getEl().scrollTo('left', scrollLeft);
        }
    } // eo function onFilterScroll

    /**
     * User can type operator and value in the filter form field.
     * This method parses (optional) operator and value string
     * returning {value:xxx, operator:yyy}
     * @param {String} v The value to parse
     * @returns {Object} Object with value and optional operator
     */
    ,parseUserValue:function(v) {
        var  me = this
            ,re = me.operatorRe
            ,sep = me.inSeparator
            ,va
            ,operator
            ,value
            ,trim = Ext.String.trim
            ;

        if(!v) {
            return {value:''};
        }

        v = v.toString();

        va = v.split(re);
        if(2 > va.length) {
            return {value:v};
        }

        value = trim(va[2]);
        operator = trim(va[1]);

        if('in' !== operator) {
            return {
                value:value
                ,operator:operator
            };
        }

        return {
            value:trim(value).split(sep)
            ,operator:operator
        };
    } // eo function parseUserValue

    /**
     * specialkey hander. Used only if {@link #filterOnEnter filterOnEnter:true}
     * @private
     * @param {Ext.form.field.Field} field
     * @param {Ext.EventObject} e
     */
    ,onSpecialKey:function(field, e) {
        var  me = this;
        if(Ext.EventObject.ENTER === e.getKey()) {
            me.setFilter(me.getFilters());
        }
    } // eo function onSpecialKey

    /**
     * click handler for icon column icon. Shows the filter menu.
     * @private
     * @param {Ext.EventObject} e
     */
    ,onIconClick:function(e) {
        var me = this;
        if(me.filterMenu) {
            me.filterMenu.showBy(e.getTarget('div.x-tool'));
        }
    } // eo function onIconClick

    /**
     * Override it if you need a different icon column
     * @template
     * @returns {Object} Icon column config object
     */
    ,getIconCol:function() {
        return {
             width:21
            ,menuDisabled:true
            ,hideable:false
            ,sortable:false
            ,itemId:'iconCol'
            ,draggable:false
            ,hoverCls:''
            ,baseCls:''
        };

    } // eo function getIconCol

    /**
     * Override it if you need a different icon. For example,
     * if you use Font Icons then you can override the icon configuration
     * returned by this method.
     * @template
     * @returns {Object} Icon config object
     */
    ,getIcon:function() {
        return {
            autoEl:{
                 tag:'div'
                ,children:[{
                     tag:'img'
                    ,src:'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
                    ,cls:'saki-gms-icon x-tool-img x-tool-gear'
                }]
            }
            ,cls:'saki-gms-nofilter x-tool'
            ,overCls:'x-tool-over'
            ,listeners:{
                click:{
                     fn:this.onIconClick
                    ,scope:this
                    ,element:'el'
                }
            }
        };
    } // eo function getIcon

    /**
     * @private
     * Creates filter control menu
     * @todo: implement saving named filters
     */
    ,createFilterMenu:function() {
        var  me = this
            ,items = []
        ;
        if(!me.filterMenu) {
            items.push({
                 text:me.clearItemT
                ,iconCls:me.clearItemIconCls
                ,scope:me
                ,handler:function(){
                    me.clearValues(true);
                    me.getStore().clearFilter();
                }
            });
            me.filterMenu = Ext.widget('menu', {
                 defaultAlign:'tr-br?'
                ,items:items
            });
        }
    } // eo function createFilterMenu

    /**
     * Shows/hides clear icon in the passed field.
     * @private
     * @param {Ext.form.field.Field} field
     */
    ,updateClearIcon:function(field) {
        var  me = this
            ,cls = 'saki-gms-hasvalue'
            ,body = field.bodyEl
            ,value = field.getValue ? field.getValue() : null
        ;

        if(body) {
            if (false !== field.clearIcon) {
                if (!field.clearIcon) {
                    field.clearIcon = body.createChild({
                        tag: 'div', cls: 'saki-gms-clear'
                    });
                    field.clearIcon.on('click', Ext.bind(me.clearField, me, [field]));
                    body.applyStyles({position: 'relative'});
                }
                if (value && !field.readOnly && !field.disabled) {
                    body.addCls(cls);
                }
                else {
                    body.removeCls(cls);
                }
            }
        }
    } // eo function updateClearIcon

    /**
     * Marks/unmarks grid column filtered by adding/removing
     * css class to/from it
     * @private
     * @param {Ext.form.field.Field} field
     */
    ,markFiltered:function(field) {
        var  me = this
            ,value = field.getValue ? field.getValue() : null
            ,colEl = me.headerCt.getGridColumns()[me.items.indexOf(field)]//.getEl()
        ;

        if(!colEl) {
            return;
        }
        colEl = colEl.getEl();
        colEl.removeCls('saki-gms-filtered');

        if(value) {
            colEl.addCls('saki-gms-filtered');
        }
        else {
            colEl.removeCls('saki-gms-filtered');
        }
    } // eo function markFiltered

    /**
     * Synchronizes UI of filter with actual state of filtering.
     * It shows or hides field clear icon.
     * @private
     */
    ,syncUi:function() {
        var  me = this;
        me.items.each(function(field) {
            if(field && field.rendered) {
                me.updateClearIcon(field);
                me.markFiltered(field);
            }
        });
    } // eo function syncUi

    /**
     * Synchronizes widths of filter fields with
     * widths of columns.
     * @private
     */
    ,syncCols:function() {
        var  me = this
            ,cols = me.headerCt.getGridColumns()//.headerCt.items
            ,hdWidth
        ;
        if(!me.rendered) {
            return;
        }

        hdWidth = me.headerCt.layout.innerCt.getWidth();

        Ext.Array.each(cols, function(col, i){
            var filter = me.items.getAt(i);
            if(filter) {
                filter.setWidth(col.getWidth());
            }
        });

        me.layout.targetEl.setWidth(hdWidth);

    } // eo function syncCols

    /**
     * Grid view scroll event listener that synchronizes
     * grid view, header and filters scrolling.
     * @private
     */
    ,onGridScroll:function() {
        var  me = this
            ,scroll = me.grid.getView().getEl().getScroll()
            ,scrollEl = me.getLayout().innerCt
        ;
        scrollEl.scrollTo('left', scroll.left);

    } // eo function onGridScroll

    /**
     * Move column event listener that moves filter
     * in sync with column moves
     * @private
     */
    ,onColumnMove:function() {
        var  me = this;

        me.syncOrder();
        me.grid.getView().refresh();
        me.syncUi();
        me.syncCols();

        // syncing scrolling must be defered 1ms
        Ext.Function.defer(me.onGridScroll, 1, me);

    } // eo function onColumnMove

    /**
     * Synchronizes the order of filters with
     * the order of the grid columns
     * @private
     */
    ,syncOrder:function() {
        var  me = this
            ,cols = me.headerCt.getGridColumns()
            ,i
            ,field
        ;
        for(i = 0; i < cols.length; i++) {
            field = me.items.get(cols[i].dataIndex);
            if(field) {
                me.items.insert(i, field);
            }
        }
        me.doLayout();

    } // eo function syncOrder

    /**
     * Synchronizes columns and other UI features
     * whenever the header changes layout
     * @private
     */
    ,afterHdLayout:function() {
        var me = this;
        if(!me.grid.reconfiguring) {
            me.syncCols();
            me.syncUi();
        }
    } // eo function afterHdLayout

    /**
     * Runs once after grid header rendering. Adds gms to the
     * grid header and performs other initialization.
     * @private
     */
    ,afterHdRender:function() {
        var  me = this
            ,grid = me.grid
        ;

        grid.dockedItems.add(me);

        if(0 < Ext.versions.extjs.minor && 4 !== me.extVersion) {
            grid.getView().on({
                scroll: {
                    fn: me.onGridScroll, scope: me
                }
            });
        }
        else {
            grid.getView().on({
                bodyscroll: {
                    fn: me.onGridScroll, scope: me
                }
            });
        }

        me.createFilterMenu();

    } // eo function afterHdRender

});

// eof