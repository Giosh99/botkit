/* esempio */
const { BotkitConversation } = require("botkit");

module.exports = function(controller) {
    const move = new BotkitConversation('move', controller);
    console.log("creazione thread move in corso..");
    //move.addAction('move');
  //  move.addMessage('Benvenuto nella sessione MOVE {{vars.name}}','move');
  move.addAction('move');
  move.addQuestion({
      text: 'Cosa desideri fare?',
      type: 'question',
      quick_replies: [
          {
          content_type: 'text',
          title: 'Mostrami il video di un esercizio',
          payload: 'show_video'
      },
      {
          content_type: 'text',
          title: 'Voglio inviare il video di un esercizio',
          payload: 'send_video'
      },
      {
          content_type: 'text',
          title: 'Voglio parlare con il mio coach',
          payload: 'talk_to_coach'
      }
      ],
  },
      [
          {
              pattern: 'show_video',
              type: 'string',
              handler:  async(response_text, controller, bot) => {
                  controller.gotoThread('video');
              }
          },
          {
              pattern: 'talk_to_coach',
              type: 'string',
              handler: async(response_text, controller, bot) => {
                  try {return await bot.say('Hai scelto l\'opzione coach');}
                  catch(error) {console.error(error);}
              }
          }
      ]
     , {key: 'choice'}, 'move', 'video');
     
    move.addAction('video');
    move.addQuestion({
        text:'Aspe, prima che guardi a caso, preferisci qualcosa in particolare?',
        type:'question',
        quick_replies: [
            {
                content_type: 'text',
                title: 'Video di squat',
                payload: 'squat_video'
            },
            {
                content_type: 'text',
                title: 'Video di addominali su panca piana',
                payload: 'addominali_panca_video'
            },
            {
                content_type: 'text',
                title: 'Video di trazioni sopra un albero',
                payload: 'trazioni_video'
            },
        ]
    },[
        {
            pattern: 'squat_video',
            type:'string',
            handler: async(response_text, controller, bot) => {
                bot.say({
                    text: 'Hai scelto squat! Dammi un secondo e arrivo con il tuo video!',
                    type: 'choice',
                });
            }
        },
        {
            pattern: 'addominali_panca_video',
            type:'string',
            handler: async(response_text, controller, bot) => {
                bot.say({
                    text: 'Hai scelto addominali! Dammi un sec e arrivo!',
                    type: 'choice',
                });
            }
        },
        {
            pattern: 'trazioni_video',
            type:'string',
            handler: async(response_text, controller, bot) => {
                bot.say({
                    text: 'Hai scelto trazioni! Dammi un sec e arrivo!',
                    type: 'choice',
                });
            }
        }
    ], {key: 'sec_choice'}, 'video');

    controller.addDialog(move);

    move.before('move', async(controller, bot) => {
        // set a variable here that can be used in the message template
        controller.setVar('name','Giosuè');
       });

    controller.hears('move','message,direct_message', async(bot, message) => {
        console.log("triggerato move");
        await bot.beginDialog('move');
    });
}