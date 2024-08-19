import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LinksComponent } from './home/links/links.component';
import { ProfileEditComponent } from './home/profile-edit/profile-edit.component';
import { PreviewComponent } from './preview/preview.component';

export const routes: Routes = [
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'home',
        component: HomeComponent, 
        children: [
          {
            path: 'links', 
            component: LinksComponent,
          },
          {
            path: 'profile',
            component: ProfileEditComponent, 
          },
        ],
      },
      {
        path: 'preview',
        component: PreviewComponent,
      },
      { path: '',   redirectTo: '/register', pathMatch: 'full' }, 
];
