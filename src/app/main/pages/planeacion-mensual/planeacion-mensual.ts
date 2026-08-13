import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from "primeng/multiselect";
import { Item, ItemInvSem } from '../../../Interfaces/Item';
import { FormsModule } from '@angular/forms';
import { TableModule } from "primeng/table";
import { ApiService } from '../../../Services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from 'primeng/dropdown';
import { GrupoPedido, ResultadoPedidoMensual, ResultadoPedidoMensualGrupo } from '../../../Interfaces/PlaneacionMensual.ts';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-planeacion-mensual',
  standalone: true,
  imports: [CommonModule, DialogModule, MultiSelectModule, 
    FormsModule, TableModule, ToastModule, ConfirmDialogModule,DropdownModule,CalendarModule,
  TabViewModule],
  providers:[MessageService,ConfirmationService],
  templateUrl: './planeacion-mensual.html',
  styleUrl: './planeacion-mensual.scss',
})
export default class PlaneacionMensual implements OnInit {
  public loading:boolean = false; 
  modalarticulos:boolean = false; 
  public catitems:Item[] = [];
  public catitemsbd:ItemInvSem[] = [];
  public selecteditem:Item|undefined;
  public arr_eliminar:number[] = []; 
  public parametros:any; 
  public proveedoresArt:any[] = []; 
  public proveedoresbd:any[] = []; 
  public selectedProv:any; 
  public listaResultados:ResultadoPedidoMensualGrupo[] = []; 
  public listaResultadosH:ResultadoPedidoMensualGrupo[] = []; 
  public itemdetalles:ResultadoPedidoMensualGrupo|undefined; 
  public formp1:number= 0;
  public formp2:number= 0;
  public formp3:number= 0;
  public formp4:number= 0;
  public detallesart:ResultadoPedidoMensual[] = []; 
  public arr_division_ped:any[] = []; 
  public formdivProv:any; 
  public formNumDivision:number = 0; 
  public modalDetalles:boolean = false; 
  public formFechaentrega:Date = new Date();
  public formHfi:Date = new Date(); 
  public formHff:Date = new Date(); 
   
  grupos: { [key: string]: ResultadoPedidoMensual[] } = {};
  clavesGrupo: string[] = []; // ahora es string[]

   showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

   constructor(public apiserv:ApiService,private messageService: MessageService,public cdr:ChangeDetectorRef,private confirmationService: ConfirmationService)
    {
    }
  ngOnInit(): void { this.getItems(); this.getParametros(); this.getpedidosBD(); this.getProveedoresBD();}

  abrirModal()
  {
    this.modalarticulos = true; 
  }

    getItems()
{ 
  this.loading = true; 
  this.apiserv.getItemsPlaneacionMensual().subscribe({
    next: data => {
       this.catitems=data;
       this.loading = false;
       this.getItemsbd(); 
    },
    error: error => {
       console.log(error);
       this.loading = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}


    getpedidosBD()
{ 
  this.loading = true; 
  this.apiserv.getPedidosBD().subscribe({
    next: data => {
       this.listaResultados = data; 
       console.log(data); 
       this.loading = false;
       this.getItemsbd(); 
    },
    error: error => {
       console.log(error);
       this.loading = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

    getpedidosBDH()
{ 
  this.loading = true; 
  this.apiserv.getPedidosBDH(this.formHfi,this.formHff).subscribe({
    next: data => {
       this.listaResultadosH = data; 
       this.loading = false;
       this.getItemsbd(); 
    },
    error: error => {
       console.log(error);
       this.loading = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

    generarPedidos()
{ 
  this.loading = true; 
  this.apiserv.generarpedidosmensuales().subscribe({
    next: data => {
       this.getpedidosBD(); 
       this.getItemsbd(); 
    },
    error: error => {
       console.log(error);
       this.loading = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}


   getParametros()
{ 
  this.loading = true; 
  this.apiserv.getParametrosPlaneacionMensual().subscribe({
    next: data => {
       this.parametros=data;
       if(this.parametros != undefined && this.parametros != null)
        {
          this.formp1 = this.parametros.tiempoDeEntrega; 
          this.formp2 = this.parametros.periodoDeRevision;
          this.formp3 = this.parametros.nivelDeServicio;
          this.formp4 = this.parametros.mesesConDatos; 
        }
       console.log(this.parametros); 
       if(this.parametros.dataDivisionPedidos != null)
        {
             this.arr_division_ped = JSON.parse(this.parametros.dataDivisionPedidos); 
        }
       this.loading = false; 
    },
    error: error => {
       console.log(error);
       this.loading = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}
   getProveedoresArt()
{ 
  this.proveedoresArt = []; 
  this.loading = true; 
  this.apiserv.getProveedoresArt(this.selecteditem!.cod).subscribe({
    next: data => {
       this.proveedoresArt = data; 
       this.loading = false; 
    },
    error: error => {
       console.log(error);
       this.loading = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

   getProveedoresBD()
{ 
  this.proveedoresArt = []; 
  this.loading = true; 
  this.apiserv.getProveedoresBD().subscribe({
    next: data => {
       this.proveedoresbd = data; 
       this.loading = false; 
    },
    error: error => {
       console.log(error);
       this.loading = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}


  getItemsbd()
{ 
  this.loading = true; 
  this.apiserv.getItemsbdPlaneacionMensual().subscribe({
    next: data => {
       this.catitemsbd=data;
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

  agregarArticulos()
  {
        this.loading = true; 
          let articulos:number[] = [];
          
          articulos.push(this.selecteditem!.cod); 
          this.apiserv.agregarArticulosPlanecionMensual(JSON.stringify(articulos),this.selectedProv.codprov).subscribe({
            next: data => {
              this.selecteditem = undefined; 
              this.selectedProv = undefined; 
              this.showMessage('success',"Success","Artículos agregados correctamente");
              this.getItemsbd(); 
              this.cdr.detectChanges();
            },
            error: error => {
              console.log(error);
              this.loading = false; 
              this.showMessage('error',"Error","Error al procesar la solicitud");
            }
        });
  }

actualizarArrayEliminar(codArt:number)
{
   if(this.arr_eliminar.filter(x=>x == codArt).length>0)
      {
         this.arr_eliminar = this.arr_eliminar.filter(x=> x != codArt); 
      }else
         {
            this.arr_eliminar.push(codArt); 
         }
}

guardarParametros()
{
  let datadivision = JSON.stringify(this.arr_division_ped); 
      this.apiserv.guardarParametrosPlanecionMensual(this.formp1,this.formp2,this.formp3,this.formp4,datadivision).subscribe({
            next: data => { 
              this.showMessage('success',"Success","Guardado correctamente");
              this.getItemsbd(); 
              this.cdr.detectChanges();
            },
            error: error => {
              console.log(error);
              this.loading = false; 
              this.showMessage('error',"Error","Error al procesar la solicitud");
            }
        });
}

eliminarArticulos()
{
  
  this.loading = true; 
   this.apiserv.eliminarArticulosPlaneacionMensual(JSON.stringify(this.arr_eliminar)).subscribe({
    next: data => {
       this.showMessage('success',"Success","Eliminado correctamente");
       this.arr_eliminar = []; 
       this.getItemsbd(); 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.loading = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

  confirm2() {
        this.confirmationService.confirm({
            message: '¿Esta segur@ que desea eliminar '+this.arr_eliminar.length+' artículo(s)?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass:"p-button-danger p-button-text",
            rejectButtonStyleClass:"p-button-text p-button-text",
            acceptIcon:"none",
            rejectIcon:"none",

            accept: () => {
               console.log(this.arr_eliminar); 
               this.eliminarArticulos()
            },
            reject: () => {
               
            }
        });
    }

    getnombreSucursal(item:ResultadoPedidoMensualGrupo):string
    {
      return item.items[0].ubicacion; 
    }

    getNombreProv(item:ResultadoPedidoMensualGrupo):string
    {
      return item.items[0].nombreprov; 
    }

    verDetallesPedido(item:ResultadoPedidoMensualGrupo)
    {
      this.itemdetalles = item; 

     this.grupos = this.itemdetalles.items.reduce((acc, item) => {
      // Si numpedidolin es null/undefined, usar 'Sin número'
      const clave = item.numpedidoLin != null ? item.numpedidoLin.toString() : 'Sin número';
      if (!acc[clave]) {
        acc[clave] = [];
      }
      acc[clave].push(item);
      return acc;
    }, {} as { [key: string]: ResultadoPedidoMensual[] });

    // claves ordenadas alfabéticamente (puedes personalizar el orden)
    this.clavesGrupo = Object.keys(this.grupos).sort((a, b) => {
      // Si ambas son números, ordenar numéricamente
      const aNum = Number(a);
      const bNum = Number(b);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      return a.localeCompare(b);
    });

      this.modalDetalles = true; 
      this.cdr.detectChanges(); 
      
    }

    getToatalPedido(item:ResultadoPedidoMensualGrupo):number
    {
      let total = 0;
      for(let art of item.items)
        {
          let total_item = ((art.pedidoSugerido*art.udscaja)*art.precio);
          total = total + total_item; 
        } 
      return total; 
    }

       onRowSelect(event: any) {
        this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: event.data.ubicacion });
    }

    onRowUnselect(event: any) {
        this.messageService.add({ severity: 'info', summary: 'Product Unselected', detail: event.data.precio });
    }

    verdetallesart(item:ResultadoPedidoMensual)
    {
      this.detallesart = []; 
      this.detallesart.push(item); 
    }

    onHide()
    {
      this.detallesart = []; 
    }

    agregarDivisionPed()
    {
      this.arr_division_ped.push(
        {
          codprov:this.formdivProv.codprov,
          nomprov: this.formdivProv.nombreprov,
          division: this.formNumDivision
        }); 
    }

    eliminarItemDiv(index:number)
    {
         this.arr_division_ped.splice(index, 1);
    }


    confirmar(nump:string)
    {
         this.confirmationService.confirm({
      header: 'Confirmación',
      message: `¿Está seguro que desea cargar el pedido?`,
      acceptLabel: 'Aceptar', 
      rejectLabel: 'Cancelar', 
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      acceptButtonStyleClass: 'btn bg-p-b p-3',
      rejectButtonStyleClass: 'btn btn-light me-3 p-3',

      accept: () => {
        this.confirmarPedido(parseInt(nump));
      },
      reject: () => { },
    });

    }
    
    confirmarPedido(nump:number)
{
       this.loading = true;
      this.apiserv.confirmarPedido(this.itemdetalles!.id,nump,this.formFechaentrega).subscribe({
            next: data => { 
              this.showMessage('success',"Success","ENVIADO CORRECTAMENTE");
              this.loading = false;
              this.getpedidosBD(); 
              this.modalDetalles = false; 
              this.itemdetalles = undefined; 
            },
            error: error => {
              console.log(error);
              this.loading = false; 
              this.showMessage('error',"Error","Error al procesar la solicitud");
            }
        });
}

pedidoPoraceptar(numpedido:string):boolean
{
  let val = true;
  let numpedidolin = parseInt(numpedido); 
  let temp = this.itemdetalles!.items.filter(x=>x.numpedidoLin == numpedidolin); 
  if(temp[0].numpedido != '' && temp[0].numpedido != null && temp[0].numpedido != undefined ) 
    {
      val = false; 
    }
  return val; 
}

getTotalPedido(numpedido:string):number
{
  let nump:number = parseInt(numpedido); 
  let items = this.itemdetalles!.items.filter(x=>x.numpedidoLin == nump); 
  let total = 0;
  for(let i of items)
    {
      total = total + (i.pedidoSugerido * i.udscaja * i.precio); 
    }
  return total; 
}

}
