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
@Component({
  selector: 'app-medidas-uds',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule
  ],
  providers:[MessageService,DatePipe,ConfirmationService],
  templateUrl: './medidas-uds.component.html',
})
export default class MedidasUdsComponent implements OnInit {
  public medidasuds:ItProducto[] = [];  
  public modaleditar:boolean = false; 
  public modelmedida:string | undefined; 
  public modeluds:number | undefined;
  public catproveedores: Proveedor[] = []; 
  public proveedorsel:string = ""; 
  public catitems:Item[] = [];
  public articulo:any; 
  public modalagregar:boolean = false;
  public itemumedidaupdate: ItProducto | undefined; 
  public loading:boolean= true;
  constructor(public apiserv:ApiService, public cdr:ChangeDetectorRef,private messageService: MessageService,private datePipe: DatePipe,private confirmationService: ConfirmationService)
  {
    this.getMedidas();
    this.getItemsProv();
    this.getProveedores(); 
  }

  ngOnInit(): void { }

  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

  getMedidas()
  {
    this.loading = true;
    this.apiserv.getMedidasuds().subscribe({
      next: data => {
         this.medidasuds = data; 
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
  
  getProveedores()
  {
     this.apiserv.getProveedores().subscribe({
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

  guardarMedidaUds()
  {  
   debugger
    if(this.modelmedida == undefined || this.modelmedida == "")
      {
        this.showMessage('info',"Error","Favor de agregar una unidad de medida");
        return
      }

      if(this.modeluds == undefined || this.modeluds == 0)
        {
          this.showMessage('info',"Error","Favor de agregar la cantidad de unidades");
          return
        }
    const data =
    {
      rfc: this.proveedorsel,
      codarticulo: this.articulo,
      umedida: this.modelmedida.toUpperCase(),
      uds: this.modeluds
    };
    this.loading = true; 
    this.apiserv.saveumedida(data).subscribe({
      next: data => {
        this.modalagregar = false
        this.showMessage('success',"Success","Guardado correctamente");
        this.modelmedida = undefined;
        this.modeluds = undefined;
        this.getMedidas(); 

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

  confirm1(event: Event,id:string) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Está seguro que desea eliminar?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"btn btn-secondary me-2",
        acceptButtonStyleClass:"btn btn-danger",
        accept: () => {
           
          this.apiserv.deleteUmedida(id).subscribe({
            next: data => {
               this.getMedidas(); 
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

showUpdate(item:ItProducto)
{
  this.modaleditar = true; 
  this.itemumedidaupdate = item; 
  this.modelmedida = item.umedida;
  this.modeluds = item.uds;
}

updateMedidaUds()
{  

  if(this.modelmedida == undefined || this.modelmedida == "")
    {
      this.showMessage('info',"Error","Favor de agregar una unidad de medida");
      return
    }

    if(this.modeluds == undefined || this.modeluds == 0)
      {
        this.showMessage('info',"Error","Favor de agregar la cantidad de unidades");
        return
      }
  const data =
  {
    rfc: this.itemumedidaupdate?.rfc,
    codarticulo: this.itemumedidaupdate?.codarticulo,
    umedida: this.modelmedida.toUpperCase(),
    uds: this.modeluds
  };

  this.apiserv.UpdateMedidauds(data).subscribe({
    next: data => {
      this.modaleditar = false
      this.showMessage('success',"Success","Actualizado correctamente");
      this.modelmedida = undefined;
      this.modeluds = undefined;
      this.getMedidas(); 


       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

}
