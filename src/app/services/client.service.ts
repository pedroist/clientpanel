import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client } from '../models/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  clientsCollection: AngularFirestoreCollection<Client>;
  clientDoc: AngularFirestoreDocument<Client>;
  clients: Observable<Client[]>;
  client: Observable<Client>;

  constructor(private afs: AngularFirestore) {
    // 'clients' é a colecção definada no firebase project (backend panel)
    this.clientsCollection = this.afs.collection('clients', ref => ref.orderBy('lastName', 'asc'));
  }

  getClients(): Observable<Client[]> {
    //Get clients with the id (See AngularFirestore SnapshotChanges documentation)

    this.clients = this.clientsCollection.snapshotChanges()
      .pipe(map(changes => { //array the changes cada um com uma action {payload:..., type:...} (relativa a um doc - um objecto)
        return changes.map(action => {
          const data = action.payload.doc.data() as Client;
          data.id = action.payload.doc.id; /*or just 'const id'*/
          return data; //or {id, ...data}
        });
      }));

    return this.clients;
  }

  newClient(client: Client) {
    this.clientsCollection.add(client);
  }

  getClient(id: string): Observable<Client> {
    this.clientDoc = this.afs.doc<Client>(`clients/${id}`);

    // we could do valueChanges instead of snapshotChanges if we didn't need the id
    this.client = this.clientDoc.snapshotChanges()
      .pipe(map(action => {
        //check if exists
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as Client;
          data.id = action.payload.id;
          return data;
        }
      }));
    return this.client;
  }

  updateClient(client: Client) {
    this.clientDoc = this.afs.doc<Client>(`clients/${client.id}`);
    this.clientDoc.update(client);
  }
}
