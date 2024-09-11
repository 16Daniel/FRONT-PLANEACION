import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { Proveedor } from '../../../Interfaces/Proveedor';
import { Item } from '../../../Interfaces/Item';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { Retornable } from '../../../Interfaces/Retornable.';
@Component({
  selector: 'app-cartones',
  standalone: true,
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule
  ],
  providers:[MessageService,DatePipe,ConfirmationService],
  templateUrl: './Cartones.component.html',
})
export default class CartonesComponent implements OnInit {
  public arr_retornables:Retornable[] = []; 
  public modeluds:number | undefined;
  public catproveedores: Proveedor[] = []; 
  public arr_articulos:Item[] = [];
  public modalagregar:boolean = false;
  public loading:boolean= true;

  public formProv:number|undefined; 
  public formArt:number|undefined;  
  constructor(public apiserv:ApiService, public cdr:ChangeDetectorRef,private messageService: MessageService,private datePipe: DatePipe,private confirmationService: ConfirmationService)
  {
    this.getData();
    this.getProveedores(); 
  }

  ngOnInit(): void { }

  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}


getData()
{
  this.loading = true;
  this.apiserv.getDataRetornables().subscribe({
    next: data => {
       this.arr_retornables = data; 
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
    this.loading = true; 
     this.apiserv.getItemprovp(this.formProv!).subscribe({
      next: data => {
         this.arr_articulos=data;
         if(this.arr_articulos.length>0)
          {
            this.formArt = this.arr_articulos[0].cod; 
          } 
         this.loading = false; 
         this.cdr.detectChanges();
      },
      error: error => {
        this.loading = false; 
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });

  }

  showAgregar()
  {
    this.modalagregar = true; 
    this.formProv = undefined; 
    this.formArt = undefined; 
  }

  confirm1(event: Event,id:number) {
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
           
          this.apiserv.deleteRetornable(id).subscribe({
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

changeProv()
{
  this.getItemsProv(); 
}


save()
{
  this.loading = true; 
  let data= 
  {
    id:0,
    codprov:this.formProv,
    codart:this.formArt
  };
  this.apiserv.saveRetornable(data).subscribe({
   next: data => {
      this.arr_articulos=data;
      this.modalagregar = false; 
      this.getData(); 
      this.showMessage('success',"Success","Guardado correctamente");
      this.cdr.detectChanges();
   },
   error: error => {
     this.loading = false; 
      console.log(error);
      this.showMessage('error',"Error","Error al procesar la solicitud");
   }
});
}
}
