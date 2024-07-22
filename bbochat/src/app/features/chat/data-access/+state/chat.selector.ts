import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CHAT_FEATURE_KEY, ChatState } from '../+state/chat.reducer';

export const selectConversationState = createFeatureSelector<ChatState>(CHAT_FEATURE_KEY);

export const selectAllConversations = createSelector(
  selectConversationState,
  state => state.conversations
);

export const selectSelectedConversationId = createSelector(
  selectConversationState,
  state => state.selectedConversationId
);

export const selectSelectedConversation = createSelector(
  selectAllConversations,
  selectSelectedConversationId,
  (conversations, conversationId) => conversations.find(c => c.id === conversationId)
);
