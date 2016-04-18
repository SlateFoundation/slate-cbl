/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
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
