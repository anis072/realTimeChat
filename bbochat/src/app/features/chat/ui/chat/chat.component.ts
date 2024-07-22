import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as chatActions from '../../data-access/+state/chat.actions';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../data-access/repositories/chat.service';
import { Conversation } from '../../models/conversation';
import { ChatFacade } from '../../data-access/+state/chat.facade';
import { AuthService } from '../../../auth/data-access/repositories/auth.service';
import { Message } from '../../models/message';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';
import { AuthFacade } from '../../../auth/data-access/+state/auth.facade';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,TimeAgoPipe],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  conversations = signal<Conversation[]>([]);
  selectedConversation = signal<Conversation | undefined>(undefined);
  chatForm: FormGroup;
  currentUser = signal<any>(null);

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private chatService: ChatService,
    private chatFacade: ChatFacade,
    private authFacade:AuthFacade
  ) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });

    effect(() => {
      const conversations = this.chatFacade.allConversations();
      console.log(conversations)
      if (conversations) {
        this.conversations.set(conversations);
      }
    }, { allowSignalWrites: true });
    effect(() => {
      const conversation = this.chatFacade.conversation();
      if (conversation) {
        this.selectedConversation.set(conversation);
      }
      const currentUser = this.authFacade.user() || JSON.parse(localStorage.getItem('user')!)
      if(currentUser){
        this.currentUser.set(currentUser)
      }
    }, { allowSignalWrites: true });

  }

  ngOnInit(): void {
    this.chatService.loadConversations();
  }

  selectConversation(conversationId: string) {
    this.chatFacade.selectConversation(conversationId)
    this.chatService.loadMessages(conversationId);
  }

  sendMessage() {
    const message = this.chatForm.value.message;
    if (message) {
      const conversation = this.selectedConversation();
      if (conversation) {
        this.chatService.sendMessage(conversation.id, message);
        this.chatForm.reset();
      }
    }
  }

  getOtherUsers(conversation: Conversation) {
    const currentUser = this.currentUser();
    return conversation.participants.filter(participant => participant.id !== currentUser.id);
  }
  isOwnMessage(message: Message) {
    const currentUser = this.currentUser();
    return message.sender.id === currentUser.id;
  }
}
