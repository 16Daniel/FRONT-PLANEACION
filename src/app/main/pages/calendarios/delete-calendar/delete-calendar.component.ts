import { CommonModule } from '@angular/common';
import { Component,ChangeDetectorRef  } from '@angular/core';
import { Sucursal } from '../../../../Interfaces/Sucursal';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ApiService } from '../../../../Services/api.service';
import { Proveedor } from '../../../../Interfaces/Proveedor';
import { SkeletonModule } from 'primeng/skeleton';
import { Consumo } from '../../../../Interfaces/Consumo';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Dialog, DialogModule } from 'primeng/dialog';
import { Calendario, CalendarioUpdate } from '../../../../Interfaces/Calendario';
import { Router } from '@angular/router';
import { Item } from '../../../../Interfaces/Item';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-delete-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RadioButtonModule,
    SkeletonModule,
    ToastModule,
    DialogModule,
    MultiSelectModule,
    DropdownModule
  ],
  providers:[MessageService],
  templateUrl: './delete-calendar.component.html',
  styles: ``,
})
export default class DeleteCalendarComponent {
  public catsucursales:Sucursal[] = [];
  public catproveedores:Proveedor[] = [];
  public consumos:Consumo[] = []; 

  public sucursal:number | undefined; 
  public articulo:any; 
  public semanas:number | undefined = 4; 

  public typedata:number = 1; 

  public arr_semana:number[] = [];
  public arr_pedidos:number[][] = [];

  public proveedorsel:number | undefined; 
  public loading:boolean= true;
  public sucursalesseleccionadas:number[] = []; 
  public errorsave:boolean=false; 
  public shadowModal:boolean = true; 
  public resultados:boolean = false;
  public calendarios:Calendario[] = []; 
  public calendariosupdate:CalendarioUpdate[] = [];  
  public calendariosselccionados:CalendarioUpdate[] = [];  
  public provseleccionado:boolean = false; 

  public catitems:Item[] = []; 
  public selecteditems:Item[] = []; 
  public especial:boolean = false; 
  public temporal:boolean = false; 
  public regsel:CalendarioUpdate|undefined; 


  constructor(public apiserv:ApiService,private messageService: MessageService,public cdr:ChangeDetectorRef,public router:Router)
  {
    this.getProveedores();
    this.getSucursales(); 
  }

  ngOnInit(): void 
  {
    this.newarrsemana(); 
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

         for (let index = 0; index < this.catsucursales.length; index++) {
            this.sucursalesseleccionadas.push(0);
         }

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


async save(id:number):Promise<void>
{
return new Promise<void>((resolve, reject) => {
  this.apiserv.deleteCalendar(id).subscribe({
      next: (data) => {
          resolve(); // Resuelve la promesa
      },
      error: (error) => {
          console.log(error);
          this.errorsave = true;
          this.showMessage('error',"Error","Error al procesar la solicitud");
           this.loading=false; 
          reject(error); 
      }
  });
});


}

 async saveAll():Promise<void>
{
  
  if(this.proveedorsel == undefined || this.proveedorsel==null)
  {
    this.showMessage('error','Error',"Seleccione un proveedor");
    return;
  }

  if(this.arr_pedidos.length== 0)
  {
    this.showMessage('error','Error','El calendario de pedidos no puede estar vacío');
    return;
  }

  const contieneUno = this.arr_pedidos.some(arr => arr.includes(1));
  if(!contieneUno)
  {
    this.showMessage('error','Error','El calendario debe tener marcado mínimo un día de pedido');
      return;
  }

  if(this.calendariosselccionados.length==0)
    {
      this.showMessage('error','Error','Seleccionar uno o más calendarios para actualizar');
        return;
    }

  this.loading = true; 

  for(let item of this.calendariosselccionados)
    {
      await this.save(item.id);
    }

  if(this.errorsave)
  {
    this.showMessage('error',"Error","Error al procesar la solicitud");
    this.loading=false; 
  } else
  {
this.calendariosselccionados=[]; 
    this.arr_pedidos = [];
    this.newarrsemana(); 
    this.loading=false; 
    this.getCalendarios();
    this.getProveedores();
    this.showMessage('success','Success','Eliminado(s) correctamente');
  }

}

next()
{
  if(this.proveedorsel==undefined || this.proveedorsel == null)
  {
    this.showMessage('info','Error','Seleccione un proveedor');
    return; 
  }
  this.provseleccionado =true;
  this.shadowModal= false;
  this.getCalendarios();
}

getCalendarios()
{
  this.apiserv.getCalendariosProv(this.proveedorsel!).subscribe({
    next: data => {
      debugger
       this.calendarios=data;
       if(this.calendarios.length==0)
       {
        this.loading =false;
        this.resultados =false; 
        return; 
       }

       this.calendariosupdate = []; 
       for(let item of this.calendarios)
        {
          let nomsuc = ""; 
          let sucursal = this.catsucursales.filter(x=> x.cod == item.codsucursal); 
          nomsuc = sucursal.length>0 ? sucursal[0].name:""; 
          let strtemporal = item.temporal == true ? ' - TEMPORAL':''
          this.calendariosupdate.push({id:item.id,nombresuc: item.id +' - '+nomsuc+strtemporal});
        }

      this.regsel = this.calendariosupdate[0]; 
       this.arr_pedidos = JSON.parse(this.calendarios[0].jdata);
       this.especial = this.calendarios[0].especial; 
       this.temporal = this.calendarios[0].temporal; 

       let ids:number[]=[];
       for(let item of this.calendarios)
       {
          ids.push(item.codsucursal);
       }

       let sucursalfiltradas = this.catsucursales.filter((sucursal) => {
        return ids.includes(sucursal.cod)
      });
      this.catsucursales = sucursalfiltradas; 

     if(this.calendarios.length>0)
     {
      this.resultados = true; 
     }
     this.loading = false;

     this.getItemsprovp(this.proveedorsel!);
     
     this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

reloadComponent() {
  const currentUrl = this.router.url;
  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  this.router.onSameUrlNavigation = 'reload';
  this.router.navigate([currentUrl]);
}


changeCalendar()
{
  let objCalendar:Calendario[] = this.calendarios.filter(x => x.id == this.regsel!.id);
  this.especial = objCalendar[0].especial; 
  this.temporal = objCalendar[0].temporal; 
  this.arr_pedidos = JSON.parse(objCalendar[0].jdata);
 this.getItemsSel(objCalendar[0].id);
}

getItemsSel(idc:number)
{
  this.apiserv.getItemsCal(idc).subscribe({
    next: data => {
      this.selecteditems = []; 
       this.selecteditems=data;
       this.loading = false; 
       console.log(this.catitems);
       console.log(data);
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

getItemsprovp(idp:number)
{
  this.apiserv.getItemprovp(idp).subscribe({
    next: data => {
       this.catitems=data;
       this.loading = false; 
       this.getItemsSel(this.calendarios[0].id);
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

}
