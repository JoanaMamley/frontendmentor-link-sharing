import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../shared/models/user.model';
import { Observable, Subscription } from 'rxjs';
import { Link, LinkBasicInfo } from '../../shared/models/link.model';
import { LinkItemComponent } from './link-item/link-item.component';
import { LinkService } from '../../shared/services/link.service';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [CommonModule, LinkItemComponent],
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss'
})
export class LinksComponent implements OnInit {
  subscriptions: Subscription[] = [];
  links$?: Observable<Link[]>;
  links: Link[] = [];

  constructor(private linkService: LinkService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.linkService.links$.subscribe(links => {
      this.links = links;
    });
  }

  get hasNoLinks(): boolean {
    return (!this.links || this.links.length === 0);
  }

  addNewLink(): void {
    this.linkService.addNewLink();
  }

  saveItem(link: LinkBasicInfo) {
    console.log('Saving link:', link);
    this.linkService.saveLink(link);
  }

}
