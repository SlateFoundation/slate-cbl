/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
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
