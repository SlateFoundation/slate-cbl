/*

Siesta 4.0.6
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/products/siesta/license

*/
/**
@class Siesta.Test.ExtJS.Ajax

This is a mixin, with helper methods for mocking Ajax functionality in Ext JS. This mixin is consumed by {@link Siesta.Test.ExtJS}. 
This is only supported when testing Ext JS 4.
*/
Role('Siesta.Test.ExtJS.Ajax', {
    has : {
        responses   : Joose.I.Array,
        urlMatchers : Joose.I.Array
    },

    methods: {

        /**
         * This assertion passes if there is at least one ongoing ajax call.
         * 
         * @param {Object} object (optional) The options object passed to Ext.Ajax.request
         * @param {String} [description] The description for the assertion
         */
        isAjaxLoading: function (obj, description) {
            var Ext = this.Ext();
            this.ok(Ext.Ajax.isLoading(obj), description || Siesta.Resource('Siesta.Test.ExtJS.Ajax', 'ajaxIsLoading'));
        },

        /**
         * This method calls the supplied URL using Ext.Ajax.request and then calls the provided callback. The callback will be called with the 
         * same parameters as the normal Ext.Ajax.request callback is called with ("options", "success" and "response"). To get the response text,
         * use response.responseText.
         * 
         * @param {String/Object} url The url or the options to pass to Ext.Ajax.request
         * @param {Function} callback The callback to call after the ajax request is completed
         * @param {Object} scope The scope for the callback
         */
        ajaxRequestAndThen: function (url, callback, scope) {
            var Ext     = this.Ext();
            var options = url;

            if (typeof(url) === 'string') {
                options = {
                    url         : url,
                    callback    : callback,
                    scope       : scope
                };
            }

            Ext.Ajax.request(options);
        },

        /**
         * Waits until the passed Ext.Ajax request object has completed, or until the latest performed Ajax request is done if the first argument is omitted.
         * 
         * @param {Object} object (optional) The options object passed to Ext.Ajax.request
         * @param {Function} callback The callback to call after the ajax request is completed
         * @param {Object} scope The scope for the callback
         * @param {Int} timeout The maximum amount of time to wait for the condition to be fulfilled. Defaults to the {@link Siesta.Test#waitForTimeout} value. 
         */
        waitForAjaxRequest: function (obj, callback, scope, timeout) {
            var Ext = this.Ext();
            var msg;

            if (typeof obj === 'function') {
                msg         = ' ' + Siesta.Resource('Siesta.Test.ExtJS.Ajax', 'allAjaxRequestsToComplete');
                timeout     = scope;
                scope       = callback;
                callback    = obj;
                obj         = undefined;
            } else {
                msg = ' ' + Siesta.Resource('Siesta.Test.ExtJS.Ajax', 'ajaxRequest') + ' "' + obj.options.url + '" ' + Siesta.Resource('Siesta.Test.ExtJS.Ajax', 'toComplete');
            }

            return this.waitFor({
                method          : function() { 
                    if (obj) {
                        return !Ext.Ajax.isLoading(obj) && obj;
                    }
                    return !Ext.Ajax.isLoading();
                }, 
                callback        : callback,
                scope           : scope, 
                timeout         : timeout,
                assertionName   : 'waitForAjaxRequest',
                description     : msg
            });
        }
    }
});
