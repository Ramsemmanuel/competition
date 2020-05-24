import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material';
import { ConfirmDialogService } from 'src/app/providers/modals/confirm-dialog.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompetitionsService {

  competitionsDB: AngularFirestoreCollection<any> = this.afs.collection('competitions');
  competitionsEntriesDB: AngularFirestoreCollection<any> = this.afs.collection('competitionsEntries');
  artworkDB: AngularFirestoreCollection<any> = this.afs.collection('artwork');
  userId = sessionStorage.getItem('competition:uuid');
  constructor(
    public afAuth: AngularFireAuth,
    public afd: AngularFireDatabase,
    private afs: AngularFirestore,
    public snackBar: MatSnackBar,
    public confirmDialog: ConfirmDialogService,
    private httpClient: HttpClient
  ) {
  }

    getArtworks() {
      return this.httpClient.get('http://localhost:3000/artworks/')
    }

    getUserWork(user) {
      return this.httpClient.post('http://localhost:3000/user-artworks/', {id: user});
    }

    getartWorkDetails(artworkId) {
      return this.httpClient.post('http://localhost:3000/user-artwork/', {id: artworkId});
    }

    addArtworkWork(data) {
      return this.httpClient.post('http://localhost:3000/add-artwork/', data)
    }

    updateWork(data) {
      return this.httpClient.put('http://localhost:3000/update-artwork/', data)
    }


    deleteWork(data) {
      let workId = data.id;
      return this.httpClient.post('http://localhost:3000/delete-artwork/', {id: workId})
    }

    getCompetitions() {
      return this.competitionsDB;
    }

    addCompetition(data) {
      return this.competitionsDB.add(data).then(res => {
        res.update({ id: res.id }).then(response => {
          this.snackBar.open('Competition added', 'CLOSE', {
            duration: 3000,
          });
        });
      })
    }
  
    updateCompetition(data) {
      return this.competitionsDB.doc(data.id).update(data).then(response => {
        this.snackBar.open('Competition updated', 'CLOSE', {
          duration: 3000,
        });
      });
    }

    // ENTRIES
    enterCompetition(data) {
        return this.httpClient.post('http://localhost:3000/competition-entry/', data);
    }

    getUserArtworkEntry() {
      return this.httpClient.post('http://localhost:3000/user-entries/', {userId: this.userId});
    }

    getAllEntries() {
      return this.httpClient.get('http://localhost:3000/entries/');
    }
    updateEntry(data) {
      return this.httpClient.put('http://localhost:3000/update-entry/', data);
    }
    getUsersFromEntries() {
      return this.httpClient.get('http://localhost:3000/entries-user-ids/');
    }

    // VOTES
    updateVote(data) {
      return this.httpClient.put('http://localhost:3000/update-vote/', data);
    }
    addVote(data) {
      return this.httpClient.post('http://localhost:3000/add-vote/', data);
    }
    getAllVotes() {
      return this.httpClient.get('http://localhost:3000/votes/');
    }
}
