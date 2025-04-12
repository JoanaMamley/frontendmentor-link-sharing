// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthRequest, GenericResponse } from '../models/generic.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn: boolean = false;

  constructor(private http: HttpClient) {}

  login(credentials: AuthRequest): Promise<GenericResponse> {
    return lastValueFrom(this.http.post<GenericResponse>(`${environment.apiUrl}/login`, credentials, { withCredentials: true }));
  }

  logout(): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(`${environment.apiUrl}/logout`, {}, { withCredentials: true });
  }

  refreshAccessToken(): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(`${environment.apiUrl}/refresh`, {}, { withCredentials: true });
  }

  isAuthenticated(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(`${environment.apiUrl}/isAuthenticated`, { withCredentials: true });
  }

  set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
}