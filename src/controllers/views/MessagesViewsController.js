import { env } from '../../configs/index.js';
import repository from '../../services/repository.js';

export default class MessagesViewsController {
  renderChatView = async (req, res, next) => {
    const messages = await repository.messages.getMessages();
    const context = {
      messages: messages.map((m) => m.toObject()),
      title: 'Chat',
      stylesheet: '/css/index.css',
    };

    res.render('chat', context);
  };
}
