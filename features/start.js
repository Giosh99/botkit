const { BotkitConversation } = require("botkit");

module.exports = function(controller) {
    const start = new BotkitConversation('start', controller);
    start.addQuestion({
    text: 'Benvenuto, di quale argomento desideri informazioni?',
    type: 'question',
    quick_replies: [
        {
        content_type: 'text',
        title: 'Move',
        payload: 'move'
    },
    {
        content_type: 'text',
        title: 'Health',
        payload: 'health'
    },
    {
        content_type: 'text',
        title: 'Food',
        payload: 'food'
    }
    ],
},
    [
        {
            pattern: 'move',
            type: 'string',
            handler:  async(response_text, controller, bot) => {
                controller.gotoThread('move');
            }
        },
        {
            pattern: 'health',
            type: 'string',
            handler: async(response_text, controller, bot) => {
                try {return await bot.say('Opzione ancora da implementare!');}
                catch(error) {console.error(error);}
            }
        },
        {
            pattern: 'food',
            type: 'string',
            handler: async(response_text, controller, bot) => {
                try {return await bot.say('Opzione ancora da implementare!');}
                catch(error) {console.error(error);}
            }
        }
    ]
   ,{key: 'choice'},'start');


   controller.addDialog(start);

controller.hears('start','message,direct_message', async(bot, message) => {
    await bot.beginDialog('start');
});
}