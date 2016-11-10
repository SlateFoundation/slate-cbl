/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
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
