import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { ApiService } from '../../../../Services/api.service';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CalendarioTemporal } from '../../../../Interfaces/Calendario';

@Component({
  selector: 'app-temporales',
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
  templateUrl: './Temporales.component.html',
})
export default class TemporalesComponent{
  public foundData:boolean = true;
  public loading:boolean = true; 
  public modalAgregar:boolean = false; 
  public registrosseleccionados:number[] = []; 
  public elementosfiltrados: CalendarioTemporal[] = []; 

  public filtroUSer:number = -1; 
  public filtroProv:number = -1;


  constructor(public apiserv:ApiService,private messageService: MessageService,public cdr:ChangeDetectorRef,
    private confirmationService: ConfirmationService)
  {
      this.getcalendarios(); 
  }

  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}
  ngOnInit(): void { }


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
        this.apiserv.deleteCalendariosTemporales(JSON.stringify(this.registrosseleccionados)).subscribe({
          next: data => {
            this.getcalendarios(); 
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

  getcalendarios()
{
  this.apiserv.getCalendariosTemporales().subscribe({
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
 

}
