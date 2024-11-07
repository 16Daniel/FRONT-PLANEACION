import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ItProducto } from '../../../Interfaces/ItProducto';
import { DialogModule } from 'primeng/dialog';
import { Proveedor } from '../../../Interfaces/Proveedor';
import { Item } from '../../../Interfaces/Item';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { Almacenaje } from '../../../Interfaces/Almacenaje';
@Component({
  selector: 'app-almacen',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule
  ],
  providers:[MessageService,DatePipe,ConfirmationService],
  templateUrl: './Almacen.component.html',
})
export default class AlmacenComponent implements OnInit {
  public modaleditar:boolean = false; 
  public modelmedida:string | undefined; 
  public catproveedores: Proveedor[] = []; 
  public sucursalsel:number = 0; 
  public catitems:Item[] = [];
  public articulo:any; 
  public modalagregar:boolean = false;
  public modalupdate:boolean = false; 
  public loading:boolean= false;
  public catsucursales:Sucursal[] = []; 
  public data:Almacenaje[] = []; 
  public registrosseleccionados:number[] = []; 

  public formcapacidad:number = 0; 
  constructor(public apiserv:ApiService, public cdr:ChangeDetectorRef,private messageService: MessageService,private datePipe: DatePipe,private confirmationService: ConfirmationService)
  {

    this.getItemsProv();
    this.getSucursales(); 
    this.getData(); 
  }

  ngOnInit(): void { }

  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

getSucursales()
{
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
  

getData()
{
  this.loading = true
  this.apiserv.getDataAlmacenaje().subscribe({
    next: data => {
       this.data=data;
       this.loading = false; 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

  getItemsProv()
  {
     this.apiserv.getItemprov().subscribe({
      next: data => {
         this.catitems=data;
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
    this.modalagregar = true; 
  }


  guardar()
  {
    let data = 
    {
      Id:0,
      Idsucursal:this.sucursalsel,
      Codarticulo:this.articulo,
      Capacidad:this.formcapacidad
    }

    this.loading = true; 
    this.apiserv.saveDatatAlmacen(data).subscribe({
      next: data => {
         this.getData(); 
         this.formcapacidad = 0; 
         this.modalagregar = false; 
         this.modalupdate = false; 
         this.showMessage('success',"Success","Guardado correctamente");
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
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
     for(let item of this.data)
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


 editar(item:Almacenaje)
 {
    this.sucursalsel = item.codsucursal; 
    this.articulo = item.codart; 
    this.formcapacidad = item.capacidad; 
    this.modalupdate = true; 

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
       this.apiserv.deleteAlmacenajes(JSON.stringify(this.registrosseleccionados)).subscribe({
         next: data => {
          this.getData(); 
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


}
