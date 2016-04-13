/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
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
