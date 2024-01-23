import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';


interface mensagem {
  text: string,
  type: 'sent' | 'received'
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})

export class ChatComponent implements OnInit{
  messages: mensagem[] = [];
  newMessage: string = '';
  messageInput: string = '';
  messageType: 'c'|'t' = 'c';

  constructor(
    private db: AngularFireDatabase
  ){

  }
  ngOnInit(): void {
    this.updateMessageInput();
  }
  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.db.list('conversas/conversa_1/mensagens').push({ text: this.newMessage, type: this.messageType == 'c'? 'sent': 'received' });
      // Aqui, você pode adicionar lógica para processar a mensagem recebida, se necessário.
      this.newMessage = '';

      // Atualiza o campo de visualização de mensagens
      this.updateMessageInput();
    }
  }

  private obterMensagensEmTempoReal(conversaId: string) {
    return this.db.list(`conversas/${conversaId}/mensagens`).valueChanges();
  }

  private updateMessageInput() {
    this.obterMensagensEmTempoReal('conversa_1').subscribe((res) =>{
      console.log("TESTEEEE::::" + JSON.stringify(res));
      this.messages = res as mensagem[];
    })
    this.messageInput = this.messages.map(message => message.text).join('\n');
  }
}
