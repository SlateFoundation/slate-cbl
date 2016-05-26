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
 * Gms Grid definition
 */
Ext.define('Gms.view.GmsGrid', {
     extend:'Ext.grid.Panel'
    ,alias:'widget.gmsgrid'
    ,requires:[
         'Gms.model.Combo'
        ,'Ext.form.field.Date'
        ,'Ext.form.field.ComboBox'
        ,'Ext.saki.grid.MultiSearch'
        ,'Ext.toolbar.Paging'
        ,'Ext.util.Point'
        ,'Ext.toolbar.TextItem'
        ,'Ext.toolbar.Spacer'
        ,'Ext.toolbar.Separator'
    ]
    ,controller:{
        type:'gmsgrid'
    }
    ,viewModel:{
        type:'gmsgrid'
    }
    ,plugins:[{
         ptype:'saki-gms'
        ,pluginId:'gms'
        ,filterOnEnter:false
    }]
    ,bind:{
         store:'{cities}'
        ,columns:'{plainColumns}'
    }

    ,header:{
        defaults:{
             xtype:'button'
            ,allowDepress:false
            ,toggleGroup:'coltype'
        }
        ,items:[{
             text:'Headers: '
            ,xtype:'tbtext'
        },{
             text: 'Plain'
            ,itemId:'plainColumns'
            ,pressed:true
            ,listeners:{
                toggle:'onHeaderClick'
            }
        },{
            xtype:'tbspacer'
        },{
             text: 'Grouped'
            ,itemId:'groupedColumns'
            ,listeners:{
                toggle:'onHeaderClick'
            }
        },{
            xtype:'tbseparator'
        },{
             xtype:'tbtext'
            ,text:'Reconfigure to:'
        },{
             text:'Customers'
            ,itemId:'customers'
            ,listeners:{
                toggle:'onHeaderClick'
            }
        }]
    }

    ,pageSize:15
    ,scroll:'both'

    ,bbar:{
         xtype:'pagingtoolbar'
        ,bind:{
            store:'{cities}'
        }
        ,displayInfo:true
    }
});

// eof