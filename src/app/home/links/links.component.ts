import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Link, LinkBasicInfo } from '../../shared/models/link.model';
import { LinkItemComponent } from './link-item/link-item.component';
import { LinkService } from '../../shared/services/link.service';
import { LinksSortPipe } from '../../shared/pipes/links-sort.pipe';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [CommonModule, LinkItemComponent, LinksSortPipe],
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

  updateLink($event: LinkBasicInfo, id: number) {
    const sub = this.linkService.updateLink(id, $event).subscribe({
      next: (message) => {
        this.snackBar.open(message, 'Close', {
          duration: 2000,
          panelClass: ['snackbar-success']
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to update link', 'Close', {
          duration: 2000,
          panelClass: ['snackbar-error']
        });
      }
    });
    this.subscriptions.push(sub);
  }

  deleteLink($event: number) {
    if ($event === -1) {
      this.linkService.removeNewLink()
      this.snackBar.open('Link deleted successfully', 'Close', {
        duration: 2000,
        panelClass: ['snackbar-success']
      });
    }
    else {
      const sub = this.linkService.deleteLink($event).subscribe({
        next: (message) => {
          this.snackBar.open(message, 'Close', {
            duration: 2000,
            panelClass: ['snackbar-success']
          });
        },
        error: (error) => {
          this.snackBar.open('Failed to delete link', 'Close', {
            duration: 2000,
            panelClass: ['snackbar-error']
          });
        }
      });
      this.subscriptions.push(sub);
    }
  }

}
