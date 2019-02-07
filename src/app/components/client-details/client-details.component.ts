import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/Client';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {
  id: string;
  client: Client;
  hasBalance: boolean = false;
  showBalanceUpdateInput: boolean = false;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    //Get id from Url
    this.id = this.route.snapshot.params['id'];
    //igual a:
    // this.id = this.route.snapshot.paramMap.get('id');
    // NOTA: Não se coloca o '+' pois não se quer converter string para number

    //get Client
    this.clientService.getClient(this.id).subscribe(client => {
      if (client != null) {
        if (client.balance > 0) {
          this.hasBalance = true;
        }
      }
      this.client = client;
    });
  }

  updateBalance() {
    this.clientService.updateClient(this.client);

    this.flashMessage.show("Balance updated", {
      cssClass: 'alert-success', timeout: 3000
    });
  }
  onDeleteClick() {
    if (confirm('Are you sure?')) {
      this.clientService.deleteClient(this.client);

      this.flashMessage.show("Client Removed", {
        cssClass: 'alert-success', timeout: 3000
      });
      this.router.navigate(['/']);
    }
  }
}
