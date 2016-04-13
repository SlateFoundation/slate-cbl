/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
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
