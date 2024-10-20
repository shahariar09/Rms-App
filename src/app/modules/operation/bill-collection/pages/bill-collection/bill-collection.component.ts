import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-bill-collection',
  templateUrl: './bill-collection.component.html',
  styleUrls: ['./bill-collection.component.css']
})
export class BillCollectionComponent implements OnInit {

  ticketId: number;
  ticketTypeId: number;
  selectedTab: any = 1;

  constructor(
    private activateRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    
  }

  selectTab(tab){
    this.selectedTab = tab;
  }
}
