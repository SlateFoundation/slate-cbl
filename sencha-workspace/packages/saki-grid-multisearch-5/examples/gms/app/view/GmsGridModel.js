// vim: sw=4:ts=4:nu:nospell:fdc=4
/*global Ext:true */
/*jslint browser: true, devel:true, sloppy: true, white: true, plusplus: true */

/*
 This file is part of Saki Grid MultiSearch Plugin Example Application

 Copyright (c) 2014, Jozef Sakalos, Saki

 Package:  saki-grid-multisearch-5
 Author:   Jozef Sakalos, Saki
 Contact:  http://extjs.eu/contact
 Date:     7. December 2014
 Version:  2.2.0

 Commercial License
 Developer, or the specified number of developers, may use this file in any number
 of projects during the license period in accordance with the license purchased.

 Uses other than including the file in a project are prohibited.
 See http://extjs.eu/licensing for details.
 */

/**
 * ViewModel for GmsGrid Component
 */
Ext.define('Gms.view.GmsGridModel',{
     extend:'Ext.app.ViewModel'
    ,alias:'viewmodel.gmsgrid'

    ,data:{
        columns:{
            // geography columns
            geoCols:[{
                 text:'City'
                ,dataIndex:'name'
                ,stateId:'name'
                ,sortable:true
                ,width:160

                 // simplest filter configuration
                ,filterField:true
            },{
                 text:'Country'
                ,dataIndex:'countryCode'
                ,sortable:true
                ,width:80

                // equivalent to filterField:true
                // as textfield is created by default
                ,filterField:{
                    xtype:'textfield'
                }
            },{
                 text:'Population'
                ,dataIndex:'population'
                ,sortable:true
                ,width:110
                ,align:'right'
                ,format:'0,000'
                ,filterField:true
            }]
            ,coordCols:[{
                 text:'Latitude'
                ,dataIndex:'latitude'
                ,renderer:Ext.util.Format.numberRenderer('0.00000')
                ,align:'right'
                ,sortable:true
                ,width:100

                // combobox as filter field
                ,filterField:{
                     xtype:'combo'
                    ,valueField:'value'
                    ,displayField:'text'
                    ,queryMode:'local'
                    ,store:{
                         model:'Gms.model.Combo'
                        ,data:[
                            {value:'>=0', text:'Northern'}
                            ,{value:'<=0', text:'Southern'}
                        ]
                    }
                }
            },{
                 text:'Longitude'
                ,dataIndex:'longitude'
                ,renderer:Ext.util.Format.numberRenderer('0.00000')
                ,align:'right'
                ,sortable:true
                ,width:100

                // combo as filter
                ,filterField:{
                     xtype:'combo'
                    ,store:[
                        ['>=0', 'Eastern']
                        ,['<=0', 'Western']
                    ]
                }
            },{
                 text:'Elevation'
                ,dataIndex:'gtopo30'
                ,sortable:true
                ,renderer:Ext.util.Format.numberRenderer('0,000')
                ,align:'right'
                ,width:100

                // combo as filter
                ,filterField:{
                     xtype:'combo'
                    ,store:[
                        ['<0', '<0']
                        ,['>500', '>500']
                        ,['>1000', '>1000']
                        ,['>2000', '>2000']
                        ,['>3000', '>3000']
                    ]
                }
            }]
            ,otherCols:[{
                 text:'Time Zone'
                ,dataIndex:'timezone'
                ,sortable:true
                ,width:100

                // no filtering on this column
                ,filterField:false
            },{
                 text:'Updated'
                ,dataIndex:'lastUpdated'
                ,sortable:true
                ,width:100

                // datefield as filter
                ,filterField:'datefield'
                ,renderer:Ext.util.Format.dateRenderer('M j, Y')

            }]

            // Customers Grid Columns
            ,customers:[{
                 text:'Customer'
                ,dataIndex:'name'
                ,filterField:true
                ,flex:1.5
            },{
                 text:'Street'
                ,dataIndex:'addrStreet'
                ,filterField:true
                ,flex:2
            },{
                 text:'City'
                ,dataIndex:'addrCity'
                ,filterField:true
                ,flex:2
            },{
                 text:'Country'
                ,dataIndex:'addrCountry'
                ,filterField:true
                ,width:120

            }] // eo customers columns

        } // eo columns
    }

    ,formulas:{
        groupedColumns:function(get) {

            var  allCols = get('columns')
                ,retVal = []
            ;
            retVal = retVal.concat([{
                 text:'Geography'
                ,columns:Ext.clone(allCols.geoCols)
            },{
                 text:'Coordinates'
                ,columns:Ext.clone(allCols.coordCols)
            }], Ext.clone(allCols.otherCols));

            return retVal;

        } // eo function groupedColumns

        ,plainColumns:function(get) {

            var  allCols = get('columns')
                ,retVal = []
            ;
            retVal = retVal.concat(
                 Ext.clone(allCols.geoCols)
                ,Ext.clone(allCols.coordCols)
                ,Ext.clone(allCols.otherCols)
            );

            return retVal;

        } // eo function plainColumns
    }

    ,stores:{
        // Store for Cities Grid
        cities:{
             model:'Gms.model.City'
            ,storeId:'cities'
            ,autoLoad:true
            ,remoteSort:true
            ,remoteFilter:true
            ,statefulFilters:true
            ,stateful:true
            ,stateId:'cities-store'
            ,pageSize:15
            ,listeners:{
                // only for Google Analytics
                load:function() {
                    try {
                        top.ga('send', 'event', 'Live Demo', 'Load', 'Grid MultiSearch 5 Store Load');
                    } catch(e) {};
                }
            }
            ,filters:[{
                 property:'population'
                ,value:16000
                ,operator:'>='
            },{
                 property:'countryCode'
                ,value:['CH', 'FR', 'IT']
                ,operator:'in'
            },{
                 property:'gtopo30'
                ,value:600
                ,operator:'>'
            }]
        } // eo cities store

        // Store for Customers Grid
        ,customers:{
             model:'Gms.model.Customer'
            ,storeId:'customers'
            ,autoLoad:true
            ,remoteSort:true
            ,remoteFilter:true
            ,pageSize:10
            ,listeners:{
                // only for Google Analytics
                load:function() {
                    try {
                        top.ga('send', 'event', 'Live Demo', 'Load', 'Grid MultiSearch 5 Store Load');
                    } catch(e) {};
                }
            }
        } // eo customers store
    }
});

// eof