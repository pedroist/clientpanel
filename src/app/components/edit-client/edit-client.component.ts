import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/Client';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {
  id: string;
  client: Client = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    balance: 0
  }
  disableBalanceOnEdit: boolean = true;

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
    this.clientService.getClient(this.id).subscribe(client => this.client = client);
  }

  onSubmit({ value, valid }: { value: Client, valid: boolean }) {
    if (!valid) {
      this.flashMessage.show("Please fill out the form correctly", {
        cssClass: 'alert-danger', timeout: 3000
      });
    } else {
      // Add id to Client
      value.id = this.id; //o id nao vem no form

      //update the client
      this.clientService.updateClient(value);

      this.flashMessage.show("Client Updated", {
        cssClass: 'alert-success', timeout: 3000
      });
      this.router.navigate(['/client/' + this.id]);
    }
  }
}
