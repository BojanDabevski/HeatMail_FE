import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component'; 
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { RegisterComponent } from './pages/register/register.component'
import { HomepageComponent } from './pages/homepage/homepage.component'
import { authGuard } from './guard/auth.guard';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { AddMailsComponent } from './pages/add-mails/add-mails.component';
import { SendMailsComponent } from './pages/send-mails/send-mails.component';

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
    {
        path: 'statistics',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: StatisticsComponent,
                canActivate:[authGuard]
            }
        ]
    },
    {
        path: 'addMails',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: AddMailsComponent,
                canActivate:[authGuard]
            }
        ]
    },
    {
        path: 'sendMails',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: SendMailsComponent,
                canActivate:[authGuard]
            }
        ]
    },
];
