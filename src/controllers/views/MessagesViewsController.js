/* eslint-disable class-methods-use-this */
import { env } from '../../configs/index.js';
import services from '../../services/index.js';

export default class MessagesViewsController {
  async renderChatView(req, res, next) {
    const messages = await services.messages.getMessages();
    const context = {
      messages: messages.map((m) => m.toObject()),
      title: 'Chat',
      stylesheet: '/css/index.css',
      env: {
        API_URL: env.API_URL,
        PORT: env.PORT,
      },
    };

    res.render('chat', context);
  }
}
