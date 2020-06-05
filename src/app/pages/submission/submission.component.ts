import { Component, OnInit } from '@angular/core';
import { CompetitionsService } from 'src/app/api/competitions/competitions.service';
import { MatSnackBar } from '@angular/material';
import { IdGeneratorService } from 'src/app/providers/id-generator/id-generator.service';
import { AuthService } from 'src/app/api/auth/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';


declare var UIkit;

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {
  entriesData: any;
  artworkData: any;
  votesData: any;
  userId = sessionStorage.getItem('competition:uuid');
  usersIdsFromEntriesData: any;
  approvedEntries: any;
  unApprovedEntries: any;
  remainingEntries: any;
  processedEntries: any;
  usersData: Object;
  artworkOnPreview: any;
  toggleEdit: boolean = false;
  form: FormGroup;
  userData: any;
  buttonLabel: string;

  constructor(
    public competitionsProvider: CompetitionsService,
    public usersProvider: AuthService,
    public snackBar: MatSnackBar,
    private router: Router,
    private idGeneratorProvider: IdGeneratorService,
    private formBuilder: FormBuilder,
    public authProvider: AuthService,

    
  ) {
    this.form = this.formBuilder.group({
      comments: [this.userData ? this.userData.comments : null, Validators.required],
    });
  }

  ngOnInit() {
    this.getUser();
  }

  onArtworkView(item) {
    this.artworkOnPreview = item;
    UIkit.modal('#artwork-preview').show();
  }

  getUser() {
    this.usersProvider.getLoggedInUser().subscribe((data)=> {
      if(data[0]) {
        this.initialiseEntries();
        this.initialiseArtworks();
        this.getAllVotes();
        this.getUsersFromEntries();
        this.form.patchValue({comments: this.userData.comments ? this.userData.comments : '' });

      }
      else {
        this.router.navigate(['/login']);
      }
    });
  }

  getUsersFromEntries() {
    this.competitionsProvider.getUsersFromEntries().subscribe((data) => {
      this.usersIdsFromEntriesData = data;
    });
  }

  callUserUpdate(userData) {
    this.authProvider.updateUser(userData).subscribe(data => {
      this.snackBar.open(data['message'], 'CLOSE', { duration: 5000 });
      this.toggleEdit = false;
      this.getUser();
    });
  }

  savecomments() {
    this.userData.comments = this.form.value.comments;
    if(this.userData.id) {
      this.callUserUpdate(this.userData);
    }
  }

  initialiseEntries() {
    this.competitionsProvider.getAllEntries().subscribe((data) => {
      this.entriesData = this.groupByUser(data, 'userId');
    });
  }

  initialiseArtworks() {
    this.competitionsProvider.getArtworks().subscribe((data) => {
      this.artworkData = data;
    });
  }

  getAllVotes() {
    this.competitionsProvider.getAllVotes().subscribe((data) => {
      this.votesData = data;
      this.approvedEntries = this.votesData.filter((item) => item.vote === 'YES');
      this.unApprovedEntries = this.votesData.filter((item) => item.vote === 'NO');
      this.processedEntries = this.approvedEntries.length + this.unApprovedEntries.length;
      this.remainingEntries = this.entriesData.length - (this.approvedEntries.length + this.unApprovedEntries.length);
    });
  }

  getUserDetails(id) {
    return this.usersIdsFromEntriesData.find((user) => user.id === id)
  }

  groupByUser(arr, key) {
    let newArr = [],
        types = {},
        newItem, i, j, cur;
    for (i = 0, j = arr.length; i < j; i++) {
      cur = arr[i];
      if (!(cur[key] in types)) {
          types[cur[key]] = { userId: cur[key], data: [] };
          newArr.push(types[cur[key]]);
      }
      types[cur[key]].data.push(cur);
    }
    return newArr;
  }

  getArtworkDetails(id) {
    return this.artworkData.find((item) => item.id === id)
  }

  checkIfVoteExists(entryUserId) {
      return this.votesData.find((vote) => vote.entryUserId === entryUserId);
  }

  castVote(vote, item) {
    let voteData = {
      id: this.idGeneratorProvider.generateId(),
      voterId: this.userId,
      modifiedDate: null,
      dateAdded: Date.now(),
      entryUserId: item.userId,
      vote: vote
    };

    if(!this.checkIfVoteExists(item.userId)) {
      console.log(voteData);
      this.competitionsProvider.addVote(voteData).subscribe((data) => {
        this.snackBar.open('Vote updated successfully', 'CLOSE', { duration: 5000 });
        this.initialiseEntries();
        this.initialiseArtworks();
        this.getAllVotes();
      });
    }
    else {
      voteData.modifiedDate = Date.now();
      voteData = this.checkIfVoteExists(item.userId);
      voteData.vote = vote;
      this.competitionsProvider.updateVote(voteData).subscribe((data) => {
        this.snackBar.open('Vote updated successfully', 'CLOSE', { duration: 5000 });
        this.initialiseEntries();
        this.initialiseArtworks();
        this.getAllVotes();
      });
    }
  }
}
