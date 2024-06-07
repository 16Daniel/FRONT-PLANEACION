import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { Component,ChangeDetectorRef  } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../../Services/api.service';
import { DiasEspecial } from '../../../../Interfaces/DiasEspecial';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-dias-especiales',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonModule,
    DialogModule,
    ToastModule,
    CalendarModule,
    FormsModule,
    ConfirmDialogModule
  ],
  providers:[MessageService,ConfirmationService],
  templateUrl: './dias-especiales.component.html',
  styles: ``,
})
export default class DiasEspecialesComponent{
public foundData:boolean = true;
public loading:boolean = true; 
modalAgregar:boolean = false; 

public formDate:Date | undefined;
public formDia:number | undefined;
public formsemana:number | undefined;
public formdDescripcion:string | undefined;
public formFactor:number = 1.5;

public diasespeciales:DiasEspecial[] = []
public es:any; 
public actualizar:boolean = false; 
public diasespecialsel:DiasEspecial | undefined; 


constructor(public apiserv:ApiService,private messageService: MessageService,public cdr:ChangeDetectorRef, private config: PrimeNGConfig,
  private confirmationService: ConfirmationService)
{
  this.getDiasespeciales(); 
}
  ngOnInit(): void
   {
    this.es = {
      closeText: "Cerrar",
      prevText: "<Ant",
      nextText: "Sig>",
      currentText: "Hoy",
      monthNames: [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
      ],
      monthNamesShort: [
        "ene", "feb", "mar", "abr", "may", "jun",
        "jul", "ago", "sep", "oct", "nov", "dic"
      ],
      dayNames: [
        "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"
      ],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      weekHeader: "Sm",
      dateFormat: "dd/mm/yy",
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
    }; 

    this.config.setTranslation({
      monthNames: [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ],
      monthNamesShort: [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
      ],
      dayNames: [
        "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
      ],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      dayNamesMin: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      weekHeader: "Sem",
  });

    }

  getDiasespeciales()
  {
    this.apiserv.getDiasEspeciales().subscribe({
      next: data => {
         this.diasespeciales=data;
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


  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

showAgregar()
{
  this.actualizar=false;
  this.modalAgregar = true; 
}

// Función para obtener el día del año
 obtenerDiaDelAño(fecha: Date | undefined) {
  const comienzoDeAño = new Date(fecha!.getFullYear(), 0, 0);
  const diferencia = fecha!.getTime() - comienzoDeAño.getTime();
  const unDiaEnMilisegundos = 1000 * 60 * 60 * 24;
  this.formDia = Math.floor(diferencia / unDiaEnMilisegundos);
}

// Función para obtener la semana del año
 obtenerSemanaDelAño(fecha: Date | undefined) {
  const comienzoDeAño = new Date(fecha!.getFullYear(), 0, 0);
  const diferencia = fecha!.getTime() - comienzoDeAño.getTime();
  const unaSemanaEnMilisegundos = 1000 * 60 * 60 * 24 * 7;
  this.formsemana = Math.floor(diferencia / unaSemanaEnMilisegundos);
}

clickCalendar()
{
  this.obtenerDiaDelAño(this.formDate);
  this.obtenerSemanaDelAño(this.formDate);
}

saveData()
{  
  if(this.formDate == undefined)
  {
    this.showMessage('info',"Info","Favor de seleccionar una fecha");
    return;
  }
  if(this.formdDescripcion == undefined)
  {
    this.showMessage('info',"Info","Favor de ingresar una descripción");
    return
  }
  if(this.formFactor == undefined)
  {
    this.showMessage('info',"Info","Favor de ingresar un factor de consumo");
    return;
  }
  this.modalAgregar = false; 
  this.loading = true; 
  const data =
  {
  dia: this.formDia,
  semana: this.formsemana,
  fecha: this.formDate,
  descripcion: this.formdDescripcion,
  factorConsumo: this.formFactor

  };
  this.apiserv.createDiaEspecial(data).subscribe({
    next: data => {
       this.getDiasespeciales(); 
       this.loading = false;        
     this.showMessage('success',"Success","Guardado correctamente");
    },
    error: error => {
      this.modalAgregar=true;
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

} 

deleteDia(id:number)
{
 this.loading = true; 
  this.apiserv.deleteDiaEspecial(id).subscribe({
    next: data => {
       this.getDiasespeciales(); 
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

confirm(id:number) {
  this.confirmationService.confirm({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar?',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      acceptButtonStyleClass:"btn bg-p-b p-3",
      rejectButtonStyleClass:"btn btn-light me-3 p-3",
      accept: () => {
          this.deleteDia(id);
      },
      reject: () => {
          
      }
  });
}

showEdit(data:DiasEspecial)
{ 
  this.formDate = data.fecha;
  this.formDia = data.dia;
  this.formFactor = data.factorConsumo;
  this.formsemana = data.semana
  this.formdDescripcion = data.descripcion; 
  this.actualizar=true;
  this.modalAgregar = true;
  this.diasespecialsel = data;
}
updateData()
{ 
  const data:DiasEspecial =
  {
    id: this.diasespecialsel!.id,
    dia: this.formDia!,
    semana: this.formsemana!,
    fecha: this.formDate!,
    descripcion: this.formdDescripcion!,
    factorConsumo: this.formFactor

  };
  this.loading = true; 
  this.apiserv.updateDiaEspecial(data).subscribe({
    next: data => {
       this.getDiasespeciales(); 
       this.loading = false;        
       this.modalAgregar = false; 
     this.showMessage('success',"Success","Actualizado correctamente");
    },
    error: error => {
      this.loading = false; 
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}


}
