import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class LinksComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  links: Link[] = [];

  constructor(private linkService: LinkService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    const sub = this.linkService.links$.subscribe(links => {
      this.links = links;
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  get hasNoLinks(): boolean {
    return (!this.links || this.links.length === 0);
  }

  addNewLink(): void {
    this.linkService.addNewLink();
  }

  saveLink(link: LinkBasicInfo) {
    const sub = this.linkService.saveLink(link).subscribe({
      next: (message) => {
        this.snackBar.open(message, 'Close', {
          duration: 2000,
          panelClass: ['snackbar-success']
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to save link', 'Close', {
          duration: 2000,
          panelClass: ['snackbar-error']
        });
      }
    });
    this.subscriptions.push(sub);
  }

}
