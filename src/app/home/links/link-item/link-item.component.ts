import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Link, LinkBasicInfo, LINKDETAILS, LinkOptionDetail } from '../../../shared/models/link.model';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'link-item',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, ReactiveFormsModule, DropdownModule , IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './link-item.component.html',
  styleUrl: './link-item.component.scss'
})
export class LinkItemComponent implements OnInit {
  @Input() link!: Link;
  @Input() linkNumber!: number;
  @Output() save = new EventEmitter<LinkBasicInfo>();
  @Output() update = new EventEmitter<LinkBasicInfo>();
  @Output() delete = new EventEmitter<number>();
  linkForm?: FormGroup;
  currentLinkType?: string;

  linkTypes = LINKDETAILS;

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.currentLinkType = this.link.link_type;

    this.linkForm = new FormGroup({
      'linkType': new FormControl(this.link.link_type, [Validators.required]),
      'linkUrl': new FormControl(this.link.link_url, [Validators.required])
    });
  }

  saveLink() {
    if (this.linkForm?.invalid) {
      this.linkForm?.markAllAsTouched();
      this.snackBar.open('Please fill in all fields', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
    } else {
      if (this.link.id === -1) {
        this.save.emit({ link_type: this.linkForm?.get('linkType')?.value, link_url: this.linkForm?.get('linkUrl')?.value });
      }
      else {
        this.update.emit({ link_type: this.linkForm?.get('linkType')?.value, link_url: this.linkForm?.get('linkUrl')?.value });
      }
      this.linkForm?.reset();
    }
  }

  deleteLink() {
    this.delete.emit(this.link.id);
  }

  get linkType(): AbstractControl<any, any> | null | undefined {
      return this.linkForm?.get('linkType');
  }

  get linkUrl(): AbstractControl<any, any> | null | undefined {
      return this.linkForm?.get('linkUrl');
  }

  get linkOptions(): string[] {
    return Object.keys(this.linkTypes).map((key) => (
      key));
  }

  fetchLinkDetails(linkType: string): LinkOptionDetail {
    return this.linkTypes[linkType];
  }
}
