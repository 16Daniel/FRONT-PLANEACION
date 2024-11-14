import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { PickListModule } from 'primeng/picklist';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { ApiService } from '../../../Services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@Component({
  selector: 'app-inventario-teorico',
  standalone: true,
  imports: [
    CommonModule,
    PickListModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers:[MessageService,ConfirmationService],
  templateUrl: './InventarioTeorico.component.html',
})
export default class InventarioTeoricoComponent implements OnInit {
  public catsucursales:Sucursal[] = [];
  public arr_data:any[] = [];
  public loading:boolean = false; 
  public sucursalsel:Sucursal|undefined; 

  constructor(public apiserv:ApiService,public cdr:ChangeDetectorRef,private messageService: MessageService,private confirmationService: ConfirmationService)
  {
    this.getSucursales(); 
    this.getData();
  }

  ngOnInit(): void { }

  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

  getSucursales()
{
  this.loading = true; 
   this.apiserv.getSucursales().subscribe({
    next: data => {
       this.catsucursales=data;
    },
    error: error => {
      this.loading = false; 
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

getData()
{
  this.loading = true; 
   this.apiserv.getSucursalesInvT().subscribe({
    next: data => {
       this.arr_data=data;
       this.loading = false; 
    },
    error: error => {
      this.loading = false; 
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

deletesuc(id:number)
{

  this.confirmationService.confirm({
    header: 'Confirmación',
    message: '¿Está segur@ que desea eliminar?',
    acceptIcon: 'pi pi-check mr-2',
    rejectIcon: 'pi pi-times mr-2',
    acceptButtonStyleClass:"btn bg-p-b p-3",
    rejectButtonStyleClass:"btn btn-light me-3 p-3",
    accept: () => {
     
      this.loading = true;
      this.apiserv.deletesucursalInvt(id).subscribe({
        next: data => {
           this.loading = false; 
           this.getData(); 
           this.showMessage('success',"Success","Eliminado correctamente");
           this.cdr.detectChanges(); 
        },
        error: error => {
           console.log(error);
           this.loading = false;
           this.showMessage('error',"Error","Error al procesar la solicitud");
        }
    });

    },
    reject: () => {
        
    }
});

 
} 


addSuc()
{
  this.loading = true;
  this.apiserv.addsucursalInvt(this.sucursalsel!.cod).subscribe({
    next: data => {
       this.loading = false; 
       this.getData(); 
       this.showMessage('success',"Success","Agregado correctamente");
       this.cdr.detectChanges(); 
    },
    error: error => {
       console.log(error);
       this.loading = false;
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

}
