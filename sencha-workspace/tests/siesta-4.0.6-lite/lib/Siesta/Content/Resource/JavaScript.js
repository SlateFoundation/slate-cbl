/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Class('Siesta.Content.Resource.JavaScript', {
    
    isa     : Siesta.Content.Resource,
    
    has     : {
        instrument          : false
    },
    
    
    methods : {
        
        asHTML : function () {
        },
        
        
        asDescriptor : function () {
            var res = {
                type        : 'js'
            }
            
            if (this.url)       res.url         = this.url
            if (this.content)   res.content     = this.content
            
            return res
        }
    }
        
})
//eof Siesta.Result

