import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';
import { Subscription } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, MatIconModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss'
})
export class ProfileEditComponent implements OnInit, OnDestroy {
  profileImageUrl: string | SafeUrl = 'images/empty_profile_image.png';
  isUploading = false;
  errorMessage: string | null = null;
  private profileObjectUrl: string | null = null;
  user?: User;
  subscriptions: Subscription[] = [];
  profileForm?: FormGroup;

  constructor(private userService: UserService, private snackBar: MatSnackBar, private router: Router, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const sub = this.userService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;

        this.profileForm = new FormGroup({
          'firstname': new FormControl(user.firstname || null, [Validators.required]),
          'lastname': new FormControl(user.lastname || null, [Validators.required]),
          'email': new FormControl(user.email || null, [Validators.email])
        });

        this.loadProfileImage();
      }
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    if (this.profileObjectUrl) {
      URL.revokeObjectURL(this.profileObjectUrl);
    }
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  updateProfile() {
    if (this.user && this.profileForm?.valid) {
      const sub = this.userService.updateUser({
        email: this.profileForm?.get('email')?.value,
        firstname: this.profileForm?.get('firstname')?.value,
        lastname: this.profileForm?.get('lastname')?.value
      }, this.user.id).subscribe({
        next: (updatedUser) => {
          // console.log('Profile updated successfully:', updatedUser);
          this.userService.setCurrentUser(updatedUser);
          this.snackBar.open('Profile updated successfully', 'Close', {
            duration: 3000,
          });
        }
        , error: (err) => {
          console.error('Error updating profile:', err);
          if (err instanceof HttpErrorResponse) {
            console.error('HTTP Error:', err.message);
            this.router.navigateByUrl('/login');
          }
          else {
            this.snackBar.open('Error updating profile', 'Close', {
              duration: 3000,
            });
          }
        }
      });

      this.subscriptions.push(sub);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isUploading = true;
      this.errorMessage = null;
      const sub = this.userService.uploadProfileImage(file).subscribe({
        next: (response) => {
          this.isUploading = false;
          this.loadProfileImage();
        },
        error: (err) => {
          this.isUploading = false;
          this.errorMessage = 'Upload failed: ' + err.message;
        }
      });

      this.subscriptions.push(sub)
    }
  }

  loadProfileImage(): void {
    if (this.user) {
      const sub = this.userService.getProfileImage(this.user.id).subscribe({
        next: (blob) => {
          if (this.profileObjectUrl) {
            URL.revokeObjectURL(this.profileObjectUrl);
          }
          this.profileObjectUrl = URL.createObjectURL(blob);
          this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.profileObjectUrl);
        },
        error: (err) => {
          if (err.status === 404) {
            this.profileImageUrl = 'images/empty_profile_image.png';
          } else {
            this.errorMessage = 'Failed to load profile image';
          }
        }
      });

      this.subscriptions.push(sub);
    }
  }

  get email(): AbstractControl<any, any> | null | undefined {
      return this.profileForm?.get('email');
  }

  get firstname(): AbstractControl<any, any> | null | undefined {
    return this.profileForm?.get('firstname');
  }

  get lastname(): AbstractControl<any, any> | null | undefined {
    return this.profileForm?.get('lastname');
  }
}
