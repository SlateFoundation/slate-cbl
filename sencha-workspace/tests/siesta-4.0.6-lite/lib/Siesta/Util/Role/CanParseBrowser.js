/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Util.Role.CanParseBrowser

A mixin, providing browser name and version sniffing using UA string method.

*/
Role('Siesta.Util.Role.CanParseBrowser', {
    
    methods : { 
        
        parseBrowser : function (uaString) {
            var browser = 'unknown'
            var version = ''
            
            var match
            
            if (match = /Firefox\/((?:\d+\.?)+)/.exec(uaString)) {
                browser     = "Firefox"
                version     = match[ 1 ]
            }
            
            if (match = /Chrome\/((?:\d+\.?)+)/.exec(uaString)) {
                browser     = "Chrome"
                version     = match[ 1 ]
            }
            
            if (match = /MSIE\s*((?:\d+\.?)+)/.exec(uaString)) {
                browser     = "IE"
                version     = match[ 1 ]
            }
            
            if (uaString.match(/trident/i) && (match = /rv.(\d\d\.?\d?)/.exec(uaString))) {
                browser     = "IE"
                version     = match[ 1 ]
            }
            
            if (match = /Apple.*Version\/((?:\d+\.?)+)\s*(?=Safari\/((?:\d+\.?)+))/.exec(uaString)) {
                browser     = "Safari"
                version     = match[ 1 ] + ' (' + match[ 2 ] + ')'
            }
            
            if (match = /PhantomJS\/(\d+\.\d+\.\d+)/.exec(uaString)) {
                browser     = "PhantomJS"
                version     = match[ 1 ]
            }
            
            if (match = /SlimerJS\/(\d+\.\d+\.\d+)/.exec(uaString)) {
                browser     = "SlimerJS"
                version     = match[ 1 ]
            }
            
            return {
                name        : browser,
                version     : version
            }
        }
    }
});
