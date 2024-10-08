import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { Component,ChangeDetectorRef, destroyPlatform  } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ApiService } from '../../../Services/api.service';
import { Rol } from '../../../Interfaces/Rol';
import { Ruta } from '../../../Interfaces/Ruta';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-roles',
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
  templateUrl: './Roles.component.html'
})
export default class RolesComponent {
public catroles:Rol[] = [];
public catrutas:Ruta[] = []; 
public foundData:boolean = true;
public loading:boolean = true; 
modalAgregar:boolean = false; 
public actualizar:boolean = false; 
public formdescripcion:string = ''; 
public rolsel:Rol | undefined; 
public selectedRoutes:number[] = []; 

constructor(public apiserv:ApiService,private messageService: MessageService,public cdr:ChangeDetectorRef, private config: PrimeNGConfig,
  private confirmationService: ConfirmationService)
{
  this.getRoles(); 
  this.getRutas();
}

  ngOnInit(): void { }

  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

  getRoles()
  {
    this.apiserv.getRoles().subscribe({
      next: data => {
         this.catroles =data;
         this.loading = false;
         if(data.length==0)
         {
          this.foundData = false; 
         }
       this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });

  }


  getRutas()
  {
    this.apiserv.getRutas().subscribe({
      next: data => {
         this.catrutas =data;

         for (let index = 0; index < this.catrutas.length; index++) {
          this.selectedRoutes.push(0);
        }

         this.loading = false;
       this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });

  }



  showAgregar()
{
  this.actualizar=false;
  this.modalAgregar = true; 
  this.formdescripcion = ''; 
  
  for(let i = 0; i<this.selectedRoutes.length; i++)
    {
      this.selectedRoutes[i] = 0; 
    }

}

  confirm(id:number) {
    this.confirmationService.confirm({
        header: 'Confirmación',
        message: '¿Está seguro que desea eliminar?',
        acceptIcon: 'pi pi-check mr-2',
        rejectIcon: 'pi pi-times mr-2',
        acceptButtonStyleClass:"btn bg-p-b p-3",
        rejectButtonStyleClass:"btn btn-light me-3 p-3",
        accept: () => {
            this.deleteRol(id);
        },
        reject: () => {
            
        }
    });
  }
  
  showEdit(data:Rol)
  { 
    this.formdescripcion = data.descripcion;
    this.actualizar=true;
    this.modalAgregar = true;
    this.rolsel = data;

    for(let i = 0; i<this.selectedRoutes.length; i++)
      {
        this.selectedRoutes[i] = 0; 
      }

      
    this.apiserv.getRutasRol(data.id).subscribe({
      next: data => {
      
        let catrutasE:Ruta[] = data;
        let indicesEnArray1: number[] = [];
        indicesEnArray1 = this.buscarIndices(this.catrutas, catrutasE);
        console.log(indicesEnArray1);

        for(let i of indicesEnArray1)
          {
            this.selectedRoutes[i] = 1;
          }

       this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });

  }


  buscarIndices(array1: any[], array2: any[]): number[] {
    return array2.map(ruta2 => {
      const index = array1.findIndex(ruta1 => ruta1.id === ruta2.id);
      return index !== -1 ? index : -1;
    });
  }

  deleteRol(id:number)
  {
   this.loading = true; 
    this.apiserv.deleteRol(id).subscribe({
      next: data => {
         this.getRoles();
         this.loading = false;        
       this.showMessage('success',"Success","Eliminado correctamente");
      },
      error: error => {
        this.loading = false; 
        this.modalAgregar=true;
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
  
  }


  saveData()
  {  
    if(this.formdescripcion == '')
    {
      this.showMessage('info',"Info","Favor de agregar el nombre del rol");
      return;
    }
    this.modalAgregar = false; 
    this.loading = true; 
    const data =
    {
    descripcion: this.formdescripcion
    };
    this.apiserv.createRol(data).subscribe({
      next: data => {
          debugger
       this.cdr.detectChanges();
       this.saveAccesos(data.id);
      },
      error: error => {
        this.modalAgregar=true;
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
  
  } 
  
  updateData()
{  
  if(this.formdescripcion == '')
    {
      this.showMessage('info',"Info","Favor de agregar el nombre del rol");
      return;
    }

  const dataU:Rol =
  {
    id: this.rolsel!.id,
    descripcion: this.formdescripcion
  };

  this.loading = true; 
  this.apiserv.updateRol(dataU).subscribe({
    next: data => {
     this.cdr.detectChanges();
     this.saveAccesos(dataU.id)
    },
    error: error => {
      this.loading = false; 
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

saveAccesos(idr:number)
{
  let arrdata:number[] = []; 
  for(let i = 0; i< this.selectedRoutes.length; i++)
    {
        if(this.selectedRoutes[i] == 1)
          {
             arrdata.push(this.catrutas[i].id); 
          }
    }

  let data = JSON.stringify(arrdata);
  this.apiserv.guardaraccesos(data,idr).subscribe({
    next: data => {
       this.getRoles();
       this.loading = false;        
       this.modalAgregar = false; 
       this.formdescripcion = ''; 
     this.cdr.detectChanges();
     this.showMessage('success',"Success","Guardado correctamente");
    },
    error: error => {
      this.loading = false; 
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

chageStatusRol(index:number)
{
  let status = this.selectedRoutes[index];
  if(status == 1)
  {
    this.selectedRoutes[index] = 0;
  } else 
  {
    this.selectedRoutes[index] = 1; 
  }
}

}
