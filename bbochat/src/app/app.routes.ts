import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth-guard.guard';

export const routes: Routes = [
    {
      path: 'login',
      loadChildren: () => import('./features/auth/auth.routes').then(m => m.routes),
    },
    {
        path: 'chats',
        loadComponent: () => import('./features/chat/ui/chat/chat.component').then(m => m.ChatComponent),
        canActivate:[authGuard]
    },
    {
        path:'',redirectTo:'chats',pathMatch:'full'
    }
]   