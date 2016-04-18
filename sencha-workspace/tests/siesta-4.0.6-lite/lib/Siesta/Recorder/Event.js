/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
!function () {
    
var ID      = 1

Class('Siesta.Recorder.Event', {
    
    has : {
        id                  : function () { return ID++ },

        type                : null,

        timestamp           : null,

        // Alt, ctrl, meta, shift keys
        options             : null,
        
        x                   : null,
        y                   : null,
        
        target              : null,
        
        charCode            : null,
        keyCode             : null,
        
        button              : null
    },
    
    
    methods : {
    },
    
    
    my : {
        has : {
            ID              : 1,
            HOST            : null,
            isFirefox       : /firefox/i.test(navigator.userAgent)
        },
        
        methods : {
            
            fromDomEvent : function (e) {
                var options     = {}

                ;[ 'altKey', 'ctrlKey', 'metaKey', 'shiftKey' ].forEach(function (id) {
                    if (e[ id ]) options[ id ] = true;
                });
                
                var config          = {
                    type            : e.type,
                    target          : e.target,
                    timestamp       : Date.now && Date.now() || e.timeStamp, // Firefox / Chrome doesn't have stable timeStamp implementation https://bugzilla.mozilla.org/show_bug.cgi?id=1186218
                                                  // https://googlechrome.github.io/samples/event-timestamp/index.html
                    options         : options
                }
                
                if (e.type.match(/^key/)) {
                    config.charCode = e.charCode || e.keyCode;
                    config.keyCode  = e.keyCode;
                } else {
                    // Overcomplicated due to IE9
                    var bodyEl      = e.target && e.target.ownerDocument && e.target.ownerDocument.body;
                    var docEl       = e.target && e.target.ownerDocument.documentElement;
                                                            //Chrome              Firefox
                    var pageX       = bodyEl ? e.clientX + (bodyEl.scrollLeft || docEl.scrollLeft): e.pageX;
                    var pageY       = bodyEl ? e.clientY + (bodyEl.scrollTop || docEl.scrollTop): e.pageY;

                    config.x        = pageX;
                    config.y        = pageY;
    
                    config.button   = e.button;
                }
                
                return new this.HOST(config)
            }
        }
    }

});

}();