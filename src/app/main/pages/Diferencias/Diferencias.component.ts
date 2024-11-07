import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { Diferencia } from '../../../Interfaces/Diferencia';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-diferencias',
  standalone: true,
  imports: [
    CommonModule,
    MultiSelectModule,
    ToastModule,
    FormsModule,
    CalendarModule,
    TableModule,
    DialogModule
  ],
  providers:[MessageService],
  templateUrl: './Diferencias.component.html',
})
export default class DiferenciasComponent implements OnInit {
  public arr_data:Diferencia[] = []; 
  public catsucursales:Sucursal[] = [];
  public sucursalesSel:Sucursal[] = [];
  public loading:boolean = false; 
  public loading2:boolean = false; 
  
  public fechaini:Date = new Date(); 
  public fechafin:Date = new Date(); 

  public fmermas:number = 0;
  public finventario:number = 0; 
  public itemsel:Diferencia | undefined; 
  public showEdit:boolean = false; 

  public mermasitem:any[] = []; 
  public itemInv:any; 

  ngOnInit(): void { }


  constructor(private messageService: MessageService,public cdr:ChangeDetectorRef, public apiserv:ApiService)
  {

    this.getdata();
  }
  
  
  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det }); 
}

getdata()
{
  this.loading= true;
     this.apiserv.getDiferencias(this.fechaini).subscribe({
      next: data => {
         this.arr_data = data; 
         this.loading = false;
         console.log(this.arr_data);
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.loading = false;
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
}

  getSucursales()
  {
    this.loading= true;
     this.apiserv.getSucursales().subscribe({
      next: data => {
         this.catsucursales=data;
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


  getPreviousSunday(date: Date): Date {
    const dayOfWeek = date.getDay(); // 0 es domingo
    const diff = dayOfWeek === 0 ? 0 : dayOfWeek; // Si es domingo, no retrocede
    const previousSunday = new Date(date);
    previousSunday.setDate(date.getDate() - diff); // Restar los días necesarios para llegar al domingo
    return previousSunday;
  }
  
  getNextSaturday(date: Date): Date {
    const dayOfWeek = date.getDay(); // 6 es sábado
    const diff = dayOfWeek === 6 ? 0 : 6 - dayOfWeek; // Si es sábado, no avanza
    const nextSaturday = new Date(date);
    nextSaturday.setDate(date.getDate() + diff); // Sumar los días necesarios para llegar al sábado
    return nextSaturday;
  }
  
  
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  

  limpiardata()
  {
    this.arr_data = []; 
  }
  
editarlinea(item:Diferencia)
{
  this.showEdit = true; 
  if(isNaN(parseFloat(item.invHoy)))
    {
      this.finventario = 0; 
    } else
    {
      this.finventario = parseFloat(item.invHoy);
    }
  let mermas:number = item.mermasayer == undefined ? 0 : item.mermasayer
  this.fmermas = mermas;
  this.itemsel = item; 

this.apiserv.getLineaInv(this.fechaini,item.cod,item.codart).subscribe({
  next: data => {
    this.itemInv = data; 
    console.log("inv", data); 
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

updateinv()
{
  if(this.itemsel?.invHoy == "SIN CAPTURA")
    {
      this.loading2= true;
      this.apiserv.addInv(this.itemsel.cod,this.finventario,this.itemsel.codart,this.fechaini).subscribe({
       next: data => {
         
          this.showMessage('success',"Success","Actualizado correctamente");
          
          this.apiserv.getDiferenciaLin(this.fechaini,this.itemsel!.cod,this.itemsel!.codart).subscribe({
            next: data => {

              let itemf = this.arr_data.filter(x => x.cod == this.itemsel!.cod && x.codart == this.itemsel!.codart);
              itemf[0].invHoy = this.finventario.toString();
              itemf[0].diferencia = data[0].diferencia

              this.loading2 = false;
              this.showEdit = false; 

               this.cdr.detectChanges();
            },
            error: error => {
               console.log(error);
               this.loading2 = false;
               this.showMessage('error',"Error","Error al procesar la solicitud");
            }
         });


          this.cdr.detectChanges();
       },
       error: error => {
          console.log(error);
          this.showEdit = false; 
          this.loading2 = false;
          this.showMessage('error',"Error","Error al procesar la solicitud");
       }
   });
    } else
    {
      this.loading2= true;
      this.apiserv.UpdateInv(this.itemInv.id,this.finventario).subscribe({
       next: data => {


        this.apiserv.getDiferenciaLin(this.fechaini,this.itemsel!.cod,this.itemsel!.codart).subscribe({
          next: data => {

            let itemf = this.arr_data.filter(x => x.cod == this.itemsel!.cod && x.codart == this.itemsel!.codart);
            itemf[0].invHoy = this.finventario.toString();
            itemf[0].diferencia = data[0].diferencia
             
            this.loading = false;
            this.showEdit = false; 
             this.cdr.detectChanges();
          },
          error: error => {
             console.log(error);
             this.loading2 = false;
             this.showMessage('error',"Error","Error al procesar la solicitud");
          }
       });


          this.showMessage('success',"Success","Actualizado correctamente");
          this.cdr.detectChanges();
       },
       error: error => {
          console.log(error);
          this.loading2 = false;
          this.showEdit = false; 
          this.showMessage('error',"Error","Error al procesar la solicitud");
       }
   });
    }

}

updatemermas()
{
  this.loading2= true;
      this.apiserv.updatemermas(this.itemsel!.cod,this.itemsel!.mermasayer!,this.fmermas,this.itemsel!.codart,this.fechaini).subscribe({
       next: data => {

        this.apiserv.getDiferenciaLin(this.fechaini,this.itemsel!.cod,this.itemsel!.codart).subscribe({
          next: data => {

            let itemf = this.arr_data.filter(x => x.cod == this.itemsel!.cod && x.codart == this.itemsel!.codart);
            itemf[0].mermasayer = this.fmermas;
            itemf[0].diferencia = data[0].diferencia
            itemf[0].invFormula = data[0].invFormula; 
             
            this.loading2 = false;
            this.showEdit = false; 
             this.cdr.detectChanges();
          },
          error: error => {
             console.log(error);
             this.loading2 = false;
             this.showMessage('error',"Error","Error al procesar la solicitud");
          }
       });
          this.showMessage('success',"Success","Actualizado correctamente");
          this.cdr.detectChanges();
       },
       error: error => {
          console.log(error);
          this.loading2 = false;
          this.showEdit = false; 
          this.showMessage('error',"Error","Error al procesar la solicitud");
       }
   });
}

getBG(value:number):string
{
  let bgcolor = '#fff'; 

  if(value>-16 && value<16)
    {
      bgcolor = '#a7ff77';
    }

    if(value>15)
      {
        bgcolor = '#fffd6b';
      }

    if(value<-15)
      {
        bgcolor = '#ff7777';
      }
 return bgcolor; 
}

}
