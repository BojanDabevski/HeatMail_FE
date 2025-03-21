import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component'; 
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { RegisterComponent } from './pages/register/register.component'
import { HomepageComponent } from './pages/homepage/homepage.component'
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    {
        path:'',
        redirectTo: 'homepage',
        pathMatch:'full'
    },
    {
        path:'login',
        component: LoginComponent
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path:'dashboard',
                component: DashboardComponent,
                canActivate:[authGuard]
            }
        ]
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'homepage',
        component: HomepageComponent
    },

];
