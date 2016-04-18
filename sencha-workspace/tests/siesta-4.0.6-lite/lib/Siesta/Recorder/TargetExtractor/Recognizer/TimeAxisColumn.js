/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
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
