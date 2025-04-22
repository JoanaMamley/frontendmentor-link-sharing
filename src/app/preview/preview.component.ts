import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LINKDETAILS } from '../shared/models/link.model';

interface LinkDesc{
  name: string;
  icon: string;
  color: string;
}
@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss'
})
export class PreviewComponent {
  linkItems: LinkDesc[] = [LINKDETAILS['github'], LINKDETAILS['youtube'], LINKDETAILS['linkedIn']];

  getlinkIcon(linkType: LinkDesc): string {
    return `images/${linkType.icon}`;
  }
}
