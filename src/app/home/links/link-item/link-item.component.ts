import { Component, OnInit } from '@angular/core';
import { LINKDETAILS, LinkSGVDesc } from '../../../shared/models/link.model';
import { CommonModule } from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LINKTYPEICONSVGS } from '../../../shared/icon-svgs';

const THUMBUP_ICON =
  `
  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.` +
  `44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5` +
  `1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
  </svg>
`;

@Component({
  selector: 'link-item',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, MatIconModule],
  templateUrl: './link-item.component.html',
  styleUrl: './link-item.component.scss'
})
export class LinkItemComponent implements OnInit{
  linkTypes = LINKDETAILS;
  iconSVGS: LinkSGVDesc[] =  LINKTYPEICONSVGS;

  constructor(private domSanitizer: DomSanitizer, private iconRegistry: MatIconRegistry) {}

  ngOnInit(): void {
    for (const icon of this.iconSVGS) {
      this.iconRegistry.addSvgIconLiteral(icon.name, this.domSanitizer.bypassSecurityTrustHtml(icon.svg));
    }
    this.iconRegistry.addSvgIconLiteral('thumbs-up.svg', this.domSanitizer.bypassSecurityTrustHtml(THUMBUP_ICON));
  }
}
