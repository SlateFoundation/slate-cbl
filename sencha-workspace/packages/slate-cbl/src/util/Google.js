Ext.define('Slate.cbl.util.Google', {
    singleton: true,
    requires: [
        'Ext.Promise',
        'Ext.util.Cookies'
    ],
    mixins: [
        'Ext.mixin.Mashup'
    ],
    requiredScripts: [
        'https://apis.google.com/js/api.js'
    ],


    config: {
        domain: null,
        clientId: null,
        developerKey: null,

        tokenName: 'googleAppsToken',
        scope: 'https://www.googleapis.com/auth/drive',
        requiredAPIs: [
            'auth2',
            'client',
            'picker'
        ],
        apiIsLoaded: false,
        authenticatedUser: null
    },

    constructor: function(cfg) {
        this.initConfig(cfg || {});

        return this;
    },

    updateAuthenticatedUser: function(user) {
        if (user === null) {
            this.setToken(null);
        }
    },

    getToken: function() {
        return Ext.util.Cookies.get(this.getTokenName(), '/');
    },

    setToken: function(token, expiration) {
        if (token === null) {
            expiration = new Date(0);
        }

        return Ext.util.Cookies.set(this.getTokenName(), token, expiration, '/');
    },

    verifyEmailAddress: function(email) {
        return email.match(new RegExp('^.+@'+Slate.cbl.util.Google.getDomain()+'$'));
    },

    initFilePicker: function() {
        var me = Slate.cbl.util.Google,
            token = me.getToken(),
            developerKey = me.getDeveloperKey();

        return new google.picker.PickerBuilder().
            addView(google.picker.ViewId.DOCS).
            setOAuthToken(token).
            setDeveloperKey(developerKey);
    },

    loadAPI: function() {
        var me = Slate.cbl.util.Google,
            exception = {},
            requiredAPIs = me.getRequiredAPIs().join(':');

        if (!gapi) {
            exception.error = 'Unable to find gapi, aborting.';
            throw exception;
        }

        return new Ext.Promise(function(resolve) {
            me.setApiIsLoaded(true);
            gapi.load(requiredAPIs, function() {
                gapi.auth2.init({
                    'client_id': me.getClientId(),
                    'hosted_domain': me.getGoogleAppsDomain()
                });

                resolve(arguments);
            });

        });
    },

    /*
    * Returns Ext.Promise object
    */
    authenticateUser: function() {
        var me = Slate.cbl.util.Google;

        return gapi.auth2.getAuthInstance().signIn({
            'scope': me.getScope(),
            prompt: 'select_account'
        }).
        then(me.onUserAuthenticated);
    },

    /*
    * Returns Ext.Promise object
    */
    onUserAuthenticated: function(response) {
        return new Ext.Promise(function(resolve, reject) {
            var me = Slate.cbl.util.Google,
                googleAppsDomain = me.getDomain(),
                authResult = response.getAuthResponse();

            console.info('handleAuthResult(%o)', authResult);

            if (!authResult || authResult.error) {
                reject(authResult.error);
                return;
            }

            gapi.client.request({
                path: '/drive/v3/about',
                params: {
                    fields: 'user'
                }
            }).
            then(function(userProfileResponse) {
                console.info('loaded user', userProfileResponse.result);
                if (!userProfileResponse.result || !userProfileResponse.result.user || !me.verifyEmailAddress(userProfileResponse.result.user.emailAddress)) {
                    reject('Please sign in with an account under ' + googleAppsDomain);
                    return;
                }

                me.setToken(authResult.access_token, new Date(authResult.expires_at * 1000));
                me.setAuthenticatedUser(userProfileResponse.result.user);

                resolve(userProfileResponse);
            });
        });
    },

    /*
    * Returns Ext.Promise object
    */
    getGoogleFileOwnerEmail: function(file) {
        var me = Slate.cbl.util.Google,
            permissionId = me.getAuthenticatedUser().permissionId,
            fileId = file[google.picker.Document.ID];

        return gapi.client.request({
            path: '/drive/v3/files/'+fileId+'/permissions/'+permissionId,
            method: 'GET',
            params: {
                'access_token': me.getToken(),
                fields: 'id,emailAddress'
            }
        });
    },

    cloneGoogleFile: function(file) {
        var me = Slate.cbl.util.Google,
            googleAppsToken = me.getToken();

        return gapi.client.request({
            path: '/drive/v3/files/' + file[google.picker.Document.ID] + '/copy',
            method: 'POST',
            params: {
                'access_token': googleAppsToken,
                fields: 'id,name,webViewLink'
            },
            body: {
                'resource': { 'title': file[google.picker.Document.NAME] }
            }
        }).
        then(function(response) {
            if (response.error) {
                return Ext.Promise.reject(response);
            }

            return Ext.Promise.resolve({
                file: {
                    url: response.result.webViewLink,
                    name: response.result.name,
                    id: response.result.id
                },
                email: me.getAuthenticatedUser().emailAddress
            });
        });
    },

    /**
    * Get user file permission role (owner, writer, commenter, reader)
    * @param fileId string - Google Drive File ID
    * @param token string - Google API token, with Google Drive API scope, defaults to last token cached
    * @param permissionId string - Google User Permission ID, defaults to last authenticated user
    * Returns Promise
    */
    getUserFilePermissions: function(fileId, token, permissionId) {
        var me = Slate.cbl.util.Google,
            userPermissionId = permissionId || me.getAuthenticatedUser() && me.getAuthenticatedUser().permissionId,
            accessToken = token || me.getToken(),
            roles = [
                'reader',
                'commenter',
                'writer',
                'owner'
            ];

        return gapi.client.request({
            path: '/drive/v3/files/'+fileId+'/permissions',
            method: 'GET',
            params: {
                'access_token': accessToken
            }
        }).
        then(function(response) {
            var userPermission,
                permissions,
                i = 0;

            if (response.result && response.result.error) {
                return Ext.Promise.reject(response.results.error.errors);
            }

            permissions = response.result.permissions;
            for (; i < permissions.length; i++) {
                switch (permissions[i].type) {
                    case 'anyone':
                    case 'user':
                        if (permissions[i].id === userPermissionId
                            && (!userPermission || roles.indexOf(permissions[i].role) > roles.indexOf(userPermission))
                        ) {
                            userPermission = permissions[i].role;
                        }

                        break;

                    default:
                        break;
                }

                if (userPermission === roles[roles.length - 1]) {
                    continue;
                }
            }

            return Ext.Promise.resolve(userPermission);
        });
    }
});