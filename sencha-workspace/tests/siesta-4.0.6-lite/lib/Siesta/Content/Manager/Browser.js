/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta.Content.Manager.Browser', {
    
    isa     : Siesta.Content.Manager,
    
    has : {
        baseHost            : function () { return window.location.host },
        baseProtocol        : function () { return window.location.protocol }
    },
    
    
    methods : {
        
        load : function (url, onsuccess, onerror) {
            var match       = /^((?:https?|file):)?\/\/([^/]*)/i.exec(url)
            
            if (match && (match[ 1 ] && match[ 1 ] != this.baseProtocol || match[ 2 ] != this.baseHost)) {
                onerror('cross-domain access')
                
                return
            }
            
            var req = new JooseX.SimpleRequest()
            
            try {
                req.getText(url, true, function (success, text) {
                    
                    if (!success) { 
                        onerror(this + " not found") 
                        return 
                    }
                    
                    onsuccess(text)
                })
            } catch (e) {
                onerror(e)
            }
        }
    }
})

