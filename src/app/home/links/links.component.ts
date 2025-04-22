import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../shared/models/user.model';
import { Subscription } from 'rxjs';
import { Link } from '../../shared/models/link.model';
import { LinkItemComponent } from './link-item/link-item.component';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [CommonModule, LinkItemComponent],
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss'
})
export class LinksComponent implements OnInit {
  user?: User;
  newLink?: Link;
  subscriptions: Subscription[] = [];

  constructor(private userService: UserService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    const sub = this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });

    this.subscriptions.push(sub);
  }

  get hasNoLinks(): boolean {
    return (!this.user?.links || this.user.links.length === 0) && !this.newLink;
  }

}
