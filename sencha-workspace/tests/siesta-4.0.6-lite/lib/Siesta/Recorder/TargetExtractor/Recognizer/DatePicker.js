/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
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
