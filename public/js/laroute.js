(function () {
  var laroute = function () {
    var routes = {
      absolute: false,
      rootUrl: "http://phoenixpanel.local",
      routes: [
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "_debugbar/open",
          name: "debugbar.openhandler",
          action: "BarryvdhDebugbarControllersOpenHandlerController@handle",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "_debugbar/clockwork/{id}",
          name: "debugbar.clockwork",
          action: "BarryvdhDebugbarControllersOpenHandlerController@clockwork",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "_debugbar/assets/stylesheets",
          name: "debugbar.assets.css",
          action: "BarryvdhDebugbarControllersAssetController@css",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "_debugbar/assets/javascript",
          name: "debugbar.assets.js",
          action: "BarryvdhDebugbarControllersAssetController@js",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "_debugbar/cache/{key}/{tags?}",
          name: "debugbar.cache.delete",
          action: "BarryvdhDebugbarControllersCacheController@delete",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "/",
          name: "index",
          action: "PhoenixPanelHttpControllersBaseIndexController@getIndex",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "status/{server}",
          name: "index.status",
          action: "PhoenixPanelHttpControllersBaseIndexController@status",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "account",
          name: "account",
          action: "PhoenixPanelHttpControllersBaseAccountController@index",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "account",
          name: null,
          action: "PhoenixPanelHttpControllersBaseAccountController@update",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "account/api",
          name: "account.api",
          action: "PhoenixPanelHttpControllersBaseClientApiController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "account/api/new",
          name: "account.api.new",
          action: "PhoenixPanelHttpControllersBaseClientApiController@create",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "account/api/new",
          name: null,
          action: "PhoenixPanelHttpControllersBaseClientApiController@store",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "account/api/revoke/{identifier}",
          name: "account.api.revoke",
          action: "PhoenixPanelHttpControllersBaseClientApiController@delete",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "account/security",
          name: "account.security",
          action: "PhoenixPanelHttpControllersBaseSecurityController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "account/security/revoke/{id}",
          name: "account.security.revoke",
          action: "PhoenixPanelHttpControllersBaseSecurityController@revoke",
        },
        {
          host: null,
          methods: ["PUT"],
          uri: "account/security/totp",
          name: "account.security.totp",
          action:
            "PhoenixPanelHttpControllersBaseSecurityController@generateTotp",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "account/security/totp",
          name: "account.security.totp.set",
          action: "PhoenixPanelHttpControllersBaseSecurityController@setTotp",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "account/security/totp",
          name: "account.security.totp.disable",
          action:
            "PhoenixPanelHttpControllersBaseSecurityController@disableTotp",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin",
          name: "admin.index",
          action: "PhoenixPanelHttpControllersAdminBaseController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/statistics",
          name: "admin.statistics",
          action: "PhoenixPanelHttpControllersAdminStatisticsController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/api",
          name: "admin.api.index",
          action: "PhoenixPanelHttpControllersAdminApiController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/api/new",
          name: "admin.api.new",
          action: "PhoenixPanelHttpControllersAdminApiController@create",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/api/new",
          name: null,
          action: "PhoenixPanelHttpControllersAdminApiController@store",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "admin/api/revoke/{identifier}",
          name: "admin.api.delete",
          action: "PhoenixPanelHttpControllersAdminApiController@delete",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/locations",
          name: "admin.locations",
          action: "PhoenixPanelHttpControllersAdminLocationController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/locations/view/{location}",
          name: "admin.locations.view",
          action: "PhoenixPanelHttpControllersAdminLocationController@view",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/locations",
          name: null,
          action: "PhoenixPanelHttpControllersAdminLocationController@create",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/locations/view/{location}",
          name: null,
          action: "PhoenixPanelHttpControllersAdminLocationController@update",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/databases",
          name: "admin.databases",
          action: "PhoenixPanelHttpControllersAdminDatabaseController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/databases/view/{host}",
          name: "admin.databases.view",
          action: "PhoenixPanelHttpControllersAdminDatabaseController@view",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/databases",
          name: null,
          action: "PhoenixPanelHttpControllersAdminDatabaseController@create",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/databases/view/{host}",
          name: null,
          action: "PhoenixPanelHttpControllersAdminDatabaseController@update",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "admin/databases/view/{host}",
          name: null,
          action: "PhoenixPanelHttpControllersAdminDatabaseController@delete",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/settings",
          name: "admin.settings",
          action:
            "PhoenixPanelHttpControllersAdminSettingsIndexController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/settings/mail",
          name: "admin.settings.mail",
          action:
            "PhoenixPanelHttpControllersAdminSettingsMailController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/settings/mail/test",
          name: "admin.settings.mail.test",
          action: "PhoenixPanelHttpControllersAdminSettingsMailController@test",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/settings/advanced",
          name: "admin.settings.advanced",
          action:
            "PhoenixPanelHttpControllersAdminSettingsAdvancedController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/settings/adsmanager",
          name: "admin.settings.adsmanager",
          action:
            "PhoenixPanelHttpControllersAdminSettingsAdManagerController@index",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/settings/adsmanager",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminSettingsAdManagerController@update",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/settings",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminSettingsIndexController@update",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/settings/mail",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminSettingsMailController@update",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/settings/advanced",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminSettingsAdvancedController@update",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/users",
          name: "admin.users",
          action: "PhoenixPanelHttpControllersAdminUserController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/users/accounts.json",
          name: "admin.users.json",
          action: "PhoenixPanelHttpControllersAdminUserController@json",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/users/new",
          name: "admin.users.new",
          action: "PhoenixPanelHttpControllersAdminUserController@create",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/users/view/{user}",
          name: "admin.users.view",
          action: "PhoenixPanelHttpControllersAdminUserController@view",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/users/new",
          name: null,
          action: "PhoenixPanelHttpControllersAdminUserController@store",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/users/view/{user}",
          name: null,
          action: "PhoenixPanelHttpControllersAdminUserController@update",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "admin/users/view/{user}",
          name: null,
          action: "PhoenixPanelHttpControllersAdminUserController@delete",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/servers",
          name: "admin.servers",
          action: "PhoenixPanelHttpControllersAdminServersController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/servers/new",
          name: "admin.servers.new",
          action: "PhoenixPanelHttpControllersAdminServersController@create",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/servers/view/{server}",
          name: "admin.servers.view",
          action: "PhoenixPanelHttpControllersAdminServersController@viewIndex",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/servers/view/{server}/details",
          name: "admin.servers.view.details",
          action:
            "PhoenixPanelHttpControllersAdminServersController@viewDetails",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/servers/view/{server}/build",
          name: "admin.servers.view.build",
          action: "PhoenixPanelHttpControllersAdminServersController@viewBuild",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/servers/view/{server}/startup",
          name: "admin.servers.view.startup",
          action:
            "PhoenixPanelHttpControllersAdminServersController@viewStartup",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/servers/view/{server}/database",
          name: "admin.servers.view.database",
          action:
            "PhoenixPanelHttpControllersAdminServersController@viewDatabase",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/servers/view/{server}/manage",
          name: "admin.servers.view.manage",
          action:
            "PhoenixPanelHttpControllersAdminServersController@viewManage",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/servers/view/{server}/delete",
          name: "admin.servers.view.delete",
          action:
            "PhoenixPanelHttpControllersAdminServersController@viewDelete",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/servers/new",
          name: null,
          action: "PhoenixPanelHttpControllersAdminServersController@store",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/servers/view/{server}/build",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminServersController@updateBuild",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/servers/view/{server}/startup",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminServersController@saveStartup",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/servers/view/{server}/database",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminServersController@newDatabase",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/servers/view/{server}/manage/toggle",
          name: "admin.servers.view.manage.toggle",
          action:
            "PhoenixPanelHttpControllersAdminServersController@toggleInstall",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/servers/view/{server}/manage/rebuild",
          name: "admin.servers.view.manage.rebuild",
          action:
            "PhoenixPanelHttpControllersAdminServersController@rebuildContainer",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/servers/view/{server}/manage/suspension",
          name: "admin.servers.view.manage.suspension",
          action:
            "PhoenixPanelHttpControllersAdminServersController@manageSuspension",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/servers/view/{server}/manage/reinstall",
          name: "admin.servers.view.manage.reinstall",
          action:
            "PhoenixPanelHttpControllersAdminServersController@reinstallServer",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/servers/view/{server}/delete",
          name: null,
          action: "PhoenixPanelHttpControllersAdminServersController@delete",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/servers/view/{server}/details",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminServersController@setDetails",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/servers/view/{server}/database",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminServersController@resetDatabasePassword",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "admin/servers/view/{server}/database/{database}/delete",
          name: "admin.servers.view.database.delete",
          action:
            "PhoenixPanelHttpControllersAdminServersController@deleteDatabase",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nodes",
          name: "admin.nodes",
          action: "PhoenixPanelHttpControllersAdminNodesController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nodes/new",
          name: "admin.nodes.new",
          action: "PhoenixPanelHttpControllersAdminNodesController@create",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nodes/view/{node}",
          name: "admin.nodes.view",
          action: "PhoenixPanelHttpControllersAdminNodesController@viewIndex",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nodes/view/{node}/settings",
          name: "admin.nodes.view.settings",
          action:
            "PhoenixPanelHttpControllersAdminNodesController@viewSettings",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nodes/view/{node}/configuration",
          name: "admin.nodes.view.configuration",
          action:
            "PhoenixPanelHttpControllersAdminNodesController@viewConfiguration",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nodes/view/{node}/allocation",
          name: "admin.nodes.view.allocation",
          action:
            "PhoenixPanelHttpControllersAdminNodesController@viewAllocation",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nodes/view/{node}/servers",
          name: "admin.nodes.view.servers",
          action: "PhoenixPanelHttpControllersAdminNodesController@viewServers",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nodes/view/{node}/settings/token",
          name: "admin.nodes.view.configuration.token",
          action: "PhoenixPanelHttpControllersAdminNodesController@setToken",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/nodes/new",
          name: null,
          action: "PhoenixPanelHttpControllersAdminNodesController@store",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/nodes/view/{node}/allocation",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminNodesController@createAllocation",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/nodes/view/{node}/allocation/remove",
          name: "admin.nodes.view.allocation.removeBlock",
          action:
            "PhoenixPanelHttpControllersAdminNodesController@allocationRemoveBlock",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/nodes/view/{node}/allocation/alias",
          name: "admin.nodes.view.allocation.setAlias",
          action:
            "PhoenixPanelHttpControllersAdminNodesController@allocationSetAlias",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/nodes/view/{node}/settings",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminNodesController@updateSettings",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "admin/nodes/view/{node}/delete",
          name: "admin.nodes.view.delete",
          action: "PhoenixPanelHttpControllersAdminNodesController@delete",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "admin/nodes/view/{node}/allocation/remove/{allocation}",
          name: "admin.nodes.view.allocation.removeSingle",
          action:
            "PhoenixPanelHttpControllersAdminNodesController@allocationRemoveSingle",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "admin/nodes/view/{node}/allocations",
          name: "admin.nodes.view.allocation.removeMultiple",
          action:
            "PhoenixPanelHttpControllersAdminNodesController@allocationRemoveMultiple",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nests",
          name: "admin.nests",
          action: "PhoenixPanelHttpControllersAdminNestsNestController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nests/new",
          name: "admin.nests.new",
          action: "PhoenixPanelHttpControllersAdminNestsNestController@create",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nests/view/{nest}",
          name: "admin.nests.view",
          action: "PhoenixPanelHttpControllersAdminNestsNestController@view",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nests/egg/new",
          name: "admin.nests.egg.new",
          action: "PhoenixPanelHttpControllersAdminNestsEggController@create",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nests/egg/{egg}",
          name: "admin.nests.egg.view",
          action: "PhoenixPanelHttpControllersAdminNestsEggController@view",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nests/egg/{egg}/export",
          name: "admin.nests.egg.export",
          action:
            "PhoenixPanelHttpControllersAdminNestsEggShareController@export",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nests/egg/{egg}/variables",
          name: "admin.nests.egg.variables",
          action:
            "PhoenixPanelHttpControllersAdminNestsEggVariableController@view",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/nests/egg/{egg}/scripts",
          name: "admin.nests.egg.scripts",
          action:
            "PhoenixPanelHttpControllersAdminNestsEggScriptController@index",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/nests/new",
          name: null,
          action: "PhoenixPanelHttpControllersAdminNestsNestController@store",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/nests/import",
          name: "admin.nests.egg.import",
          action:
            "PhoenixPanelHttpControllersAdminNestsEggShareController@import",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/nests/egg/new",
          name: null,
          action: "PhoenixPanelHttpControllersAdminNestsEggController@store",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/nests/egg/{egg}/variables",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminNestsEggVariableController@store",
        },
        {
          host: null,
          methods: ["PUT"],
          uri: "admin/nests/egg/{egg}",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminNestsEggShareController@update",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/nests/view/{nest}",
          name: null,
          action: "PhoenixPanelHttpControllersAdminNestsNestController@update",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/nests/egg/{egg}",
          name: null,
          action: "PhoenixPanelHttpControllersAdminNestsEggController@update",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/nests/egg/{egg}/scripts",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminNestsEggScriptController@update",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/nests/egg/{egg}/variables/{variable}",
          name: "admin.nests.egg.variables.edit",
          action:
            "PhoenixPanelHttpControllersAdminNestsEggVariableController@update",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "admin/nests/view/{nest}",
          name: null,
          action: "PhoenixPanelHttpControllersAdminNestsNestController@destroy",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "admin/nests/egg/{egg}",
          name: null,
          action: "PhoenixPanelHttpControllersAdminNestsEggController@destroy",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "admin/nests/egg/{egg}/variables/{variable}",
          name: null,
          action:
            "PhoenixPanelHttpControllersAdminNestsEggVariableController@destroy",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/packs",
          name: "admin.packs",
          action: "PhoenixPanelHttpControllersAdminPackController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/packs/new",
          name: "admin.packs.new",
          action: "PhoenixPanelHttpControllersAdminPackController@create",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/packs/new/template",
          name: "admin.packs.new.template",
          action: "PhoenixPanelHttpControllersAdminPackController@newTemplate",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "admin/packs/view/{pack}",
          name: "admin.packs.view",
          action: "PhoenixPanelHttpControllersAdminPackController@view",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/packs/new",
          name: null,
          action: "PhoenixPanelHttpControllersAdminPackController@store",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "admin/packs/view/{pack}/export/{files?}",
          name: "admin.packs.view.export",
          action: "PhoenixPanelHttpControllersAdminPackController@export",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "admin/packs/view/{pack}",
          name: null,
          action: "PhoenixPanelHttpControllersAdminPackController@update",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "admin/packs/view/{pack}",
          name: null,
          action: "PhoenixPanelHttpControllersAdminPackController@destroy",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "auth/login",
          name: "auth.login",
          action:
            "PhoenixPanelHttpControllersAuthLoginController@showLoginForm",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "auth/login/totp",
          name: "auth.totp",
          action: "PhoenixPanelHttpControllersAuthLoginController@totp",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "auth/password",
          name: "auth.password",
          action:
            "PhoenixPanelHttpControllersAuthForgotPasswordController@showLinkRequestForm",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "auth/password/reset/{token}",
          name: "auth.reset",
          action:
            "PhoenixPanelHttpControllersAuthResetPasswordController@showResetForm",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "auth/login",
          name: null,
          action: "PhoenixPanelHttpControllersAuthLoginController@login",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "auth/login/totp",
          name: null,
          action:
            "PhoenixPanelHttpControllersAuthLoginController@loginUsingTotp",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "auth/password",
          name: null,
          action:
            "PhoenixPanelHttpControllersAuthForgotPasswordController@sendResetLinkEmail",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "auth/password/reset",
          name: "auth.reset.post",
          action:
            "PhoenixPanelHttpControllersAuthResetPasswordController@reset",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "auth/password/reset/{token}",
          name: null,
          action:
            "PhoenixPanelHttpControllersAuthForgotPasswordController@sendResetLinkEmail",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "auth/logout",
          name: "auth.logout",
          action: "PhoenixPanelHttpControllersAuthLoginController@logout",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}",
          name: "server.index",
          action: "PhoenixPanelHttpControllersServerConsoleController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/console",
          name: "server.console",
          action: "PhoenixPanelHttpControllersServerConsoleController@console",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/settings/allocation",
          name: "server.settings.allocation",
          action:
            "PhoenixPanelHttpControllersServerSettingsAllocationController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/settings/name",
          name: "server.settings.name",
          action:
            "PhoenixPanelHttpControllersServerSettingsNameController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/settings/sftp",
          name: "server.settings.sftp",
          action:
            "PhoenixPanelHttpControllersServerSettingsSftpController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/settings/startup",
          name: "server.settings.startup",
          action:
            "PhoenixPanelHttpControllersServerSettingsStartupController@index",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "server/{server}/settings/allocation",
          name: null,
          action:
            "PhoenixPanelHttpControllersServerSettingsAllocationController@update",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "server/{server}/settings/name",
          name: null,
          action:
            "PhoenixPanelHttpControllersServerSettingsNameController@update",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "server/{server}/settings/startup",
          name: null,
          action:
            "PhoenixPanelHttpControllersServerSettingsStartupController@update",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/databases",
          name: "server.databases.index",
          action: "PhoenixPanelHttpControllersServerDatabaseController@index",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "server/{server}/databases/new",
          name: "server.databases.new",
          action: "PhoenixPanelHttpControllersServerDatabaseController@store",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "server/{server}/databases/password",
          name: "server.databases.password",
          action: "PhoenixPanelHttpControllersServerDatabaseController@update",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "server/{server}/databases/delete/{database}",
          name: "server.databases.delete",
          action: "PhoenixPanelHttpControllersServerDatabaseController@delete",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/files",
          name: "server.files.index",
          action:
            "PhoenixPanelHttpControllersServerFilesFileActionsController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/files/add",
          name: "server.files.add",
          action:
            "PhoenixPanelHttpControllersServerFilesFileActionsController@create",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/files/edit/{file}",
          name: "server.files.edit",
          action:
            "PhoenixPanelHttpControllersServerFilesFileActionsController@view",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/files/download/{file}",
          name: "server.files.edit",
          action:
            "PhoenixPanelHttpControllersServerFilesDownloadController@index",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "server/{server}/files/directory-list",
          name: "server.files.directory-list",
          action:
            "PhoenixPanelHttpControllersServerFilesRemoteRequestController@directory",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "server/{server}/files/save",
          name: "server.files.save",
          action:
            "PhoenixPanelHttpControllersServerFilesRemoteRequestController@store",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/users",
          name: "server.subusers",
          action: "PhoenixPanelHttpControllersServerSubuserController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/users/new",
          name: "server.subusers.new",
          action: "PhoenixPanelHttpControllersServerSubuserController@create",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "server/{server}/users/new",
          name: null,
          action: "PhoenixPanelHttpControllersServerSubuserController@store",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/users/view/{subuser}",
          name: "server.subusers.view",
          action: "PhoenixPanelHttpControllersServerSubuserController@view",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "server/{server}/users/view/{subuser}",
          name: null,
          action: "PhoenixPanelHttpControllersServerSubuserController@update",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "server/{server}/users/view/{subuser}",
          name: null,
          action: "PhoenixPanelHttpControllersServerSubuserController@delete",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/schedules",
          name: "server.schedules",
          action:
            "PhoenixPanelHttpControllersServerTasksTaskManagementController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/schedules/new",
          name: "server.schedules.new",
          action:
            "PhoenixPanelHttpControllersServerTasksTaskManagementController@create",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "server/{server}/schedules/new",
          name: null,
          action:
            "PhoenixPanelHttpControllersServerTasksTaskManagementController@store",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "server/{server}/schedules/view/{schedule}",
          name: "server.schedules.view",
          action:
            "PhoenixPanelHttpControllersServerTasksTaskManagementController@view",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "server/{server}/schedules/view/{schedule}",
          name: null,
          action:
            "PhoenixPanelHttpControllersServerTasksTaskManagementController@update",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "server/{server}/schedules/view/{schedule}/toggle",
          name: "server.schedules.toggle",
          action:
            "PhoenixPanelHttpControllersServerTasksActionController@toggle",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "server/{server}/schedules/view/{schedule}/trigger",
          name: "server.schedules.trigger",
          action:
            "PhoenixPanelHttpControllersServerTasksActionController@trigger",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "server/{server}/schedules/view/{schedule}",
          name: null,
          action:
            "PhoenixPanelHttpControllersServerTasksTaskManagementController@delete",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/users",
          name: "api.application.users",
          action:
            "PhoenixPanelHttpControllersApiApplicationUsersUserController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/users/{user}",
          name: "api.application.users.view",
          action:
            "PhoenixPanelHttpControllersApiApplicationUsersUserController@view",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/users/external/{external_id}",
          name: "api.application.users.external",
          action:
            "PhoenixPanelHttpControllersApiApplicationUsersExternalUserController@index",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/application/users",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationUsersUserController@store",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "api/application/users/{user}",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationUsersUserController@update",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "api/application/users/{user}",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationUsersUserController@delete",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/nodes",
          name: "api.application.nodes",
          action:
            "PhoenixPanelHttpControllersApiApplicationNodesNodeController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/nodes/{node}",
          name: "api.application.nodes.view",
          action:
            "PhoenixPanelHttpControllersApiApplicationNodesNodeController@view",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/application/nodes",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationNodesNodeController@store",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "api/application/nodes/{node}",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationNodesNodeController@update",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "api/application/nodes/{node}",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationNodesNodeController@delete",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/nodes/{node}/allocations",
          name: "api.application.allocations",
          action:
            "PhoenixPanelHttpControllersApiApplicationNodesAllocationController@index",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/application/nodes/{node}/allocations",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationNodesAllocationController@store",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "api/application/nodes/{node}/allocations/{allocation}",
          name: "api.application.allocations.view",
          action:
            "PhoenixPanelHttpControllersApiApplicationNodesAllocationController@delete",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/locations",
          name: "api.applications.locations",
          action:
            "PhoenixPanelHttpControllersApiApplicationLocationsLocationController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/locations/{location}",
          name: "api.application.locations.view",
          action:
            "PhoenixPanelHttpControllersApiApplicationLocationsLocationController@view",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/application/locations",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationLocationsLocationController@store",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "api/application/locations/{location}",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationLocationsLocationController@update",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "api/application/locations/{location}",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationLocationsLocationController@delete",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/servers",
          name: "api.application.servers",
          action:
            "PhoenixPanelHttpControllersApiApplicationServersServerController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/servers/{server}",
          name: "api.application.servers.view",
          action:
            "PhoenixPanelHttpControllersApiApplicationServersServerController@view",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/servers/external/{external_id}",
          name: "api.application.servers.external",
          action:
            "PhoenixPanelHttpControllersApiApplicationServersExternalServerController@index",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "api/application/servers/{server}/details",
          name: "api.application.servers.details",
          action:
            "PhoenixPanelHttpControllersApiApplicationServersServerDetailsController@details",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "api/application/servers/{server}/build",
          name: "api.application.servers.build",
          action:
            "PhoenixPanelHttpControllersApiApplicationServersServerDetailsController@build",
        },
        {
          host: null,
          methods: ["PATCH"],
          uri: "api/application/servers/{server}/startup",
          name: "api.application.servers.startup",
          action:
            "PhoenixPanelHttpControllersApiApplicationServersStartupController@index",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/application/servers",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationServersServerController@store",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/application/servers/{server}/suspend",
          name: "api.application.servers.suspend",
          action:
            "PhoenixPanelHttpControllersApiApplicationServersServerManagementController@suspend",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/application/servers/{server}/unsuspend",
          name: "api.application.servers.unsuspend",
          action:
            "PhoenixPanelHttpControllersApiApplicationServersServerManagementController@unsuspend",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/application/servers/{server}/reinstall",
          name: "api.application.servers.reinstall",
          action:
            "PhoenixPanelHttpControllersApiApplicationServersServerManagementController@reinstall",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/application/servers/{server}/rebuild",
          name: "api.application.servers.rebuild",
          action:
            "PhoenixPanelHttpControllersApiApplicationServersServerManagementController@rebuild",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "api/application/servers/{server}",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationServersServerController@delete",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "api/application/servers/{server}/{force?}",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationServersServerController@delete",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/servers/{server}/databases",
          name: "api.application.servers.databases",
          action:
            "PhoenixPanelHttpControllersApiApplicationServersDatabaseController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/servers/{server}/databases/{database}",
          name: "api.application.servers.databases.view",
          action:
            "PhoenixPanelHttpControllersApiApplicationServersDatabaseController@view",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/application/servers/{server}/databases",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationServersDatabaseController@store",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/application/servers/{server}/databases/{database}/reset-password",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationServersDatabaseController@resetPassword",
        },
        {
          host: null,
          methods: ["DELETE"],
          uri: "api/application/servers/{server}/databases/{database}",
          name: null,
          action:
            "PhoenixPanelHttpControllersApiApplicationServersDatabaseController@delete",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/nests",
          name: "api.application.nests",
          action:
            "PhoenixPanelHttpControllersApiApplicationNestsNestController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/nests/{nest}",
          name: "api.application.nests.view",
          action:
            "PhoenixPanelHttpControllersApiApplicationNestsNestController@view",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/nests/{nest}/eggs",
          name: "api.application.nests.eggs",
          action:
            "PhoenixPanelHttpControllersApiApplicationNestsEggController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/application/nests/{nest}/eggs/{egg}",
          name: "api.application.nests.eggs.view",
          action:
            "PhoenixPanelHttpControllersApiApplicationNestsEggController@view",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/client",
          name: "api.client.index",
          action: "PhoenixPanelHttpControllersApiClientClientController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/client/servers/{server}",
          name: "api.client.servers.view",
          action:
            "PhoenixPanelHttpControllersApiClientServersServerController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/client/servers/{server}/utilization",
          name: "api.client.servers.resources",
          action:
            "PhoenixPanelHttpControllersApiClientServersResourceUtilizationController@index",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/client/servers/{server}/command",
          name: "api.client.servers.command",
          action:
            "PhoenixPanelHttpControllersApiClientServersCommandController@index",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/client/servers/{server}/power",
          name: "api.client.servers.power",
          action:
            "PhoenixPanelHttpControllersApiClientServersPowerController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/remote/authenticate/{token}",
          name: "api.remote.authenticate",
          action:
            "PhoenixPanelHttpControllersApiRemoteValidateKeyController@index",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/remote/download-file",
          name: "api.remote.download_file",
          action:
            "PhoenixPanelHttpControllersApiRemoteFileDownloadController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/remote/eggs",
          name: "api.remote.eggs",
          action:
            "PhoenixPanelHttpControllersApiRemoteEggRetrievalController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/remote/eggs/{uuid}",
          name: "api.remote.eggs.download",
          action:
            "PhoenixPanelHttpControllersApiRemoteEggRetrievalController@download",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "api/remote/scripts/{uuid}",
          name: "api.remote.scripts",
          action:
            "PhoenixPanelHttpControllersApiRemoteEggInstallController@index",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "api/remote/sftp",
          name: "api.remote.sftp",
          action: "PhoenixPanelHttpControllersApiRemoteSftpController@index",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "daemon/packs/pull/{uuid}",
          name: "daemon.pack.pull",
          action: "PhoenixPanelHttpControllersDaemonPackController@pull",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "daemon/packs/pull/{uuid}/hash",
          name: "daemon.pack.hash",
          action: "PhoenixPanelHttpControllersDaemonPackController@hash",
        },
        {
          host: null,
          methods: ["GET", "HEAD"],
          uri: "daemon/configure/{token}",
          name: "daemon.configuration",
          action:
            "PhoenixPanelHttpControllersDaemonActionController@configuration",
        },
        {
          host: null,
          methods: ["POST"],
          uri: "daemon/install",
          name: "daemon.install",
          action:
            "PhoenixPanelHttpControllersDaemonActionController@markInstall",
        },
      ],
      prefix: "",

      route: function (name, parameters, route) {
        route = route || this.getByName(name);

        if (!route) {
          return undefined;
        }

        return this.toRoute(route, parameters);
      },

      url: function (url, parameters) {
        parameters = parameters || [];

        var uri = url + "/" + parameters.join("/");

        return this.getCorrectUrl(uri);
      },

      toRoute: function (route, parameters) {
        var uri = this.replaceNamedParameters(route.uri, parameters);
        var qs = this.getRouteQueryString(parameters);

        if (this.absolute && this.isOtherHost(route)) {
          return "//" + route.host + "/" + uri + qs;
        }

        return this.getCorrectUrl(uri + qs);
      },

      isOtherHost: function (route) {
        return route.host && route.host != window.location.hostname;
      },

      replaceNamedParameters: function (uri, parameters) {
        uri = uri.replace(/\{(.*?)\??\}/g, function (match, key) {
          if (parameters.hasOwnProperty(key)) {
            var value = parameters[key];
            delete parameters[key];
            return value;
          } else {
            return match;
          }
        });

        // Strip out any optional parameters that were not given
        uri = uri.replace(/\/\{.*?\?\}/g, "");

        return uri;
      },

      getRouteQueryString: function (parameters) {
        var qs = [];
        for (var key in parameters) {
          if (parameters.hasOwnProperty(key)) {
            qs.push(key + "=" + parameters[key]);
          }
        }

        if (qs.length < 1) {
          return "";
        }

        return "?" + qs.join("&");
      },

      getByName: function (name) {
        for (var key in this.routes) {
          if (
            this.routes.hasOwnProperty(key) &&
            this.routes[key].name === name
          ) {
            return this.routes[key];
          }
        }
      },

      getByAction: function (action) {
        for (var key in this.routes) {
          if (
            this.routes.hasOwnProperty(key) &&
            this.routes[key].action === action
          ) {
            return this.routes[key];
          }
        }
      },

      getCorrectUrl: function (uri) {
        var url = this.prefix + "/" + uri.replace(/^\/?/, "");

        if (!this.absolute) {
          return url;
        }

        return this.rootUrl.replace("//?$/", "") + url;
      },
    };

    var getLinkAttributes = function (attributes) {
      if (!attributes) {
        return "";
      }

      var attrs = [];
      for (var key in attributes) {
        if (attributes.hasOwnProperty(key)) {
          attrs.push(key + '="' + attributes[key] + '"');
        }
      }

      return attrs.join(" ");
    };

    var getHtmlLink = function (url, title, attributes) {
      title = title || url;
      attributes = getLinkAttributes(attributes);

      return '<a href="' + url + '" ' + attributes + ">" + title + "</a>";
    };

    return {
      // Generate a url for a given controller action.
      // Router.action('HomeController@getIndex', [params = {}])
      action: function (name, parameters) {
        parameters = parameters || {};

        return routes.route(name, parameters, routes.getByAction(name));
      },

      // Generate a url for a given named route.
      // Router.route('routeName', [params = {}])
      route: function (route, parameters) {
        parameters = parameters || {};

        return routes.route(route, parameters);
      },

      // Generate a fully qualified URL to the given path.
      // Router.route('url', [params = {}])
      url: function (route, parameters) {
        parameters = parameters || {};

        return routes.url(route, parameters);
      },

      // Generate a html link to the given url.
      // Router.link_to('foo/bar', [title = url], [attributes = {}])
      link_to: function (url, title, attributes) {
        url = this.url(url);

        return getHtmlLink(url, title, attributes);
      },

      // Generate a html link to the given route.
      // Router.link_to_route('route.name', [title=url], [parameters = {}], [attributes = {}])
      link_to_route: function (route, title, parameters, attributes) {
        var url = this.route(route, parameters);

        return getHtmlLink(url, title, attributes);
      },

      // Generate a html link to the given controller action.
      // Router.link_to_action('HomeController@getIndex', [title=url], [parameters = {}], [attributes = {}])
      link_to_action: function (action, title, parameters, attributes) {
        var url = this.action(action, parameters);

        return getHtmlLink(url, title, attributes);
      },
    };
  }.call(this);

  /**
   * Expose the class either via AMD, CommonJS or the global object
   */
  if (typeof define === "function" && define.amd) {
    define(function () {
      return laroute;
    });
  } else if (typeof module === "object" && module.exports) {
    module.exports = laroute;
  } else {
    window.Router = laroute;
  }
}.call(this));
