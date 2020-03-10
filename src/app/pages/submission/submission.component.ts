import { Component, OnInit } from '@angular/core';
import { CompetitionsService } from 'src/app/api/competitions/competitions.service';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {
  entriesData: any;
  artworkData: any;

  constructor(
    public competitionsProvider: CompetitionsService,
  ) {
    this.competitionsProvider.getAllEntries().subscribe((data) => {
      this.entriesData = data;
    });

    this.competitionsProvider.getArtworks().subscribe((data) => {
      this.artworkData = data;
    })
  }

  ngOnInit() {
    this
  }

  getArtworkDetails(id) {
    return this.artworkData.find((item) => item.id === id)
  }

}
