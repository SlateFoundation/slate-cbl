/**
 * This controller provides optional Google Drive integration for attachments
 */
Ext.define('SlateTasksTeacher.controller.GoogleDrive', {
    extend: 'Ext.app.Controller',
    requires: [
        /* global Slate */
        'Slate.cbl.util.Google'
    ],


    // entry points
    listen: {
        controller: {
            '#': {
                bootstrapdataload: 'onBootstrapDataLoad'
            }
        }
    },

    control: {
        // attachmentsList: {
        //     sharemethodchange: 'onGoogleFileShareMethodChange'
        // },
        // 'slate-tasks-teacher-taskeditor slate-tasks-attachmentsfield': {
        //     addgoogleattachment: 'onAddGoogleAttachmentClick'
        // }
    },


    // event handlers
    onBootstrapDataLoad: function(app, bootstrapData) {
        var googleApiConfig = bootstrapData.googleApiConfig;

        // configure Google API
        if (googleApiConfig) {
            Slate.cbl.util.Google.setConfig(googleApiConfig);
        }
    }


    // onGoogleFileShareMethodChange: function(list, record, radio, selected) {
    //     var me = this,
    //         shareMethod = radio.inputValue;

    //     if (selected === false) {
    //         return false;
    //     }

    //     record.set('ShareMethod', shareMethod);

    //     if (shareMethod === 'collaborate') {
    //         return Slate.cbl.util.Google.getUserFilePermissions(record.get('File').DriveID).
    //             then(function(role) {
    //                 var errorMessage;

    //                 if (!role) {
    //                     errorMessage = 'Unable to collaborate with this file. <br>You can either:<ul><li>Duplicate this file into your drive</li>Request write access from the file owner.<li>b</li></ul>';
    //                     Ext.Msg.alert('Unable to collaborate', errorMessage);
    //                 }

    //             });
    //     }

    //     return false;
    // },

    // onAddGoogleAttachmentClick: function() {
    //     var me = this,
    //         googleUtil = Slate.cbl.util.Google;

    //     if (googleUtil.getToken()) {
    //         googleUtil.loadAPI().
    //             then(function() {
    //                 return gapi.client.request({
    //                     path: '/drive/v3/about',
    //                     params: {
    //                         fields: 'user',
    //                         'access_token': googleUtil.getToken()
    //                     }
    //                 });
    //             }).
    //             then(function(response) {
    //                 Ext.Promise.resolve(googleUtil.setAuthenticatedUser(response.result.user));
    //             }, googleUtil.authenticateUser).
    //             then(Ext.bind(me.openFilePicker, me)).
    //             then(null, function(error) {
    //                 if (Ext.isObject(error)) {
    //                     if (error.error == 'popup_closed_by_user' || error.error == 'access_denied') {
    //                         return;
    //                     }

    //                     if (error.error == 'popup_blocked_by_browser') {
    //                         error = 'The sign-in popup was blocked by the browser. Please try again.';
    //                     }
    //                 }

    //                 if (!Ext.isString(error)) {
    //                     error = 'An error occured. Please try again.';
    //                 }

    //                 Ext.Msg.alert('Error', error);
    //             });
    //     } else {
    //         googleUtil.loadAPI().
    //             then(googleUtil.authenticateUser).
    //             then(Ext.bind(me.openFilePicker, me)).
    //             then(null, function(error) {
    //                 if (Ext.isObject(error)) {
    //                     if (error.error == 'popup_closed_by_user' || error.error == 'access_denied') {
    //                     return;
    //                     }

    //                     if (error.error == 'popup_blocked_by_browser') {
    //                         error = 'The sign-in popup was blocked by the browser. Please try again.';
    //                     }
    //                 }

    //                 if (!Ext.isString(error)) {
    //                     error = 'An error occured. Please try again.';
    //                 }

    //                     Ext.Msg.alert('Error', error);
    //             });
    //     }
    // },

    // onGoogleAuthentication: function(authResult) {
    //     var me = this,
    //         googleAppsDomain = SiteEnvironment && SiteEnvironment.googleAppsDomain || location.host,
    //         googleAppsEmailRegex = new RegExp('^.+@'+googleAppsDomain+'$'),
    //         tokenExpiration;

    //     console.info('handleAuthResult(%o)', authResult);

    //     if (!authResult || authResult.error) {
    //         Ext.Msg.alert('Error', 'Unable to authenticate user. Please try again or contact an administrator.');
    //         return;
    //     }

    //     // confirm authentication is within google apps domain
    //     gapi.client.request({
    //         path: '/drive/v3/about',
    //         params: {
    //             fields: 'user'
    //         }
    //     }).
    //     then(function(response) {
    //         console.info('loaded user', response.result);

    //         if (!response.result || !response.result.user || !response.result.user.emailAddress.match(googleAppsEmailRegex)) {
    //             return Ext.Promise.reject('Please sign in with an account under ' + googleAppsDomain);
    //         }

    //         tokenExpiration = new Date(authResult.expires_at * 1000);

    //         Ext.util.Cookies.set('googleAppsToken', authResult.access_token, tokenExpiration, '/');

    //         me.doOpenFilePicker(authResult.access_token);
    //     }).
    //     then(null, function(error) {
    //         var errorMessage;

    //         if (error) {
    //             if (Ext.isString(error)) {
    //                 errorMessage = error;
    //             } else if (Ext.isObject(error) && Ext.isString(error.error)) {
    //                 errorMessage = error.error;
    //             }
    //         }
    //         if (errorMessage) {
    //             Ext.Msg.alert('Error', errorMessage);
    //         }
    //     });
    // },


    // // internal methods
    // doAddGoogleFile: function(file, ownerEmail) {
    //     var me = this,
    //         attachmentsField = me.getAttachmentsField(),
    //         fileId = file[google.picker.Document.ID];

    //     gapi.client.request({
    //         path: '/drive/v3/files/'+fileId+'/revisions/head',
    //         method: 'GET',
    //         params: {
    //             'access_token': Ext.util.Cookies.get('googleAppsToken', '/')
    //         }
    //     }).then(function(response) {
    //         var fileInfo = response.result;

    //         if (response.error) {
    //             Ext.Msg.alert('Error', 'Unable to lookup details about google document. Please try again, or contact an administrator.');
    //             return;
    //         }

    //         attachmentsField.setAttachments({
    //             Class: 'Slate\\CBL\\Tasks\\Attachments\\GoogleDriveFile',
    //             URL: file[google.picker.Document.URL],
    //             Title: file[google.picker.Document.NAME],
    //             FileRevisionID: fileInfo.id,
    //             File: {
    //                 DriveID: fileId,
    //                 OwnerEmail: ownerEmail,
    //                 Type: 'n/a',
    //                 Title: file[google.picker.Document.NAME]
    //             }
    //         }, true);
    //     },
    //     function(response) { // revision id could not be found
    //         var error = response.result.error;

    //         if (Ext.isObject(error) && error.code === 404) {
    //             attachmentsField.setAttachments({
    //                 Class: 'Slate\\CBL\\Tasks\\Attachments\\GoogleDriveFile',
    //                 URL: file[google.picker.Document.URL],
    //                 Title: file[google.picker.Document.NAME],
    //                 File: {
    //                     DriveID: fileId,
    //                     OwnerEmail: ownerEmail
    //                 }
    //             }, true);
    //         }
    //     });
    // },

    // openFilePicker: function() {
    //     var me = this,
    //         googleUtil = Slate.cbl.util.Google,
    //         taskEditor = me.getTaskEditor();

    //     taskEditor.hide(true);

    //     googleUtil.
    //         initFilePicker().
    //         setCallback(function(data) {
    //             var showTaskEditor = [
    //                     google.picker.Action.CANCEL,
    //                     google.picker.Action.PICKED
    //                 ].indexOf(data[google.picker.Response.ACTION]) > -1,

    //                 filePicked = data[google.picker.Response.ACTION] == google.picker.Action.PICKED,
    //                 fileData = filePicked && data[google.picker.Response.DOCUMENTS][0];

    //             if (data[google.picker.Response.ACTION] == 'loaded') {
    //                 return;
    //             } else if (data[google.picker.Response.ACTION] === google.picker.Action.CANCEL) {
    //                 googleUtil.setAuthenticatedUser(null);
    //             }

    //             if (showTaskEditor) {
    //                 taskEditor.show();
    //             }

    //             if (fileData) {
    //                 googleUtil.
    //                     getGoogleFileOwnerEmail(fileData).
    //                     then(function(response) {
    //                         var emailIsValid = googleUtil.verifyEmailAddress(response.result.emailAddress);

    //                         if (emailIsValid) {
    //                             return Ext.Promise.resolve({
    //                                 file: fileData,
    //                                 email: response.result.emailAddress
    //                             });
    //                         }

    //                         return new Ext.Promise(function(resolve) {
    //                             Ext.Msg.confirm('Clone File', 'This google drive file is currently owned by someone outside of the '+googleUtil.getGoogleAppsDomain() + ' domain. Would you like to clone this file instead?', function(answer) {
    //                                 if (answer === 'yes') {
    //                                     resolve(googleUtil.cloneGoogleFile(fileData));
    //                                 }
    //                             });
    //                         });
    //                     }).
    //                     then(null, function(response) {
    //                         return new Ext.Promise(function(resolve) {
    //                             if (response.result && response.result.error && response.result.error.code === 403) {
    //                                 Ext.Msg.confirm('Clone File', 'You must have write access to the file in order to share. Would you like to clone this file instead?', function(answer) {
    //                                     if (answer === 'yes') {
    //                                         resolve(googleUtil.cloneGoogleFile(fileData));
    //                                     }
    //                                 });
    //                             }
    //                         });
    //                     }).
    //                     then(function(response) {
    //                         me.doAddGoogleFile(response.file, response.email);
    //                     });
    //             }
    //         }).
    //         build().
    //         setVisible(true);
    // },

});