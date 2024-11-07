import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarioTemporal } from '../../../Interfaces/Calendario';
import { Proveedor } from '../../../Interfaces/Proveedor';

@Component({
  selector: 'app-descuentos',
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
  templateUrl: './descuentos.component.html',
})
export default class DescuentosComponent implements OnInit {
  public foundData:boolean = true;
  public loading:boolean = true; 
  public modalAgregar:boolean = false; 
  public registrosseleccionados:number[] = []; 
  public elementosfiltrados: any[] = []; 
  public catproveedores:Proveedor[] = [];
  public proveedorsel:number | undefined; 
  public filtroUSer:number = -1; 
  public filtroProv:number = -1;


  constructor(public apiserv:ApiService,private messageService: MessageService,public cdr:ChangeDetectorRef,
    private confirmationService: ConfirmationService)
  {
    this.getProveedores(); 
      this.getData(); 
  }

  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}
  ngOnInit(): void { }


  showDelete(id:number)
  { 
    debugger 
    this.confirmationService.confirm({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar?',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      acceptButtonStyleClass:"btn bg-p-b p-3",
      rejectButtonStyleClass:"btn btn-light me-3 p-3",
      accept: () => {
        this.loading = true;
        this.apiserv.deleteDescuento(id).subscribe({
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

  getData()
{
  this.apiserv.getDescuentos().subscribe({
    next: data => {
       this.elementosfiltrados =data;
     this.loading = false; 
     this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

addDescuento()
{
  this.loading = true;
  this.apiserv.addDescuento(this.proveedorsel!).subscribe({
    next: data => {
      this.showMessage('success',"Success","Guardado correctamente");
      this.getData();
     this.loading = false; 
     this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}
 

}
