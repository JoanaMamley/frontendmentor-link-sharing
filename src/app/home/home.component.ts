import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { PhoneMockupComponent } from './phone-mockup/phone-mockup.component';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, PhoneMockupComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  user?: User;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    const sub: Subscription = this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.userService.setCurrentUser(user);
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
        this.router.navigateByUrl('/login');
      }
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
