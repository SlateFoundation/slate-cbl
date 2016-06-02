// vim: sw=4:ts=4:nu:nospell:fdc=4
/*global Ext:true */
/*jslint browser: true, devel:true, sloppy: true, white: true, plusplus: true */

/*
 This file is part of Saki Grid MultiSearch Plugin Example Application

 Copyright (c) 2014, Jozef Sakalos, Saki

 Package:  saki-grid-multisearch
 Author:   Jozef Sakalos, Saki
 Contact:  http://extjs.eu/contact
 Date:     6. March 2014

 Commercial License
 Developer, or the specified number of developers, may use this file in any number
 of projects during the license period in accordance with the license purchased.

 Uses other than including the file in the project are prohibited.
 See http://extjs.eu/licensing for details.
 */

/**
 * Cities store
 */
Ext.define('Gms.store.CitiesStore',{
     extend:'Ext.data.Store'
    ,requires:[
        'Gms.model.City'
    ]
    ,model:'Gms.model.City'

    ,autoLoad:true
    ,remoteSort:true
    ,remoteFilter:true
    ,pageSize:15

    ,listeners:{
        // only for Google Analytics
        load:function() {
            try {
                top.ga('send', 'event', 'Live Demo', 'Load', 'Grid MultiSearch 5 Store Load');
            } catch(e) {};
        }
    }
});

// eof