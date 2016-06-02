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
 * City model
 */
Ext.define('Gms.model.City', {
     extend:'Gms.model.Base'
    ,fields:[
         {name:'id', mapping:'geonameId', type:'int'}
        ,{name:'name', type:'string'}
        ,{name:'latitude', type:'float'}
        ,{name:'longitude', type:'float'}
        ,{name:'countryCode', type:'string'}
        ,{name:'population', type:'int'}
        ,{name:'elevation', type:'int'}
        ,{name:'gtopo30', type:'int'}
        ,{name:'timezone', type:'string'}
        ,{name:'lastUpdated', type:'date', dateFormat:'Y-m-d'}
    ]
});

// eof