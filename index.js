/**
 *
 * Reldens - NPM Test
 *
 * ServerPlugin initialization and events.
 * This is a test example file on how the server can be initialized.
 *
 */

// required the module:
const { ServerManager } = require('reldens/server');

// custom plugin (if you like to implement customizations do it there):
const { ServerPlugin } = require('./theme/plugins/server-plugin');
// you can find an example of the server file in node_modules/reldens/theme/packages/server-plugin.js
// create a server instance passing the current root:
let appServer = new ServerManager({
    projectRoot: __dirname, // we need to pass the server root
    projectThemeName: 'custom-game-theme-test', // if the project theme is not specified then "default" will be used
    jsSourceMaps: '1' === process.env.RELDENS_JS_SOURCEMAPS, // enable JS source maps to debug the client on your IDE
    cssSourceMaps: '1' === process.env.RELDENS_CSS_SOURCEMAPS,
    customPlugin: ServerPlugin
});

console.log('TEST - All these are TEST logs that you can remove from your index file.');

// events debug:
// appServer.events.debug = 'all'; // or any string containing multiple events keys.
// setup as you need:
appServer.events.on('reldens.serverConfigFeaturesReady', (props) => {
    console.log('TEST - Events test reldens.serverConfigFeaturesReady success!');
});

// blocked admin actions test (remove to enable the admin actions):
if('1' === process.env.RELDENS_BLOCKED_ADMIN){
    appServer.events.on('reldens.afterCreateAdminManager', (event) => {
        console.log('DEMO - Hardcoded event to disable CRUD Administration Panel.');
        let blackList = [];
        for(let driverResource of event.serverManager.serverAdmin.resources){
            let entityRoute = '/'+driverResource.entityPath;
            blackList.push(entityRoute + event.serverManager.serverAdmin.savePath);
            blackList.push(entityRoute + event.serverManager.serverAdmin.deletePath);
        }
        event.serverManager.serverAdmin.blackList['1'] = blackList; // block registered users
        event.serverManager.serverAdmin.blackList['2'] = blackList; // block guest users
        event.serverManager.serverAdmin.blackList['99'] = blackList; // block admin users
    });
    // custom users authentication test:
    appServer.events.on('reldens.roomLoginOnAuth', (props) => {
        // deny login for users the incorrect role:
        if(4 === props.loginResult.user.role_id){
            props.result.confirm = false;
        }
    });
}

// run the server!
console.log('TEST - ServerPlugin starting...');
appServer.createServers().then(() => {
    console.log('TEST - CREATED APP SERVER INSTANCE!');
    appServer.start().then(() => {
        console.log('TEST - SERVER UP AND RUNNING!');
    }).catch((err) => {
        console.log('TEST - ServerPlugin error:', err);
        process.exit();
    });
});
