/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
// Localization helper
Siesta.Resource = (function () {
    
    var cacheByNamespace    = {}
    
    var Resource    = Class({
        does    : Siesta.Util.Role.CanFormatStrings,
        
        has     : {
            dict        : null
        },
        
        methods : {
            'get' : function (key, data) {
                var text = this.dict[ key ];
        
                if (text) return this.formatString(text, data);
        
                if (window.console && console.error) {
                    window.top.console.error('TEXT_NOT_DEFINED: ' + key);
                }
        
                return 'TEXT_NOT_DEFINED: ' + key;
            }
        }
    
    })
    

    return function (namespace, key, data) {
        var dictionary  = Siesta.CurrentLocale[ namespace ];

        if (!dictionary) {
            throw 'Missing dictionary for namespace: ' + namespace;
        }
        
        var resource    = cacheByNamespace[ namespace ]
        
        if (!resource) {
            resource    = cacheByNamespace[ namespace ] = new Resource({ dict : dictionary, serializeFormatingPlaceholders : false })
        }

        if (key) return resource.get(key, data)

        return resource
    }
})();
