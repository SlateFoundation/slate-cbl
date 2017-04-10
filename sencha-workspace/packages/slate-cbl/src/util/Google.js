Ext.define('Slate.cbl.util.Google', {
    singleton: true,

    requires: [
        'Ext.Promise',
        'Ext.util.Cookies'
    ],

    config: {
        tokenName: 'googleAppsToken',
        requiredAPIs: [
            'auth',
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


    getToken: function() {
        return Ext.util.Cookies.get(this.getTokenName(), '/');
    },

    getDeveloperKey: function() {
        return SiteEnvironment && SiteEnvironment.googleAppsDeveloperKey;
    },

    getClientId: function() {
        return SiteEnvironment && SiteEnvironment.googleAppsClientId;
    },

    getGoogleAppsDomain: function() {
        return SiteEnvironment && SiteEnvironment.googleAppsDomain || location.host;
    },

    verifyEmailAddress: function(email) {
        return email.match(new RegExp('^.+@'+Slate.cbl.util.Google.getGoogleAppsDomain()+'$'));
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
            requiredAPIs = this.getRequiredAPIs().join(':');

        if (!gapi) {
            exception.error = 'Unable to find gapi, aborting.';
            throw exception;
        }

        return new Ext.Promise(function(resolve) {
            me.setApiIsLoaded(true);
            gapi.load(requiredAPIs, resolve);
        });
    },

    /*
    * Returns Ext.Promise object
    */
    authenticateUser: function() {
        var me = Slate.cbl.util.Google,
            scope = ['https://www.googleapis.com/auth/drive'],
            clientId = me.getClientId();

        return gapi.auth.authorize({
            'client_id': clientId,
            'scope': scope,
            'immediate': false
        }).
        then(me.onUserAuthenticated);
    },

    /*
    * Returns Ext.Promise object
    */
    onUserAuthenticated: function(authResult) {
        return new Ext.Promise(function(resolve, reject) {
            var me = Slate.cbl.util.Google,
                googleAppsDomain = me.getGoogleAppsDomain(),
                googleAppsEmailRegex = new RegExp('^.+@'+googleAppsDomain+'$'),
                tokenExpiration;

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

                tokenExpiration = new Date(authResult.expires_at * 1000);

                Ext.util.Cookies.set(me.getTokenName(), authResult.access_token, tokenExpiration, '/');

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

    cloneGoogleFile: function(fileData) {
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
                }
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