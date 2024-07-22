import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { io } from 'socket.io-client';
import { Message } from '../../models/message';
import * as chatActions from '../+state/chat.actions';
import { Conversation } from '../../models/conversation';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {
  private socket;
  private apiUrl = 'http://localhost:3000';
  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient, private store: Store) {
    this.socket = io(this.apiUrl);

    this.socket.on('newMessage', (data: { conversationId: string, message: Message }) => {
      this.store.dispatch(chatActions.newMessage(data));
    });
  }

  loadConversations() {
    this.http.get<Conversation[]>(`${this.apiUrl}/conversations`)
      .pipe(takeUntil(this.destroy$))
      .subscribe(conversations => {
        this.store.dispatch(chatActions.loadConversationsSuccess({ conversations }));
      });
  }

  loadMessages(conversationId: string) {
    this.http.get<Message[]>(`${this.apiUrl}/conversations/${conversationId}/messages`)
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        this.store.dispatch(chatActions.loadMessagesSuccess({ conversationId, messages }));
      });
  }

  sendMessage(conversationId: string, message: string) {
    this.http.post<Message>(`${this.apiUrl}/conversations/${conversationId}/messages`, { body: message })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.socket.disconnect();
  }
}
