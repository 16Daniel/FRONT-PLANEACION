import { CommonModule,DatePipe } from '@angular/common';
import { Component,ChangeDetectorRef } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ApiService } from '../../../Services/api.service';
import { Proveedor } from '../../../Interfaces/Proveedor';
import { SkeletonModule } from 'primeng/skeleton';
import { Item } from '../../../Interfaces/Item';
import { Consumo } from '../../../Interfaces/Consumo';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { respuestaDiaEspecial } from '../../../Interfaces/DiasEspecial';
import { TooltipModule } from 'primeng/tooltip';
import { Calendario } from '../../../Interfaces/Calendario';
import { Inventario } from '../../../Interfaces/inventario';
import { addDays } from 'date-fns';
import { Parametro } from '../../../Interfaces/Parametro';

@Component({
  selector: 'app-calendarizacion-pedidos',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    RadioButtonModule,
    SkeletonModule,
    ToastModule,
    TagModule,
    TooltipModule
  ],
  providers:[MessageService,DatePipe],
  templateUrl: './calendarizacion-pedidos.component.html',
  styleUrl: './calendarizacion-pedidos.component.css',
})
export default class CalendarizacionPedidosComponent {
  public catsucursales:Sucursal[] = [];
  public catproveedores:Proveedor[] = [];
  public catitems:Item[] = [];
  public consumos:Consumo[] = [];
  public consumoscalculados:respuestaDiaEspecial[] =[]; 
  public nombredias:string[] = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  public sucursal:any; 
  public articulo:any; 
  public semanas:number | undefined = 5; 
  public typedata:number = 1; 
  public arr_semana:any = [];
  public arr_pedidos:any = [];
  public proveedorsel:number | undefined; 
  public loading:boolean= true;
  public numsemanas:number[] = []; 
  public semanasel:number=0; 
  public diasdelasemana:Date[] = []; 
  public year:number = new Date().getFullYear(); 
  public calendario:Calendario |undefined;
  public factorseguridad:number =1.5; 
  public mayorconsumosemana:number = 0; 
  public consumoscalendario:number[]=[]; 
  public inventarios:Inventario[] = []; 
  public proyecciones:number[] =[0,0,0,0,0,0,0]; 
  public parametros: Parametro | undefined; 

  constructor(public apiserv:ApiService, public cdr:ChangeDetectorRef,private messageService: MessageService,private datePipe: DatePipe)
  {
    this.getSucursales();
    this.getProveedores();
    this.getItemsProv();
  }

  ngOnInit(): void 
  {
    this.newarrsemana(); 


    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24; // Milisegundos en un día
    const dayOfYear = Math.floor(diff / oneDay);
    let numsemanasv:number = 0; 
    if((dayOfYear/7)%7==0)
    {
      numsemanasv = dayOfYear/7;
    } else
    {
      numsemanasv = Math.floor(dayOfYear/7);
      numsemanasv++;
    }
  
    for(let i=1;i<=numsemanasv;i++)
    {
      this.numsemanas.push(i);
    }  
    this.semanasel = this.numsemanas.length;

    this.changeweek();

  }  


   getDatesOfWeekByWeekNumber(year: number, weekNumber: number): Date[] {
    // const januaryFirst = new Date(year, 0, 1);
    // const daysToFirst = (weekNumber - 1) * 7;
    // januaryFirst.setDate(januaryFirst.getDate() + daysToFirst);

    // const firstDayOfWeek = new Date(januaryFirst);
    // firstDayOfWeek.setDate(januaryFirst.getDate() - januaryFirst.getDay());

     const datesOfWeek: Date[] = [];
    // for (let i = 0; i < 7; i++) {
    //     const currentDate = new Date(firstDayOfWeek);
    //     currentDate.setDate(firstDayOfWeek.getDate() + i);
    //     datesOfWeek.push(currentDate);
    // }

    let primerlunes:Date = this.firstMondayOfYear(year); 
   let fechaini:Date = addDays(primerlunes,-1) ;
   let fechaini2:Date = new Date(); 
  if(this.semanasel >1)
  {
     let incremento = (this.semanasel-1)*7;
     fechaini2 = addDays(fechaini,incremento);
  }

  for(let i = 0; i < 7; i++)
  {
    datesOfWeek.push(addDays(fechaini2,i))
  }

    return datesOfWeek;
}

firstMondayOfYear(year: number): Date {
  const firstDayOfMonth = new Date(year, 0, 1);
  const dayOfWeek = firstDayOfMonth.getDay(); // Domingo es 0, Lunes es 1, ..., Sábado es 6
  let daysToAdd = 0;
  if (dayOfWeek !== 1) { // Si no es Lunes
    daysToAdd = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // Calcular los días para llegar al primer Lunes
  }
  return new Date(year, 0, 1 + daysToAdd);
}

  newarrsemana()
  {
    this.arr_semana = [0,0,0,0,0,0];
    this.arr_pedidos.push(this.arr_semana);
  }

  setPedido(index:number,dia:number)
  {
    this.arr_pedidos[index][dia] = 1;
  }

  setConsumo(index:number,dia:number)
  {
    this.arr_pedidos[index][dia] = 2;
  }

  setEmpty(index:number,dia:number)
  {
    this.arr_pedidos[index][dia] = 0;
  }

  marcar(index:number,dia:number)
  {
    if(this.typedata==1)
    {
      this.setPedido(index,dia); 
    }else
    {
      this.setConsumo(index,dia);
    }

    if(this.typedata==2)
    {
      this.setConsumo(index,dia);
    }

    if(this.typedata==0)
    {
        this.setEmpty(index,dia);
    }
  }

  deletearr(index:number)
  {
    this.arr_pedidos.splice(index,1);
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

  getProveedores()
  {
     this.apiserv.getProveedores().subscribe({
      next: data => {
         this.catproveedores=data;
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
         this.loading = false; 
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });

  }


  getConsumoPromedio()
  {
    if(this.sucursal == undefined || this.sucursal==null)
    {
      this.showMessage('error','Error',"Seleccione una sucursal");
      return;
    }
    if(this.articulo == undefined || this.articulo==null)
    {
      this.showMessage('error','Error',"Seleccione un artículo");
      return;
    }
    if(this.semanas == undefined || this.semanas==null)
    {
      this.showMessage('error','Error',"ingrese el número de días de consumo");
      return;
    }
    
    this.loading = true; 
    this.diasdelasemana = this.getDatesOfWeekByWeekNumber(this.year,this.semanasel); 
     this.apiserv.getConsumoPromedio(this.sucursal,this.articulo,this.semanas!,this.datePipe.transform(this.diasdelasemana[0], 'yyyy-MM-dd')!).subscribe({
      next: data => {
         this.consumos=data;
         if(data.length==0)
         { 
          this.consumos =[];
            for(let i=0; i<8; i++)
            {
              let consumo:Consumo = { dia:1, consumo:0};
              this.consumos.push(consumo); 
            } 
         }  
           let datatemp:number[] = []; 
           for(let item of this.consumos)
           {
              datatemp.push(item.consumo);
           }
           this.mayorconsumosemana = Math.max(...datatemp);
         this.loading = false; 
          this.calculartodo();      
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
         this.loading = false;
      }
  });

  }

  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

async calculartodo():Promise<void>
{
  for(let i=0; i<this.consumos.length; i++)
  {
    await this.calcularconsumo(i);           
  } 
  this.getCalendario();  
}
async calcularconsumo(index:number):Promise<void>
{
  const data =
  {
    fecha: this.diasdelasemana[index],
    consumo: this.consumos[index].consumo
  }

return new Promise<void>((resolve, reject) => {
  this.apiserv.esdiaespecial(data).subscribe({
      next: (data) => {
          this.consumoscalculados[index] = data;
          resolve(); // Resuelve la promesa
      },
      error: (error) => {
          console.log(error);
          this.showMessage('error',"Error","Error al procesar la solicitud");
           this.loading=false; 
          reject(error); 
      }
  });
});


}

 getWeekTwoDates(year: number, semana:number): Date[] {
  const weekStart = new Date(year, 0, 1); // January 1st
  weekStart.setDate(weekStart.getDate() + (semana*7)); // Move to the start of week 2

  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(weekStart);
    currentDate.setDate(currentDate.getDate() + i); // Add days to get each date
    weekDates.push(currentDate);
  }

  return weekDates;
}

changeweek()
{
  this.diasdelasemana = this.getDatesOfWeekByWeekNumber(this.year,this.semanasel); 
  this.cdr.detectChanges(); 
}

getCalendario()
{
   this.apiserv.getCalenadrio(this.proveedorsel!,this.sucursal).subscribe({
    next: data => {
      this.calendario=data;
       this.loading =false;
      this.arr_pedidos = JSON.parse(this.calendario.jdata);

      for(let i=0; i< this.arr_pedidos.length; i++)
      {
          let suma:number = 0;
          for(let j=0; j< 7; j++)
          {
            if(this.arr_pedidos[i][j]==3 || this.arr_pedidos[i][j]==2 || this.arr_pedidos[i][j]==1) suma = suma + (this.consumoscalculados[j].consumo); 
          }
          this.consumoscalendario.push(suma);
      }
        this.getInventarios(this.sucursal,this.articulo,this.datePipe.transform(this.diasdelasemana[0], 'yyyy-MM-dd')!,this.datePipe.transform(this.diasdelasemana[6], 'yyyy-MM-dd')!);
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.arr_pedidos = [];
       this.newarrsemana();
    }
});

}

getInventarios(sucursal:number,articulo:number,fechainicio:string,fechafin:string)
{

  this.apiserv.getInventarios(sucursal,articulo,fechainicio,fechafin).subscribe({
    next: data => {
        this.inventarios = data; 
        this.getProy();
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
    }
});

}

getInv(fecha:Date):Number
{
 let fechaS = this.datePipe.transform(fecha, 'yyyy-MM-dd');
 let invf = this.inventarios.filter(i => this.datePipe.transform(i.fecha, 'yyyy-MM-dd') == fechaS);
 if(invf.length>0)
 {
    return invf[0].unidades;
 } else
 {
    return -1; 
 }
}

getProy()
{
  debugger
   for(let p = 0; p<this.arr_pedidos.length; p++)
   {
      for(let i=0; i<7; i++)
      {
        if(this.arr_pedidos[p][i]==1)
        {
          this.proyecciones[i] = (this.consumoscalendario[p])+(this.mayorconsumosemana*this.factorseguridad)-this.inventarios[i].unidades;
        }
      }
   }
   console.log(this.proyecciones);
   this.cdr.detectChanges(); 
}

getParametros()
{
  this.apiserv.getParametros().subscribe({
    next: data => {
      if(data != null)
        { 
          debugger
           this.parametros = data; 
           let obj = JSON.parse(this.parametros.jdata);

           this.semanas = obj.pedido.diasconprom;
           this.factorseguridad = obj.pedido.factorstock; 
        } 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

}






