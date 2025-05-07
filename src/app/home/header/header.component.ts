import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'home-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() userId?: number;

  constructor(private authService: AuthService, private router: Router) {}

  async logout() {
    await lastValueFrom(this.authService.logout()).catch((error) => {
      console.error('Logout failed:', error);
    }
    );
    this.router.navigateByUrl('/login');
  }
}
