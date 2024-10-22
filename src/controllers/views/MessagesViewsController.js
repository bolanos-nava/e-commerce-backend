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

  async renderChatView(_, res, __) {
    const messages = await this.#messagesService.getAll({ lean: true });
    const context = {
      messages,
      title: 'Chat',
      stylesheet: '/static/css/index.css',
    };

    res.render('chat', context);
  }
}
