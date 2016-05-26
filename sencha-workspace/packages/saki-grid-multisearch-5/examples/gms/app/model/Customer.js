// vim: sw=4:ts=4:nu:nospell:fdc=4
/*global Ext:true */
/*jslint browser: true, devel:true, sloppy: true, white: true, plusplus: true */

/*
 This file is part of Grid Multisearch Plugin Example

 Copyright (c) 2014, Jozef Sakalos, Saki

 Package:  Using ExtJS 5 Routing Example
 Author:   Jozef Sakalos, Saki
 Contact:  http://extjs.eu/contact
 Date:     4. September 2014

 Commercial License
 Developer, or the specified number of developers, may use this file in any number
 of projects during the license period in accordance with the license purchased.

 Uses other than including the file in a project are prohibited.
 See http://extjs.eu/licensing for details.
 */

/**
 * Customer model
 */
Ext.define('Gms.model.Customer', {
     extend: 'Gms.model.Base'

    ,fields:[{
         name:'name'
        ,type:'string'
    },{
         name:'addrStreet'
        ,type:'string'
    },{
         name:'addrCity'
        ,type:'string'
    },{
         name:'addrCountry'
        ,type:'string'
    }] // eo fields
});

// eof