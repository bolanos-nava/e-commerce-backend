import BaseViewsController from './BaseViewsController.js';

/**
 * @typedef {import('../../types').MongoDaosType['messages']} MessagesDao
 */
export default class MessagesViewsController extends BaseViewsController {
  /** @type MessagesDao */
  #messagesService;

  /**
   * Constructs a new controller for messages view
   *
   * @param {MessagesDao} messagesService
   */
  constructor(messagesService) {
    super();
    this.#messagesService = messagesService;
  }

  renderChatView = async (req, res, next) => {
    const messages = await this.#messagesService.getMessages();
    const context = {
      messages: messages.map((m) => m.toObject()),
      title: 'Chat',
      stylesheet: '/css/index.css',
    };

    res.render('chat', context);
  };
}
