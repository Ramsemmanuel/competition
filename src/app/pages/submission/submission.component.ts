import { Component, OnInit } from '@angular/core';
import { CompetitionsService } from 'src/app/api/competitions/competitions.service';
import { MatSnackBar } from '@angular/material';
import { IdGeneratorService } from 'src/app/providers/id-generator/id-generator.service';

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

  constructor(
    public competitionsProvider: CompetitionsService,
    public snackBar: MatSnackBar,
    private idGeneratorProvider: IdGeneratorService,
  ) {
  }

  ngOnInit() {
    this.initialiseEntries();
    this.initialiseArtworks();
    this.getAllVotes();
    this.getUsersFromEntries();
  }

  getUsersFromEntries() {
    this.competitionsProvider.getUsersFromEntries().subscribe((data) => {
      this.usersIdsFromEntriesData = data
    });
  }

  initialiseEntries() {
    this.competitionsProvider.getAllEntries().subscribe((data) => {
      this.entriesData = data;
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
    });
  }

  getArtworkDetails(id) {
    return this.artworkData.find((item) => item.id === id)
  }

  castVote(vote, item) {
    let voteData = item;
    delete voteData.id;
    delete voteData.entryDate;
    voteData.vote = vote;
    if(!item.dateAdded && !item.id) {
      voteData.dateAdded = Date.now();
      voteData.id = this.idGeneratorProvider.generateId();
      voteData.voterId = this.userId;
      this.competitionsProvider.addVote(voteData).subscribe((data) => {
        this.snackBar.open('Vote casted successfully', 'CLOSE', { duration: 5000 });
        this.initialiseEntries();
        this.initialiseArtworks();
        this.getAllVotes();
      })
    }
    else {
      voteData.modifiedDate = Date.now();
      this.competitionsProvider.updateVote(voteData).subscribe((data) => {
        this.snackBar.open('Vote updated successfully', 'CLOSE', { duration: 5000 });
        this.initialiseEntries();
        this.initialiseArtworks();
        this.getAllVotes();
      })
    }
  }

  getMostVoted(artworkId) {
    let mostVoted = this.votesData.filter(item => item.vote === 'YES' && item.artworkId === artworkId).length;
    return { number: mostVoted, artworkId: artworkId }
  }
}
