import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as chatActions from './chat.actions';
import * as fromChat from './chat.selector';
import { tap } from 'rxjs';
import { ChatService } from '../repositories/chat.service';

@Injectable({ providedIn: 'root' })
export class ChatFacade {
  readonly allConversations = this.store.selectSignal(
    fromChat.selectAllConversations
  );
  readonly conversation = this.store.selectSignal(
    fromChat.selectSelectedConversation
  );

  constructor(private store: Store, private chatService: ChatService) {}
  selectConversation(conversationId: string) {
    this.store.dispatch(chatActions.selectConversation({ conversationId }));
  }
}
