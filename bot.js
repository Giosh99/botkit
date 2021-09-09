        //  __   __  ___        ___
        // |__) /  \  |  |__/ |  |  
// |__) \__/  |  |  \ |  |  

// This is the main file for the prova bot.

// Import Botkit's core features
const { Botkit } = require('botkit');
const { BotkitCMSHelper } = require('botkit-plugin-cms');
const { WebAdapter } = require('botbuilder-adapter-web');
// Import a platform-specific adapter for web.
const { MongoDbStorage } = require('botbuilder-storage-mongodb');

// Load process.env values from .env file
require('dotenv').config();

let storage = null;
if (process.env.MONGO_URI) {
    storage = mongoStorage = new MongoDbStorage({
        url : process.env.MONGO_URI,
    });
}


const adapter = new WebAdapter({});


const controller = new Botkit({
    webhook_uri: '',

    adapter: adapter,

    storage
});

if (process.env.CMS_URI) {
    controller.usePlugin(new BotkitCMSHelper({
        uri: process.env.CMS_URI,
        token: process.env.CMS_TOKEN,
    }));
}

controller.ready(() => {

    // load traditional developer-created local custom feature modules
    controller.loadModules(__dirname + '/features');

    /* catch-all that uses the CMS to trigger dialogs */
    if (controller.plugins.cms) {
        controller.on('message,direct_message', async (bot, message) => {
            let results = false;
            results = await controller.plugins.cms.testTrigger(bot, message);
            if (results !== false) {
                // do not continue middleware!
                return false;
            }
        });
        controller.on('end', function(convo) {
            let res = convo.extractResponses();
            console.log(res);
        });
        controller.on('receive_error', function(err, bot, message, pipeline_stage) {
            bot.reply(message, `There was an error processing your request. Please try again later. Error: ${err.toString()}`);
        });
    }

});






