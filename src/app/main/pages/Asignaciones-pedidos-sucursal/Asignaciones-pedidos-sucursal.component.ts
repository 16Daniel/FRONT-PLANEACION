import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { Component,ChangeDetectorRef, type OnInit  } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../Services/api.service';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { Asignacion } from '../../../Interfaces/Asignacion.';
import { Usuario } from '../../../Interfaces/Usuario';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { Proveedor } from '../../../Interfaces/Proveedor';
@Component({
  selector: 'app-asignaciones-pedidos-sucursal',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonModule,
    DialogModule,
    ToastModule,
    CalendarModule,
    FormsModule,
    ConfirmDialogModule,
    MultiSelectModule
  ],
  providers:[MessageService,ConfirmationService],
  templateUrl: './Asignaciones-pedidos-sucursal.component.html',
})
export default class AsignacionesPedidosSucursalComponent implements OnInit {
  public foundData:boolean = true;
  public loading:boolean = true; 
  public modalAgregar:boolean = false; 
  public arr_asignaciones:Asignacion[]=[]; 
  public catusuarios:Usuario[] = []; 
  public catsucursales:Sucursal[] = [];
  public selectedSucs:Sucursal[] = []; 
  public catproveedores:Proveedor[] = [];
  public selectedprovs:Proveedor[] = []; 
  public selectedUSer:number = -1; 
  public selectedProv:number = -1; 
  public catAsignaciones:Asignacion[] = []; 
  public registrosseleccionados:number[] = []; 
  public elementosfiltrados: Asignacion[] = []; 

  public filtroUSer:number = -1; 
  public filtroProv:number = -1;

  constructor(public apiserv:ApiService,private messageService: MessageService,public cdr:ChangeDetectorRef, private config: PrimeNGConfig,
    private confirmationService: ConfirmationService)
  {
    
  }

  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}
  ngOnInit(): void 
  {
    this.getAsignaciones(); 
    this.getProveedores();
    this.getSucursales();
    this.getusuarios(); 

   }


  showAgregar()
  {
    this.modalAgregar = true;
  }
  showDelete()
  { 
    this.confirmationService.confirm({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar '+this.registrosseleccionados.length+' registros?',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      acceptButtonStyleClass:"btn bg-p-b p-3",
      rejectButtonStyleClass:"btn btn-light me-3 p-3",
      accept: () => {
        this.loading = true;
        this.apiserv.deleteAsignacionesPedSuc(JSON.stringify(this.registrosseleccionados)).subscribe({
          next: data => {
            this.getAsignaciones(); 
            this.showMessage('success',"Success","Eliminado correctamente");
          },
          error: error => {
             console.log(error);
             this.showMessage('error',"Error","Error al procesar la solicitud");
          }
      });
      },
      reject: () => {
          
      }
  });
  }

  saveData()
  {

    if(this.selectedProv == -1)
      {
        this.showMessage('info',"Info","Seleccione un proveedor");
        return
      }

      if(this.selectedSucs.length==0)
        {
          this.showMessage('info',"Info","Seleccione una o más sucursales");
          return
        }

      if(this.selectedUSer == -1)
        {
          this.showMessage('info',"Info","Seleccione un usuario");
          return
        }

        this.loading = true; 
      let data:number[] = []; 

      for(let item of this.selectedSucs)
        {
           data.push(item.cod);
        }

    this.apiserv.guardarAsignacionesPedSuc(this.selectedProv,this.selectedUSer,JSON.stringify(data)).subscribe({
      next: data => {

        this.selectedProv = -1;
        this.selectedUSer = -1;
        this.selectedSucs = []; 
        this.modalAgregar = false; 
        this.loading = false; 
        this.foundData = true; 
        this.showMessage('success',"Success","Guardado correctamente");
       this.cdr.detectChanges();
        this.getAsignaciones();
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
  
  }

  getusuarios()
{
  this.apiserv.getusuarios().subscribe({
    next: data => {
       this.catusuarios =data;
     this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

 getSucursales()
  {
    this.loading = true; 
     this.apiserv.getSucursales().subscribe({
      next: data => {
         this.catsucursales=data;
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });

  }


  getProveedores()
  {
     this.apiserv.getProveedoresAllPedSuc().subscribe({
      next: data => {
         this.catproveedores=data;
       this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });

  }


  
 getAsignaciones()
 {
    this.apiserv.getPedSucAsignaiones().subscribe({
     next: data => {
        this.arr_asignaciones=data;
        if(data.length==0)
          {
            this.foundData = false; 
          } else
          {
            this.filtrar(); 
          }
        this.loading = false; 
        this.cdr.detectChanges();
     },
     error: error => {
        console.log(error);
        this.loading = false; 
        this.showMessage('error',"Error","Error al procesar la solicitud");
     }
 });

 }

 checkregistro(id:number)
 {
 
   const index = this.registrosseleccionados.indexOf(id);
 
     if (index > -1) {
       // El número existe, lo eliminamos
       this.registrosseleccionados.splice(index, 1);
     } else {
       // El número no existe, lo agregamos
       this.registrosseleccionados.push(id);
     }
 
 } 

 seleccionartodo()
 {
    this.registrosseleccionados = []; 
    for(let item of this.elementosfiltrados)
      {
        this.registrosseleccionados.push(item.id);
      }
      this.cdr.detectChanges();
 }

 desmarcartodo()
 {
   this.registrosseleccionados = []; 
 }

getCheck(id:number):boolean
{

  const index = this.registrosseleccionados.indexOf(id);
 
  if (index > -1) {
    return true;
  } else {
    return false;
  }

}
 

filtrar()
{
  this.elementosfiltrados = [...this.arr_asignaciones]; 
  if(this.filtroProv == -1 && this.filtroUSer == -1)
  {
    this.elementosfiltrados = [...this.arr_asignaciones]; 
  }

  if(this.filtroProv > -1 && this.filtroUSer > -1)
    {  
      this.elementosfiltrados = this.elementosfiltrados.filter(p => p.idprov == this.filtroProv && p.idu == this.filtroUSer);
    }

    if(this.filtroProv > -1 && this.filtroUSer == -1)
      {  
        this.elementosfiltrados = this.elementosfiltrados.filter(p => p.idprov == this.filtroProv);
      }

      if(this.filtroUSer >-1 && this.filtroProv ==-1)
        {  
          this.elementosfiltrados = this.elementosfiltrados.filter(p => p.idu == this.filtroUSer);
        }
}
}
