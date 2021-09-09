/* esempio */
const { BotkitConversation } = require("botkit");
module.exports = function (controller) {

    start = new BotkitConversation('start', controller);

    start.addAction('start');
    // start.setVar('question', 'Benvenuto, di quale argomento desideri informazioni?');
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
                handler: async (response_text, controller, bot) => {
                    //controller.setVar('Argomento', 'move');
                    controller.gotoThread('move');
                }
            },
            {
                pattern: 'health',
                type: 'string',
                handler: async (response_text, controller, bot) => {
                    try { return await bot.say('Opzione ancora da implementare!'); }
                    catch (error) { console.error(error); }
                }
            },
            {
                pattern: 'food',
                type: 'string',
                handler: async (response_text, controller, bot) => {
                    try { return await bot.say('Opzione ancora da implementare!'); }
                    catch (error) { console.error(error); }
                }
            },
            // pattern triggerato quando viene mandata una richiesta di chiusura conversazione anticipara rispetto al flow normale
            {
                pattern: 'finish',
                type: 'string',
                handles: async (response_text, controller, bot) => {
                    controller.addAction('complete');
                }
            }
        ]
        , { key: 'argument_choice' }, 'start');
    // thread move 
    start.addAction('move');
    start.addQuestion({
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
                payload: 'upload_video'
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
                handler: async (response_text, controller, bot) => {
                    controller.setVar('Argomento', 'move');
                    controller.gotoThread('watch_video');
                }
            },
            {
                pattern: 'talk_to_coach',
                type: 'string',
                handler: async (response_text, controller, bot) => {
                    controller.gotoThread('upload_text');
                }
            },
            {
                pattern: 'upload_video',
                type: 'string',
                handler: async (response_text, controller, bot) => {
                    controller.gotoThread('upload_video');
                }
            }
            ,
            // pattern triggerato quando viene mandata una richiesta di chiusura conversazione anticipara rispetto al flow normale
            {
                pattern: 'finish',
                type: 'string',
                handles: async (response_text, controller, bot) => {
                    controller.addAction('complete');
                }
            }
        ]
        , { key: 'action_choice' }, 'move', 'watch_video');
    //thread watch_video
    start.addAction('watch_video');
    start.addQuestion({
        text: 'Aspe, prima che guardi a caso, preferisci qualcosa in particolare?',
        type: 'question',
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
    }, [
        {
            pattern: 'squat_video',
            type: 'string',
            handler: async (response_text, controller, bot) => {
                await bot.say({
                    text: 'Hai scelto squat! Dammi un secondo e arrivo con il tuo video!',
                    type: 'choice',
                });
                await bot.say({
                    text: "Funzia",
                    type: 'choice'
                });
            }
        },
        {
            pattern: 'addominali_panca_video',
            type: 'string',
            handler: async (response_text, controller, bot) => {
                await bot.say({
                    text: 'Hai scelto addominali! Dammi un sec e arrivo!',
                    type: 'choice',
                });
            }
        },
        {
            pattern: 'trazioni_video',
            type: 'string',
            handler: async (response_text, controller, bot) => {
                await bot.say({
                    text: 'Hai scelto trazioni! Dammi un sec e arrivo!',
                    type: 'choice',
                });
            }
        }
        ,
        // pattern triggerato quando viene mandata una richiesta di chiusura conversazione anticipara rispetto al flow normale
            {
                pattern: 'finish',
                type: 'string',
                handles: async (response_text, controller, bot) => {
                    controller.addAction('complete');
                }
            }
    ], { key: 'request_video_choice' }, 'watch_video');
    // thread text_message
    start.addAction('upload_text');
    start.addQuestion({
        text: 'Invia un messaggio al tuo coach!',
        type: 'keyboard_activation'
    },
        async (response, convo, bot, full_message) => {
            // controllo che il messaggio arrivato sia di tipo testo
            if (full_message.content_type == 'text')
                await bot.say({
                    text: 'Messaggio ricevuto! Il tuo coach ti risponderà a breve',
                    type: 'fulfillment'
                }
                );
                // controllo che il messaggio arrivato sia un messaggio di chiusura conversazione
            else if(full_message.content_type == 'finish') {
                convo.addAction('complete');
            }
            // se non è nessuno dei precedenti allora richiedo l'invio del messaggio
            else {
                await bot.say({
                    text: 'Il messaggio ricevuto non è del tipo aspettato, riprova!',
                    type: 'keyboard_activation'
                });
                convo.gotoThread('upload_text');
            }
        }, { key: 'upload_text' }, 'upload_text'
    );
    start.addAction('complete');
    // thread upload_video
    start.addAction("upload_video");
    start.addQuestion({
        text: 'Invia un video!',
        type: 'media_activation'
    },
        async (response, convo, bot, full_message) => {
            if (full_message.content_type == 'video') {
                await bot.say(
                    {
                        text: 'Video ricevuto! Il tuo coach ti risponderà al più presto',
                        type: 'fulfillment'
                    }
                );
            }
            // controllo che il messaggio arrivato sia un messaggio di chiusura conversazione
            else if(full_message.content_type == 'finish') {
                convo.addAction('complete');
            }
            else {
                await bot.say({
                    text: 'Errore, il messaggio ricevuto non è di tipo video! Riprovare!',
                    type: 'media_activation'
                });
                convo.gotoThread('upload_video');
            }
        }, { key: 'upload_video' }, 'upload_video'
    );
    // prima che si concluda il thread e si arrivi alla foglia inviamo un messaggio
    // in modo da segnalare la chiusura del percorso, e l'inizio di uno nuovo
    start.before('complete', async (convo, bot) => {
        return await bot.say({
            text: 'Closing..',
            type: 'fulfillment'
        });
    });
    start.addAction('complete');
    controller.addDialog(start);

    controller.hears('start', 'message,direct_message', async (bot, message) => {
        console.log("triggerato thread start");
        await bot.beginDialog('start');
    });

}