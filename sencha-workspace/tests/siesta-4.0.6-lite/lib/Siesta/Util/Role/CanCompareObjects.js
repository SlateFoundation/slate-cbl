/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Util.Role.CanCompareObjects

A mixin, providing the "compareObjects" method. 

*/
Role('Siesta.Util.Role.CanCompareObjects', {
    
    does    : [
        Siesta.Util.Role.CanGetType
    ],
    
    methods : {
        
        countKeys : function (object) {
            var counter = 0

            Joose.O.eachOwn(object, function () {
                counter++
            })

            return counter
        },


        /**
         * This method performs a deep comparison of the passed JSON objects. Objects must not contain cyclic references.
         * You can use this method in your own assertions.
         *
         * @param {Mixed} obj1 The 1st object to compare
         * @param {Mixed} obj2 The 2nd object to compare
         * @param {Boolean} strict When passed the `true` value, the comparison of the primitive values will be performed with the
         * `===` operator (so [ 1 ] and [ "1" ] object will be different). Additionally, when this flag is set to `true`, then
         * when comparing Function, RegExp and Date instances, additional check that objects contains the same set of own properties ("hasOwnProperty")
         * will be performed.
         * @param {Boolean} onlyPrimitives When set to `true`, the function will not recurse into composite objects (like [] or {}) and will just report that
         * objects are different. Use this mode when you are only interested in comparison of primitive values (numbers, strings, etc).
         * @param {Boolean} asObjects When set to `true`, the function will compare various special Object instances, like Functions, RegExp etc,
         * by comparison of their properties only and not taking the anything else into account.
         * @return {Boolean} `true` if the passed objects are equal
         */
        compareObjects : function (obj1, obj2, strict, onlyPrimitives, asObjects) {
            var obj1IsPlaceholder       = Joose.O.isInstance(obj1) && obj1.meta.does(Siesta.Test.Role.Placeholder)
            var obj2IsPlaceholder       = Joose.O.isInstance(obj2) && obj2.meta.does(Siesta.Test.Role.Placeholder)

            if (strict) {
                if (obj1 === obj2) return true
            } else
                if (obj1 == obj2) return true

            if (obj1IsPlaceholder && obj2IsPlaceholder)
                return obj1.equalsTo(obj2)
            else if (obj2IsPlaceholder)
                return obj2.equalsTo(obj1)
            else if (obj1IsPlaceholder)
                return obj1.equalsTo(obj2)

            if (onlyPrimitives) return false

            var type1 = this.typeOf(obj1)
            var type2 = this.typeOf(obj2)

            if (type1 != type2) return false

            var me = this

            if (type1 == 'Object' || asObjects)
                if (this.countKeys(obj1) != this.countKeys(obj2))
                    return false
                else {
                    var res = Joose.O.eachOwn(obj1, function (value, name) {

                        if (!me.compareObjects(value, obj2[ name ], strict)) return false
                    })

                    return res === false ? false : true
                }

            if (type1 == 'Array')
                if (obj1.length != obj2.length)
                    return false
                else {
                    for (var i = 0; i < obj1.length; i++)
                        if (!this.compareObjects(obj1[ i ], obj2[ i ], strict)) return false

                    return true
                }

            if (type1 == 'Function')
                return obj1.toString() == obj2.toString() && (!strict || this.compareObjects(obj1, obj2, strict, false, true))

            if (type1 == 'RegExp')
                return obj1.source == obj2.source && obj1.global == obj2.global && obj1.ignoreCase == obj2.ignoreCase
                    && obj1.multiline == obj2.multiline && (!strict || this.compareObjects(obj1, obj2, strict, false, true))

            if (type1 == 'Date') return !Boolean(obj1 - obj2) && (!strict || this.compareObjects(obj1, obj2, strict, false, true))

            return false
        }
    }
})
