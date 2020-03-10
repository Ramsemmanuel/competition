import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  usersDB: AngularFirestoreCollection<any> = this.afs.collection('users');

  constructor(
    public afAuth: AngularFireAuth,
    public afd: AngularFireDatabase,
    private afs: AngularFirestore,
    public snackBar: MatSnackBar
    ) {}

  addClub(data) {
    return this.usersDB.add(data).then(res => {
      res.update({ id: res.id }).then(response => {
        this.snackBar.open('User added', 'CLOSE', {
          duration: 2000,
        });
      });
    })
  }

  updateUser(data) {
    return this.usersDB.doc(data.id).update(data).then(response => {
      this.snackBar.open('User updated', 'CLOSE', {
        duration: 2000,
      });
    });
  }
}
