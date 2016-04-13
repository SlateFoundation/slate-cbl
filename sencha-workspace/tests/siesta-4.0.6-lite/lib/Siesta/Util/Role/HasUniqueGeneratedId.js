/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
!function () {
/* header */
    
var id      = 1

Role('Siesta.Util.Role.HasUniqueGeneratedId', {
    
    has : {
        id                      : {
            is      : 'ro',
            init    : function () { return id++ }
        }
    }
})

/* footer */
}()