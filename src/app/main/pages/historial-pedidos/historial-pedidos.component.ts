import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { Proveedor } from '../../../Interfaces/Proveedor';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ConsumoModel, Pedido, PedidoH } from '../../../Interfaces/pedido';
import { ArticuloPedido } from '../../../Interfaces/pedido';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers:[MessageService,DatePipe,ConfirmationService],
  templateUrl: './historial-pedidos.component.html',
})
export default class HistorialPedidosComponent implements OnInit {
  public catsucursales:Sucursal[] = [];
  public catproveedores:Proveedor[] = [];
  public proveedorsel:number = -999; 
  public sucursal:number = -999; 
  public loading:boolean= true;
  public verpedido:boolean = false;
  public pedidos:PedidoH[] = [];
  public pedidosall:PedidoH[] = []; 
  public pedidosel: PedidoH | undefined; 
  public modaladduds:boolean = false; 
  public itemadduds:ArticuloPedido | undefined;
  public itemdetalles:ArticuloPedido | undefined;

  public modelmedida:string | undefined; 
  public modeluds:number | undefined;
  public modaldetallesart:boolean = false; 
  public justificacion:string = "NO SE REALIZO EL INVENTARIO";
  public errorsave:boolean = false;
  public inventariovalue:number = 0;

  public editarinventario:boolean = false; 
  public tieneajustefinal:boolean = false; 
  public filtrofechai:Date | undefined; 
  public filtrofechaf:Date | undefined; 
  constructor(public apiserv:ApiService, public cdr:ChangeDetectorRef,private messageService: MessageService,private datePipe: DatePipe,private confirmationService: ConfirmationService)
  {
    this.getSucursales();
    this.getProveedores();
    this.getPedidos();
  }


  ngOnInit(): void { }

  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

getPedidos()
{
  this.apiserv.getPedidosH().subscribe({
    next: data => {
       this.pedidos = data; 
       this.pedidosall = [...this.pedidos]; 
       this.loading = false; 

       if(this.pedidosel != undefined)
        {
            const temp = this.pedidos.filter(p => p.id = this.pedidosel!.id);
            if(temp.length>0)
              {
                this.pedidosel = temp[0]; 
                if(this.itemdetalles != undefined)
                  {
                    const tempid = this.pedidosel.articulos.filter(i => i.codArticulo == this.itemdetalles?.codArticulo);
                    if(tempid.length>0)
                      {
                        this.itemdetalles = tempid[0]; 
                      }
                  }
              }
        }

       this.cdr.detectChanges();
       console.log(this.pedidos);
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
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
         
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });

  }

  detallesPedido(pedido:PedidoH)
  {
    this.pedidosel = pedido; 
    this.verpedido = true; 
  }
  
  showModalAdduds(item:ArticuloPedido)
  {
    this.modaladduds = true;
    this.itemadduds = item; 
  }

  guardarMedidaUds()
  {  

    if(this.modelmedida == undefined || this.modelmedida == "")
      {
        this.showMessage('info',"Error","Favor de agregar una unidad de medida");
        return
      }

      if(this.modeluds == undefined || this.modeluds == 0)
        {
          this.showMessage('info',"Error","Favor de agregar la cantidad de unidades");
          return
        }
    const data =
    {
      rfc: this.pedidosel?.rfc,
      codarticulo: this.itemadduds?.codArticulo,
      umedida: this.modelmedida.toUpperCase(),
      uds: this.modeluds
    };

    this.apiserv.saveumedida(data).subscribe({
      next: data => {
        this.modaladduds = false
        this.showMessage('success',"Success","Guardado correctamente");
        this.modelmedida = undefined;
        this.modeluds = undefined;
        
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
  }

  showDetallesArt(item:ArticuloPedido)
  {
    this.modaldetallesart = true; 
   this.itemdetalles = item; 
   this.inventariovalue = item.inventariohoy;
   this.getModificacion(item.codArticulo);
  }

  getModificacion(idart:number)
  {
    this.apiserv.getModificacion(this.pedidosel!.id, idart).subscribe({
      next: data => {
        debugger
            if(data != null)
            {
                this.tieneajustefinal = true; 
            }else{ this.tieneajustefinal = false; }
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
  }

  getconsumopedidocad(arraycal:number[],consumos:ConsumoModel[]):string
  {
    let cad = '';  
    for(let i=0; i<arraycal.length; i++)
    {
      if(arraycal[i]>0)
        {  
          if(this.itemdetalles?.diasespeciales[i] != null)
            {
              cad+= '('+consumos[i].consumo+' * '+this.itemdetalles.diasespeciales[i].factorConsumo+") + ";
            } else 
            {
              cad+= consumos[i].consumo +" + ";
            }
          
        }
    }

     return cad.slice(0, -2);; 
  }

  getconsumopedido(arraycal:number[],consumos:ConsumoModel[]):number
  {
    let cad:number = 0;  
    for(let i=0; i<arraycal.length; i++)
    {
      if(arraycal[i]>0)
        {
          if(this.itemdetalles?.diasespeciales[i] != null)
            {
              cad+= (consumos[i].consumo*+this.itemdetalles.diasespeciales[i].factorConsumo);
            } else 
            {
              cad+= consumos[i].consumo;
            }
        }
    }

     return cad;
  }

 getStockSeguridad(factor:number,mayorc:number):number
 {
     return mayorc * factor;
 }

 getproyeccion(num1:number,num2:number,num3:number):number
 {
    return num1+num2-num3
 }   

updatepedido()
{
  const data = 
  {
    id: this.pedidosel?.id,
    codarticulo: this.itemdetalles?.codArticulo,
    justificacion: this.justificacion,
    inventario: this.inventariovalue
  };

  
  this.apiserv.UpdatePedido(data).subscribe({
    next: data => {
      this.showMessage('success',"Success","Guardado correctamente");
      this.getPedidos();
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}  

filtrar()
{  
  this.pedidos = [...this.pedidosall]; 
  if(this.proveedorsel == -999 && this.sucursal == -999)
  {
    this.pedidos = [...this.pedidosall]; 
  }

  if(this.proveedorsel! > -999 && this.sucursal > -999)
    {  
      this.pedidos = this.pedidos.filter(p => p.codProveedor == this.proveedorsel && p.idSucursal == ''+this.sucursal);
    }

    if(this.proveedorsel! > -999 && this.sucursal == -999)
      {  
        this.pedidos = this.pedidos.filter(p => p.codProveedor == this.proveedorsel);
      }

      if(this.proveedorsel! == -999 && this.sucursal > -999)
        {  
          this.pedidos = this.pedidos.filter(p => p.idSucursal == ''+this.sucursal);
        }
}

editarinv()
{
  this.editarinventario = true; 
}

canceledit()
{
  this.editarinventario = false; 
}


confirmarpedido()
{

  this.loading = true;
  this.apiserv.ConfirmarPedido(this.pedidosel!.id).subscribe({
    next: data => {
      this.verpedido = false; 
      this.showMessage('success',"Success","Procesado correctamente");
      this.getPedidos();
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

refreshpedidos()
{ 
  this.loading = true;
  this.apiserv.refreshPedidos().subscribe({
    next: data => {
      this.showMessage('success',"Success","Lista de pedidos actualizada");
      this.getPedidos();
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}   


confirmartodo(event: Event)
{
  this.loading = true;
  let pedidosc = this.pedidos.filter(p => p.status == 1); 
  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: 'SE PROCESARAN '+pedidosc.length+' PEDIDO(S), DESEA CONTINUAR',
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon:"none",
    rejectIcon:"none",
    rejectButtonStyleClass:"btn btn-secondary me-2",
    acceptButtonStyleClass:"btn btn-success",
    accept: () => {
       
        this.confirmado(); 
       

    },
    reject: () => {
      
    }
});




}

 async confirmado():Promise<void>
{  
  this.errorsave = false; 
  let pedidosc = this.pedidos.filter(p => p.status == 1); 
  for(let pedido of pedidosc)
  {
    await this.save(pedido.id);
  } 
  
  this.getPedidos(); 

  if(this.errorsave == false)
    { 
     
      this.showMessage('success','Success','Procesado correctamente');
    }
    this.loading = false;
}


async save(id:number):Promise<void>
{
return new Promise<void>((resolve, reject) => {
  this.apiserv.ConfirmarPedido(id).subscribe({
      next: (data) => {
          resolve(); // Resuelve la promesa
      },
      error: (error) => {
          console.log(error);
          this.showMessage('error',"Error","Error al procesar la solicitud");
           this.loading=false; 
           this.errorsave = true;
          reject(error); 
      }
  });
});


}

aload()
{
  this.loading = true; 
}

getCajas(proyeccion:number):number
{
    return Math.ceil(proyeccion);
}

rechazarPedido()
{

  this.apiserv.RechazarPedido(this.pedidosel!.id).subscribe({
    next: data => {
       this.verpedido= false;
       this.getPedidos(); 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

getpedidosFecha()
{
  this.loading = true;
  if(this.filtrofechaf == undefined || this.filtrofechai == undefined)
    {
      this.showMessage('info',"Error","Favor de seleccionar una fecha inicial y una fecha final");
      this.loading = false; 
      return;
    }

    this.apiserv.getPedidosFH(this.filtrofechai,this.filtrofechaf).subscribe({
      next: data => {
        this.pedidos = data; 
       this.pedidosall = [...this.pedidos]; 
       this.loading = false; 

       if(this.pedidosel != undefined)
        {
            const temp = this.pedidos.filter(p => p.id = this.pedidosel!.id);
            if(temp.length>0)
              {
                this.pedidosel = temp[0]; 
                if(this.itemdetalles != undefined)
                  {
                    const tempid = this.pedidosel.articulos.filter(i => i.codArticulo == this.itemdetalles?.codArticulo);
                    if(tempid.length>0)
                      {
                        this.itemdetalles = tempid[0]; 
                      }
                  }
              }
        }

       this.cdr.detectChanges();
       console.log(this.pedidos);
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
}


exportarExcel()
{ 
  this.loading = true;
  let data = JSON.stringify(this.pedidos);
  this.apiserv.ExcelHistorialPedidos(data).subscribe({
    next: data => {
      this.loading = false;
      this.cdr.detectChanges();
      const base64String = data.base64File; // Aquí debes colocar tu cadena base64 del archivo Excel

      // Decodificar la cadena base64
      const binaryString = window.atob(base64String);
  
      // Convertir a un array de bytes
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
  
      // Crear un Blob con los datos binarios
      const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      // Crear una URL para el Blob
      const url = window.URL.createObjectURL(blob);
  
      // Crear un enlace para la descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = 'HISTORIAL DE PEDIDOS.xlsx'; // Establecer el nombre del archivo
      document.body.appendChild(link);
  
      // Hacer clic en el enlace para iniciar la descarga
      link.click();
  
      // Limpiar la URL y el enlace después de la descarga
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    },
    error: error => {
      this.loading = false; 
      this.showMessage('error','Error','Error al generar el archivo de excel');
      console.log(error);
     
    }
});
}

}
