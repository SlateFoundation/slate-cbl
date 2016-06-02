// vim: sw=4:ts=4:nu:nospell:fdc=4
/*global Ext:true */
/*jslint browser: true, devel:true, sloppy: true, white: true, plusplus: true */

/*
 This file is part of Saki Grid MultiSearch Plugin Example Application

 Copyright (c) 2014, Jozef Sakalos, Saki

 Package:  saki-grid-multisearch-5
 Author:   Jozef Sakalos, Saki
 Contact:  http://extjs.eu/contact
 Date:     11. September 2014
            5. December 2014
 Version:  2.2.0

 Commercial License
 Developer, or the specified number of developers, may use this file in any number
 of projects during the license period in accordance with the license purchased.

 Uses other than including the file in a project are prohibited.
 See http://extjs.eu/licensing for details.
 */

/**
 * Application definition file
 */
Ext.define('Gms.Application', {
     name: 'Gms'
    ,extend: 'Ext.app.Application'

    ,launch:function() {
        var ct = Ext.get('example-ct') || Ext.getBody()
        Ext.widget('gmsgrid',{
             height:550
            ,width:670
            ,renderTo:ct
            ,title:'Ext Grid MultiSearch 5 Example'
            ,border:true

            ,selType:'checkboxmodel'
            ,selModel:{
                 mode:'SIMPLE'
                ,injectCheckbox:0
            }
        })
    } // eo function launch

}); // eo define

// eof
