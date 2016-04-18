/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
;(function () {
    
var ID = 0

Class('Siesta.Result', {
    
    has : {
        description     : null,
        
        children        : Joose.I.Array,
        
        length          : 0,
        
        id              : function () {
            return ++ID
        },
        
        parent          : null
    },
    
    
    methods : {
        
        itemAt : function (i) {
            return this.children[ i ]
        },
        
        
        push        : function (result) {
            this.children.push(result)
            
            result.parent   = this
            
            this.length     = this.children.length
        },
        
        
        each : function (func, scope) {
            var children        = this.children
            
            if (func.call(scope || this, this) === false) return false
            
            for (var i = 0; i < children.length; i++)
                if (children[ i ].each(func, scope) === false) return false
        },
        
        
        eachChild : function (func, scope) {
            var children        = this.children
            
            for (var i = 0; i < children.length; i++)
                if (func.call(scope, children[ i ]) === false) return false
        },
        
        
        toString : function () {
            return this.description
        },
        
        
        toJSON : function () {
            return {
                type        : this.meta.name,
                description : this.description
            }
        },
        
        
        findChildById : function (id) {
            var child
            
            this.each(function (node) {
                if (node.id == id) { child = node; return false } 
            })
            
            return child
        }
    },
    
    // used for self-testing when we need different ids for outer context and context being tested
    my : {
        methods     : {
            seedID : function (value) {
                ID          = value
            }
        }
    }
        
})


})()