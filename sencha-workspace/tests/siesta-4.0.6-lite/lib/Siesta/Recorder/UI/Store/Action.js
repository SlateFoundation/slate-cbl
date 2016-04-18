/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
Ext.define('Siesta.Recorder.UI.Store.Action', {
    extend : 'Ext.data.TreeStore',
    alias  : 'store.actionstore',
    model  : 'Siesta.Recorder.UI.Model.Action',
    alias  : 'store.actionstore',
    proxy  : 'memory',
    root   : {
        expanded : true
    },

    tabSize : 4,

    generateCode : function (name) {
        var root = this.getRootNode();
        var code = '';

        if (root.childNodes.length > 0) {
            if (root.firstChild.isLeaf()) {
                // Make a simple chain
                code = this.generateChain(root);
            } else {
                // Group assertions into "it" statements
                code = root.childNodes.map(this.generateCodeForNode, this).join('\n\n');
            }
        }

        return 'describe("' + name + '", function(t) {\n' + code + '\n});'
    },

    generateCodeForNode : function (node) {

        if (node.isLeaf()) {
            return this.getIndent(node.data.depth + 1) + node.asCode();
        }

        if (node.get('action') === 'group') {
            return this.generateIt(node);
        }
    },

    generateIt : function (node) {
        var indent = this.getIndent(node.data.depth);
        var itPre  = indent + 't.it("' + (node.get('value') || 'should...') + '", function(t) {\n';
        var itPost = '\n' + indent + '});';

        return itPre + this.generateChain(node) + itPost;
    },

    generateChain : function (node) {
        var me        = this;
        var indent    = this.getIndent(node.data.depth + 1);
        var chainPre  = indent + 't.chain(\n';
        var chainPost = '\n' + indent + ');';

        var codeForSteps = node.childNodes.map(function (step) {
            return me.generateCodeForNode(step);
        }).join(',\n\n');

        return chainPre + codeForSteps + chainPost;
    },

    getIndent : function (tabs) {
        return new Array((this.tabSize * tabs) + 1).join(' ');
    }
});
