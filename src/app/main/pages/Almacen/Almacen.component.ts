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
  public proveedorsel:string = ""; 
  public catitems:Item[] = [];
  public articulo:any; 
  public modalagregar:boolean = false;
  public loading:boolean= false;
  public catsucursales:Sucursal[] = []; 

  public formcapacidad:number = 0; 
  constructor(public apiserv:ApiService, public cdr:ChangeDetectorRef,private messageService: MessageService,private datePipe: DatePipe,private confirmationService: ConfirmationService)
  {

    this.getItemsProv();
    this.getSucursales(); 
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




}
