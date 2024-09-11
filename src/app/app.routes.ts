import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
{
    path:'main',
    loadComponent: () => import('./main/main.component'),
    canActivateChild:[authGuard],
    children:
    [
        {
            path:'users',
            title:'Usuarios',
            loadComponent: () => import('./main/pages/Users/Users.component')
        },
        {
            path:'roles',
            title:'Roles de usuarios',
            loadComponent: () => import('./main/pages/Roles/Roles.component')
        },
        {
            path:'order-calendar',
            title:'Simulador',
            loadComponent: () => import('./main/pages/calendarizacion-pedidos/calendarizacion-pedidos.component')
        },
        {
            path:'home',
            title:'Inicio',
            loadComponent: () => import('./main/pages/Home/Home.component')
        },
        {
            path:'add-calendar',
            title:'Agregar calendario',
            loadComponent: () => import('./main/pages/calendarios/add-calendar/add-calendar.component')
        },
        {
            path:'orders',
            title:'Pedidos',
            loadComponent: () => import('./main/pages/pedidos/pedidos.component')
        },
        {
            path:'edit-calendar',
            title:'Agregar calendario',
            loadComponent: () => import('./main/pages/calendarios/edit-calendar/edit-calendar.component')
        },
        {
            path:'delete-calendar',
            title:'Agregar calendario',
            loadComponent: () => import('./main/pages/calendarios/delete-calendar/delete-calendar.component')
        },
        {
            path:'especial-day',
            title:'Dias especiales',
            loadComponent: () => import('./main/pages/calendarios/dias-especiales/dias-especiales.component')
        },
        {
            path:'medidas-uds',
            title:'Medidas',
            loadComponent: () => import('./main/pages/medidas-uds/medidas-uds.component')
        },
        {
            path:'parameters',
            title:'Parametros',
            loadComponent: () => import('./main/pages/parametros/parametros.component')
        },
        {
            path:'h-orders',
            title:'Historial de pedidos',
            loadComponent: () => import('./main/pages/historial-pedidos/historial-pedidos.component')
        },
        {
            path:'dias-especiales-sucursales',
            title:'Dias especiales por sucursal',
            loadComponent: () => import('./main/pages/calendarios/especiales-sucursales/especiales-sucursales.component')
        },
        {
            path:'asignaciones',
            title:'Asignaciones',
            loadComponent: () => import('./main/pages/AsignarProveedores/AsignarProveedores.component')
        },
        {
            path:'retornables',
            title:'Retornables',
            loadComponent: () => import('./main/pages/Cartones/Cartones.component')
        },
        {
            path: '',
            redirectTo: '/main/home',
            pathMatch: 'full'
        }
    ]
},
{
    path: '',
    redirectTo: '/main',
    pathMatch: 'full'
},
{
    path:'auth',
    children:
    [
        {
            path:'login',
            title:'Login',
            loadComponent: () => import('./auth/login/login.component')
        },
        {
            path: '',
            redirectTo: '/auth/login',
            pathMatch: 'full'
        }
    ]
}

];
