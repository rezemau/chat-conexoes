import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, Params } from '@angular/router';


interface mensagem {
  text: string,
  type: 'sent' | 'received'
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit {
  messages: mensagem[] = [];
  newMessage: string = '';
  messageInput: string = '';
  messageType: 'c' | 't' = 'c';

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute
  ) {

  }
  ngOnInit(): void {
    this.updateMessageInput();
    this.route.params.subscribe((params: Params) => {
      // params conterá os parâmetros da URL
      const id = params['id'];
      alert(id);
    });
  }
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.db.list('conversas/conversa_1/mensagens').push({ text: this.newMessage, type: this.messageType == 'c' ? 'sent' : 'received' });
      // Aqui, você pode adicionar lógica para processar a mensagem recebida, se necessário.
      this.newMessage = '';

      // Atualiza o campo de visualização de mensagens
      this.updateMessageInput();
    }
  }

  protected scrollChatToBottom() {
    if (this.chatContainer) {
      const container = this.chatContainer.nativeElement;
      container.scrollTop = container.scrollHeight - container.offsetHeight;
    }
  }

  private obterMensagensEmTempoReal(conversaId: string) {
    return this.db.list(`conversas/${conversaId}/mensagens`).valueChanges();
  }

  private updateMessageInput() {
    this.obterMensagensEmTempoReal('conversa_1').subscribe((res) => {
      console.log("TESTEEEE::::" + JSON.stringify(res));
      this.messages = res as mensagem[];
    })
    this.messageInput = this.messages.map(message => message.text).join('\n');
    this.scrollChatToBottom();
  }
}
