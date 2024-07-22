
import { createReducer, on } from '@ngrx/store';
import * as ConversationActions from '../+state/chat.actions';
import { Conversation } from '../../models/conversation';
export const CHAT_FEATURE_KEY= 'chat'

export interface ChatState {
  conversations: Conversation[];
  selectedConversationId: string | null;
}

export const initialState: ChatState = {
  conversations: [],
  selectedConversationId: null,
};

export const conversationReducer = createReducer(
  initialState,
  on(ConversationActions.loadConversationsSuccess, (state, { conversations }) => ({
    ...state,
    conversations,
  })),
  on(ConversationActions.selectConversation, (state, { conversationId }) => ({
    ...state,
    selectedConversationId: conversationId,
  })),
  on(ConversationActions.loadMessagesSuccess, (state, { conversationId, messages }) => ({
    ...state,
    conversations: state.conversations.map(conversation =>
      conversation.id === conversationId ? { ...conversation, messages } : conversation
    ),
  })),
  on(ConversationActions.newMessage, (state, { conversationId, message }) => ({
    ...state,
    conversations: state.conversations.map(conversation =>
      conversation.id === conversationId ? {
        ...conversation,
        lastMessage: message.body,
        messages: [...conversation.messages, message]
      } : conversation
    ),
  }))
);
