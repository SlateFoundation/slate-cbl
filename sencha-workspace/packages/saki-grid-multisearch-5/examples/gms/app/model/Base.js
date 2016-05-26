// vim: sw=4:ts=4:nu:nospell:fdc=4
/*global Ext:true */
/*jslint browser: true, devel:true, sloppy: true, white: true, plusplus: true */

/*
 This file is part of Saki Grid MultiSearch Plugin Example Application

 Copyright (c) 2014, Jozef Sakalos, Saki

 Package:  saki-grid-multisearch-5
 Author:   Jozef Sakalos, Saki
 Contact:  http://extjs.eu/contact
 Date:     14. June 2014

 Commercial License
 Developer, or the specified number of developers, may use this file in any number
 of projects during the license period in accordance with the license purchased.

 Uses other than including the file in a project are prohibited.
 See http://extjs.eu/licensing for details.
 */

/**
 * # Base model class - implements schema
 * All other models inherit from this.
 */
Ext.define('Gms.model.Base', {
     extend: 'Ext.data.Model'

    // default fields
    ,idProperty:'id'
    ,fields:[{name:'id', type:'int'}]

    // inherited by all models
    ,schema:{
         namespace:'Gms.model'
        ,urlPrefix:'resources/service.php'
        ,proxy:{
             type:'ajax'
            ,url:'{prefix}/{entityName:lowercase}/read'
            ,actionMethods:{
                 read:'POST'
            }
            ,reader:{
                 type:'json'
                ,rootProperty:'data'
            }
        } // eo proxy

    } // eo schema

});

// eof