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
  viewsForm: FormGroup;
  viewsData: any;
  buttonLabel: string;
  toggleEditComment: boolean = false;
  toggleEditReason: boolean = false;

  constructor(
    public competitionsProvider: CompetitionsService,
    public usersProvider: AuthService,
    public snackBar: MatSnackBar,
    private router: Router,
    private idGeneratorProvider: IdGeneratorService,
    private formBuilder: FormBuilder,
    public authProvider: AuthService,

    
  ) {
    this.viewsForm = this.formBuilder.group({
      comment: [this.viewsData ? this.viewsData.comment : null, Validators.nullValidator],
      reason: [this.viewsData ? this.viewsData.reason : null, Validators.nullValidator]
    });
  }

  ngOnInit() {
    this.getUser();
  }

  onArtworkView(item) {
    this.artworkOnPreview = item;
    UIkit.modal('#artwork-preview').show();
  }

  getViews(id) {
    this.competitionsProvider.getViews(id).subscribe((data) => {
      this.viewsData = data[0];
      this.viewsForm = this.formBuilder.group({
        comment: [this.viewsData ? this.viewsData.comment : null, Validators.nullValidator],
        reason: [this.viewsData ? this.viewsData.reason : null, Validators.nullValidator]
      });
    })
  }

  getUser() {
    this.usersProvider.getLoggedInUser().subscribe((data)=> {
      if(data[0]) {
        this.getViews(data[0].id)
        this.initialiseEntries();
        this.initialiseArtworks();
        this.getAllVotes();
        this.getUsersFromEntries();
        // this.viewsForm.patchValue({comments: this.userData.comments ? this.userData.comments : '' });

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

  saveViews() {
    let viewsData = this.viewsForm.value;
    viewsData.userId = this.userId;
    if(this.userId && (viewsData.comment || viewsData.reason)) {
      // Update
      if(this.viewsData) {
        viewsData.id = this.viewsData.id;
        this.competitionsProvider.updateView(viewsData).subscribe((data) => {
          this.getViews(this.userId);
          this.toggleEditComment = false;
          this.toggleEditReason = false;
          this.snackBar.open('Views updated successfully', 'CLOSE', { duration: 5000 });
        })
      }
      // Add
      else {
        viewsData.id = this.idGeneratorProvider.generateId();
        this.competitionsProvider.addView(viewsData).subscribe((data) => {
          this.getViews(this.userId);
          this.toggleEditComment = false;
          this.toggleEditReason = false;
          this.snackBar.open('Views Added successfully', 'CLOSE', { duration: 5000 });
        })
      }

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
