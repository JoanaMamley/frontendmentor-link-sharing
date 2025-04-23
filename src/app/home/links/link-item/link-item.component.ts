import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Link, LinkBasicInfo, LINKDETAILS, LinkSGVDesc } from '../../../shared/models/link.model';
import { CommonModule } from '@angular/common';
import { LINKTYPEICONSVGS } from '../../../shared/icon-svgs';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'link-item',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, ReactiveFormsModule],
  templateUrl: './link-item.component.html',
  styleUrl: './link-item.component.scss'
})
export class LinkItemComponent{
  @Input() link!: Link;
  @Input() linkNumber!: number;
  @Output() save = new EventEmitter<LinkBasicInfo>();
  linkForm?: FormGroup;

  linkTypes = LINKDETAILS;

  constructor(private snackBar: MatSnackBar) {}


  saveLink() {
    if (this.linkForm?.invalid) {
      this.linkForm?.markAllAsTouched();
      this.snackBar.open('Please fill in all fields', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    } else {
      this.save.emit({ link_type: this.linkForm?.get('linkType')?.value, link_url: this.linkForm?.get('linkUrl')?.value });
      this.linkForm?.reset();
    }
  }

  ngOnInit(): void {
    this.linkForm = new FormGroup({
      'linkType': new FormControl(this.link.link_type, [Validators.required]),
      'linkUrl': new FormControl(this.link.link_url, [Validators.required])
    });
  }

  get linkType(): AbstractControl<any, any> | null | undefined {
      return this.linkForm?.get('linkType');
  }

  get linkUrl(): AbstractControl<any, any> | null | undefined {
      return this.linkForm?.get('linkUrl');
  }
}
