;!function () {;
var Joose = {}

// configuration hash

Joose.C             = typeof JOOSE_CFG != 'undefined' ? JOOSE_CFG : {}

Joose.is_IE         = '\v' == 'v'
Joose.is_NodeJS     = Boolean(typeof process != 'undefined' && process.pid)


Joose.top           = Joose.is_NodeJS && global || this

Joose.stub          = function () {
    return function () { throw new Error("Modules can not be instantiated") }
}


Joose.VERSION       = ({ /*PKGVERSION*/VERSION : '3.50.1' }).VERSION


if (typeof module != 'undefined') module.exports = Joose
/*if (!Joose.is_NodeJS) */
this.Joose = Joose


// Static helpers for Arrays
Joose.A = {

    each : function (array, func, scope) {
        scope = scope || this
        
        for (var i = 0, len = array.length; i < len; i++) 
            if (func.call(scope, array[i], i) === false) return false
    },
    
    
    eachR : function (array, func, scope) {
        scope = scope || this

        for (var i = array.length - 1; i >= 0; i--) 
            if (func.call(scope, array[i], i) === false) return false
    },
    
    
    exists : function (array, value) {
        for (var i = 0, len = array.length; i < len; i++) if (array[i] == value) return true
            
        return false
    },
    
    
    map : function (array, func, scope) {
        scope = scope || this
        
        var res = []
        
        for (var i = 0, len = array.length; i < len; i++) 
            res.push( func.call(scope, array[i], i) )
            
        return res
    },
    

    grep : function (array, func) {
        var a = []
        
        Joose.A.each(array, function (t) {
            if (func(t)) a.push(t)
        })
        
        return a
    },
    
    
    remove : function (array, removeEle) {
        var a = []
        
        Joose.A.each(array, function (t) {
            if (t !== removeEle) a.push(t)
        })
        
        return a
    }
    
}

// Static helpers for Strings
Joose.S = {
    
    saneSplit : function (str, delimeter) {
        var res = (str || '').split(delimeter)
        
        if (res.length == 1 && !res[0]) res.shift()
        
        return res
    },
    

    uppercaseFirst : function (string) { 
        return string.substr(0, 1).toUpperCase() + string.substr(1, string.length - 1)
    },
    
    
    strToClass : function (name, top) {
        var current = top || Joose.top
        
        Joose.A.each(name.split('.'), function (segment) {
            if (current) 
                current = current[ segment ]
            else
                return false
        })
        
        return current
    }
}

var baseFunc    = function () {}

var enumProps   = [ 'hasOwnProperty', 'valueOf', 'toString', 'constructor' ]

var manualEnum  = true

for (var i in { toString : 1 }) manualEnum = false


// Static helpers for objects
Joose.O = {

    each : function (object, func, scope) {
        scope = scope || this
        
        for (var i in object) 
            if (func.call(scope, object[i], i) === false) return false
        
        if (manualEnum) 
            return Joose.A.each(enumProps, function (el) {
                
                if (object.hasOwnProperty(el)) return func.call(scope, object[el], el)
            })
    },
    
    
    eachOwn : function (object, func, scope) {
        scope = scope || this
        
        return Joose.O.each(object, function (value, name) {
            if (object.hasOwnProperty(name)) return func.call(scope, value, name)
        }, scope)
    },
    
    
    copy : function (source, target) {
        target = target || {}
        
        Joose.O.each(source, function (value, name) { target[name] = value })
        
        return target
    },
    
    
    copyOwn : function (source, target) {
        target = target || {}
        
        Joose.O.eachOwn(source, function (value, name) { target[name] = value })
        
        return target
    },
    
    
    getMutableCopy : function (object) {
        baseFunc.prototype = object
        
        return new baseFunc()
    },
    
    
    extend : function (target, source) {
        return Joose.O.copy(source, target)
    },
    
    
    isEmpty : function (object) {
        for (var i in object) if (object.hasOwnProperty(i)) return false
        
        return true
    },
    
    
    isInstance: function (obj) {
        return obj && obj.meta && obj.constructor == obj.meta.c
    },
    
    
    isClass : function (obj) {
        return obj && obj.meta && obj.meta.c == obj
    },
    
    
    wantArray : function (obj) {
        if (obj instanceof Array) return obj
        
        return [ obj ]
    },
    
    
    // this was a bug in WebKit, which gives typeof / / == 'function'
    // should be monitored and removed at some point in the future
    isFunction : function (obj) {
        return typeof obj == 'function' && obj.constructor != / /.constructor
    }
}


//initializers

Joose.I = {
    Array       : function () { return [] },
    Object      : function () { return {} },
    Function    : function () { return arguments.callee },
    Now         : function () { return new Date() }
};
Joose.Proto = Joose.stub()

Joose.Proto.Empty = Joose.stub()
    
Joose.Proto.Empty.meta = {};
;(function () {

    Joose.Proto.Object = Joose.stub()
    
    
    var SUPER = function () {
        var self = SUPER.caller
        
        if (self == SUPERARG) self = self.caller
        
        if (!self.SUPER) throw "Invalid call to SUPER"
        
        return self.SUPER[self.methodName].apply(this, arguments)
    }
    
    
    var SUPERARG = function () {
        return this.SUPER.apply(this, arguments[0])
    }
    
    
    
    Joose.Proto.Object.prototype = {
        
        SUPERARG : SUPERARG,
        SUPER : SUPER,
        
        INNER : function () {
            throw "Invalid call to INNER"
        },                
        
        
        BUILD : function (config) {
            return arguments.length == 1 && typeof config == 'object' && config || {}
        },
        
        
        initialize: function () {
        },
        
        
        toString: function () {
            return "a " + this.meta.name
        }
        
    }
        
    Joose.Proto.Object.meta = {
        constructor     : Joose.Proto.Object,
        
        methods         : Joose.O.copy(Joose.Proto.Object.prototype),
        attributes      : {}
    }
    
    Joose.Proto.Object.prototype.meta = Joose.Proto.Object.meta

})();
;(function () {

    Joose.Proto.Class = function () {
        return this.initialize(this.BUILD.apply(this, arguments)) || this
    }
    
    var bootstrap = {
        
        VERSION             : null,
        AUTHORITY           : null,
        
        constructor         : Joose.Proto.Class,
        superClass          : null,
        
        name                : null,
        
        attributes          : null,
        methods             : null,
        
        meta                : null,
        c                   : null,
        
        defaultSuperClass   : Joose.Proto.Object,
        
        
        BUILD : function (name, extend) {
            this.name = name
            
            return { __extend__ : extend || {} }
        },
        
        
        initialize: function (props) {
            var extend      = props.__extend__
            
            this.VERSION    = extend.VERSION
            this.AUTHORITY  = extend.AUTHORITY
            
            delete extend.VERSION
            delete extend.AUTHORITY
            
            this.c = this.extractConstructor(extend)
            
            this.adaptConstructor(this.c)
            
            if (extend.constructorOnly) {
                delete extend.constructorOnly
                return
            }
            
            this.construct(extend)
        },
        
        
        construct : function (extend) {
            if (!this.prepareProps(extend)) return
            
            var superClass = this.superClass = this.extractSuperClass(extend)
            
            this.processSuperClass(superClass)
            
            this.adaptPrototype(this.c.prototype)
            
            this.finalize(extend)
        },
        
        
        finalize : function (extend) {
            this.processStem(extend)
            
            this.extend(extend)
        },
        
        
        //if the extension returns false from this method it should re-enter 'construct'
        prepareProps : function (extend) {
            return true
        },
        
        
        extractConstructor : function (extend) {
            var res = extend.hasOwnProperty('constructor') ? extend.constructor : this.defaultConstructor()
            
            delete extend.constructor
            
            return res
        },
        
        
        extractSuperClass : function (extend) {
            if (extend.hasOwnProperty('isa') && !extend.isa) throw new Error("Attempt to inherit from undefined superclass [" + this.name + "]")
            
            var res = extend.isa || this.defaultSuperClass
            
            delete extend.isa
            
            return res
        },
        
        
        processStem : function () {
            var superMeta       = this.superClass.meta
            
            this.methods        = Joose.O.getMutableCopy(superMeta.methods || {})
            this.attributes     = Joose.O.getMutableCopy(superMeta.attributes || {})
        },
        
        
        initInstance : function (instance, props) {
            Joose.O.copyOwn(props, instance)
        },
        
        
        defaultConstructor: function () {
            return function (arg) {
                var BUILD = this.BUILD
                
                var args = BUILD && BUILD.apply(this, arguments) || arg || {}
                
                var thisMeta    = this.meta
                
                thisMeta.initInstance(this, args)
                
                return thisMeta.hasMethod('initialize') && this.initialize(args) || this
            }
        },
        
        
        processSuperClass: function (superClass) {
            var superProto      = superClass.prototype
            
            //non-Joose superclasses
            if (!superClass.meta) {
                
                var extend = Joose.O.copy(superProto)
                
                extend.isa = Joose.Proto.Empty
                // clear potential value in the `extend.constructor` to prevent it from being modified
                delete extend.constructor
                
                var meta = new this.defaultSuperClass.meta.constructor(null, extend)
                
                superClass.meta = superProto.meta = meta
                
                meta.c = superClass
            }
            
            this.c.prototype    = Joose.O.getMutableCopy(superProto)
            this.c.superClass   = superProto
        },
        
        
        adaptConstructor: function (c) {
            c.meta = this
            
            if (!c.hasOwnProperty('toString')) c.toString = function () { return this.meta.name }
        },
    
        
        adaptPrototype: function (proto) {
            //this will fix weird semantic of native "constructor" property to more intuitive (idea borrowed from Ext)
            proto.constructor   = this.c
            proto.meta          = this
        },
        
        
        addMethod: function (name, func) {
            func.SUPER = this.superClass.prototype
            
            //chrome don't allow to redefine the "name" property
            func.methodName = name
            
            this.methods[name] = func
            this.c.prototype[name] = func
        },
        
        
        addAttribute: function (name, init) {
            this.attributes[name] = init
            this.c.prototype[name] = init
        },
        
        
        removeMethod : function (name) {
            delete this.methods[name]
            delete this.c.prototype[name]
        },
    
        
        removeAttribute: function (name) {
            delete this.attributes[name]
            delete this.c.prototype[name]
        },
        
        
        hasMethod: function (name) { 
            return Boolean(this.methods[name])
        },
        
        
        hasAttribute: function (name) { 
            return this.attributes[name] !== undefined
        },
        
    
        hasOwnMethod: function (name) { 
            return this.hasMethod(name) && this.methods.hasOwnProperty(name)
        },
        
        
        hasOwnAttribute: function (name) { 
            return this.hasAttribute(name) && this.attributes.hasOwnProperty(name)
        },
        
        
        extend : function (props) {
            Joose.O.eachOwn(props, function (value, name) {
                if (name != 'meta' && name != 'constructor') 
                    if (Joose.O.isFunction(value) && !value.meta) 
                        this.addMethod(name, value) 
                    else 
                        this.addAttribute(name, value)
            }, this)
        },
        
        
        subClassOf : function (classObject, extend) {
            return this.subClass(extend, null, classObject)
        },
    
    
        subClass : function (extend, name, classObject) {
            extend      = extend        || {}
            extend.isa  = classObject   || this.c
            
            return new this.constructor(name, extend).c
        },
        
        
        instantiate : function () {
            var f = function () {}
            
            f.prototype = this.c.prototype
            
            var obj = new f()
            
            return this.c.apply(obj, arguments) || obj
        }
    }
    
    //micro bootstraping
    
    Joose.Proto.Class.prototype = Joose.O.getMutableCopy(Joose.Proto.Object.prototype)
    
    Joose.O.extend(Joose.Proto.Class.prototype, bootstrap)
    
    Joose.Proto.Class.prototype.meta = new Joose.Proto.Class('Joose.Proto.Class', bootstrap)
    
    
    
    Joose.Proto.Class.meta.addMethod('isa', function (someClass) {
        var f = function () {}
        
        f.prototype = this.c.prototype
        
        return new f() instanceof someClass
    })
})();
Joose.Managed = Joose.stub()

Joose.Managed.Property = new Joose.Proto.Class('Joose.Managed.Property', {
    
    name            : null,
    
    init            : null,
    value           : null,
    
    definedIn       : null,
    
    
    initialize : function (props) {
        Joose.Managed.Property.superClass.initialize.call(this, props)
        
        this.computeValue()
    },
    
    
    computeValue : function () {
        this.value = this.init
    },    
    
    
    //targetClass is still open at this stage
    preApply : function (targetClass) {
    },
    

    //targetClass is already open at this stage
    postUnApply : function (targetClass) {
    },
    
    
    apply : function (target) {
        target[this.name] = this.value
    },
    
    
    isAppliedTo : function (target) {
        return target[this.name] == this.value
    },
    
    
    unapply : function (from) {
        if (!this.isAppliedTo(from)) throw "Unapply of property [" + this.name + "] from [" + from + "] failed"
        
        delete from[this.name]
    },
    
    
    cloneProps : function () {
        return {
            name        : this.name, 
            init        : this.init,
            definedIn   : this.definedIn
        }
    },

    
    clone : function (name) {
        var props = this.cloneProps()
        
        props.name = name || props.name
        
        return new this.constructor(props)
    }
    
    
}).c;
Joose.Managed.Property.ConflictMarker = new Joose.Proto.Class('Joose.Managed.Property.ConflictMarker', {
    
    isa : Joose.Managed.Property,

    apply : function (target) {
        throw new Error("Attempt to apply ConflictMarker [" + this.name + "] to [" + target + "]")
    }
    
}).c;
Joose.Managed.Property.Requirement = new Joose.Proto.Class('Joose.Managed.Property.Requirement', {
    
    isa : Joose.Managed.Property,

    
    apply : function (target) {
        if (!target.meta.hasMethod(this.name)) 
            throw new Error("Requirement [" + this.name + "], defined in [" + this.definedIn.definedIn.name + "] is not satisfied for class [" + target + "]")
    },
    
    
    unapply : function (from) {
    }
    
}).c;
Joose.Managed.Property.Attribute = new Joose.Proto.Class('Joose.Managed.Property.Attribute', {
    
    isa : Joose.Managed.Property,
    
    slot                : null,
    
    
    initialize : function () {
        Joose.Managed.Property.Attribute.superClass.initialize.apply(this, arguments)
        
        this.slot = this.name
    },
    
    
    apply : function (target) {
        target.prototype[ this.slot ] = this.value
    },
    
    
    isAppliedTo : function (target) {
        return target.prototype[ this.slot ] == this.value
    },
    
    
    unapply : function (from) {
        if (!this.isAppliedTo(from)) throw "Unapply of property [" + this.name + "] from [" + from + "] failed"
        
        delete from.prototype[this.slot]
    },
    
    
    clearValue : function (instance) {
        delete instance[ this.slot ]
    },
    
    
    hasValue : function (instance) {
        return instance.hasOwnProperty(this.slot)
    },
        
        
    getRawValueFrom : function (instance) {
        return instance[ this.slot ]
    },
    
    
    setRawValueTo : function (instance, value) {
        instance[ this.slot ] = value
        
        return this
    }
    
}).c;
Joose.Managed.Property.MethodModifier = new Joose.Proto.Class('Joose.Managed.Property.MethodModifier', {
    
    isa : Joose.Managed.Property,

    
    prepareWrapper : function () {
        throw "Abstract method [prepareWrapper] of " + this + " was called"
    },
    
    
    apply : function (target) {
        var name            = this.name
        var targetProto     = target.prototype
        var isOwn           = targetProto.hasOwnProperty(name)
        var original        = targetProto[name]
        var superProto      = target.meta.superClass.prototype
        
        
        var originalCall = isOwn ? original : function () { 
            return superProto[name].apply(this, arguments) 
        }
        
        var methodWrapper = this.prepareWrapper({
            name            : name,
            modifier        : this.value, 
            
            isOwn           : isOwn,
            originalCall    : originalCall, 
            
            superProto      : superProto,
            
            target          : target
        })
        
        if (isOwn) methodWrapper.__ORIGINAL__ = original
        
        methodWrapper.__CONTAIN__   = this.value
        methodWrapper.__METHOD__    = this
        this.value.displayName      = this.getDisplayName(target)
        methodWrapper.displayName   = 'internal wrapper' 
        
        targetProto[name] = methodWrapper
    },
    
    
    getDisplayName : function (target) {
        return target.meta.name + '[' + this.name + ']'
    },
    
    
    isAppliedTo : function (target) {
        var targetCont = target.prototype[this.name]
        
        return targetCont && targetCont.__CONTAIN__ == this.value
    },
    
    
    unapply : function (from) {
        var name = this.name
        var fromProto = from.prototype
        var original = fromProto[name].__ORIGINAL__
        
        if (!this.isAppliedTo(from)) throw "Unapply of method [" + name + "] from class [" + from + "] failed"
        
        //if modifier was applied to own method - restore it
        if (original) 
            fromProto[name] = original
        //otherwise - just delete it, to reveal the inherited method 
        else
            delete fromProto[name]
    }
    
}).c;
Joose.Managed.Property.MethodModifier.Override = new Joose.Proto.Class('Joose.Managed.Property.MethodModifier.Override', {
    
    isa : Joose.Managed.Property.MethodModifier,

    
    prepareWrapper : function (params) {
        
        var modifier        = params.modifier
        var originalCall    = params.originalCall
        var superProto      = params.superProto
        var superMetaConst  = superProto.meta.constructor
        
        //call to Joose.Proto level, require some additional processing
        var isCallToProto = (superMetaConst == Joose.Proto.Class || superMetaConst == Joose.Proto.Object) && !(params.isOwn && originalCall.IS_OVERRIDE) 
        
        var original = originalCall
        
        if (isCallToProto) original = function () {
            var beforeSUPER = this.SUPER
            
            this.SUPER  = superProto.SUPER
            
            var res = originalCall.apply(this, arguments)
            
            this.SUPER = beforeSUPER
            
            return res
        }

        var override = function () {
            
            var beforeSUPER = this.SUPER
            
            this.SUPER  = original
            
            var res = modifier.apply(this, arguments)
            
            this.SUPER = beforeSUPER
            
            return res
        }
        
        override.IS_OVERRIDE = true
        
        return override
    },
    
    getDisplayName : function (target) {
        return target.meta.name + '[override ' + this.name + ']'
    }
    
    
}).c;
Joose.Managed.Property.MethodModifier.Put = new Joose.Proto.Class('Joose.Managed.Property.MethodModifier.Put', {
    
    isa : Joose.Managed.Property.MethodModifier.Override,


    prepareWrapper : function (params) {
        
        if (params.isOwn) throw "Method [" + params.name + "] is applying over something [" + params.originalCall + "] in class [" + params.target + "]"
        
        return Joose.Managed.Property.MethodModifier.Put.superClass.prepareWrapper.call(this, params)
    },
    
    getDisplayName : function (target) {
        return target.meta.name + '[' + this.name + ']'
    }
    
    
}).c;
Joose.Managed.Property.MethodModifier.After = new Joose.Proto.Class('Joose.Managed.Property.MethodModifier.After', {
    
    isa : Joose.Managed.Property.MethodModifier,

    
    prepareWrapper : function (params) {
        
        var modifier        = params.modifier
        var originalCall    = params.originalCall
        
        return function () {
            var res = originalCall.apply(this, arguments)
            modifier.apply(this, arguments)
            return res
        }
    },
    
    getDisplayName : function (target) {
        return target.meta.name + '[after ' + this.name + ']'
    }
    
}).c;
Joose.Managed.Property.MethodModifier.Before = new Joose.Proto.Class('Joose.Managed.Property.MethodModifier.Before', {
    
    isa : Joose.Managed.Property.MethodModifier,

    
    prepareWrapper : function (params) {
        
        var modifier        = params.modifier
        var originalCall    = params.originalCall
        
        return function () {
            modifier.apply(this, arguments)
            return originalCall.apply(this, arguments)
        }
    },
    
    getDisplayName : function (target) {
        return target.meta.name + '[before ' + this.name + ']'
    }
    
}).c;
Joose.Managed.Property.MethodModifier.Around = new Joose.Proto.Class('Joose.Managed.Property.MethodModifier.Around', {
    
    isa : Joose.Managed.Property.MethodModifier,

    prepareWrapper : function (params) {
        
        var modifier        = params.modifier
        var originalCall    = params.originalCall
        
        var me
        
        var bound = function () {
            return originalCall.apply(me, arguments)
        }
            
        return function () {
            me = this
            
            var boundArr = [ bound ]
            boundArr.push.apply(boundArr, arguments)
            
            return modifier.apply(this, boundArr)
        }
    },
    
    getDisplayName : function (target) {
        return target.meta.name + '[around ' + this.name + ']'
    }
    
}).c;
Joose.Managed.Property.MethodModifier.Augment = new Joose.Proto.Class('Joose.Managed.Property.MethodModifier.Augment', {
    
    isa : Joose.Managed.Property.MethodModifier,

    
    prepareWrapper : function (params) {
        
        var AUGMENT = function () {
            
            //populate callstack to the most deep non-augment method
            var callstack = []
            
            var self = AUGMENT
            
            do {
                callstack.push(self.IS_AUGMENT ? self.__CONTAIN__ : self)
                
                self = self.IS_AUGMENT && (self.__ORIGINAL__ || self.SUPER[self.methodName])
            } while (self)
            
            
            //save previous INNER
            var beforeINNER = this.INNER
            
            //create new INNER
            this.INNER = function () {
                var innerCall = callstack.pop()
                
                return innerCall ? innerCall.apply(this, arguments) : undefined
            }
            
            //augment modifier results in hypotetical INNER call of the same method in subclass 
            var res = this.INNER.apply(this, arguments)
            
            //restore previous INNER chain
            this.INNER = beforeINNER
            
            return res
        }
        
        AUGMENT.methodName  = params.name
        AUGMENT.SUPER       = params.superProto
        AUGMENT.IS_AUGMENT  = true
        
        return AUGMENT
    },
    
    getDisplayName : function (target) {
        return target.meta.name + '[augment ' + this.name + ']'
    }
    
}).c;
Joose.Managed.PropertySet = new Joose.Proto.Class('Joose.Managed.PropertySet', {
    
    isa                       : Joose.Managed.Property,

    properties                : null,
    
    propertyMetaClass         : Joose.Managed.Property,
    
    
    initialize : function (props) {
        Joose.Managed.PropertySet.superClass.initialize.call(this, props)
        
        //XXX this guards the meta roles :)
        this.properties = props.properties || {}
    },
    
    
    addProperty : function (name, props) {
        var metaClass = props.meta || this.propertyMetaClass
        delete props.meta
        
        props.definedIn     = this
        props.name          = name
        
        return this.properties[name] = new metaClass(props)
    },
    
    
    addPropertyObject : function (object) {
        return this.properties[object.name] = object
    },
    
    
    removeProperty : function (name) {
        var prop = this.properties[name]
        
        delete this.properties[name]
        
        return prop
    },
    
    
    haveProperty : function (name) {
        return this.properties[name] != null
    },
    

    haveOwnProperty : function (name) {
        return this.haveProperty(name) && this.properties.hasOwnProperty(name)
    },
    
    
    getProperty : function (name) {
        return this.properties[name]
    },
    
    
    //includes inherited properties (probably you wants 'eachOwn', which process only "own" (including consumed from Roles) properties) 
    each : function (func, scope) {
        Joose.O.each(this.properties, func, scope || this)
    },
    
    
    eachOwn : function (func, scope) {
        Joose.O.eachOwn(this.properties, func, scope || this)
    },
    
    
    //synonym for each
    eachAll : function (func, scope) {
        this.each(func, scope)
    },
    
    
    cloneProps : function () {
        var props = Joose.Managed.PropertySet.superClass.cloneProps.call(this)
        
        props.propertyMetaClass     = this.propertyMetaClass
        
        return props
    },
    
    
    clone : function (name) {
        var clone = this.cleanClone(name)
        
        clone.properties = Joose.O.copyOwn(this.properties)
        
        return clone
    },
    
    
    cleanClone : function (name) {
        var props = this.cloneProps()
        
        props.name = name || props.name
        
        return new this.constructor(props)
    },
    
    
    alias : function (what) {
        var props = this.properties
        
        Joose.O.each(what, function (aliasName, originalName) {
            var original = props[originalName]
            
            if (original) this.addPropertyObject(original.clone(aliasName))
        }, this)
    },
    
    
    exclude : function (what) {
        var props = this.properties
        
        Joose.A.each(what, function (name) {
            delete props[name]
        })
    },
    
    
    beforeConsumedBy : function () {
    },
    
    
    flattenTo : function (target) {
        var targetProps = target.properties
        
        this.eachOwn(function (property, name) {
            var targetProperty = targetProps[name]
            
            if (targetProperty instanceof Joose.Managed.Property.ConflictMarker) return
            
            if (!targetProps.hasOwnProperty(name) || targetProperty == null) {
                target.addPropertyObject(property)
                return
            }
            
            if (targetProperty == property) return
            
            target.removeProperty(name)
            target.addProperty(name, {
                meta : Joose.Managed.Property.ConflictMarker
            })
        }, this)
    },
    
    
    composeTo : function (target) {
        this.eachOwn(function (property, name) {
            if (!target.haveOwnProperty(name)) target.addPropertyObject(property)
        })
    },
    
    
    composeFrom : function () {
        if (!arguments.length) return
        
        var flattening = this.cleanClone()
        
        Joose.A.each(arguments, function (arg) {
            var isDescriptor    = !(arg instanceof Joose.Managed.PropertySet)
            var propSet         = isDescriptor ? arg.propertySet : arg
            
            propSet.beforeConsumedBy(this, flattening)
            
            if (isDescriptor) {
                if (arg.alias || arg.exclude)   propSet = propSet.clone()
                if (arg.alias)                  propSet.alias(arg.alias)
                if (arg.exclude)                propSet.exclude(arg.exclude)
            }
            
            propSet.flattenTo(flattening)
        }, this)
        
        flattening.composeTo(this)
    },
    
    
    preApply : function (target) {
        this.eachOwn(function (property) {
            property.preApply(target)
        })
    },
    
    
    apply : function (target) {
        this.eachOwn(function (property) {
            property.apply(target)
        })
    },
    
    
    unapply : function (from) {
        this.eachOwn(function (property) {
            property.unapply(from)
        })
    },
    
    
    postUnApply : function (target) {
        this.eachOwn(function (property) {
            property.postUnApply(target)
        })
    }
    
}).c
;
var __ID__ = 1


Joose.Managed.PropertySet.Mutable = new Joose.Proto.Class('Joose.Managed.PropertySet.Mutable', {
    
    isa                 : Joose.Managed.PropertySet,

    ID                  : null,
    
    derivatives         : null,
    
    opened              : null,
    
    composedFrom        : null,
    
    
    initialize : function (props) {
        Joose.Managed.PropertySet.Mutable.superClass.initialize.call(this, props)
        
        //initially opened
        this.opened             = 1
        this.derivatives        = {}
        this.ID                 = __ID__++
        this.composedFrom       = []
    },
    
    
    addComposeInfo : function () {
        this.ensureOpen()
        
        Joose.A.each(arguments, function (arg) {
            this.composedFrom.push(arg)
            
            var propSet = arg instanceof Joose.Managed.PropertySet ? arg : arg.propertySet
                
            propSet.derivatives[this.ID] = this
        }, this)
    },
    
    
    removeComposeInfo : function () {
        this.ensureOpen()
        
        Joose.A.each(arguments, function (arg) {
            
            var i = 0
            
            while (i < this.composedFrom.length) {
                var propSet = this.composedFrom[i]
                propSet = propSet instanceof Joose.Managed.PropertySet ? propSet : propSet.propertySet
                
                if (arg == propSet) {
                    delete propSet.derivatives[this.ID]
                    this.composedFrom.splice(i, 1)
                } else i++
            }
            
        }, this)
    },
    
    
    ensureOpen : function () {
        if (!this.opened) throw "Mutation of closed property set: [" + this.name + "]"
    },
    
    
    addProperty : function (name, props) {
        this.ensureOpen()
        
        return Joose.Managed.PropertySet.Mutable.superClass.addProperty.call(this, name, props)
    },
    

    addPropertyObject : function (object) {
        this.ensureOpen()
        
        return Joose.Managed.PropertySet.Mutable.superClass.addPropertyObject.call(this, object)
    },
    
    
    removeProperty : function (name) {
        this.ensureOpen()
        
        return Joose.Managed.PropertySet.Mutable.superClass.removeProperty.call(this, name)
    },
    
    
    composeFrom : function () {
        this.ensureOpen()
        
        return Joose.Managed.PropertySet.Mutable.superClass.composeFrom.apply(this, this.composedFrom)
    },
    
    
    open : function () {
        this.opened++
        
        if (this.opened == 1) {
        
            Joose.O.each(this.derivatives, function (propSet) {
                propSet.open()
            })
            
            this.deCompose()
        }
    },
    
    
    close : function () {
        if (!this.opened) throw "Unmatched 'close' operation on property set: [" + this.name + "]"
        
        if (this.opened == 1) {
            this.reCompose()
            
            Joose.O.each(this.derivatives, function (propSet) {
                propSet.close()
            })
        }
        this.opened--
    },
    
    
    reCompose : function () {
        this.composeFrom()
    },
    
    
    deCompose : function () {
        this.eachOwn(function (property, name) {
            if (property.definedIn != this) this.removeProperty(name)
        }, this)
    }
    
}).c;
Joose.Managed.StemElement = function () { throw "Modules may not be instantiated." }

Joose.Managed.StemElement.Attributes = new Joose.Proto.Class('Joose.Managed.StemElement.Attributes', {
    
    isa                     : Joose.Managed.PropertySet.Mutable,
    
    propertyMetaClass       : Joose.Managed.Property.Attribute
    
}).c
;
Joose.Managed.StemElement.Methods = new Joose.Proto.Class('Joose.Managed.StemElement.Methods', {
    
    isa : Joose.Managed.PropertySet.Mutable,
    
    propertyMetaClass : Joose.Managed.Property.MethodModifier.Put,

    
    preApply : function () {
    },
    
    
    postUnApply : function () {
    }
    
}).c;
Joose.Managed.StemElement.Requirements = new Joose.Proto.Class('Joose.Managed.StemElement.Requirements', {

    isa                     : Joose.Managed.PropertySet.Mutable,
    
    propertyMetaClass       : Joose.Managed.Property.Requirement,
    
    
    
    alias : function () {
    },
    
    
    exclude : function () {
    },
    
    
    flattenTo : function (target) {
        this.each(function (property, name) {
            if (!target.haveProperty(name)) target.addPropertyObject(property)
        })
    },
    
    
    composeTo : function (target) {
        this.flattenTo(target)
    },
    
    
    preApply : function () {
    },
    
    
    postUnApply : function () {
    }
    
}).c;
Joose.Managed.StemElement.MethodModifiers = new Joose.Proto.Class('Joose.Managed.StemElement.MethodModifiers', {

    isa                     : Joose.Managed.PropertySet.Mutable,
    
    propertyMetaClass       : null,
    
    
    addProperty : function (name, props) {
        var metaClass = props.meta
        delete props.meta
        
        props.definedIn         = this
        props.name              = name
        
        var modifier            = new metaClass(props)
        var properties          = this.properties
        
        if (!properties[name]) properties[ name ] = []
        
        properties[name].push(modifier)
        
        return modifier
    },
    

    addPropertyObject : function (object) {
        var name            = object.name
        var properties      = this.properties
        
        if (!properties[name]) properties[name] = []
        
        properties[name].push(object)
        
        return object
    },
    
    
    //remove only the last modifier
    removeProperty : function (name) {
        if (!this.haveProperty(name)) return undefined
        
        var properties      = this.properties
        var modifier        = properties[ name ].pop()
        
        //if all modifiers were removed - clearing the properties
        if (!properties[name].length) Joose.Managed.StemElement.MethodModifiers.superClass.removeProperty.call(this, name)
        
        return modifier
    },
    
    
    alias : function () {
    },
    
    
    exclude : function () {
    },
    
    
    flattenTo : function (target) {
        var targetProps = target.properties
        
        this.each(function (modifiersArr, name) {
            var targetModifiersArr = targetProps[name]
            
            if (targetModifiersArr == null) targetModifiersArr = targetProps[name] = []
            
            Joose.A.each(modifiersArr, function (modifier) {
                if (!Joose.A.exists(targetModifiersArr, modifier)) targetModifiersArr.push(modifier)
            })
            
        })
    },
    
    
    composeTo : function (target) {
        this.flattenTo(target)
    },

    
    deCompose : function () {
        this.each(function (modifiersArr, name) {
            var i = 0
            
            while (i < modifiersArr.length) 
                if (modifiersArr[i].definedIn != this) 
                    modifiersArr.splice(i, 1)
                else 
                    i++
        })
    },
    
    
    preApply : function (target) {
    },

    
    postUnApply : function (target) {
    },
    
    
    apply : function (target) {
        this.each(function (modifiersArr, name) {
            Joose.A.each(modifiersArr, function (modifier) {
                modifier.apply(target)
            })
        })
    },
    
    
    unapply : function (from) {
        this.each(function (modifiersArr, name) {
            for (var i = modifiersArr.length - 1; i >=0 ; i--) modifiersArr[i].unapply(from)
        })
    }
    
    
    
}).c;
Joose.Managed.PropertySet.Composition = new Joose.Proto.Class('Joose.Managed.PropertySet.Composition', {
    
    isa                         : Joose.Managed.PropertySet.Mutable,
    
    propertyMetaClass           : Joose.Managed.PropertySet.Mutable,
    
    processOrder                : null,

    
    each : function (func, scope) {
        var props   = this.properties
        var scope   = scope || this
        
        Joose.A.each(this.processOrder, function (name) {
            func.call(scope, props[name], name)
        })
    },
    
    
    eachR : function (func, scope) {
        var props   = this.properties
        var scope   = scope || this
        
        Joose.A.eachR(this.processOrder, function (name) {
            func.call(scope, props[name], name)
        })
        
        
//        var props           = this.properties
//        var processOrder    = this.processOrder
//        
//        for(var i = processOrder.length - 1; i >= 0; i--) 
//            func.call(scope || this, props[ processOrder[i] ], processOrder[i])
    },
    
    
    clone : function (name) {
        var clone = this.cleanClone(name)
        
        this.each(function (property) {
            clone.addPropertyObject(property.clone())
        })
        
        return clone
    },
    
    
    alias : function (what) {
        this.each(function (property) {
            property.alias(what)
        })
    },
    
    
    exclude : function (what) {
        this.each(function (property) {
            property.exclude(what)
        })
    },
    
    
    flattenTo : function (target) {
        var targetProps = target.properties
        
        this.each(function (property, name) {
            var subTarget = targetProps[name] || target.addProperty(name, {
                meta : property.constructor
            })
            
            property.flattenTo(subTarget)
        })
    },
    
    
    composeTo : function (target) {
        var targetProps = target.properties
        
        this.each(function (property, name) {
            var subTarget = targetProps[name] || target.addProperty(name, {
                meta : property.constructor
            })
            
            property.composeTo(subTarget)
        })
    },
    
    
    
    deCompose : function () {
        this.eachR(function (property) {
            property.open()
        })
        
        Joose.Managed.PropertySet.Composition.superClass.deCompose.call(this)
    },
    
    
    reCompose : function () {
        Joose.Managed.PropertySet.Composition.superClass.reCompose.call(this)
        
        this.each(function (property) {
            property.close()
        })
    },
    
    
    unapply : function (from) {
        this.eachR(function (property) {
            property.unapply(from)
        })
    }
    
}).c
;
Joose.Managed.Stem = new Joose.Proto.Class('Joose.Managed.Stem', {
    
    isa                  : Joose.Managed.PropertySet.Composition,
    
    targetMeta           : null,
    
    attributesMC         : Joose.Managed.StemElement.Attributes,
    methodsMC            : Joose.Managed.StemElement.Methods,
    requirementsMC       : Joose.Managed.StemElement.Requirements,
    methodsModifiersMC   : Joose.Managed.StemElement.MethodModifiers,
    
    processOrder         : [ 'attributes', 'methods', 'requirements', 'methodsModifiers' ],
    
    
    initialize : function (props) {
        Joose.Managed.Stem.superClass.initialize.call(this, props)
        
        var targetMeta = this.targetMeta
        
        this.addProperty('attributes', {
            meta : this.attributesMC,
            
            //it can be no 'targetMeta' in clones
            properties : targetMeta ? targetMeta.attributes : {}
        })
        
        
        this.addProperty('methods', {
            meta : this.methodsMC,
            
            properties : targetMeta ? targetMeta.methods : {}
        })
        
        
        this.addProperty('requirements', {
            meta : this.requirementsMC
        })
        
        
        this.addProperty('methodsModifiers', {
            meta : this.methodsModifiersMC
        })
    },
    
    
    reCompose : function () {
        var c       = this.targetMeta.c
        
        this.preApply(c)
        
        Joose.Managed.Stem.superClass.reCompose.call(this)
        
        this.apply(c)
    },
    
    
    deCompose : function () {
        var c       = this.targetMeta.c
        
        this.unapply(c)
        
        Joose.Managed.Stem.superClass.deCompose.call(this)
        
        this.postUnApply(c)
    }
    
    
}).c
;
Joose.Managed.Builder = new Joose.Proto.Class('Joose.Managed.Builder', {
    
    targetMeta          : null,
    
    
    _buildStart : function (targetMeta, props) {
        targetMeta.stem.open()
        
        Joose.A.each([ 'trait', 'traits', 'removeTrait', 'removeTraits', 'does', 'doesnot', 'doesnt' ], function (builder) {
            if (props[builder]) {
                this[builder](targetMeta, props[builder])
                delete props[builder]
            }
        }, this)
    },
    
    
    _extend : function (props) {
        if (Joose.O.isEmpty(props)) return
        
        var targetMeta = this.targetMeta
        
        this._buildStart(targetMeta, props)
        
        Joose.O.eachOwn(props, function (value, name) {
            var handler = this[name]
            
            if (!handler) throw new Error("Unknown builder [" + name + "] was used during extending of [" + targetMeta.c + "]")
            
            handler.call(this, targetMeta, value)
        }, this)
        
        this._buildComplete(targetMeta, props)
    },
    

    _buildComplete : function (targetMeta, props) {
        targetMeta.stem.close()
    },
    
    
    methods : function (targetMeta, info) {
        Joose.O.eachOwn(info, function (value, name) {
            targetMeta.addMethod(name, value)
        })
    },
    

    removeMethods : function (targetMeta, info) {
        Joose.A.each(info, function (name) {
            targetMeta.removeMethod(name)
        })
    },
    
    
    have : function (targetMeta, info) {
        Joose.O.eachOwn(info, function (value, name) {
            targetMeta.addAttribute(name, value)
        })
    },
    
    
    havenot : function (targetMeta, info) {
        Joose.A.each(info, function (name) {
            targetMeta.removeAttribute(name)
        })
    },
    

    havent : function (targetMeta, info) {
        this.havenot(targetMeta, info)
    },
    
    
    after : function (targetMeta, info) {
        Joose.O.each(info, function (value, name) {
            targetMeta.addMethodModifier(name, value, Joose.Managed.Property.MethodModifier.After)
        })
    },
    
    
    before : function (targetMeta, info) {
        Joose.O.each(info, function (value, name) {
            targetMeta.addMethodModifier(name, value, Joose.Managed.Property.MethodModifier.Before)
        })
    },
    
    
    override : function (targetMeta, info) {
        Joose.O.each(info, function (value, name) {
            targetMeta.addMethodModifier(name, value, Joose.Managed.Property.MethodModifier.Override)
        })
    },
    
    
    around : function (targetMeta, info) {
        Joose.O.each(info, function (value, name) {
            targetMeta.addMethodModifier(name, value, Joose.Managed.Property.MethodModifier.Around)
        })
    },
    
    
    augment : function (targetMeta, info) {
        Joose.O.each(info, function (value, name) {
            targetMeta.addMethodModifier(name, value, Joose.Managed.Property.MethodModifier.Augment)
        })
    },
    
    
    removeModifier : function (targetMeta, info) {
        Joose.A.each(info, function (name) {
            targetMeta.removeMethodModifier(name)
        })
    },
    
    
    does : function (targetMeta, info) {
        Joose.A.each(Joose.O.wantArray(info), function (desc) {
            targetMeta.addRole(desc)
        })
    },
    

    doesnot : function (targetMeta, info) {
        Joose.A.each(Joose.O.wantArray(info), function (desc) {
            targetMeta.removeRole(desc)
        })
    },
    
    
    doesnt : function (targetMeta, info) {
        this.doesnot(targetMeta, info)
    },
    
    
    trait : function () {
        this.traits.apply(this, arguments)
    },
    
    
    traits : function (targetMeta, info) {
        if (targetMeta.firstPass) return
        
        if (!targetMeta.meta.isDetached) throw "Can't apply trait to not detached class"
        
        targetMeta.meta.extend({
            does : info
        })
    },
    
    
    removeTrait : function () {
        this.removeTraits.apply(this, arguments)
    },
     
    
    removeTraits : function (targetMeta, info) {
        if (!targetMeta.meta.isDetached) throw "Can't remove trait from not detached class"
        
        targetMeta.meta.extend({
            doesnot : info
        })
    },
    
    name : function (targetMeta, name) {
        targetMeta.name     = name
    }
    
}).c;
Joose.Managed.Class = new Joose.Proto.Class('Joose.Managed.Class', {
    
    isa                         : Joose.Proto.Class,
    
    stem                        : null,
    stemClass                   : Joose.Managed.Stem,
    stemClassCreated            : false,
    
    builder                     : null,
    builderClass                : Joose.Managed.Builder,
    builderClassCreated         : false,
    
    isDetached                  : false,
    firstPass                   : true,
    
    // a special instance, which, when passed as 1st argument to constructor, signifies that constructor should
    // skips traits processing for this instance
    skipTraitsAnchor            : {},
    
    
    //build for metaclasses - collects traits from roles
    BUILD : function () {
        var sup = Joose.Managed.Class.superClass.BUILD.apply(this, arguments)
        
        var props   = sup.__extend__
        
        var traits = Joose.O.wantArray(props.trait || props.traits || [])
        delete props.trait
        delete props.traits
        
        Joose.A.each(Joose.O.wantArray(props.does || []), function (arg) {
            var role = (arg.meta instanceof Joose.Managed.Class) ? arg : arg.role
            
            if (role.meta.meta.isDetached) traits.push(role.meta.constructor)
        })
        
        if (traits.length) props.traits = traits 
        
        return sup
    },
    
    
    initInstance : function (instance, props) {
        Joose.O.each(this.attributes, function (attribute, name) {
            
            if (attribute instanceof Joose.Managed.Attribute) 
                attribute.initFromConfig(instance, props)
            else 
                if (props.hasOwnProperty(name)) instance[name] = props[name]
        })
    },
    
    
    // we are using the same constructor for usual and meta- classes
    defaultConstructor: function () {
        return function (skipTraitsAnchor, params) {
            
            var thisMeta    = this.meta
            var skipTraits  = skipTraitsAnchor == thisMeta.skipTraitsAnchor
            
            var BUILD       = this.BUILD
            
            var props       = BUILD && BUILD.apply(this, skipTraits ? params : arguments) || (skipTraits ? params[0] : skipTraitsAnchor) || {}
            
            
            // either looking for traits in __extend__ (meta-class) or in usual props (usual class)
            var extend  = props.__extend__ || props
            
            var traits = extend.trait || extend.traits
            
            if (traits || extend.detached) {
                delete extend.trait
                delete extend.traits
                delete extend.detached
                
                if (!skipTraits) {
                    var classWithTrait  = thisMeta.subClass({ does : traits || [] }, thisMeta.name)
                    var meta            = classWithTrait.meta
                    meta.isDetached     = true
                    
                    return meta.instantiate(thisMeta.skipTraitsAnchor, arguments)
                }
            }
            
            thisMeta.initInstance(this, props)
            
            return thisMeta.hasMethod('initialize') && this.initialize(props) || this
        }
    },
    
    
    finalize: function (extend) {
        Joose.Managed.Class.superClass.finalize.call(this, extend)
        
        this.stem.close()
        
        this.afterMutate()
    },
    
    
    processStem : function () {
        Joose.Managed.Class.superClass.processStem.call(this)
        
        this.builder    = new this.builderClass({ targetMeta : this })
        this.stem       = new this.stemClass({ name : this.name, targetMeta : this })
        
        var builderClass = this.getClassInAttribute('builderClass')
        
        if (builderClass) {
            this.builderClassCreated = true
            this.addAttribute('builderClass', this.subClassOf(builderClass))
        }
        
        
        var stemClass = this.getClassInAttribute('stemClass')
        
        if (stemClass) {
            this.stemClassCreated = true
            this.addAttribute('stemClass', this.subClassOf(stemClass))
        }
    },
    
    
    extend : function (props) {
        if (props.builder) {
            this.getBuilderTarget().meta.extend(props.builder)
            delete props.builder
        }
        
        if (props.stem) {
            this.getStemTarget().meta.extend(props.stem)
            delete props.stem
        }
        
        this.builder._extend(props)
        
        this.firstPass = false
        
        if (!this.stem.opened) this.afterMutate()
    },
    
    
    getBuilderTarget : function () {
        var builderClass = this.getClassInAttribute('builderClass')
        if (!builderClass) throw "Attempt to extend a builder on non-meta class"
        
        return builderClass
    },
    

    getStemTarget : function () {
        var stemClass = this.getClassInAttribute('stemClass')
        if (!stemClass) throw "Attempt to extend a stem on non-meta class"
        
        return stemClass
    },
    
    
    getClassInAttribute : function (attributeName) {
        var attrClass = this.getAttribute(attributeName)
        if (attrClass instanceof Joose.Managed.Property.Attribute) attrClass = attrClass.value
        
        return attrClass
    },
    
    
    addMethodModifier: function (name, func, type) {
        var props = {}
        
        props.init = func
        props.meta = type
        
        return this.stem.properties.methodsModifiers.addProperty(name, props)
    },
    
    
    removeMethodModifier: function (name) {
        return this.stem.properties.methodsModifiers.removeProperty(name)
    },
    
    
    addMethod: function (name, func, props) {
        props = props || {}
        props.init = func
        
        return this.stem.properties.methods.addProperty(name, props)
    },
    
    
    addAttribute: function (name, init, props) {
        props = props || {}
        props.init = init
        
        return this.stem.properties.attributes.addProperty(name, props)
    },
    
    
    removeMethod : function (name) {
        return this.stem.properties.methods.removeProperty(name)
    },

    
    removeAttribute: function (name) {
        return this.stem.properties.attributes.removeProperty(name)
    },
    
    
    hasMethod: function (name) {
        return this.stem.properties.methods.haveProperty(name)
    },
    
    
    hasAttribute: function (name) { 
        return this.stem.properties.attributes.haveProperty(name)
    },
    
    
    hasMethodModifiersFor : function (name) {
        return this.stem.properties.methodsModifiers.haveProperty(name)
    },
    
    
    hasOwnMethod: function (name) {
        return this.stem.properties.methods.haveOwnProperty(name)
    },
    
    
    hasOwnAttribute: function (name) { 
        return this.stem.properties.attributes.haveOwnProperty(name)
    },
    

    getMethod : function (name) {
        return this.stem.properties.methods.getProperty(name)
    },
    
    
    getAttribute : function (name) {
        return this.stem.properties.attributes.getProperty(name)
    },
    
    
    eachRole : function (roles, func, scope) {
        Joose.A.each(roles, function (arg, index) {
            var role = (arg.meta instanceof Joose.Managed.Class) ? arg : arg.role
            
            func.call(scope || this, arg, role, index)
        }, this)
    },
    
    
    addRole : function () {
        
        this.eachRole(arguments, function (arg, role) {
            
            this.beforeRoleAdd(role)
            
            var desc = arg
            
            //compose descriptor can contain 'alias' and 'exclude' fields, in this case actual reference should be stored
            //into 'propertySet' field
            if (role != arg) {
                desc.propertySet = role.meta.stem
                delete desc.role
            } else
                desc = desc.meta.stem
            
            this.stem.addComposeInfo(desc)
            
        }, this)
    },
    
    
    beforeRoleAdd : function (role) {
        var roleMeta = role.meta
        
        if (roleMeta.builderClassCreated) this.getBuilderTarget().meta.extend({
            does : [ roleMeta.getBuilderTarget() ]
        })
        
        if (roleMeta.stemClassCreated) this.getStemTarget().meta.extend({
            does : [ roleMeta.getStemTarget() ]
        })
        
        if (roleMeta.meta.isDetached && !this.firstPass) this.builder.traits(this, roleMeta.constructor)
    },
    
    
    beforeRoleRemove : function (role) {
        var roleMeta = role.meta
        
        if (roleMeta.builderClassCreated) this.getBuilderTarget().meta.extend({
            doesnt : [ roleMeta.getBuilderTarget() ]
        })
        
        if (roleMeta.stemClassCreated) this.getStemTarget().meta.extend({
            doesnt : [ roleMeta.getStemTarget() ]
        })
        
        if (roleMeta.meta.isDetached && !this.firstPass) this.builder.removeTraits(this, roleMeta.constructor)
    },
    
    
    removeRole : function () {
        this.eachRole(arguments, function (arg, role) {
            this.beforeRoleRemove(role)
            
            this.stem.removeComposeInfo(role.meta.stem)
        }, this)
    },
    
    
    getRoles : function () {
        
        return Joose.A.map(this.stem.composedFrom, function (composeDesc) {
            //compose descriptor can contain 'alias' and 'exclude' fields, in this case actual reference is stored
            //into 'propertySet' field
            if (!(composeDesc instanceof Joose.Managed.PropertySet)) return composeDesc.propertySet
            
            return composeDesc.targetMeta.c
        })
    },
    
    
    does : function (role) {
        var myRoles = this.getRoles()
        
        for (var i = 0; i < myRoles.length; i++) if (role == myRoles[i]) return true
        for (var i = 0; i < myRoles.length; i++) if (myRoles[i].meta.does(role)) return true
        
        var superMeta = this.superClass.meta
        
        // considering the case of inheriting from non-Joose classes
        if (this.superClass != Joose.Proto.Empty && superMeta && superMeta.meta && superMeta.meta.hasMethod('does')) return superMeta.does(role)
        
        return false
    },
    
    
    getMethods : function () {
        return this.stem.properties.methods
    },
    
    
    getAttributes : function () {
        return this.stem.properties.attributes
    },
    
    
    afterMutate : function () {
    },
    
    
    getCurrentMethod : function () {
        for (var wrapper = arguments.callee.caller, count = 0; wrapper && count < 5; wrapper = wrapper.caller, count++)
            if (wrapper.__METHOD__) return wrapper.__METHOD__
        
        return null
    }
    
    
}).c;
Joose.Managed.Role = new Joose.Managed.Class('Joose.Managed.Role', {
    
    isa                         : Joose.Managed.Class,
    
    have : {
        defaultSuperClass       : Joose.Proto.Empty,
        
        builderRole             : null,
        stemRole                : null
    },
    
    
    methods : {
        
        defaultConstructor : function () {
            return function () {
                throw new Error("Roles cant be instantiated")
            }
        },
        

        processSuperClass : function () {
            if (this.superClass != this.defaultSuperClass) throw new Error("Roles can't inherit from anything")
        },
        
        
        getBuilderTarget : function () {
            if (!this.builderRole) {
                this.builderRole = new this.constructor().c
                this.builderClassCreated = true
            }
            
            return this.builderRole
        },
        
    
        getStemTarget : function () {
            if (!this.stemRole) {
                this.stemRole = new this.constructor().c
                this.stemClassCreated = true
            }
            
            return this.stemRole
        },
        
    
        addRequirement : function (methodName) {
            this.stem.properties.requirements.addProperty(methodName, {})
        }
        
    },
    

    stem : {
        methods : {
            
            apply : function () {
            },
            
            
            unapply : function () {
            }
        }
    },
    
    
    builder : {
        methods : {
            requires : function (targetClassMeta, info) {
                Joose.A.each(Joose.O.wantArray(info), function (methodName) {
                    targetClassMeta.addRequirement(methodName)
                }, this)
            }
        }
    }
    
}).c;
Joose.Managed.Attribute = new Joose.Managed.Class('Joose.Managed.Attribute', {
    
    isa : Joose.Managed.Property.Attribute,
    
    have : {
        is              : null,
        
        builder         : null,
        
        isPrivate       : false,
        
        role            : null,
        
        publicName      : null,
        setterName      : null,
        getterName      : null,
        
        //indicates the logical readableness/writeableness of the attribute
        readable        : false,
        writeable       : false,
        
        //indicates the physical presense of the accessor (may be absent for "combined" accessors for example)
        hasGetter       : false,
        hasSetter       : false,
        
        required        : false,
        
        canInlineSetRaw : true,
        canInlineGetRaw : true
    },
    
    
    after : {
        initialize : function () {
            var name = this.name
            
            this.publicName = name.replace(/^_+/, '')
            
            this.slot = this.isPrivate ? '$' + name : name
            
            this.setterName = this.setterName || this.getSetterName()
            this.getterName = this.getterName || this.getGetterName()
            
            this.readable  = this.hasGetter = /^r/i.test(this.is)
            this.writeable = this.hasSetter = /^.w/i.test(this.is)
        }
    },
    
    
    override : {
        
        computeValue : function () {
            var init    = this.init
            
            if (Joose.O.isClass(init) || !Joose.O.isFunction(init)) this.SUPER()
        },
        
        
        preApply : function (targetClass) {
            targetClass.meta.extend({
                methods : this.getAccessorsFor(targetClass)
            })
        },
        
        
        postUnApply : function (from) {
            from.meta.extend({
                removeMethods : this.getAccessorsFrom(from)
            })
        }
        
    },
    
    
    methods : {
        
        getAccessorsFor : function (targetClass) {
            var targetMeta = targetClass.meta
            var setterName = this.setterName
            var getterName = this.getterName
            
            var methods = {}
            
            if (this.hasSetter && !targetMeta.hasMethod(setterName)) {
                methods[setterName] = this.getSetter()
                methods[setterName].ACCESSOR_FROM = this
            }
            
            if (this.hasGetter && !targetMeta.hasMethod(getterName)) {
                methods[getterName] = this.getGetter()
                methods[getterName].ACCESSOR_FROM = this
            }
            
            return methods
        },
        
        
        getAccessorsFrom : function (from) {
            var targetMeta = from.meta
            var setterName = this.setterName
            var getterName = this.getterName
            
            var setter = this.hasSetter && targetMeta.getMethod(setterName)
            var getter = this.hasGetter && targetMeta.getMethod(getterName)
            
            var removeMethods = []
            
            if (setter && setter.value.ACCESSOR_FROM == this) removeMethods.push(setterName)
            if (getter && getter.value.ACCESSOR_FROM == this) removeMethods.push(getterName)
            
            return removeMethods
        },
        
        
        getGetterName : function () {
            return 'get' + Joose.S.uppercaseFirst(this.publicName)
        },


        getSetterName : function () {
            return 'set' + Joose.S.uppercaseFirst(this.publicName)
        },
        
        
        getSetter : function () {
            var me      = this
            var slot    = me.slot
            
            if (me.canInlineSetRaw)
                return function (value) {
                    this[ slot ] = value
                    
                    return this
                }
            else
                return function () {
                    return me.setRawValueTo.apply(this, arguments)
                }
        },
        
        
        getGetter : function () {
            var me      = this
            var slot    = me.slot
            
            if (me.canInlineGetRaw)
                return function (value) {
                    return this[ slot ]
                }
            else
                return function () {
                    return me.getRawValueFrom.apply(this, arguments)
                }
        },
        
        
        getValueFrom : function (instance) {
            var getterName      = this.getterName
            
            if (this.readable && instance.meta.hasMethod(getterName)) return instance[ getterName ]()
            
            return this.getRawValueFrom(instance)
        },
        
        
        setValueTo : function (instance, value) {
            var setterName      = this.setterName
            
            if (this.writeable && instance.meta.hasMethod(setterName)) 
                instance[ setterName ](value)
            else
                this.setRawValueTo(instance, value)
        },
        
        
        initFromConfig : function (instance, config) {
            var name            = this.name
            
            var value, isSet = false
            
            if (config.hasOwnProperty(name)) {
                value = config[name]
                isSet = true
            } else {
                var init    = this.init
                
                // simple function (not class) has been used as "init" value
                if (Joose.O.isFunction(init) && !Joose.O.isClass(init)) {
                    
                    value = init.call(instance, config, name)
                    
                    isSet = true
                    
                } else if (this.builder) {
                    
                    value = instance[ this.builder.replace(/^this\./, '') ](config, name)
                    isSet = true
                }
            }
            
            if (isSet)
                this.setRawValueTo(instance, value)
            else 
                if (this.required) throw new Error("Required attribute [" + name + "] is missed during initialization of " + instance)
        }
    }

}).c
;
Joose.Managed.Attribute.Builder = new Joose.Managed.Role('Joose.Managed.Attribute.Builder', {
    
    
    have : {
        defaultAttributeClass : Joose.Managed.Attribute
    },
    
    builder : {
        
        methods : {
            
            has : function (targetClassMeta, info) {
                Joose.O.eachOwn(info, function (props, name) {
                    if (typeof props != 'object' || props == null || props.constructor == / /.constructor) props = { init : props }
                    
                    props.meta = props.meta || targetClassMeta.defaultAttributeClass
                    
                    if (/^__/.test(name)) {
                        name = name.replace(/^_+/, '')
                        
                        props.isPrivate = true
                    }
                    
                    targetClassMeta.addAttribute(name, props.init, props)
                }, this)
            },
            
            
            hasnot : function (targetClassMeta, info) {
                this.havenot(targetClassMeta, info)
            },
            
            
            hasnt : function (targetClassMeta, info) {
                this.hasnot(targetClassMeta, info)
            }
        }
            
    }
    
}).c
;
Joose.Managed.My = new Joose.Managed.Role('Joose.Managed.My', {
    
    have : {
        myClass                         : null,
        
        needToReAlias                   : false
    },
    
    
    methods : {
        createMy : function (extend) {
            var thisMeta        = this.meta
            var isRole          = this instanceof Joose.Managed.Role
            
            var myExtend        = extend.my || {}
            delete extend.my
            
            // Symbiont will generally have the same meta class as its hoster, excepting the cases, when the superclass also have the symbiont. 
            // In such cases, the meta class for symbiont will be inherited (unless explicitly specified)
            var superClassMy    = this.superClass.meta.myClass
            
            if (!isRole && !myExtend.isa && superClassMy) myExtend.isa = superClassMy
            

            if (!myExtend.meta && !myExtend.isa) myExtend.meta = this.constructor
            
            myExtend.name       = this.name + '.my'
            
            var createdClass    = this.myClass = Class(myExtend)
            
            var c               = this.c
            
            c.prototype.my      = c.my = isRole ? createdClass : new createdClass({ HOST : c })
            
            this.needToReAlias = true
        },
        
        
        aliasStaticMethods : function () {
            this.needToReAlias = false
            
            var c           = this.c
            var myProto     = this.myClass.prototype
            
            Joose.O.eachOwn(c, function (property, name) {
                if (property.IS_ALIAS) delete c[ name ] 
            })
            
            this.myClass.meta.stem.properties.methods.each(function (method, name) {
                
                if (!c[ name ])
                    (c[ name ] = function () {
                        return myProto[ name ].apply(c.my, arguments)
                    }).IS_ALIAS = true
            })
        }
    },
    
    
    override : {
        
        extend : function (props) {
            var myClass = this.myClass
            
            if (!myClass && this.superClass.meta.myClass) this.createMy(props)
            
            if (props.my) {
                if (!myClass) 
                    this.createMy(props)
                else {
                    this.needToReAlias = true
                    
                    myClass.meta.extend(props.my)
                    delete props.my
                }
            }
            
            this.SUPER(props)
            
            if (this.needToReAlias && !(this instanceof Joose.Managed.Role)) this.aliasStaticMethods()
        }  
    },
    
    
    before : {
        
        addRole : function () {
            var myStem
            
            Joose.A.each(arguments, function (arg) {
                
                if (!arg) throw new Error("Attempt to consume an undefined Role into [" + this.name + "]")
                
                //instanceof Class to allow treat classes as roles
                var role = (arg.meta instanceof Joose.Managed.Class) ? arg : arg.role
                
                if (role.meta.meta.hasAttribute('myClass') && role.meta.myClass) {
                    
                    if (!this.myClass) {
                        this.createMy({
                            my : {
                                does : role.meta.myClass
                            }
                        })
                        return
                    }
                    
                    myStem = this.myClass.meta.stem
                    if (!myStem.opened) myStem.open()
                    
                    myStem.addComposeInfo(role.my.meta.stem)
                }
            }, this)
            
            if (myStem) {
                myStem.close()
                
                this.needToReAlias = true
            }
        },
        
        
        removeRole : function () {
            if (!this.myClass) return
            
            var myStem = this.myClass.meta.stem
            myStem.open()
            
            Joose.A.each(arguments, function (role) {
                if (role.meta.meta.hasAttribute('myClass') && role.meta.myClass) {
                    myStem.removeComposeInfo(role.my.meta.stem)
                    
                    this.needToReAlias = true
                }
            }, this)
            
            myStem.close()
        }
        
    }
    
}).c;
Joose.Namespace = Joose.stub()

Joose.Namespace.Able = new Joose.Managed.Role('Joose.Namespace.Able', {

    have : {
        bodyFunc                : null
    },
    
    
    before : {
        extend : function (extend) {
            if (extend.body) {
                this.bodyFunc = extend.body
                delete extend.body
            }
        }
    },
    
    
    after: {
        
        afterMutate : function () {
            var bodyFunc = this.bodyFunc
            delete this.bodyFunc
            
            if (bodyFunc) Joose.Namespace.Manager.my.executeIn(this.c, bodyFunc)
        }
    }
    
}).c;
Joose.Managed.Bootstrap = new Joose.Managed.Role('Joose.Managed.Bootstrap', {
    
    does   : [ Joose.Namespace.Able, Joose.Managed.My, Joose.Managed.Attribute.Builder ]
    
}).c
;
Joose.Meta = Joose.stub()


Joose.Meta.Object = new Joose.Proto.Class('Joose.Meta.Object', {
    
    isa             : Joose.Proto.Object
    
}).c


;
Joose.Meta.Class = new Joose.Managed.Class('Joose.Meta.Class', {
    
    isa                         : Joose.Managed.Class,
    
    does                        : Joose.Managed.Bootstrap,
    
    have : {
        defaultSuperClass       : Joose.Meta.Object
    }
    
}).c

;
Joose.Meta.Role = new Joose.Meta.Class('Joose.Meta.Role', {
    
    isa                         : Joose.Managed.Role,
    
    does                        : Joose.Managed.Bootstrap
    
}).c;
Joose.Namespace.Keeper = new Joose.Meta.Class('Joose.Namespace.Keeper', {
    
    isa         : Joose.Meta.Class,
    
    have        : {
        externalConstructor             : null
    },
    
    
    methods: {
        
        defaultConstructor: function () {
            
            return function () {
                //constructors should assume that meta is attached to 'arguments.callee' (not to 'this') 
                var thisMeta = arguments.callee.meta
                
                if (thisMeta instanceof Joose.Namespace.Keeper) throw new Error("Module [" + thisMeta.c + "] may not be instantiated. Forgot to 'use' the class with the same name?")
                
                var externalConstructor = thisMeta.externalConstructor
                
                if (typeof externalConstructor == 'function') {
                    
                    externalConstructor.meta = thisMeta
                    
                    return externalConstructor.apply(this, arguments)
                }
                
                throw "NamespaceKeeper of [" + thisMeta.name + "] was planted incorrectly."
            }
        },
        
        
        //withClass should be not constructed yet on this stage (see Joose.Proto.Class.construct)
        //it should be on the 'constructorOnly' life stage (should already have constructor)
        plant: function (withClass) {
            var keeper = this.c
            
            keeper.meta = withClass.meta
            
            keeper.meta.c = keeper
            keeper.meta.externalConstructor = withClass
        }
    }
    
}).c


;
Joose.Namespace.Manager = new Joose.Managed.Class('Joose.Namespace.Manager', {
    
    have : {
        current     : null
    },
    
    
    methods : {
        
        initialize : function () {
            this.current    = [ Joose.top ]
        },
        
        
        getCurrent: function () {
            return this.current[0]
        },
        
        
        executeIn : function (ns, func) {
            var current = this.current
            
            current.unshift(ns)
            var res = func.call(ns, ns)
            current.shift()
            
            return res
        },
        
        
        earlyCreate : function (name, metaClass, props) {
            props.constructorOnly = true
            
            return new metaClass(name, props).c
        },
        
        
        //this function establishing the full "namespace chain" (including the last element)
        create : function (nsName, metaClass, extend) {
            
            //if no name provided, then we creating an anonymous class, so just skip all the namespace manipulations
            if (!nsName) return new metaClass(nsName, extend).c
            
            var me = this
            
            if (/^\./.test(nsName)) return this.executeIn(Joose.top, function () {
                return me.create(nsName.replace(/^\./, ''), metaClass, extend)
            })
            
            var props   = extend || {}
            
            var parts   = Joose.S.saneSplit(nsName, '.')
            var object  = this.getCurrent()
            var soFar   = object == Joose.top ? [] : Joose.S.saneSplit(object.meta.name, '.')
            
            for (var i = 0; i < parts.length; i++) {
                var part        = parts[i]
                var isLast      = i == parts.length - 1
                
                if (part == "meta" || part == "my" || !part) throw "Module name [" + nsName + "] may not include a part called 'meta' or 'my' or empty part."
                
                var cur =   object[part]
                
                soFar.push(part)
                
                var soFarName       = soFar.join(".")
                var needFinalize    = false
                var nsKeeper
                
                // if the namespace segment is empty
                if (typeof cur == "undefined") {
                    if (isLast) {
                        // perform "early create" which just fills the namespace segment with right constructor
                        // this allows us to have a right constructor in the namespace segment when the `body` will be called
                        nsKeeper        = this.earlyCreate(soFarName, metaClass, props)
                        needFinalize    = true
                    } else
                        nsKeeper        = new Joose.Namespace.Keeper(soFarName).c
                    
                    object[part] = nsKeeper
                    
                    cur = nsKeeper
                    
                } else if (isLast && cur && cur.meta) {
                    
                    var currentMeta = cur.meta
                    
                    if (metaClass == Joose.Namespace.Keeper)
                        //`Module` over something case - extend the original
                        currentMeta.extend(props)
                    else {
                        
                        if (currentMeta instanceof Joose.Namespace.Keeper) {
                            
                            currentMeta.plant(this.earlyCreate(soFarName, metaClass, props))
                            
                            needFinalize = true
                        } else
                            throw new Error("Double declaration of [" + soFarName + "]")
                    }
                    
                } else 
                    if (isLast && !(cur && cur.meta && cur.meta.meta)) throw "Trying to setup module " + soFarName + " failed. There is already something: " + cur

                // hook to allow embedd resource into meta
                if (isLast) this.prepareMeta(cur.meta)
                    
                if (needFinalize) cur.meta.construct(props)
                    
                object = cur
            }
            
            return object
        },
        
        
        prepareMeta : function () {
        },
        
        
        prepareProperties : function (name, props, defaultMeta, callback) {
            if (name && typeof name != 'string') {
                props   = name
                name    = null
            }
            
            var meta
            
            if (props && props.meta) {
                meta = props.meta
                delete props.meta
            }
            
            if (!meta)
                if (props && typeof props.isa == 'function' && props.isa.meta)
                    meta = props.isa.meta.constructor
                else
                    meta = defaultMeta
            
            return callback.call(this, name, meta, props)
        },
        
        
        getDefaultHelperFor : function (metaClass) {
            var me = this
            
            return function (name, props) {
                return me.prepareProperties(name, props, metaClass, function (name, meta, props) {
                    return me.create(name, meta, props)
                })
            }
        },
        
        
        register : function (helperName, metaClass, func) {
            var me = this
            
            if (this.meta.hasMethod(helperName)) {
                
                var helper = function () {
                    return me[ helperName ].apply(me, arguments)
                }
                
                if (!Joose.top[ helperName ])   Joose.top[ helperName ]         = helper
                if (!Joose[ helperName ])       Joose[ helperName ]             = helper
                
                if (Joose.is_NodeJS && typeof exports != 'undefined')            exports[ helperName ]    = helper
                
            } else {
                var methods = {}
                
                methods[ helperName ] = func || this.getDefaultHelperFor(metaClass)
                
                this.meta.extend({
                    methods : methods
                })
                
                this.register(helperName)
            }
        },
        
        
        Module : function (name, props) {
            return this.prepareProperties(name, props, Joose.Namespace.Keeper, function (name, meta, props) {
                if (typeof props == 'function') props = { body : props }    
                
                return this.create(name, meta, props)
            })
        }
    }
    
}).c

Joose.Namespace.Manager.my = new Joose.Namespace.Manager()

Joose.Namespace.Manager.my.register('Class', Joose.Meta.Class)
Joose.Namespace.Manager.my.register('Role', Joose.Meta.Role)
Joose.Namespace.Manager.my.register('Module')


// for the rest of the package
var Class       = Joose.Class
var Role        = Joose.Role
;
Role('Joose.Attribute.Delegate', {
    
    have : {
        handles : null
    },
    
    
    override : {
        
        eachDelegate : function (handles, func, scope) {
            if (typeof handles == 'string') return func.call(scope, handles, handles)
            
            if (handles instanceof Array)
                return Joose.A.each(handles, function (delegateTo) {
                    
                    func.call(scope, delegateTo, delegateTo)
                })
                
            if (handles === Object(handles))
                Joose.O.eachOwn(handles, function (delegateTo, handleAs) {
                    
                    func.call(scope, handleAs, delegateTo)
                })
        },
        
        
        getAccessorsFor : function (targetClass) {
            var targetMeta  = targetClass.meta
            var methods     = this.SUPER(targetClass)
            
            var me      = this
            
            this.eachDelegate(this.handles, function (handleAs, delegateTo) {
                
                if (!targetMeta.hasMethod(handleAs)) {
                    var handler = methods[ handleAs ] = function () {
                        var attrValue = me.getValueFrom(this)
                        
                        return attrValue[ delegateTo ].apply(attrValue, arguments)
                    }
                    
                    handler.ACCESSOR_FROM = me
                }
            })
            
            return methods
        },
        
        
        getAccessorsFrom : function (from) {
            var methods = this.SUPER(from)
            
            var me          = this
            var targetMeta  = from.meta
            
            this.eachDelegate(this.handles, function (handleAs) {
                
                var handler = targetMeta.getMethod(handleAs)
                
                if (handler && handler.value.ACCESSOR_FROM == me) methods.push(handleAs)
            })
            
            return methods
        }
    }
})

;
Role('Joose.Attribute.Trigger', {
    
    have : {
        trigger        : null
    }, 

    
    after : {
        initialize : function() {
            if (this.trigger) {
                if (!this.writeable) throw new Error("Can't use `trigger` for read-only attributes")
                
                this.hasSetter = true
            }
        }
    },
    
    
    override : {
        
        getSetter : function() {
            var original    = this.SUPER()
            var trigger     = this.trigger
            
            if (!trigger) return original
            
            var me      = this
            var init    = Joose.O.isFunction(me.init) ? null : me.init
            
            return function () {
                var oldValue    = me.hasValue(this) ? me.getValueFrom(this) : init
                
                var res         = original.apply(this, arguments)
                
                trigger.call(this, me.getValueFrom(this), oldValue)
                
                return res
            }
        }
    }
})    

;
Role('Joose.Attribute.Lazy', {
    
    
    have : {
        lazy        : null
    }, 
    
    
    before : {
        computeValue : function () {
            if (typeof this.init == 'function' && this.lazy) {
                this.lazy = this.init    
                delete this.init    
            }
        }
    },
    
    
    after : {
        initialize : function () {
            if (this.lazy) this.readable = this.hasGetter = true
        }
    },
    
    
    override : {
        
        getGetter : function () {
            var original    = this.SUPER()
            var lazy        = this.lazy
            
            if (!lazy) return original
            
            var me      = this    
            
            return function () {
                if (!me.hasValue(this)) {
                    var initializer = typeof lazy == 'function' ? lazy : this[ lazy.replace(/^this\./, '') ]
                    
                    me.setValueTo(this, initializer.apply(this, arguments))
                }
                
                return original.call(this)    
            }
        }
    }
})

;
Role('Joose.Attribute.Accessor.Combined', {
    
    
    have : {
        isCombined        : false
    }, 
    
    
    after : {
        initialize : function() {
            this.isCombined = this.isCombined || /..c/i.test(this.is)
            
            if (this.isCombined) {
                this.slot = '$$' + this.name
                
                this.hasGetter = true
                this.hasSetter = false
                
                this.setterName = this.getterName = this.publicName
            }
        }
    },
    
    
    override : {
        
        getGetter : function() {
            var getter    = this.SUPER()
            
            if (!this.isCombined) return getter
            
            var setter    = this.getSetter()
            
            var me = this
            
            return function () {
                
                if (!arguments.length) {
                    if (me.readable) return getter.call(this)
                    throw new Error("Call to getter of unreadable attribute: [" + me.name + "]")
                }
                
                if (me.writeable) return setter.apply(this, arguments)
                
                throw new Error("Call to setter of read-only attribute: [" + me.name + "]")    
            }
        }
    }
    
})

;
Joose.Managed.Attribute.meta.extend({
    does : [ Joose.Attribute.Delegate, Joose.Attribute.Trigger, Joose.Attribute.Lazy, Joose.Attribute.Accessor.Combined ]
})            

;
Role('Joose.Meta.Singleton', {
    
    has : {
        forceInstance           : Joose.I.Object,
        instance                : null
    },
    
    
    
    override : {
        
        defaultConstructor : function () {
            var meta        = this
            var previous    = this.SUPER()
            
            this.adaptConstructor(previous)
            
            return function (forceInstance, params) {
                if (forceInstance == meta.forceInstance) return previous.apply(this, params) || this
                
                var instance = meta.instance
                
                if (instance) {
                    if (meta.hasMethod('configure')) instance.configure.apply(instance, arguments)
                } else
                    meta.instance = new meta.c(meta.forceInstance, arguments)
                    
                return meta.instance
            }
        }        
    }
    

})


Joose.Namespace.Manager.my.register('Singleton', Class({
    isa     : Joose.Meta.Class,
    meta    : Joose.Meta.Class,
    
    does    : Joose.Meta.Singleton
}))
;
;
}();;
;
Class('JooseX.Observable.Event', {
    
    has : {
        name        : { required : true },
        args        : { required : true },
        
        source      : { required : true },
        
        splat       : null,
        current     : null,
        
        bubbling    : true
    },
    
        
    methods : {
        
        stopPropagation : function () {
            this.bubbling = false
        }
    }
})


;
Class('JooseX.Observable.Listener', {

    has : {
        channel     : { required : true },
        eventName   : { required : true },
        
        func        : { required : true },
        scope       : null,
        
        single          : false,
        
        buffer          : null,
        bufferMax       : null,
        
        bufferStartedAt : null,
        bufferTimeout   : null,
        
        delayTimeout    : null,
        
        delay           : null
    },
    
        
    methods : {
        
        activate : function (event, args) {
            var me      = this
            
            if (me.buffer != null) {
                
                if (me.bufferMax != null)
                    if (!me.bufferStartedAt) 
                        me.bufferStartedAt = new Date()
                    else
                        if (new Date - me.bufferStartedAt > me.bufferMax) return
                
                        
                if (me.bufferTimeout) clearTimeout(me.bufferTimeout)
                
                me.bufferTimeout = setTimeout(function () {
                    
                    delete me.bufferStartedAt
                    delete me.bufferTimeout
                    
                    me.doActivate(event, args)
                    
                }, me.buffer)
                
                return
            }
            
            if (me.delay != null) {
                
                me.delayTimeout = setTimeout(function () {
                    
                    delete me.delayTimeout
                    
                    me.doActivate(event, args)
                    
                }, me.delay)
                
                return
            }
            
            return me.doActivate(event, args)
        },
        
        
        doActivate : function (event, args) {
            if (this.single) this.remove()
            
            return this.func.apply(this.scope || event.source, [ event ].concat(args) ) !== false
        },
        
        
        cancel  : function () {
            if (this.buffer) {
                clearTimeout(this.bufferTimeout)
                
                delete this.bufferTimeout
                delete this.bufferStartedAt
            }
            
            if (this.delay) clearTimeout(this.delayTimeout)
        },
        
        
        remove : function () {
            this.channel.removeListener(this)
        }
    }
})


;
Class('JooseX.Observable.Channel', {
    
    has : {
        channels    : Joose.I.Object,
        
        listeners   : Joose.I.Object
    },
    
        
    methods : {
        
        destroy : function () {
            Joose.O.each(this.channels, function (channel, name) {
                channel.purgeListeners()
            })
            
            this.channels   = null
            
            // cleanup paranoya
            Joose.O.each(this.listeners, function (value, name) {
                this.listeners[ name ]  = null
            }, this)
            
            this.listeners  = null
        },
        
        
        // (!) segments array will be destroyed in this method
        getListenersFor : function (segments, name, activators) {
            var listeners = this.listeners
            
            if (listeners[ '**' ]) {
                
                var splat       = segments.concat(name)
                
                Joose.A.each(listeners[ '**' ], function (listener) {
                    activators.push({
                        listener    : listener,
                        splat       : splat
                    })
                })
            }
            
            if (segments.length) {
                var next = this.getSingleChannel(segments.shift(), true)
                
                if (next) next.getListenersFor(segments, name, activators)
            } else {
                
                if (listeners[ '*' ])
                    Joose.A.each(listeners[ '*' ], function (listener) {
                        
                        activators.push({
                            listener    : listener,
                            splat       : name
                        })
                    })
                
                if (listeners[ name ])  
                    Joose.A.each(listeners[ name ], function (listener) {
                        
                        activators.push({
                            listener    : listener
                        })
                    })
            }
        },
        
        
        hasListenerFor : function (segments, name) {
            var listeners = this.listeners
            
            if (listeners[ '**' ] && listeners[ '**' ].length) return true
            
            if (segments.length)  {
                var next = this.getSingleChannel(segments.shift(), true)
                
                if (next) return next.hasListenerFor(segments, name)
                
            } else {
                
                if (listeners[ '*' ] && listeners[ '*' ].length) return true
                
                if (listeners[ name ] && listeners[ name ].length) return true  
            }
            
            return false
        },
        
        
        addListener : function (listener) {
            var eventName   = listener.eventName
            var listeners   = this.listeners
            
            listeners[ eventName ] = listeners[ eventName ] || []
            
            listeners[ eventName ].push(listener)
        },
        
        
        removeListener : function (listenerToRemove) {
            // already purged
            if (!this.listeners) return
            
            var eventListeners      = this.listeners[ listenerToRemove.eventName ]
            
            eventListeners && Joose.A.each(eventListeners, function (listener, index) {
                
                if (listener == listenerToRemove) {
                    
                    eventListeners.splice(index, 1)
                    
                    return false
                }
            })
        },
        
        
        removeListenerByHandler : function (eventName, func, scope) {
            var eventListeners      = this.listeners[ eventName ]
            
            eventListeners && Joose.A.each(eventListeners, function (listener, index) {
                
                if (listener.func == func && listener.scope == scope) {
                    
                    eventListeners.splice(index, 1)
                    
                    return false
                }
            })
        },
        
        
        getSingleChannel : function (name, doNotCreate) {
            var channels    = this.channels
            
            if (channels[ name ]) return channels[ name ]
            
            if (doNotCreate) return null
            
            return channels[ name ] = new JooseX.Observable.Channel()
        },
        
        
        // (!) segments array will be destroyed in this method
        getChannel : function (segments, doNotCreate) {
            if (!segments.length) return this
            
            var next    = this.getSingleChannel(segments.shift(), doNotCreate)
            
            if (doNotCreate && !next) return null
            
            return next.getChannel(segments, doNotCreate)
        }
    }
})


;
Role('JooseX.Observable', {
    
    /*PKGVERSION*/VERSION : 0.04,
    
//    use : [ 
//        'JooseX.Observable.Channel',    
//        'JooseX.Observable.Listener', 
//        'JooseX.Observable.Event'    
//    ],
    
    
//    trait   : 'JooseX.Observable.Meta',
    
    
    has : {
        rootChannel             : {
            is          : 'rw',
            init        : function () { return new JooseX.Observable.Channel() }
        },
        
        suspendCounter          : 0
    },
    
        
    methods : {
        
        getBubbleTarget : function () {
        },
        
        
        parseEventPath : function (path) {
            var channels    = path.split('/')
            var eventName   = channels.pop()
            
            if (channels.length && !channels[ 0 ]) channels.shift()
            
            return {
                channels        : channels,
                eventName       : eventName
            }
        },
        
        
        on : function (path, func, scope, options) {
            if (!func) throw "Not valid listener function provided when subsribing on event: " + path
            
            var parsed      = this.parseEventPath(path)
            var channel     = this.getRootChannel().getChannel(parsed.channels)
            
            var listener    = new JooseX.Observable.Listener(Joose.O.extend(options || {}, {
                channel     : channel,
                eventName   : parsed.eventName,
                
                func        : func,
                scope       : scope
            }))
            
            channel.addListener(listener)
            
            return listener
        },
        
        
        un : function (path, func, scope) {
            
            if (path instanceof JooseX.Observable.Listener) {
                
                path.remove()
                
                return
            }
            
            var parsed      = this.parseEventPath(path)
            var channel     = this.getRootChannel().getChannel(parsed.channels, true)
            
            if (channel) channel.removeListenerByHandler(parsed.eventName, func, scope)
        },
        
        
        emit : function () {
            return this.fireEvent.apply(this, arguments)
        },
        
        
        fireEvent : function (path) {
            if (this.suspendCounter) return
            
            var args        = Array.prototype.slice.call(arguments, 1)

            var event       = new JooseX.Observable.Event({
                name        : path,
                args        : args,
                
                source      : this
            }) 
            
            return this.propagateEvent(event, path, args)
        },
        
        
        propagateEvent : function (event, path, args) {
            if (this.suspendCounter) return
            
            var parsed      = this.parseEventPath(path)
            var eventName   = parsed.eventName
            
            if (!eventName == '*' || eventName == '**') throw new Error("Can't fire an empty event or event with `*`, `**` names ")
            
            var activators  = []
            
            this.getRootChannel().getListenersFor(parsed.channels, eventName, activators)
            
            var res             = true
            
            event.current       = this
            
            if (activators.length) Joose.A.each(activators, function (activator) {
                event.splat = activator.splat
                
                res = activator.listener.activate(event, args) !== false && res
            })
            
            if (event.bubbling) {
                
                var further = this.getBubbleTarget()
                
                if (further) res = further.propagateEvent(event, path, args) !== false && res
            } 
                
            return res
        },
        
        
        hasListenerFor : function (path) {
            var parsed      = this.parseEventPath(path)
            
            return this.getRootChannel().hasListenerFor(parsed.channels, parsed.eventName)
        },
        
        
        purgeListeners  : function () {
            this.rootChannel.destroy()
            
            this.rootChannel = new JooseX.Observable.Channel()
        },
        
        
        suspendEvents : function () {
            this.suspendCounter++
        },
        
        
        resumeEvents : function () {
            this.suspendCounter--
            
            if (this.suspendCounter < 0) this.suspendCounter = 0
        }
    }
});
;
/**
@class Siesta.Test.Simulate.KeyCodes
@singleton

This is a singleton class, containing the mnemonical names for various advanced key codes. You can use this names in the {@link Siesta.Test.Browser#type} method, like this:

    t.type(el, 'Foo bar[ENTER]', function () {
        ...
    })

Below is the full list:

 - `BACKSPACE`

 - `TAB`

 - `RETURN`
 - `ENTER`

 - `SHIFT`
 - `CTRL`
 - `ALT`

 - `PAUSE-BREAK`
 - `CAPS`
 - `ESCAPE`
 - `NUM-LOCK`
 - `SCROLL-LOCK`
 - `PRINT`

 - `PAGE-UP`
 - `PAGE-DOWN`
 - `END`
 - `HOME`
 - `LEFT`
 - `UP`
 - `RIGHT`
 - `DOWN`
 - `INSERT`
 - `DELETE`


 - `NUM0`
 - `NUM1`
 - `NUM2`
 - `NUM3`
 - `NUM4`
 - `NUM5`
 - `NUM6`
 - `NUM7`
 - `NUM8`
 - `NUM9`

 - `F1`
 - `F2`
 - `F3`
 - `F4`
 - `F5`
 - `F6`
 - `F7`
 - `F8`
 - `F9`
 - `F10`
 - `F11`
 - `F12`

 */
Singleton('Siesta.Test.Simulate.KeyCodes', {

    methods : {
        isNav : function (k) {
            var keys = this.keys

            return (k >= 33 && k <= 40) ||
                k == keys.RETURN ||
                k == keys.TAB ||
                k == keys.ESCAPE;
        },

        isSpecial : function (k) {

            return k === this.keys.BACKSPACE ||
                (k >= 16 && k <= 20) ||
                (k >= 44 && k <= 46) ||
                k === 91;
        },

        isModifier : function(k) {
            return k === this.keys.SHIFT ||
                   k === this.keys.CTRL ||
                   k === this.keys.ALT ||
                   k === this.keys.CMD; // TODO add check to make sure it's a Mac?
        },

        fromCharCode : function (code, readableForm) {
            var keys    = this.keys
            
            for (var key in keys) if (keys[ key ] === code && (!readableForm || key.length > 1)) return key;
        }
    },

    has : {
        // FROM Syn library by JupiterJS, MIT License. www.jupiterjs.com

        // key codes
        keys : {

            init : {
                //backspace
                '\b'          : 8,
                'BACKSPACE'   : 8,

                //tab
                '\t'          : 9,
                'TAB'         : 9,

                //enter
                '\r'          : 13,
                'RETURN'      : 13,
                'ENTER'       : 13,

                //special
                'SHIFT'       : 16,
                'CTRL'        : 17,
                'ALT'         : 18,
                'CMD'         : 91, // Mac

                //weird
                'PAUSE-BREAK' : 19,
                'CAPS'        : 20,
                'ESCAPE'      : 27,
                'NUM-LOCK'    : 144,
                'SCROLL-LOCK' : 145,
                'PRINT'       : 44,

                //navigation
                'PAGE-UP'     : 33,
                'PAGE-DOWN'   : 34,
                'END'         : 35,
                'HOME'        : 36,
                'LEFT'        : 37,
                'UP'          : 38,
                'RIGHT'       : 39,
                'DOWN'        : 40,
                'INSERT'      : 45,
                'DELETE'      : 46,

                //normal characters
                ' '           : 32,
                '0'           : 48,
                '1'           : 49,
                '2'           : 50,
                '3'           : 51,
                '4'           : 52,
                '5'           : 53,
                '6'           : 54,
                '7'           : 55,
                '8'           : 56,
                '9'           : 57,
                'A'           : 65,
                'B'           : 66,
                'C'           : 67,
                'D'           : 68,
                'E'           : 69,
                'F'           : 70,
                'G'           : 71,
                'H'           : 72,
                'I'           : 73,
                'J'           : 74,
                'K'           : 75,
                'L'           : 76,
                'M'           : 77,
                'N'           : 78,
                'O'           : 79,
                'P'           : 80,
                'Q'           : 81,
                'R'           : 82,
                'S'           : 83,
                'T'           : 84,
                'U'           : 85,
                'V'           : 86,
                'W'           : 87,
                'X'           : 88,
                'Y'           : 89,
                'Z'           : 90,

                //NORMAL-CHARACTERS, NUMPAD
                'NUM0'        : 96,
                'NUM1'        : 97,
                'NUM2'        : 98,
                'NUM3'        : 99,
                'NUM4'        : 100,
                'NUM5'        : 101,
                'NUM6'        : 102,
                'NUM7'        : 103,
                'NUM8'        : 104,
                'NUM9'        : 105,
                '*'           : 106,
                '+'           : 107,
                '-'           : 109,
                '.'           : 110,

                //normal-characters, others
                '/'           : 111,
                ';'           : 186,
                '='           : 187,
                ','           : 188,
                '-'           : 189,
                '.'           : 190,
                '/'           : 191,
                '`'           : 192,
                '['           : 219,
                '\\'          : 220,
                ']'           : 221,
                "'"           : 222,

                'F1'  : 112,
                'F2'  : 113,
                'F3'  : 114,
                'F4'  : 115,
                'F5'  : 116,
                'F6'  : 117,
                'F7'  : 118,
                'F8'  : 119,
                'F9'  : 120,
                'F10' : 121,
                'F11' : 122,
                'F12' : 123
            }
        }
        // eof key codes
    }
    // eof has
});;
/*! Sizzle v2.3.1-pre | (c) jQuery Foundation, Inc. | jquery.org/license */
!function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\x00-\\xa0])+",M="\\["+K+"*("+L+")(?:"+K+"*([*^$|!~]?=)"+K+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+L+"))|)"+K+"*\\]",N=":("+L+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+M+")*)|.*)\\)|)",O=new RegExp(K+"+","g"),P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(N),U=new RegExp("^"+L+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L+"|[*])"),ATTR:new RegExp("^"+M),PSEUDO:new RegExp("^"+N),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),aa=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ba=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g,ca=function(a,b){return b?"\x00"===a?"\ufffd":a.slice(0,-1)+"\\"+a.charCodeAt(a.length-1).toString(16)+" ":"\\"+a},da=function(){m()},ea=ta(function(a){return a.disabled===!0},{dir:"parentNode",next:"legend"});try{G.apply(D=H.call(v.childNodes),v.childNodes),D[v.childNodes.length].nodeType}catch(fa){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s=b&&b.ownerDocument,w=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==w&&9!==w&&11!==w)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==w&&(l=Z.exec(a)))if(f=l[1]){if(9===w){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(s&&(j=s.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(l[2])return G.apply(d,b.getElementsByTagName(a)),d;if((f=l[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==w)s=b,r=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(ba,ca):b.setAttribute("id",k=u),o=g(a),h=o.length;while(h--)o[h]="#"+k+" "+sa(o[h]);r=o.join(","),s=$.test(a)&&qa(b.parentNode)||b}if(r)try{return G.apply(d,s.querySelectorAll(r)),d}catch(x){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(P,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("fieldset");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&a.sourceIndex-b.sourceIndex;if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return function(b){return"label"in b&&b.disabled===a||"form"in b&&b.disabled===a||"form"in b&&b.disabled===!1&&(b.isDisabled===a||b.isDisabled!==!a&&("label"in b||!ea(b))!==a)}}function pa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function qa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),v!==n&&(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(n.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}},d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(_,aa);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return"undefined"!=typeof b.getElementsByClassName&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=Y.test(n.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){a.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+K+"*[*^$|!~]?="),2!==a.querySelectorAll(":enabled").length&&q.push(":enabled",":disabled"),o.appendChild(a).disabled=!0,2!==a.querySelectorAll(":disabled").length&&q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Y.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"*"),s.call(a,"[s!='']:x"),r.push("!=",N)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Y.test(o.compareDocumentPosition),t=b||Y.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?I(k,a)-I(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?I(k,a)-I(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?la(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(S,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.escape=function(a){return(a+"").replace(ba,ca)},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(_,aa),a[3]=(a[3]||a[4]||a[5]||"").replace(_,aa),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return V.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&T.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(_,aa).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(O," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(P,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(_,aa),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return U.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(_,aa).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:oa(!1),disabled:oa(!0),checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:pa(function(){return[0]}),last:pa(function(a,b){return[b-1]}),eq:pa(function(a,b,c){return[0>c?c+b:c]}),even:pa(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:pa(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:pa(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:pa(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function ra(){}ra.prototype=d.filters=d.pseudos,d.setFilters=new ra,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=Q.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function sa(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function ta(a,b,c){var d=b.dir,e=b.next,f=e||d,g=c&&"parentNode"===f,h=x++;return b.first?function(b,c,e){while(b=b[d])if(1===b.nodeType||g)return a(b,c,e)}:function(b,c,i){var j,k,l,m=[w,h];if(i){while(b=b[d])if((1===b.nodeType||g)&&a(b,c,i))return!0}else while(b=b[d])if(1===b.nodeType||g)if(l=b[u]||(b[u]={}),k=l[b.uniqueID]||(l[b.uniqueID]={}),e&&e===b.nodeName.toLowerCase())b=b[d]||b;else{if((j=k[f])&&j[0]===w&&j[1]===h)return m[2]=j[2];if(k[f]=m,m[2]=a(b,c,i))return!0}}}function ua(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function va(a,b,c){for(var d=0,e=b.length;e>d;d++)ga(a,b[d],c);return c}function wa(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function xa(a,b,c,d,e,f){return d&&!d[u]&&(d=xa(d)),e&&!e[u]&&(e=xa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||va(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:wa(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=wa(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=wa(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ya(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ta(function(a){return a===b},h,!0),l=ta(function(a){return I(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[ta(ua(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return xa(i>1&&ua(m),i>1&&sa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(P,"$1"),c,e>i&&ya(a.slice(i,e)),f>e&&ya(a=a.slice(e)),f>e&&sa(a))}m.push(c)}return ua(m)}function za(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=E.call(i));u=wa(u)}G.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&ga.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ia(f):f}h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=ya(b[c]),f[u]?d.push(f):e.push(f);f=A(a,za(e,d)),f.selector=a}return f},i=ga.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(_,aa),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=V.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(_,aa),$.test(j[0].type)&&qa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&sa(j),!a)return G.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,!b||$.test(a)&&qa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("fieldset"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(J,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null});var Aa=a.Sizzle;ga.noConflict=function(){return a.Sizzle===ga&&(a.Sizzle=Aa),ga},"function"==typeof define&&define.amd?define(function(){return ga}):"undefined"!=typeof module&&module.exports?module.exports=ga:a.Sizzle=ga}(window);
//# sourceMappingURL=sizzle.min.map

// Add "textEquals" pseudo - exact text matching selector
(function() {
    var getText = function (elems) {
        var ret = "", elem;

        for (var i = 0; elems[i]; i++) {
            elem = elems[i];

            // Get the text from text nodes and CDATA nodes
            if (elem.nodeType === 3 || elem.nodeType === 4) {
                ret += elem.nodeValue;

                // Traverse everything else, except comment nodes
            } else if (elem.nodeType !== 8) {
                ret += getText(elem.childNodes);
            }
        }

        return ret;
    };

    Sizzle.selectors.pseudos.textEquals = function(el, i, m) {
        var searchText = m[3];

        return getText([el]).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') === searchText;
    };
})()
;
Role('Siesta.Util.Role.Dom', {

    has : {
        doesNotIncludeMarginInBodyOffset : false
    },
    methods : {

        closest : function (elem, selector, maxLevels) {
            maxLevels = maxLevels || 100;

            var docEl = elem.ownerDocument.documentElement;

            // Get closest match
            for (var i = 0; i < maxLevels && elem && elem !== docEl; elem = elem.parentNode ){
                if (Sizzle.matchesSelector(elem, selector)) {
                    return elem;
                }

                i++;
            }

            return false;
        },

        contains : function (container, node, maxLevels) {
            var doc = node.ownerDocument;
            var i = 0;

            maxLevels = maxLevels || Number.MAX_VALUE;

            while (node && node !== doc && i < maxLevels) {
                node = node.parentNode

                if (node === container) {
                    return true;
                }
                i++;
            }

            return false;
        },

        is : function (node, selector) {
            return Sizzle.matchesSelector(node, selector);
        },

        offset : function (elem) {
            var box;

            if (!elem || !elem.ownerDocument) {
                return null;
            }

            if (elem === elem.ownerDocument.body) {
                return this.bodyOffset(elem);
            }

            try {
                box = elem.getBoundingClientRect();
            } catch (e) {
            }

            var doc     = elem.ownerDocument,
                docElem = doc.documentElement;

            // Make sure we're not dealing with a disconnected DOM node
            if (!box || !this.contains(docElem, elem)) {
                return box ? { top : box.top, left : box.left } : { top : 0, left : 0 };
            }

            var body       = doc.body,
                win        = doc.defaultView || doc.parentWindow,
                clientTop  = docElem.clientTop || body.clientTop || 0,
                clientLeft = docElem.clientLeft || body.clientLeft || 0,
                scrollTop  = win.pageYOffset || docElem.scrollTop || body.scrollTop,
                scrollLeft = win.pageXOffset || docElem.scrollLeft || body.scrollLeft,
                top        = box.top + scrollTop - clientTop,
                left       = box.left + scrollLeft - clientLeft;

            return { top : top, left : left };
        },

        bodyOffset: function (body) {
            var top = body.offsetTop,
                left = body.offsetLeft;

            this.initializeOffset();

            if (this.doesNotIncludeMarginInBodyOffset) {
                top += parseFloat(jQuery.css(body, "marginTop")) || 0;
                left += parseFloat(jQuery.css(body, "marginLeft")) || 0;
            }

            return { top: top, left: left };
        },

        initializeOffset: function () {
            var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat(jQuery.css(body, "marginTop")) || 0,
                html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

            var styles = { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" };

            for (var o in styles) {
                container.style[o] = styles[o];
            }

            container.innerHTML = html;
            body.insertBefore(container, body.firstChild);
            innerDiv = container.firstChild;
            checkDiv = innerDiv.firstChild;
            td = innerDiv.nextSibling.firstChild.firstChild;

            checkDiv.style.position = "fixed";
            checkDiv.style.top = "20px";

            checkDiv.style.position = checkDiv.style.top = "";

            innerDiv.style.overflow = "hidden";
            innerDiv.style.position = "relative";

            this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

            body.removeChild(container);
            this.initializeOffset = function(){};
        },

        getWidth : function(el) {
            return el.getBoundingClientRect().width;
        },


        getHeight : function(el) {
            return el.getBoundingClientRect().height;
        }
    }
})
;
Role('Siesta.Util.Role.CanParseOs', {
    
    methods : { 
        
        parseOS : function (platform) {
            if (/Win/.test(platform)) return "Windows"
            
            if (/Mac/.test(platform)) return "MacOS"
            
            if (/Linux/.test(platform)) return "Linux"
            
            return "unknown"
        }
    }
});
;
Class('Siesta.Recorder.Target', {
    
    has : {
        targets             : Joose.I.Array,
        activeTarget        : null
    },
    
    
    methods : {
        
        initialize : function () {
            if (!this.targets) this.targets = []
            
            var firstTarget     = this.targets[ 0 ]
            
            if (firstTarget && !this.activeTarget) this.activeTarget = firstTarget.type
        },
        
        
        clear : function () {
            this.targets = []
        },
        
        
        getTargets : function () {
            var target      = this.getTarget()
            
            return target && target.targets || null
        },
        
        
        // `getActiveTarget`
        getTarget : function () {
            return this.getTargetByType(this.activeTarget)
        },
        
        
        clearOffset : function () {
            this.setOffset(null)
        },
    
    
        setOffset : function (value) {
            var target                  = this.getTarget()
            
            if (target) 
                if (value) 
                    target.offset   = value
                else
                    delete target.offset
        },
    
    
        getOffset : function () {
            var target                  = this.getTarget()
            
            if (target) return target.offset
        },
        
        
        getTargetByType : function (type) {
            var targetByType
            
            Joose.A.each(this.targets, function (target) {
                if (target.type == type) { 
                    targetByType = target
                    return false
                }
            })
            
            return targetByType
        },
        
        
        setUserTarget : function (value, offset) {
            var userTarget          = this.getTargetByType('user')
            
            if (!userTarget) {
                var target          = { type : 'user', target : value }
                
                if (offset) target.offset   = offset
                
                this.targets.unshift(target)
            } else {
                userTarget.target   = value
                
                if (offset)
                    userTarget.offset   = offset
                else
                    delete userTarget.offset
            }
            
            this.activeTarget       = 'user'
        },
        
        
        // returns `true` if targeting the coordinates on the screen or <body> (which is the same thing)
        isTooGeneric : function () {
            var targets     = this.targets
            
            if (!targets || targets.length === 0) return true
            
            if (targets.length === 1 && targets[ 0 ].type == 'xy') return true
            
            if (targets.length === 2) {
                var xy      = this.getTargetByType('xy')
                var css     = this.getTargetByType('css')
                
                if (xy && css && css.target == 'body') return true
            }
            
            return false
        }
    }
});;
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

}();;
!function () {
    
var ID      = 1

Class('Siesta.Recorder.Action', {
    
    has : {
        id                  : function () { return ID++ },
        action              : null,
        
        value               : null,
        
        /*
            Possible type of targets:
            - 'xy'      XY coordinates
            - 'css'     css selector
            - 'cq'      component query
            - 'csq'     composite query
            - 'user'    user-provided text
        */
        target              : null,
        
        toTarget            : null,
        by                  : null,
        waitForPageLoad     : false,
        options             : null,
        
        sourceEvent         : null
    },
    
    
    methods : {
        
        initialize : function () {
            var target      = this.target

            if (target && !(target instanceof Siesta.Recorder.Target)) {
                this.target = new Siesta.Recorder.Target({ targets : target })
            }
            
            var toTarget    = this.toTarget
            
            if (toTarget && !(toTarget instanceof Siesta.Recorder.Target)) 
                this.toTarget = new Siesta.Recorder.Target({ targets : toTarget })
        },
        
        
        setAction : function (newAction) {
            this.action     = newAction

            if (!this.hasTarget()) {
                this.target && this.target.clear()
                this.toTarget && this.toTarget.clear()
            }
        },
        
        
        hasTarget : function () {
            return this.isMouseAction()
        },
        
        
        getTarget : function (asInstance) {
            var target      = this.target
            
            return asInstance ? target : target && this.target.getTarget()
        },
        
        
        isMouseAction : function () {
            return (this.action || '').toLowerCase() in {
                click           : 1,
                contextmenu     : 1,
                dblclick        : 1,
                drag            : 1,
                mousedown       : 1,
                mouseup         : 1,
                movecursorto    : 1
            }
        },
        
        
        resetValues : function () {
            this.target         = null
            this.value          = null
            this.toTarget       = null
            this.by             = null
            this.options        = null
            this.sourceEvent    = null
        },
        
        
        parseOffset : function (offsetString) {
            var values  = offsetString.split(',');
    
            if (values.length < 2) return;
    
            if (!values[ 0 ].match('%')) {
                values[ 0 ] = parseInt(values[ 0 ], 10);
    
                if (isNaN(values[ 0 ])) return;
            }
    
            if (!values[ 1 ].match('%')) {
                values[ 1 ] = parseInt(values[ 1 ], 10);
    
                if (isNaN(values[ 1 ])) return;
            }
    
            return values;
        },
        
        
        clearTargetOffset : function () {
            this.setTargetOffset(null)
        },
    
    
        setTargetOffset : function (value) {
            var target  = this.target
            
            if (target) target.setOffset(value)
        },
    
    
        getTargetOffset : function () {
            var target  = this.target
            
            if (target) return target.getOffset()
        },
        
        
        objectToSource : function (obj) {
            var me = this;
            var result = '';
            var prependComma;
            var convertFn = function (key, value) {
                value = value || obj[key];

                if (value instanceof Array) {
                    return key + ' : [' + value.join(', ') + ']';
                } else if (typeof value === 'object') {
                    return key + ' : ' + me.objectToSource(value);
                } else {
                    return key + ' : ' + (typeof (value) === 'string' ? '"' + value + '"' : value);
                }
            };

            // Use brief action description, do this manually to make sure action + target is
            // the first item in the object descriptor
            if (obj.target) {
                result = convertFn(obj.action, obj.target);
                prependComma = true;

                delete obj.target;
                delete obj.action;
            }

            var keys = Object.keys(obj);

            if (keys.length > 0) {
                result = result + (prependComma ? ', ' : '') + keys.map(function(key) { return convertFn(key); }).join(', ');
            }

            return '{ ' + result + ' }';
        },


        asCode : function () {
            var step        = this.asStep()

            if (!step) return null

            return typeof step == 'function' ? step : this.objectToSource(step)
        },
        
        
        asStep : function (test) {

            var actionName      = this.action

            if (!actionName) return null
            
            var step            = { action : this.action };
            var target          = this.getTarget()
            var value           = this.value
            var hasTarget       = this.hasTarget()

            if (hasTarget) {
                if (!target) {
                    // If target is required but not filled in, just leave it blank
                    step.target = '';
                } else if (target.type == 'cq') {
                    var splitPos = target.target.indexOf('->');
                    step.target     = splitPos > 0 ? target.target.split('->').splice(1, 0, '>>').join() : '>>' + target.target
                } else {
                    step.target     = target.target
                }

                if (target && target.offset)
                    step.offset = target.offset.slice()
            }
    
    //        if (!actionName.match('waitFor') && target && typeof target !== "string" && !target.length) {
    //            throw 'Invalid target for ' + actionName + ' actionRecord: ' + target;
    //        }
    //
            if (this.options && !Joose.O.isEmpty(this.options)) {
                step.options    = this.options;
            }
    
            if (actionName.match(/^waitFor/)) {
                switch (actionName) {
                    case 'waitForFn':
                        // After this statement, t will be available in the evaled function below just as a regular local variable
                        if (test) var t   = test;
                        return { waitFor : eval("(function() {\n        " + value.replace(/\n/g, "\n        ") + "\n    })") };
    
                    case 'waitForMs':
                        var val = parseInt(value, 10);
    
                        return { waitForMs : val };
    
                    default:
                        var obj = {};

                        obj[actionName] = value || [];

                        return obj;
                }
            } else {
                switch (actionName) {
                    case 'click':
                    case 'dblclick':
                    case 'contextmenu':
                    case 'mousedown':
                    case 'mouseup':
                    case 'moveCursorTo':
                        break;

                    case 'screenshot':
                        step = { screenshot : value };
                        break;

                    case 'moveCursorBy':
                        var by = this.value.split(',');
                        by[0] = parseInt(by[0], 10);
                        by[1] = parseInt(by[1], 10);

                        step = { action : 'moveCursor', by : by};
                        break;

                    case 'type':
                        step.text   = value;
                        delete step.target;
    
                        break;
    
                    case 'drag':
                        var toTarget    = this.toTarget
                        
                        if (toTarget && !toTarget.isTooGeneric()) {
                            step.to                             = toTarget.target;
                            if (toTarget.offset) step.toOffset  = toTarget.offset;
                            
                            break;
                        }
                        
                        step.by = this.by;
    
                        break;
    
                    case 'fn':
                        // After this statement, t will be available in the evaled function below just as a regular local variable
                        if (test) var t   = test;
    
                        return eval("(function(next) {\n        " + value.replace(/\n/g, "\n        ") + "\n        next();\n    })");
    
                    default:
                        var step = {};
                        step[actionName] = value;
                        return step;
                }
            }
    
            return this.waitForPageLoad ? { waitForPageLoad : [], trigger : step } : step;
        }
        
    }
});

}();;
/**

@class Siesta.Recorder.TargetExtractor

The type of target, possible options:

- 'css'     css selector
- 'xy'      XY coordinates

*/
Class('Siesta.Recorder.TargetExtractor', {

    does       : [
        Siesta.Util.Role.Dom
    ],

    has        : {
        lookUpUntil             : 'HTML',

        // using node name as a CSS selector optional
        skipNodeNameForCSS      : false,

        ignoreIdRegExp          : function () {
            // match nothing
            return /\0/
        },

        domIdentifiers    : function () {
            return [
                'name'
            ];
        },

        // Ignore all irrelevant or generic classes which will generate unstable selectors
        ignoreClasses           : Joose.I.Array,
        ignoreCssClassesRegExp  : null,
        
        allowNodeNamesForTargetNodes    : true,
        // in theory, we don't need to precisely identify the target node, we are ok with its parent node and offset
        allowParentMatching             : true,

        uniqueDomNodeProperty : 'id',

        // When using a p:contains(some text) locator, always truncate the text to a max nbr of characters
        maxCharsForContainsSelector : 30,

        swallowExceptions : false,

        // Copy of the first exception that occurred during target extraction
        exception : null
    },

    methods : {

        initialize : function () {
            var ignoreClasses = this.constructor.prototype.meta.getAttribute('ignoreClasses').init()

            ignoreClasses = ignoreClasses.concat(this.ignoreClasses)

            this.ignoreCssClassesRegExp = ignoreClasses.length ? new RegExp(ignoreClasses.join('|')) : /\0/
        },
        
        // return `true` to keep the id, `false` - to ignore it
        ignoreDomId : function (id, dom) {
            return this.ignoreIdRegExp.test(id)
        },
        
        
        // `true` to keep the class
        ignoreCssClass : function (cssClass) {
            return this.ignoreCssClassesRegExp.test(cssClass)
        },
        
        findOffset : function (pageX, pageY, relativeTo) {
            var offset    = this.offset(relativeTo)
            
//            if (jqOffset.left - Math.round(jqOffset.left) != 0 || jqOffset.top - Math.round(jqOffset.top) != 0) debugger
            
            offset.left   = offset.left
            offset.top    = offset.top

            var relativeOffset = [ pageX - offset.left, pageY - offset.top ]

            //if (!this.verifyOffset(relativeTo, relativeOffset)) {
            //}

            return relativeOffset;
        },

        // May need an extra check to verify that the suggested coordinate returns the expected target, could be tricky for rotated elements
        // Returns true if the element can be resolved using the suggested x,y coordinates
        /*verifyOffset : function(el, offset) {
            var doc             = el.ownerDocument;
            var bodyOffset      = this.offset(el),
                body            = el.ownerDocument.body,
                xy              = [ Math.round(bodyOffset.left - body.scrollLeft + offset[0]), Math.round(bodyOffset.top - body.scrollTop + offset[1])];

            var foundEl = doc.elementFromPoint(xy[0],xy[1]);

            return foundEl === el;
        },*/
        
        
        getCssClasses : function (dom) {
            var classes             = dom.className.trim().replace(/  +/g, ' ');
            var significantClasses  = []
            var index               = {}

            classes = classes && classes.split(' ') || [];

            for (var i = 0; i < classes.length; i++) {
                var cssClass            = classes[ i ]
                
                if (!this.ignoreCssClass(cssClass) && !index[ cssClass ]) {
                    significantClasses.push(cssClass)
                    
                    index[ cssClass ]   = true
                }
            }
            
            return this.processCssClasses(significantClasses)
        },

        
        getCssQuerySegmentForElement : function (dom, isTarget, maxNumberOfCssClasses, lookUpUntil, useContainsSelector) {
            maxNumberOfCssClasses   = maxNumberOfCssClasses != null ? maxNumberOfCssClasses : 1e10

            // doesn't make sense to use id/css classes for "body" as there's a single such el in the document
            if (dom == dom.ownerDocument.body) return 'body'

            if (this.uniqueDomNodeProperty !== 'id') {
                var domAttrValue = dom.getAttribute(this.uniqueDomNodeProperty);

                if (domAttrValue) {
                    return '[' + this.uniqueDomNodeProperty + '=\'' + domAttrValue + '\']';
                }
            }

            // Sizzle doesn't like : or . in DOM ids, need to escape them
            if (dom.id && !this.ignoreDomId(dom.id, dom)) return '#' + dom.id.replace(/:/gi, '\\:').replace(/\./gi, '\\.');
            
            var significantClasses  = this.getCssClasses(dom)
            var nodeName = dom.nodeName.toLowerCase();
            var retVal   = null;

            if (significantClasses.length > maxNumberOfCssClasses) significantClasses.length = maxNumberOfCssClasses

            if(significantClasses.length > 0) {
                retVal = '.' + significantClasses.join('.');
            }

            var text = dom.textContent.trim();

            if (useContainsSelector && dom.children.length == 0 && text.length > 1){
                // Return readable target for A tags with only text in them
                retVal = nodeName + (retVal || '') + ':contains(' + text.substr(0, this.maxCharsForContainsSelector) + ')';
            } else if (!retVal && isTarget && this.allowNodeNamesForTargetNodes) {
                retVal = nodeName;
            } else {
                this.domIdentifiers.forEach(function(attr) {
                   if (!retVal && dom[attr]) {
                       retVal = '['+ attr + '=\'' + dom[attr] + '\']';
                   }
                });
            }

            return retVal;
        },
        
        
        processCssClasses : function (classes) {
            return classes
        },
        
        
        // if an #id is found then return immediately, otherwise return the 1st specific (matching only 1 node)
        // css query
        findDomQueryFor : function (dom, lookUpUntil, maxNumberOfCssClasses, useContainsSelector) {
            var target      = dom
            var query       = []
            var doc         = dom.ownerDocument
            
            var foundId     = false
            
            lookUpUntil     = lookUpUntil || doc.body
            
            var needToChangeTarget  = false
            var current     = target
            
            while (current && current != lookUpUntil) {
                var segment     = this.getCssQuerySegmentForElement(current, current == dom, maxNumberOfCssClasses, lookUpUntil, useContainsSelector)

                // `getCssQuerySegmentForElement` has returned an object, instead of string - meaning
                // it has already jumped several levels up in the tree
                if (Object(segment) === segment) {
                    // the last node in dom, that has been already examined inside of the `getCssQuerySegmentForElement` (by recognizer probably)
                    current     = segment.current
                    if (segment.target) target = segment.target
                    segment     = segment.segment
                }
                
                // can't reliably identify the target node - no query at all
                if (dom == current && !segment) 
                    if (this.allowParentMatching) {
                        // switching to "parent matching" mode in which we are looking for some parent of original dom
                        needToChangeTarget  = true
                    } else
                        break
                
                if (segment) {
                    if (needToChangeTarget) {
                        target              = current
                        needToChangeTarget  = false
                    }

                    query.unshift(segment)
                    
                    // no point in going further up, id is specific enough, return early
                    if (segment.match(/^#/) || (this.uniqueDomNodeProperty !== 'id' && current.getAttribute(this.uniqueDomNodeProperty))) {
                        foundId = true;
                        break
                    }
                }
                
                // may happen if `getCssQuerySegmentForElement` has jumped over several nodes in tree and already reached the exit point
                // TODO check also for current.contains(lookUpUntil) ?
                if (current == lookUpUntil || this.contains(current, lookUpUntil)) break
                
                current         = current.parentNode
            }
            
            var resultQuery
            var hasUniqueMatch      = false
            
            // starting from the last segments we build several queries, until we find unique match
            for (var i = foundId ? 0 : query.length - 1; i >= 0; i--) {
                var parts           = query.slice(i)
                var subQuery        = parts.join(' ')
                var matchingNodes   = Sizzle(subQuery, lookUpUntil)
                
                if (matchingNodes.length == 1) 
                    if (matchingNodes[ 0 ] == target) {
                        hasUniqueMatch  = true
                        
                        resultQuery     = { query : subQuery, target : target, foundId : foundId, parts : parts }
                        
                        break
                    } else
                        // found some query that matches a different element, something went wrong
                        return null
                
                // at this point we are testing the whole query and it matches more then 1 dom element
                // in general such query is not specific enough, the only exception is when our dom node
                // is the 1st one in the results
                // in all other cases return null (below) 
                if (i == 0 && matchingNodes[ 0 ] == target) return { query : subQuery, target : target, foundId : foundId }
            }
            
            if (hasUniqueMatch) {
                var matchingParts       = resultQuery.parts
                
                var index               = 1
                
                while (index < matchingParts.length - 1) {
                    if (this.domSegmentIsNotSignificant(matchingParts[ index ])) {
                        var strippedParts   = matchingParts.slice()
                        
                        strippedParts.splice(index, 1)
                        
                        var matchingNodes   = Sizzle(subQuery, lookUpUntil)
                        
                        if (matchingNodes.length == 1) {
                            matchingParts.splice(index, 1)
                            // need to keep the index the same, so counter-adjust the following ++
                            index--
                        }
                    }
                    
                    index++
                }
            
                resultQuery.query       = parts.join(' ')
                delete resultQuery.parts
                
                return resultQuery
            }
            
            return null
        },
        
        
        domSegmentIsNotSignificant : function (segment) {
            // id selectors are always significant
            if (/^#/.test(segment)) return false
            
            // tag name - css classes will start with "."
            if (!/^\./.test(segment)) return true
            
            var cssClasses      = segment.split('.')
            
            // remove empty initial element
            cssClasses.shift()
            
            for (var i = 0; i < cssClasses.length; i++)
                if (!/^x-/.test(cssClasses[ i ])) return false

            // if all classes starts with "x-" then this segment is not significant
            return true
        },
        
        
        resolveDomQuery : function (subQuery, lookUpUntil) {
            var matchingNodes   = Sizzle(subQuery, lookUpUntil)
            
            return 
        },
        
        
        insertIntoTargets : function (targets, targetDesc, originalTarget) {
            var newTargetDistance   = this.calculateDistance(this.resolveTarget(targetDesc, originalTarget), originalTarget)
            
            for (var i = 0; i < targets.length; i++) {
                var currentTarget   = targets[ i ]
                
                if (currentTarget.type == 'xy') {
                    targets.splice(i, 0 , targetDesc)
                    return
                }
                
                var distance        = this.calculateDistance(this.resolveTarget(currentTarget, originalTarget), originalTarget)
                
                // we assume targets are inserted with "insertIntoTargets" with increasing specifity,
                // so that csq is going after cq, which goes after css
                // in this way even if csq target has same distance it should be inserted before the current target
                if (newTargetDistance <= distance) {
                    targets.splice(i, 0 , targetDesc)
                    return
                }
            }
            
            targets.push(targetDesc)
        },
        
        
        calculateDistance : function (node, deeperNode) {
            var distance    = 0
            
            while (deeperNode && node != deeperNode) {
                distance++
                deeperNode  = deeperNode.parentNode
            }
            
            return distance
        },
        
        resolveTarget : function (target, sampleEl) {
            if (target.type == 'css') {
                return Sizzle(target.target)[ 0 ]
            }
        },
        
        
        getTargets : function (event, useContainsSelector, saveOffset) {
            // By default we should use :contains selector unless useContainsSelector is strictly false
            useContainsSelector = useContainsSelector === false ? false : true;

            var result              = []
            var cssQuery
            var target              = event.target;

            if (this.swallowExceptions) {
                try {
                    cssQuery            = this.findDomQueryFor(target, null, null, useContainsSelector)
                } catch(e) {
                    this.exception = this.exception || e;
                }
            } else {
                cssQuery            = this.findDomQueryFor(target, null, null, useContainsSelector)
            }

            if (cssQuery) result.push({
                type        : 'css',
                target      : cssQuery.query,
                offset      : (saveOffset || !this.isElementReachableAtCenter(target)) ? this.findOffset(event.x, event.y, cssQuery.target) : null
            })

            result.push({
                type        : 'xy',
                target      : [ event.x, event.y ]
            })
            
            return result
        },
        
        
        regExpEscape : function (s) {
            return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        },

        isTargetReachableAt : function(el, x, y){
            var doc = el.ownerDocument;
            var foundEl = doc.elementFromPoint(x, y);

            return foundEl && (foundEl === el || this.contains(el, foundEl));
        },

        isElementReachableAtCenter : function(el){
            var offsets = this.offset(el);

            return this.isTargetReachableAt(el, offsets.left + (this.getWidth(el) / 2), offsets.top + (this.getHeight(el) / 2));
        }
    }
});
;
/**
 @class Siesta.Recorder.Recorder

Low level class which records the events of the window it's attached to. It records basic mouse and key events,
but does not record scroll events and other browser type events. Since it's JS based, we cannot record
native dialog interactions, such as alert, print or confirm etc.

It tries to coalesce certain event patterns into higher order events (click, drag etc).

*/
Class('Siesta.Recorder.Recorder', {

    does : [
        JooseX.Observable,
        Siesta.Util.Role.Dom,
        Siesta.Util.Role.CanParseOs
    ],

    has : {
        active              : null,

        extractor           : null,

        extractorClass      : Siesta.Recorder.TargetExtractor,

        extractorConfig     : null,

        /**
         * @cfg {Array[String]/String} uniqueComponentProperty A string or an array of strings, containing attribute names that the Recorder will use to identify Ext JS components.
         */
        uniqueComponentProperty : null,

        /**
         * @cfg {String} uniqueDomNodeProperty A property that will be used to uniquely identify DOM nodes.
         */
        uniqueDomNodeProperty : 'id',

        /**
         * @cfg {Boolean} recordOffsets true to record the offset to each targeted DOM element for recorded actions to make sure the recorded action can be played back with exact precision.
         * Should be avoided for most cases, to let Siesta pick the center of each target.
         */
        recordOffsets       : true,

        // ignore events generated by Siesta (bypass in normal use, but for testing recorder we need it)
        ignoreSynthetic     : true,

        // The window this recorder is observing for events
        window              : null,

        // Fire a mouseidle event if mouse doesn't move for a while.
        idleTimeout         : 3000,
        // console.logs all DOM events detected
        debugMode           : false,

        eventsToRecord      : {
            init : function () {
                return [
                    "keydown",
                    "keypress",
                    "keyup",

                    "click",
                    "dblclick",
                    "contextmenu",
                    "mousedown",
                    "mouseup"
                ];
            }
        },

        // "raw" log of all dom events
        events              : Joose.I.Array,

        actions             : Joose.I.Array,
        actionsByEventId    : Joose.I.Object,
        cursorPosition      : Joose.I.Array,

        swallowExceptions   : false,
        recordMouseMove     : true,
        mouseMoveTimerId    : null,
        windowResizeTimerId : null,
        dragPixelThreshold  : 3, // If mousedown/mouseup position differs by less, we consider it a click

        // If the mouse is moved upon a target matching these selectors, a moveCursorTo will be recorded
        moveCursorToSelectors   : Joose.I.Array,

        // our own private helper selectors
        _moveCursorToSelectors          : Joose.I.Array,
        moveCursorToSelectorsMatcher    : null,
        lastMoveCursorToEl              : null,
        lastMoveTimestamp               : null,
        actionClass                     : Siesta.Recorder.Action
    },


    methods : {

        initialize : function () {
            this.onUnload                       = this.onUnload.bind(this);
            this.onFrameLoad                    = this.onFrameLoad.bind(this);
            this.onDomEvent                     = this.onDomEvent.bind(this);
            this.resetMouseMoveListener         = this.resetMouseMoveListener.bind(this);
            this.onWindowResizeThrottler        = this.onWindowResizeThrottler.bind(this);
            this.throttledMouseMove             = this.throttleMouseMoveListener(this.onBodyMouseMove, this.idleTimeout);
            this.onBodyMouseOver                = this.onBodyMouseOver.bind(this);
            this.moveCursorToSelectorsMatcher   = this._moveCursorToSelectors.concat(this.moveCursorToSelectors).join(',');

            var extractorConfig = this.extractorConfig || {}

            extractorConfig.uniqueComponentProperty = extractorConfig.uniqueComponentProperty || this.uniqueComponentProperty;
            extractorConfig.uniqueDomNodeProperty = extractorConfig.uniqueDomNodeProperty || this.uniqueDomNodeProperty;
            extractorConfig.swallowExceptions = this.swallowExceptions;

            this.extractor                  = new this.extractorClass(extractorConfig);
        },


        isSamePoint : function (event1, event2) {
            return Math.abs(event1.x - event2.x) <= this.dragPixelThreshold &&
                   Math.abs(event1.y - event2.y) <= this.dragPixelThreshold;
        },

        isSameTarget : function(event1, event2) {
            return event1.target == event2.target || this.contains(event1.target, event2.target) || this.contains(event2.target, event1.target);
        },


        clear          : function () {
            this.events     = []
            this.actions    = []

            this.fireEvent('clear', this)
        },


        // We monitor page loads so the recorder can add a waitForPageLoad action
        onUnload : function () {
            var actions = this.actions,
                last = actions.length && actions[actions.length - 1];

            if (last && last.target) {
                last.waitForPageLoad = true;
            }
        },

        // After frame has loaded, stop listening to old window and restart on new frame window
        onFrameLoad    : function (event) {
            this.stop();

            this.attach(event.target.contentWindow);

            this.start();
        },

        /*
         * Attaches the recorder to a Window object
         * @param {Window} window The window to attach to.
         **/
        attach         : function (window) {
            if (this.window !== window) {
                this.stop()
            }

            // clear only events, keep the actions
            this.events = []

            this.window = window;
        },

        /*
         * Starts recording events of the current Window object
         **/
        start          : function () {
            this.stop();

            this.active         = Date.now();
            this.onStart();
            this.fireEvent('start', this);
        },

        /*
         * Stops the recording of events
         **/
        stop           : function () {
            if (this.active) {
                this.active     = null;
                this.onStop();
                this.fireEvent('stop', this);
            }
        },


        getRecordedEvents : function () {
            return this.events;
        },


        getRecordedActions : function () {
            return this.actions
        },


        getRecordedActionsAsSteps : function () {
            return Joose.A.map(this.actions, function (action) {
                return action.asStep()
            })
        },


        onDomEvent : function (e) {
            if (this.swallowExceptions) {
                // extra protection from the exceptions from the recorder itself
                try {
                    this.processDomEvent(e);
                } catch(e) {
                    this.fireEvent('exception', e);
                }
            } else {
                this.processDomEvent(e);
            }

            if (this.getException()) {
                this.fireEvent('exception', this.getException());
            }
        },

        processDomEvent : function (e) {
            var target          = e.target

            if (this.debugMode) {
                console.log(e.type, target, e.keyIdentifier || e.key);
            }

            // Never trust IE - target may be absent
            // Ignore events from played back test (if user plays test and records before it's stopped)
            if (!target || (this.ignoreSynthetic && e.synthetic)) return;

            var eventType       = e.type
            var isKeyEvent      = eventType.match(/^key/)

            var keys            = Siesta.Test.Simulate.KeyCodes().keys

            // Ignore special keys which are used only in combination with other keys
            if (isKeyEvent && (e.keyCode === keys.SHIFT || e.keyCode === keys.CTRL || e.keyCode === keys.ALT)) return;

            var event           = Siesta.Recorder.Event.fromDomEvent(e)

            // this "reset" will ensure that "onBodyMouseMove" handler will be called after "idleTimeout"
            // after any other dom event
            this.resetMouseMoveListener();

            this.convertToAction(event)

            this.events.push(event)

            this.fireEvent('domevent', event)
        },


        eventToAction : function (event, actionName) {
            var type        = event.type

            if (!actionName)
                if (type.match(/^key/))
                    // convert all key events to type for now
                    actionName  = 'type'
                else
                    actionName  = type

            var config      = {
                action          : actionName,

                target          : this.extractor.getTargets(event, true, this.recordOffsets),

                options         : event.options,

                sourceEvent     : event
            }

            // `window` object to which the event target belongs
            var win             = event.target.ownerDocument.defaultView;

            // Case of nested iframe
            if (win !== this.window) {

                if (!win.frameElement.id) {
                    throw 'To record events in a nested iframe, please set an "id" property on your frames';
                }

                // Prepend the frame id to each suggested target
                config.target = config.target.filter(function(actionTarget) {
                    if (typeof(actionTarget.target) === 'string') {
                        actionTarget.target = '#' + win.frameElement.id + ' -> ' + actionTarget.target;

                        return true;
                    }
                    // Skip array coordinates for nested iframes, make little sense
                    return false;
                });
            }

            return new this.actionClass(config)
        },


        recordAsAction : function (event, actionName) {
            var action      = this.eventToAction(event, actionName)

            if (action) {
                this.addAction(action)
            }
        },


        addAction : function (action) {
            if (!(action instanceof this.actionClass)) {
                action = new this.actionClass(action);
            }

            this.beforeAddAction(action);

            this.actions.push(action)
            if (action.sourceEvent) this.actionsByEventId[ action.sourceEvent.id ] = action

            this.fireEvent('actionadd', action)
        },


        removeAction : function (actionToRemove) {
            var actions     = this.actions;

            for (var i = 0; i < actions.length; i++) {
                var action  = actions[ i ]

                if (action == actionToRemove) {
                    actions.splice(i, 1)

                    if (action.sourceEvent) delete this.actionsByEventId[ action.sourceEvent.id ]

                    this.fireEvent('actionremove', actionToRemove)
                    break;
                }
            }
        },


        removeActionByEventId : function (eventId) {
            this.removeAction(this.getActionByEventId(eventId))
        },


        removeActionByEvent : function (event) {
            this.removeAction(this.getActionByEventId(event.id))
        },


        getActionByEventId : function (eventId) {
            return this.actionsByEventId[ eventId ]
        },


        getLastAction : function () {
            return this.actions[ this.actions.length - 1 ]
        },

        getLastEvent : function () {
            return this.events[ this.events.length - 1 ]
        },


        canCombineTypeActions : function (prevOptions, curOptions) {
            return prevOptions.ctrlKey == curOptions.ctrlKey &&
                prevOptions.metaKey == curOptions.metaKey &&
                prevOptions.altKey == curOptions.altKey;
        },


        // Method which tries to identify "composite" DOM interactions such as 'click/contextmenu' (3 events), double click
        // but also complex scenarios such as 'drag'
        convertToAction : function (event) {
            var type        = event.type

            if (type == 'keypress' || type == 'keyup' || type == 'keydown') {
                this.convertKeyEventToAction(event);
                return
            }

            var events      = this.getRecordedEvents(),
                length      = events.length,
                tail        = this.getLastEvent();

            // if there's no already recorded events - there's nothing to coalsce
            if (!length) {
                this.recordAsAction(event)

                return
            }

            var tail        = events[ length - 1 ],
                tailPrev    = length >= 2 ? events[ length - 2 ] : null;

            var tailType    = tail.type

            // when user clicks on the <label> with "for" attribute 2 "click" events are triggered
            // just ignore the 2nd event and not record it as action
            // in FF, the 2nd "click" will have 0, 0 coordinates, so we have to disable `isSamePoint` extra sanity check
            if (type == 'click' && tailType == 'click' /*&& this.isSamePoint(event, tail)*/ && tail.target.getAttribute('for')) {
                return
            }

            if (type == 'dblclick') {
                // removing the last `click` action - one click event will still remain
                this.removeAction(this.getLastAction())

                this.getLastAction().action = 'dblclick'

                this.fireEvent('actionupdate', this.getLastAction())

                return
            }


            // if mousedown/up happened in a row in different points - this is considered to be a drag operation
            if (tailType == 'mousedown' && type == 'mouseup' && event.button == tail.button && !this.isSamePoint(event, tail)) {
                var lastAction      = this.getLastAction()

                // if we've recorded "moveCursorTo" in between mousedown / up (we don't record mousemove, so tail event will be still
                // mousedown) then we don't need to convert "mouseup" into drag
                if (lastAction.action != 'moveCursorTo') {
                    lastAction.action   = 'drag'

                    lastAction.by       = [ event.x - tail.x, event.y - tail.y ]

    //                var toTarget        = new Siesta.Recorder.Target({ targets : this.extractor.getTargets(event) })
    //
    //                if (!toTarget.isTooGeneric()) lastAction.toTarget = toTarget

                    this.fireEvent('actionupdate', lastAction)

                    return
                } else if (lastAction.sourceEvent && !this.isSamePoint(event, lastAction.sourceEvent)) {
                    this.addMoveCursorAction(event, this.recordOffsets)

                    // the `mouseup` action will be recorded as the last `this.recordAsAction(event)` statement
                }
            }

            // In some situations the mouseup event may remove/overwrite the current element and no click will be triggered
            // so we need to catch drag operation on mouseup (see above) and ignore following "click" event
            if (type === 'click' && this.getLastAction() && this.getLastAction().action === 'drag') {
                return
            }

            // On Mac ignore mouseup happening after contextmenu
            if (type == 'mouseup' && tailType === 'contextmenu') {
                return
            }

            if (tailPrev && type === 'click') {
                if (
                    // Verify tail
                    tailType == 'mouseup' &&
                    event.button == tail.button &&
                    event.button == tailPrev.button &&
                    this.isSamePoint(event, tail) &&

                    // Verify previous tail
                    tailPrev.type == 'mousedown' &&
                    this.isSameTarget(event, tail) &&
                    this.isSameTarget(event, tailPrev) &&
                    this.isSamePoint(event, tailPrev)
                ) {
                    this.removeActionByEvent(tailPrev)
                    this.removeActionByEvent(tail)

                    // reuse mousedown event info, since that has the correct initial target information. Target may have been changed by mousedown/mouseup.
                    var props = ['timestamp', 'options', 'x', 'y', 'target', 'charCode', 'keyCode', 'button'];

                    props.forEach(function(prop) {
                        event[prop] = tailPrev[prop];
                    });
                }
            } else if (type === 'contextmenu') {
                // Verify tail (Mac OSX doesn't fire mouse up)
                if ((tailType == 'mouseup' || tailType == 'mousedown') && event.button == tail.button && this.isSamePoint(event, tail)) {
                    this.removeActionByEvent(tail)
                }
                // Verify previous tail
                if (tailType == 'mouseup' && tailPrev.type == 'mousedown' &&
                    this.isSameTarget(event, tail) &&
                    this.isSameTarget(event, tailPrev) &&
                    this.isSamePoint(event, tailPrev)) {
                    this.removeActionByEvent(tailPrev)
                }
            }

            this.recordAsAction(event)
        },

        convertKeyEventToAction : function (event) {
            var type            = event.type
            var tail            = this.getLastEvent();
            var KC              = Siesta.Test.Simulate.KeyCodes();
            var isSpecial       = type == 'keydown' && (KC.isSpecial(event.keyCode) || KC.isNav(event.keyCode));
            var isModifier      = KC.isModifier(event.keyCode);
            var options         = event.options;
            var prevType        = tail && tail.type;
            var prevSpecial     = type == 'keypress' && prevType == 'keydown' && (KC.isSpecial(tail.keyCode) || KC.isNav(tail.keyCode));
            var isWindows       = this.parseOS(navigator.platform) === 'Windows';
            var isMac           = this.parseOS(navigator.platform) === 'MacOS';

            // On Windows, no keypress is triggered if CTRL key is pressed along with a regular char (e.g Ctrl-C).
            // On Mac, no keypress is triggered if CMD key is pressed along with a regular char (e.g Cmd-C).
            if (type == 'keypress' && !isSpecial && !prevSpecial || (type == 'keydown' && (isSpecial || isModifier || (isWindows && options.ctrlKey) || (isMac && options.metaKey)))) {
                var lastAction      = this.getLastAction()

                var text            = isSpecial ? '[' + KC.fromCharCode(event.charCode, true) + ']' : String.fromCharCode(event.charCode);
                // Crude check to make sure we don't merge a CTRL-C with the next "normal" keystroke
                if (lastAction && lastAction.action === 'type' && this.canCombineTypeActions(lastAction.options, event.options)) {
                    if (!KC.isModifier(event.keyCode)){
                        lastAction.value += text

                        this.fireEvent('actionupdate', lastAction)
                    }
                } else {
                    this.addAction({
                        action          : 'type',

                        value           : text,

                        sourceEvent     : event,
                        options         : event.options
                    })
                }

                return
            }

            // ignore 'keydown' events
        },


        onStart : function () {
            var me              = this,
                window          = me.window,
                doc             = window.document,
                body            = doc.body,
                resizeTimeout   = null,
                frameWindows    = this.getNestedFrames().map(function(frame) { return frame.contentWindow; });

            // Listen to test window and any frames nested in it
            [ window ].concat(frameWindows).forEach(function (win) {
                me.registerWindowListeners(win);

                win.frameElement && win.frameElement.addEventListener('load', function() {
                    me.registerWindowListeners(win);
                });
            })

            if (this.recordMouseMove) {
                if (this.moveCursorToSelectorsMatcher) {
                    body.addEventListener('mouseover', this.onBodyMouseOver);
                    this.lastMoveCursorToEl = null;
                }
                body.addEventListener('mousemove', this.throttledMouseMove, true);
                body.addEventListener('mouseleave', this.resetMouseMoveListener);
            }

            window.frameElement && window.frameElement.addEventListener('load', this.onFrameLoad);
            window.addEventListener('unload', this.onUnload);
            window.addEventListener('resize', this.onWindowResizeThrottler);
        },


        registerWindowListeners : function (win) {
            var me = this;

            // We might not have access to the frame window if it's in another domain
            try {
                var foo = win.document;
            } catch(e) {
                return;
            }

            // Safari doesn't throw exception when trying to access x-domain frames
            if (!foo) return;

            me.eventsToRecord.forEach(function (name) {
                win.document.addEventListener(name, me.onDomEvent, true);
            });
        },


        deregisterWindowListeners : function (win) {
            var me = this;

            try {
                var foo = win.document;
            } catch(e) { return; }

            me.eventsToRecord.forEach(function (name) {
                win.document.removeEventListener(name, me.onDomEvent, true);
            });
        },

        // Returns only frames on the same domain
        getNestedFrames : function() {
            var testWindow      = this.window,
                doc             = testWindow.document;

            return Array.prototype.slice.apply(doc.getElementsByTagName('iframe')).filter(function(frame) {
                try {
                    var foo = frame.contentWindow.document;
                } catch(e) { return false; }

                return true;
            });
        },

        onStop : function () {
            var me              = this,
                testWindow      = me.window,
                doc             = testWindow.document,
                body            = doc.body,
                frameWindows    = this.getNestedFrames().map(function(frame) { return frame.contentWindow; });

            // Unlisten to test window and any frames nested in it
            [ testWindow ].concat(frameWindows).forEach(function (win) {
                me.deregisterWindowListeners(win);

                win.frameElement && win.frameElement.addEventListener('unload', function() {
                    me.deregisterWindowListeners(win);
                });
            })

            if (this.recordMouseMove) {
                if (this.moveCursorToSelectorsMatcher) {
                    body.removeEventListener('mouseover', this.onBodyMouseOver);
                    this.lastMoveCursorToEl = null;
                }
                body.removeEventListener('mousemove', this.throttledMouseMove, true);
                body.removeEventListener('mouseleave', this.resetMouseMoveListener);
            }

            testWindow.frameElement && testWindow.frameElement.removeEventListener('load', this.onFrameLoad);
            testWindow.removeEventListener('unload', this.onUnload);
            testWindow.removeEventListener('resize', this.onWindowResizeThrottler);

            this.resetMouseMoveListener()
        },


        resetMouseMoveListener : function () {
            clearTimeout(this.mouseMoveTimerId);
        },

        // This allows a user to indicate that the cursor should be move to a certain place
        // if mouse is still for a period (idleTimeout) of time.
        onBodyMouseMove        : function (e, recordOffsets) {
            if (this.swallowExceptions) {
                // handling exceptions from the recorder itself
                try {
                    this.processBodyMouseMove(e, recordOffsets);
                } catch(e) {
                    this.fireEvent('exception', e);
                }
            } else {
                this.processBodyMouseMove(e, recordOffsets);
            }

            if (this.getException()) {
                this.fireEvent('exception', this.getException());
            }
        },

        onBodyMouseOver : function(e) {
            var target = e.target;

            if (this.is(target, this.moveCursorToSelectorsMatcher) ||
                (target = this.closest(e.target, this.moveCursorToSelectorsMatcher, 3))) {

                if (target !== this.lastMoveCursorToEl) {
                    var docEl       = this.window.document.documentElement;

                    var evtData = {
                        type      : e.type,
                        target    : target,
                        timeStamp : Date.now(),
                        options   : e.options,
                        clientX   : e.clientX,
                        clientY   : e.clientY,
                        pageX     : e.clientX + docEl.scrollLeft,
                        pageY     : e.clientY + docEl.scrollTop
                    };

                    this.onBodyMouseMove(evtData, false);
                    this.lastMoveCursorToEl = target;
                }
            }
        },

        processBodyMouseMove : function (e, recordOffsets) {
            // Skip test playback events and mouse moves in frames
            if ((this.ignoreSynthetic && e.synthetic) || e.target.ownerDocument !== this.window.document) return;

            // Avoid duplicate events
            if (this.lastMoveCursorToEl === e.target || this.contains(this.lastMoveCursorToEl, e.target, 3)) return;

            var mouseMoveEvent  = new Siesta.Recorder.Event.fromDomEvent(e)

            recordOffsets = recordOffsets !== undefined ? recordOffsets : this.recordOffsets;

            this.addMoveCursorAction(mouseMoveEvent, recordOffsets);
        },


        throttleMouseMoveListener : function (fn, threshhold) {
            var last,
                me = this;

            return function (event) {
                var now         = Date.now();
                var docEl       = me.window.document.documentElement;

                me.lastMoveTimestamp = now;

                // No access to pageX/pageY in IE9
                me.cursorPosition[0] = event.clientX + docEl.scrollLeft;
                me.cursorPosition[1] = event.clientY + docEl.scrollTop;

                if (last && now < last + threshhold) {
                    var args = arguments;

                    clearTimeout(me.mouseMoveTimerId);

                    me.mouseMoveTimerId = setTimeout(function () {
                        last    = now;
                        fn.apply(me, args);
                    }, threshhold);
                } else {
                    last        = now;
                }
            };
        },

        onWindowResizeThrottler : function (e) {
            if ( !this.windowResizeTimerId ) {
                var me = this;
                this.windowResizeTimerId = setTimeout(function() {
                    me.windowResizeTimerId = null;
                    me.onWindowResize(e);
                }, 500);
            }
        },

        onWindowResize : function(event) {
            var win = this.window;

            if (win) {
                var d            = win.document;
                var windowWidth  = win.innerWidth || d.documentElement.clientWidth || d.body.clientWidth,
                    windowHeight = win.innerHeight || d.documentElement.clientHeight || d.body.clientHeight;

                this.addAction({
                    action          : 'setWindowSize',
                    value           : [windowWidth, windowHeight],
                    sourceEvent     : event
                })
            }
        },

        // Returns an exception that happened during target extraction
        getException : function() {
            return this.extractor.exception;
        },

        // Hook called before adding actions to inject 'helping' actions
        beforeAddAction : function(action) {
        },

        addMoveCursorAction : function(event, recordOffsets) {
            this.addAction({
                action          : 'moveCursorTo',

                target          : this.extractor.getTargets(event, true, recordOffsets),

                sourceEvent     : event,
                options         : event.options
            })
        }
    }
    // eof methods
});
;
;
/**
@class Siesta.Recorder.TargetExtractor.Recognizer.Grid

A class recognizing the Ext JS grid cell/row markup
*/
Role('Siesta.Recorder.TargetExtractor.Recognizer.Grid', {
    
    requires     : [ 'getFirstNonExtCssClass', 'getNthPosition', 'findDomQueryFor' ],

    override : {
        getCssQuerySegmentForElement : function (node, isTarget, maxNumberOfCssClasses, lookUpUntil) {
            var Ext             = this.Ext
            var viewProto       = Ext && Ext.grid && Ext.grid.View && Ext.grid.View.prototype
            var itemSelector    = viewProto && (viewProto.rowSelector || viewProto.itemSelector)

            // Ext or Grid package may not be loaded in the page!
            if (!itemSelector) return this.SUPERARG(arguments);

            var cellEl            = this.closest(node, '.x-grid-cell');

            if (!cellEl) return this.SUPERARG(arguments);

            var rowEl             = this.closest(cellEl, itemSelector);
            var gridViewCmp     = this.getComponentOfNode(rowEl)
            var gridCmp         = gridViewCmp && gridViewCmp.ownerCt
            var gridEl          = gridCmp && (gridCmp.el || gridCmp.element)

            gridEl              = gridEl && gridEl.dom;

            // `lookUpUntil` indicates the highest node in tree we can examine while building the css query segment
            // can't go inside the method if row exceeds this level
            if (!rowEl || rowEl == lookUpUntil || this.contains(rowEl, lookUpUntil) || !gridEl) return this.SUPERARG(arguments);
            
            var rowSelector;
            
            if (rowEl.id && !this.ignoreDomId(rowEl.id, rowEl)) 
                rowSelector         = '#' + rowEl.id
            else {
                var rowCss          = this.getFirstNonExtCssClass(rowEl);
                
                // If a custom non-Ext CSS row class is found we grab it, if not we fall back to nth-child
                if (rowCss) {
                    rowSelector     = '.' + rowCss;
                } else {
                    // in Ext5 rows (.x-grid-row) are wrapped in <table> containers (.x-grid-item)
                    // we are interested in the position of container in this case
                    var rowContainerSelector    = viewProto.itemSelector || itemSelector
                    
                    var rowIndex    = this.getNthPosition(rowEl, rowContainerSelector);
                    rowSelector     = rowContainerSelector + ':nth-child(' + (rowIndex + 1) + ')';
                }
            }

            var cellSelector
            
            var cellCss         = this.getFirstNonExtCssClass(cellEl);
            
            // If a custom non-Ext CSS cell class is found we grab it, if not we fall back to nth-child
            if (cellCss) {
                cellSelector    = '.' + cellCss;
            } else {
                var cellIndex   = this.getNthPosition(cellEl, '.x-grid-cell');
                cellSelector    = '.x-grid-cell:nth-child(' + (cellIndex + 1) + ')';
            }

            
            // try to find additional dom query from cell to the original node
            var domQuery        = this.findDomQueryFor(node, cellEl, 1)
            
            var segment         = rowSelector + ' ' + cellSelector + (domQuery ? ' ' + domQuery.query : '')
            
            // if we've found a dom query that starts with ID - we don't need our row/cell selectors at all
            if (domQuery && domQuery.foundId) segment = domQuery.query
            
            return {
                current     : gridEl,
                segment     : segment,
                target      : domQuery ? domQuery.target : cellEl
            }
        }
    }
});
;
/**
@class Siesta.Recorder.TargetExtractor.Recognizer.BoundList

A class recognizing the Ext JS BoundList markup

*/
Role('Siesta.Recorder.TargetExtractor.Recognizer.BoundList', {
    
    override : {
        getCssQuerySegmentForElement : function (node) {
            var item   = this.closest(node, '.x-boundlist-item')
            
            if (!item) return this.SUPERARG(arguments)
            
            // todo, should we check for user specific classes too and how to prioritize in this case?
            return {
                current     : this.closest(item, '.x-boundlist'),
                segment     : '.x-boundlist-item:contains(' + item.innerHTML + ')',
                target      : item
            }
        }
    }
});
;
/**
@class Siesta.Recorder.TargetExtractor.Recognizer.View

A class recognizing the Ext JS View component
*/
Role('Siesta.Recorder.TargetExtractor.Recognizer.View', {

    override : {
        getCssQuerySegmentForElement : function (node, isTarget, maxNumberOfCssClasses, lookUpUntil) {
            var cmpRoot = this.closest(node, '.x-component');

            if (!cmpRoot || this.contains(cmpRoot, lookUpUntil)) {
                return this.SUPERARG(arguments);
            }

            var Ext     = this.Ext;
            var cmp     = Ext && Ext.getCmp(cmpRoot.id);

            if (!(cmp && Ext.ComponentQuery.is(cmp, 'dataview') && this.closest(node, cmp.itemSelector))) {
                return this.SUPERARG(arguments);
            }

            var itemSelector    = cmp.itemSelector;
            var itemNode        = node;
            var newTarget       = node

            if (!this.is(node, itemSelector)) {
                itemNode        = this.closest(node, itemSelector);
            }

            var pos             = Array.prototype.slice.apply(itemNode.parentNode.childNodes).indexOf(itemNode) + 1;

            var segment         = itemSelector + ':nth-child(' + pos + ')' + ' ';

            if (node !== itemNode) {
                var customCss   = this.getFirstNonExtCssClass(node);
                
                if (customCss)
                    // TODO not guaranteed that this query will match exact "node"
                    segment         += '.' + customCss
                else {
                    var prev        = this.allowNodeNamesForTargetNodes
                    this.allowNodeNamesForTargetNodes = true
                    
                    var extraQuery  = this.findDomQueryFor(node, itemNode, null, true)
                    
                    this.allowNodeNamesForTargetNodes = prev
                    
                    if (extraQuery) {
                        segment     += extraQuery.query
                        newTarget   = extraQuery.target
                    }
                }
                    
            }

            return {
                current     : (cmp.el || cmp.element).dom,
                segment     : segment,
                target      : newTarget
            }
        }
    }
});
;
/**
@class Siesta.Recorder.TargetExtractor.Recognizer.NumberField

A class recognizing the Ext JS NumberField component
*/
Role('Siesta.Recorder.TargetExtractor.Recognizer.NumberField', {

    override : {
        getCssQuerySegmentForElement : function (node) {
            var match = typeof node.className === 'string' && node.className.match(/\bx-form-spinner-(?:up|down)/);

            if (!match) {
                return this.SUPERARG(arguments);
            }

            return '.' + match[ 0 ]
        }
    }
});
;
/**
@class Siesta.Recorder.TargetExtractor.Recognizer.DatePicker

A class recognizing the Ext JS DatePicker component
*/
Role('Siesta.Recorder.TargetExtractor.Recognizer.DatePicker', {

    override : {
        getCssQuerySegmentForElement : function (node) {
            var match = typeof node.className === 'string' && node.className.match(/\bx-datepicker-date\b|\bx-monthpicker-month\b/);

            if (!match) {
                return this.SUPERARG(arguments);
            }

            return '.' + match[0] + ':textEquals(' + node.textContent + ')'
        }
    }
});
;
/**
@class Siesta.Recorder.TargetExtractor.Recognizer.TimeAxisColumn

A class recognizing the Ext Gantt TimeAxis column component
*/
Role('Siesta.Recorder.TargetExtractor.Recognizer.TimeAxisColumn', {

    override : {
        getCssQuerySegmentForElement : function (node) {
            var date = node.getAttribute('data-date');

            if (!date) {
                return this.SUPERARG(arguments);
            }

            return '[data-date=' + date + ']' + (node.textContent ? (':textEquals(' + node.textContent + ')') : '');
        }
    }
});
;
/**
@class Siesta.Recorder.TargetExtractor.ExtJS

To resolve a component, this is done in the following prio list

1. Custom (non-auto-gen Id, client provided)
2. Custom field property (see componentIdentifier). User provides button with "foo : 'savebutton'", possibly add CSS selector
3. Custom xtype, user provides subclassed button for example, possibly combined with CSS selector (composite query)
3. For components, add some intelligence, user generated CSS properties win over Ext CSS properties
3a. Buttons could look for iconCls, text etc
3b. Menuitems same thing
3c. Grids and lists provide nth-child to know which position in the list
3d. Find extra non Ext classes (they start with "x-"), which of course have been put there by client
4. CSS selector (class names, nodeName DIV etc)
5. Coordinates

The type of target, possible options:

- 'cq'      component query
- 'csq'     composite query


*/
Class('Siesta.Recorder.TargetExtractor.ExtJS', {
    isa     : Siesta.Recorder.TargetExtractor,

    does    : [
        Siesta.Recorder.TargetExtractor.Recognizer.Grid,
        Siesta.Recorder.TargetExtractor.Recognizer.BoundList,
        Siesta.Recorder.TargetExtractor.Recognizer.DatePicker,
        Siesta.Recorder.TargetExtractor.Recognizer.NumberField,
        Siesta.Recorder.TargetExtractor.Recognizer.View,
        Siesta.Recorder.TargetExtractor.Recognizer.TimeAxisColumn
    ],


    has : {
        // An accessor method to get the relevant Ext JS object for the target (which could reside inside an iframe)
        Ext                     : null,
        baseCSSPrefix           : null,

        allowNodeNamesForTargetNodes : false,

        ignoreIdRegExp          : function () {
            return /^ext-/
        },

        // ?? probably meant to be used for DOM ids only.. Ext 4 vs  Ext 3
        compAutoGenIdRegExp     : /^ext-gen\d+|^ext-comp\d+/,

        uniqueComponentProperty : null,

        // Tell Siesta how components can be identified uniquely,
        // to make sure generated selectors target only a single place in the DOM
        // (sorted in order of relevance)
        componentIdentifiers    : function () {
            return [
                'id',
                'itemId',
                'text',         // menu items, buttons
                'dataIndex',    // Column component
                'iconCls',      // button/menuitem
                'type',         // Panel header tools
                'name',         // form fields
                'title',        // identifying panels, tab panels headers
//                'cls',        // Cmp, TODO discuss
                'inputType',
                'boxLabel',
                'fieldLabel'
            ];
        },

        /* Ignore all generic classes which will generate unstable selectors */
        ignoreClasses           : function () {
            return [
                '-focus$',
                '-over$',               // never use hover-specific CSS classes
                '-selected$',
                '-active$',
                '-default$',
                '-focused$',

                'x-body',
                'x-box-item',
                'x-btn-wrap',
                'x-component',      // too generic
                'x-datepicker-cell',
                'x-fit-item',
                'x-form-field',     // too generic
                'x-form-empty-field',
                'x-form-required-field',
                'x-grid-cell-inner',  // we prefer "x-grid-cell"
                'x-grid-view',
                'x-grid-resize-marker',
                'x-layout',
                'x-menu-item-link',
                'x-noicon',
                'x-resizable-overlay',
                'x-tab-noicon',
                'x-tab-default-noicon',
                'x-tab-default',
                'x-tab-inner',
                'x-tab-button',
                'x-tab-text',
                'x-tab-icon',
                'x-tab-wrap',
                'x-tree-icon',
                'x-trigger-index-',
                'x-unselectable',
                'x-grid-with-row-lines',
                '^x-autocontainer-',
                '^x-btn-inner',
                'x-column-header-text-inner',
                '^x-noborder',
                'x-box-inner',
                'x-monthpicker-item-inner',
                'x-box-target',
                'x-dd-drag-proxy',
                // Ext3 panel body classes
                'x-panel-bwrap',

                // Bryntum generic selectors
                'sch-gantt-terminal$',
                'sch-gantt-task-handle$',
                'sch-gantt-item',
                'sch-resizable-handle$',

                // In case someone left garbage in the DOM
                'null',
                'undefined'
            ];
        },

        // Table view is always in panel which seems more 'relevant'
        // headerContainer is rarely useful (remember though, a grid column is also a headercontainer)
        ignoreCQSelectors            : function () {
            return [
                'viewport',     // Adds no relevance, like matching BODY in a dom query
                'tableview',    // Always sits in a grid panel
                'treeview',     // Always sits in a tree panel
                'gridview',     // Always sits in a grid panel
                'surface',      // "belongs" to a chart but does not respond to CQ: https://www.sencha.com/forum/showthread.php?308911-Querying-chart-gt-surface-doesn-t-work&p=1128263#post1128263
                '>>headercontainer[isColumn=undefined]'
            ];
        },

        ignoreExtClassNamesRe : function () {
            return [
                'Ext.dd.StatusProxy'
            ].join('|');
        }
    },

    methods : {

        initialize : function () {
            var uniqueComponentProperty = this.uniqueComponentProperty

            if (uniqueComponentProperty) {
                this.componentIdentifiers.unshift.apply(
                    this.componentIdentifiers,
                    uniqueComponentProperty instanceof Array ? uniqueComponentProperty : [ uniqueComponentProperty ]
                )
            }

            this.SUPER()
        },

        setExt : function(node) {
            var doc = node.ownerDocument;
            this.Ext = (doc.defaultView || doc.parentWindow).Ext;

            if (this.Ext) {
                this.baseCSSPrefix = this.Ext.baseCSSPrefix || 'x';
            }
        },

        shouldUseContainsSelectorForComponent : function(comp) {
            var viewXtypes = [
                'dataview'
            ];

            return comp.is(viewXtypes.join(','));
        },

        getTargets : function (event, useContainsSelector, saveOffset) {
            var target      = event.target;

            this.setExt(target);

            var component;
            useContainsSelector = false;
            var hasCQ       = this.Ext && this.Ext.ComponentQuery && (this.Ext.versions && !this.Ext.versions.touch);

            if (hasCQ) {
                component = this.getComponentOfNode(target);

                useContainsSelector = !component || this.shouldUseContainsSelectorForComponent(component);
            }

            var result      = this.SUPER(event, useContainsSelector, saveOffset)

            // 1. Ext might not exist in the page,
            // 2. Ext JS < 4 has no support for ComponentQuery
            // 3. We don't support recording Touch applications
            if (!hasCQ) return result;

            // also try to find component/composite queries for the target
            if (component) {
                var componentQuery;

                if (this.swallowExceptions) {
                    try {
                        componentQuery = this.findComponentQueryFor(component)
                    } catch(e) {
                        this.exception = this.exception || e;
                    }
                } else {
                    componentQuery = this.findComponentQueryFor(component)
                }

                if (componentQuery) {
                    var el = (component.el || component.element).dom;

                    this.insertIntoTargets(result, {
                        type        : 'cq',
                        target      : componentQuery.query,
                        offset      : (saveOffset || !this.isElementReachableAtCenter(el)) ? this.findOffset(event.x, event.y, el) : null
                    }, target)

                    var compositeQuery  = this.findCompositeQueryFor(target, componentQuery, componentQuery.target)

                    if (compositeQuery)
                        this.insertIntoTargets(result, {
                            type        : 'csq',
                            target      : compositeQuery.query,
                            offset      : (saveOffset || !this.isElementReachableAtCenter(compositeQuery.target))? this.findOffset(event.x, event.y, compositeQuery.target) : null
                        }, target)
                }
            }

            return result
        },


        findCompositeQueryFor : function (node, componentQuery, component) {
            if (!componentQuery) {
                var component       = this.getComponentOfNode(node)

                if (component) {
                    componentQuery  = this.findComponentQueryFor(component)

                    if (!componentQuery) return null

                    // while finding the component query we've may actually switched to "parent matching" mode
                    // at changed the target component
                    component       = componentQuery.target
                }
            }

            var compEl              = (component.el || component.element)

            var compositeDomQuery   = this.findDomQueryFor(node, compEl.dom, 1)

            // if dom query contains an id - we don't need composite query at all?
            // if (compositeDomQuery && compositeDomQuery.foundId) return null

            return compositeDomQuery
                ?
                    { query : componentQuery.query + ' => ' + compositeDomQuery.query, target : compositeDomQuery.target }
                :
                    null
        },


        getComponentOfNode : function (node) {
            var body        = node.ownerDocument.body
            var Ext         = this.Ext

            while (node && node != body) {
                if (node.id && Ext.getCmp(node.id)) return Ext.getCmp(node.id)

                node        = node.parentNode
            }

            return null
        },

        ignoreDomId : function (id, node) {
            var Ext     = this.Ext;
            var prev    = this.SUPERARG(arguments)

            if (prev || !Ext || !Ext.getCmp) return prev

            // id of node in the dom can be formed from the id of the component this node belongs to
            // for example dom node `container-1019-innertCt` belonging to container-1019
            // such ids are considered auto-generated and should be ignored
            var comp    = this.getComponentOfNode(node)

            // 1. Ignore all autogenerated id's, and further - Ext JS prefixes child elements in certain components as:
            // #button1-btnInnerEl etc
            // Such suffixes should not be considered stable, even if "first half" is stable we filter them out here
            if (comp) {
                if (this.hasAutoGeneratedId(comp) || (id !== comp.id && id.indexOf(comp.id) > -1)) {
                    return true
                }
            }
            return false
        },

        /*
         * Some components rarely offer extra specificity, like grid view which always sits inside a more
         * 'public' grid panel, need to ignore such components
         */
        ignoreComponent   : function (cmp) {
            var Ext    = this.Ext;
            var ignore = (Ext.getClassName && Boolean(Ext.getClassName(cmp).match(this.ignoreExtClassNamesRe)));

            if (!ignore) {
                Joose.A.each(this.ignoreCQSelectors, function (xtype) {
                    var isQuery     = /^>>(.*)/.exec(xtype)

                    if (isQuery && Ext.ComponentQuery.is(cmp, isQuery[ 1 ]) || !isQuery && cmp.xtype == xtype) {
                        ignore = true;
                        return false;
                    }
                });
            }

            return ignore;
        },


        getComponentQuerySegmentForComponent : function (cmp) {
            var append      = '';

            // Figure out how best to identify this component, combobox lists, grid menus etc all need special treatment
            if (cmp.pickerField && cmp.pickerField.getPicker) {
                // Instead try to identify the owner picker field
                cmp         = cmp.pickerField;
                append      = '.getPicker()';
            }

            if (this.ignoreComponent(cmp)) return null;

            var Ext         = this.Ext

            if (Ext.ComponentQuery.is(cmp, 'menu')) {
                // We only care about visible menus
                append      = '{isVisible()}';
            }

            var xtype       = (cmp.getXType && cmp.getXType()) || cmp.xtype || cmp.xtypes[ 0 ]

            var dontNeedXType   = false
            var query           = ''

            for (var i = 0; i < this.componentIdentifiers.length; i++) {
                var attr    = this.componentIdentifiers[ i ]
                var value   = cmp[ attr ]

                if (
                    value && typeof value === 'string' && !(
                        (attr == 'id' && this.hasAutoGeneratedId(cmp)) ||

                        // ignore the "inputType" for sliders which is always a "text"
                        (attr == 'inputType' && Ext.slider && Ext.slider.Multi && (cmp instanceof Ext.slider.Multi)) ||

                        // Some Ext Components have an empty title/text - ignore
                        (value == '&#160;') ||

                        // Form fields can get a 'name' property auto generated, based on its own (or 2 lvls of parents) auto-gen id - ignore if true
                        (attr == 'name' && this.propertyIsAutoGenerated(cmp, 'name'))
                    )
                ) {
                    // Certain chars like commas and [] need to be escaped in Ext ComponentQuery attributes
                    value = value.replace(/,/g, '\\\\,').replace(/\[/g, '\\[').replace(/\]/g, '\\]');

                    if (attr === 'id') {
                        query           = '#' + value
                    } else if (attr === 'itemId') {
                        // Easier to read and xtype is irrelevant
                        // return itemId selector as starting with double ##
                        // this distinct it from the selector with global id and is corrected in the outer method
                        query           = '##' + value
                    } else {
                        query           = '[' + attr + '=' + value + ']'
                    }

                    if (attr === 'id' || attr == 'itemId') dontNeedXType = true

                    break
                }
            }

            if (!query && (xtype == 'component' || xtype == 'container' || xtype == 'toolbar')) return null

            return (dontNeedXType ? query : xtype + query) + append
        },


        // Ext JS 4+: Form fields sometimes get their 'name' generated based on a parent id
        // property is considered to be auto-generated if it contains an id string and id is in turn auto-generated
        propertyIsAutoGenerated : function (comp, prop) {
            // Not relevant for Ext < 4
            if (!comp.up) return false;

            if (comp.autoGenId && comp[ prop ].indexOf(comp.id) >= 0) {
                return true;
            }

            var parentWithAutoId = comp.up('[autoGenId=true]');

            return Boolean(parentWithAutoId) && comp[ prop ].indexOf(parentWithAutoId.id) >= 0
        },


        hasAutoGeneratedId      : function (component) {
            // Ext3 ?
            if (this.compAutoGenIdRegExp.test(component.id)) {
                return true;
            }

            // even if `autoGenId` can be set to false, the id of the component can be formed from the id
            // if its parent, like "window-1019-header_hd" (id of window header), where "window-1019" is autogenerated id 
            // of parent component
            return component.autoGenId || this.propertyIsAutoGenerated(component, 'id');
        },


        processCssClasses : function (classes) {
            var Ext         = this.Ext

            var prefix      = new RegExp('^' + this.baseCSSPrefix)

            var filtered    = classes.filter(function (cssClass) {
                return !prefix.test(cssClass)
            })

            // trying to find any non-Ext css class, if not found - return ext classes
            return filtered.length ? filtered : classes
        },


        findComponentQueryFor : function (comp, lookUpUntil) {
            var target              = comp
            var query               = []

            var foundGlobalId       = false
            // a size of array at which the last `itemId` segment was found
            // we want to include all `itemId` segments in the query, so later in the `for` loop
            // we start not from the last element, but from `last - foundLocalIdAt`
            var foundLocalIdAt      = 0

            var needToChangeTarget  = false

            var current             = target

            while (current && current != lookUpUntil) {
                var segment     = this.getComponentQuerySegmentForComponent(current)

                // can't reliably identify the target component - no query at all
                if (current == comp && !segment)
                    if (this.allowParentMatching) {
                        // switching to "parent matching" mode in which we are looking for some parent of original dom
                        needToChangeTarget  = true
                    } else
                        break

                if (segment) {
                    if (needToChangeTarget) {
                        target              = current
                        needToChangeTarget  = false
                    }

                    query.unshift(segment)

                    // no point in going further up, id is specific enough, return early
                    if (segment.match(/^#[^#]/)) {
                        foundGlobalId       = true
                        break
                    }

                    if (segment.match(/^##/) || segment.match(/^\[itemId=.*\]/)) {
                        foundLocalIdAt = query.length
                        // remove the double ## at the begining of the string, which was just indicating that this is 
                        // "local" item id, not global
                        query[ 0 ]  = query[ 0 ].replace(/^##/, '#')
                    }
                }

                do {
                    current         = current.ownerCt
                } while (current && current != lookUpUntil && this.ignoreComponent(current))
            }

            var resultQuery
            var hasUniqueMatch      = false

            for (var i = foundGlobalId ? 0 : (query.length - (foundLocalIdAt ? foundLocalIdAt : 1)); i >= 0; i--) {
                var parts               = query.slice(i)
                var subQuery            = parts.join(' ')
                var matchingComponents  = this.doNonStandardComponentQuery(subQuery)

                // if only part of the query already matches only one component, we treat this as specific enough query
                // and not using other segments
                if (matchingComponents.length == 1)
                    if (matchingComponents[ 0 ] == target) {
                        hasUniqueMatch  = true
                        resultQuery     = { query : subQuery, target : target, parts : parts }
                        break
                    } else
                        // found some query that matches a single component, not equal to original one - something went wrong
                        return null

                // at this point we are testing the whole query and if it matches more than 1 component
                // in general such query is not specific enough, the only exception is when our component
                // is the 1st one in the results
                // in all other cases return null (below) 
                if (i == 0 && matchingComponents[ 0 ] == target) return { query : subQuery, target : target }
            }

            if (hasUniqueMatch) {
                var matchingParts       = resultQuery.parts

                var index               = 1

                while (index < matchingParts.length - 1) {
                    if (this.componentSegmentIsNotSignificant(matchingParts[ index ])) {
                        var strippedParts   = matchingParts.slice()

                        strippedParts.splice(index, 1)

                        var matchingNodes   = this.doNonStandardComponentQuery(subQuery)

                        if (matchingNodes.length == 1) {
                            matchingParts.splice(index, 1)
                            // need to keep the index the same, so counter-adjust the following ++
                            index--
                        }
                    }

                    index++
                }

                resultQuery.query       = parts.join(' ')
                delete resultQuery.parts

                return resultQuery
            }

            var globalQuery = this.findGlobalQuery(comp);

            if (globalQuery) {
                return {
                    query  : globalQuery,
                    target : comp
                };
            }

            return null;
        },

        // As a fallback, if a component can not be uniquely identified with CQ - just use a
        // basic CQ based on the full tree hierarchy
        findGlobalQuery : function(comp) {
            var Ext   = this.Ext
            var parent;
            var parts = [];

            while(parent = comp.up()) {
                // Make sure parent is a container (could be a Combobox or something else)
                if(comp.xtype && ((parent.contains && parent.contains(comp)) || (parent.child && parent.child(comp)))) {
                    var index = parent.items ? parent.items.indexOf(comp) : -1;

                    if (index >= 0) {
                        parts.unshift(comp.xtype + ':nth-child(' + (index + 1) + ')');
                    } else {
                        parts.unshift(comp.xtype);
                    }

                    comp = parent;
                } else {
                    break;
                }
            }

            if (!comp.xtype) return null; // Failed to find a query

            if (!Ext.ComponentQuery.pseudos.root) {
                this.installRootPseudoCQ();
            }

            // Add a root level component which should make the result sufficiently unique
            var allRootComponentsOfType = Ext.ComponentQuery.query(comp.xtype  + '(true)' + ':root');
            var index = Ext.Array.indexOf(allRootComponentsOfType, comp);

            if (index < 0) {
                throw 'Could not find global CQ for xtype: ' + comp.xtype + ' , parts: ' + parts.join(' ');
            }

            parts.unshift(comp.xtype + '(true):root(' + (index + 1) + ')');

            return parts.join(' ');
        },


        componentSegmentIsNotSignificant : function () {
            return false
        },


        // Component Query with extensions - ".someMethod()" at the end
        doNonStandardComponentQuery : function (query, lookUpUntil) {
            var Ext             = this.Ext
            var match           = /(.+?)\.(\w+)\(\)/g.exec(query)

            var trimmedQuery    = ((match && match[ 1 ]) || query).trim();
            var methodName      = match && match[ 2 ]

            // Discard any hidden components, special treatment of Ext Widgets that don't yet implement isVisible.
            // https://www.sencha.com/forum/showthread.php?308370-CQ-crashes-if-widgets-are-used&p=1126410#post1126410
            var matchedComponents   = Ext.ComponentQuery.query(trimmedQuery + ':not([isVisible])').concat(
                Ext.ComponentQuery.query(trimmedQuery + '[isVisible]{isVisible()}')
            )

            if (methodName)
                for (var i = 0; i < matchedComponents.length; i++)
                    if (Object.prototype.toString.call(matchedComponents[ i ][ methodName ]) == '[object Function]')
                        matchedComponents[ i ] = matchedComponents[ i ][ methodName ]()

            return matchedComponents
        },


        resolveTarget : function (target) {
            if (target.type == 'cq') {
                var component   = this.doNonStandardComponentQuery(target.target)[ 0 ]
                var el          = component && (component.el || component.element)

                return el && el.dom
            }

            if (target.type == 'csq') {
                var parts   = target.target.split('=>')

                var compEl  = this.resolveTarget({ type : 'cq', target : parts[ 0 ] })

                var el      = compEl && Sizzle(parts[ 1 ], compEl)[0]

                return el
            }

            return this.SUPERARG(arguments)
        },


        getFirstNonExtCssClass : function (node) {
            var prefix      = this.baseCSSPrefix;
            var trimmed     = node.className.trim();
            var classes     = trimmed && trimmed.replace(/  +/g, ' ').split(' ') || [];

            for (var i = 0; i < classes.length; i++) {
                var cls     = classes[ i ].trim();

                if (cls.indexOf(prefix) != 0) return cls
            }

            return null;
        },


        // gets `node` itself (if it matches selector) or the neareset such parent  and returns the
        // index of that node in its parent child nodes list
        getNthPosition : function (node, selector) {
            // find item that has the given `cls` class, starting from given `node` and up in the dom tree
            var itemInList  = this.is(node, selector) ? node : this.closest(node, selector);

            // then find out, what index it has in its parent node
            var array       = Array.prototype.slice.apply(itemInList.parentNode.childNodes);

            return array.indexOf(itemInList)
        },

        // add :root pseudo CQ selector to be able to identify 'root' level components that don't have
        // parent containers. value is 1-based
        installRootPseudoCQ : function() {
            this.Ext.ComponentQuery.pseudos.root = function(items, value) {
                var i = 0, l = items.length, c, result = [];
                var findAllRoots = value === undefined

                if (!findAllRoots) {
                    value = Number(value) - 1;
                }

                for (; i < l; i++) {
                    c = items[i].up();
                    var hasParentContainer = c && c.contains && c.contains(items[i]);

                    if (!hasParentContainer) {
                        result.push(items[i]);
                    }
                }

                if (!findAllRoots) {
                    result = result[value] ? [result[value]] : [];
                }

                return result;
            };
        }
    }

//    ,
//    my : {
//        has : {
//            recognizers : Joose.I.Object
//        },
//
//        methods : {
//
//            addRecognizer : function (recognizer) {
//                this.recognizers[ recognizer.meta.name ] = recognizer.recognize;
//            }
//        }
//    }
});
;
/**
 @class Siesta.Recorder.ExtJS

 Ext JS specific recorder implementation

 */
Role('Siesta.Recorder.Helper.GridColumn', {

    override : {

        // Hook called before adding actions to inject 'helping' actions
        beforeAddAction : function(action) {
            this.SUPERARG(arguments);

            var target = action.getTarget();

            if ((action.action === 'click' || action.action === 'moveCursorTo') && target && typeof target.target === 'string' && target.target.match('column-header-trigger$')) {
                // Make sure we don't add extra unnecessary helper actions: scenario
                // 1. move cursor to column trigger el and wait
                // 2. This adds moveCursorTo action for the trigger el
                // 3. We inject a moveCursorTo before, targeting the grid column main element
                // 4. Click trigger el, now we should not inject any helper steps

                var prevHelperAction = this.getRecordedActions()[this.getRecordedActions().length - 2];
                var lastActionTarget = prevHelperAction && prevHelperAction.getTarget() && prevHelperAction.getTarget().target;
                var columnSelector   = target.target.replace(/column-header-trigger/, "column-header-inner");

                if (!prevHelperAction || prevHelperAction.action !== 'moveCursorTo' || lastActionTarget !== columnSelector) {
                    // Before clicking column header trigger to activate menu, inject a mouse move to the column which
                    // shows the trigger el
                    this.addAction({
                        action : 'moveCursorTo',

                        target : [{
                            type   : target.type,
                            target : columnSelector
                        }],

                        sourceEvent : action.sourceEvent
                    })
                }
            }
        }
    }
    // eof methods
});
;
/**
 @class Siesta.Recorder.ExtJS

 Ext JS specific recorder implementation

 */
Class('Siesta.Recorder.ExtJS', {
    isa     : Siesta.Recorder.Recorder,

    does : [
        Siesta.Recorder.Helper.GridColumn
    ],

    has : {
        extractorClass          : Siesta.Recorder.TargetExtractor.ExtJS,
        _moveCursorToSelectors   : function() {
            return ['.x-menu-item'];
        }
    },

    methods : {
        initialize : function () {
            this.SUPERARG(arguments)
        },

        onStart : function() {
            var me              = this,
                window          = me.window,
                body            = window.document.body;

            this.SUPERARG(arguments)

            body.addEventListener('mouseover', this.onMouseOver, true);
        },

        onStop : function() {
            var me              = this,
                window          = me.window,
                body            = window.document.body;

            this.SUPERARG(arguments)

            body.removeEventListener('mouseover', this.onMouseOver, true);
        },

        addMoveCursorAction : function(event, recordOffsets) {
            // If something is being dragged and we're hovering over the drag target, choose moveCursorTo with coordinate
            if (event.target && this.closest(event.target, '[class*=-dd-drag-proxy]', 5)) {
                this.addAction({
                    action          : 'moveCursorTo',

                    target          : [{
                        type        : 'xy',
                        target      : [ event.x, event.y ]
                    }],

                    sourceEvent     : event,
                    options         : event.options
                })
            } else {
                this.SUPERARG(arguments)
            }
        }
    }
    // eof methods
});
;
;
