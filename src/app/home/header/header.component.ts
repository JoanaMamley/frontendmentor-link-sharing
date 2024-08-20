import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'home-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  highlighted: boolean = false;

  constructor(private router: Router){}
  
  navigateToPreview() {
    this.router.navigateByUrl('/preview')
  }

  highlight(){
    this.highlighted = true;
  }

  removeHighlight(){
    this.highlighted = false;
  }
}
