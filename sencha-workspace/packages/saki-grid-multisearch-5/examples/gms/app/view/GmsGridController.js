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
 * View Controller for GmsGrid
 */
Ext.define('Gms.view.GmsGridController',{
     extend:'Ext.app.ViewController'
    ,alias:'controller.gmsgrid'

    ,onHeaderClick:function(btn, pressed) {
        var  me = this
            ,cols = btn.getItemId()
            ,vm = me.getViewModel()
            ,grid = me.getView()
        ;

        if(pressed) {
            if('customers' === cols) {
                grid.reconfigure(vm.getStore('customers'), vm.get('columns.customers'));
            }
            else {
                grid.reconfigure(vm.getStore('cities'), vm.get(cols));
            }
        }
    } // eo function onHeaderClick

});

// eof