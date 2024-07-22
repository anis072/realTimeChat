import { createAction, props } from '@ngrx/store';
import { Conversation } from '../../models/conversation';
import { Message } from '../../models/message';

export const loadConversations = createAction('[Conversation] Load Conversations');
export const loadConversationsSuccess = createAction(
  '[Conversation] Load Conversations Success',
  props<{ conversations: Conversation[] }>()
);

export const selectConversation = createAction(
  '[Conversation] Select Conversation',
  props<{ conversationId: string }>()
);

export const loadMessages = createAction(
  '[Conversation] Load Messages',
  props<{ conversationId: string }>()
);

export const loadMessagesSuccess = createAction(
  '[Conversation] Load Messages Success',
  props<{ conversationId: string, messages: Message[] }>()
);

export const sendMessage = createAction(
  '[Conversation] Send Message',
  props<{ conversationId: string, message: string }>()
);

export const newMessage = createAction(
  '[Conversation] New Message',
  props<{ conversationId: string, message: Message }>()
);
