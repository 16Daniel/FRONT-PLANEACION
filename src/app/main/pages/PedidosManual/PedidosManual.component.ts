import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { StepsModule } from 'primeng/steps';
import { ApiService } from '../../../Services/api.service';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { Proveedor } from '../../../Interfaces/Proveedor';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Item, ItemPS } from '../../../Interfaces/Item';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { PickListModule } from 'primeng/picklist';
import { CalendarModule } from 'primeng/calendar';
import { ArticuloPedSuc, PedidoSuc } from '../../../Interfaces/pedido';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-pedidos-manual',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    StepsModule,
    DropdownModule,
    FormsModule,
    MultiSelectModule,
    ToastModule,
    ConfirmDialogModule,
    PickListModule,
    CalendarModule,
    TableModule
  ],
  providers:[MessageService,ConfirmationService],
  templateUrl: './PedidosManual.component.html',
})
export default class PedidosManualComponent implements OnInit {
public modalagregar:boolean = false; 
public modalconfig:boolean = false; 
public modalconfigarts:boolean = false; 
public modalhistorial:boolean = false; 
public catsucursales:Sucursal[] = [];
public catproveedores:Proveedor[] = [];
public catproveedoresconf:Proveedor[] = [];
public loading:boolean = false; 
public loading2:boolean = false; 
public loading3:boolean = false; 
public provsel:Proveedor|undefined;
public provselconf:Proveedor|undefined;
public sucursalsel:Sucursal|undefined; 

public catitems:ItemPS[] = []; 
public selecteditems:ItemPS[] = []; 
public catitemsconf:ItemPS[] = []; 
public selecteditemsconf:ItemPS[] = []; 
public datatable:ArticuloPedSuc[] = []; 

public nombreuserped:string = ""; 
public fechaentrega:Date = new Date();
public itemprovarts:Proveedor|undefined; 
public step2:boolean = false; 

public arr_data:PedidoSuc[] = []; 
public arr_dataH:PedidoSuc[] = []; 
public verpedido:boolean = false; 
public pedidosel:PedidoSuc|undefined; 
public fdescuento:number = 0; 

public fechainiH:Date = new Date();
public fechafinH:Date = new Date();

public modalajusteItem:boolean = false;
public itemdetalles:ArticuloPedSuc|undefined; 
public unidadesajustec:number = 0; 
public idRol:number = 0; 
  ngOnInit(): void { }

  constructor(public apiserv:ApiService,private messageService: MessageService,public cdr:ChangeDetectorRef,private confirmationService: ConfirmationService)
  {
    this.getSucursales();
    this.getProveedores();
    this.getProveedoresConfig(); 

    let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
    this.idRol = this.idRol = userdata.idRol; 
  }

  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

openmodaladd()
{
  this.step2 = false; 
  this.provsel = undefined; 
  this.selecteditems = []; 
  this.modalagregar = true; 
}

openmodalconfig()
{
  this.modalconfig = true; 
}

openmodalconfigarts(item:Proveedor)
{
  this.itemprovarts = item; 
  this.getItemsprovconf();
  this.apiserv.getItemprovPedSuc(item.codproveedor).subscribe({
    next: data => {
       this.selecteditemsconf=data;
       this.loading = false; 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
  this.modalconfigarts = true; 
}

getPedidoshoySuc(idsuc:number)
{
  
  this.loading = true; 
   this.apiserv.getPedidosSuc(idsuc).subscribe({
    next: data => {
       this.arr_data=data;

       if(this.pedidosel != undefined)
        {
          let idp = this.pedidosel!.id; 
          this.pedidosel = undefined; 
          this.pedidosel = this.arr_data.find(x => x.id == idp);
        }

       this.loading = false; 
     this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.loading = false
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

getProveedores()
{
  this.loading2 = true; 
   this.apiserv.getProveedoresPedSuc().subscribe({
    next: data => {
       this.catproveedores=data;
       this.loading2 = false; 
     this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.loading2 = false
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

getProveedoresConfig()
{
  this.loading2 = true;
   this.apiserv.getProveedoresPedSucConfig().subscribe({
    next: data => {
       this.catproveedoresconf=data;
       this.loading2 = false; 
     this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.loading2 = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

getSucursales()
{
  this.loading = true; 
   this.apiserv.getSucursales().subscribe({
    next: data => {
       this.catsucursales=data;
       this.getSucursalUser(); 
    },
    error: error => {
      this.loading = false; 
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

getSucursalUser()
{
   this.apiserv.getSucursaluser().subscribe({
    next: data => {
      if(data.cod >0)
        {
          this.sucursalsel=data;
          this.getPedidoshoySuc(this.sucursalsel!.cod); 
        }

        if(this.idRol>18 && this.idRol<22)
          {
            this.getPedidoshoySuc(-1); 
          }
   
        this.loading = false; 
       this.cdr.detectChanges();
    },
    error: error => {
      this.loading = false; 
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

getItemsprovpedsuc()
{
  this.loading = true; 
  this.selecteditems = [];
  this.apiserv.getItemprovPedSuc(this.provsel!.codproveedor).subscribe({
    next: data => {
       this.catitems=data;
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

getItemsprovconf()
{
  this.loading3= true; 
  this.apiserv.getItemprovPedSucConfig(this.itemprovarts!.codproveedor).subscribe({
    next: data => {
       this.catitemsconf=data;
       this.loading3 = false; 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.loading3 = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}


agregarprov()
{
  this.loading2 = true;
  this.apiserv.addProvPedSuc(this.provselconf!.codproveedor).subscribe({
    next: data => {
       this.loading2 = false; 
       this.showMessage('success',"Success","Agregado correctamente");
       this.cdr.detectChanges();
       this.getProveedores(); 
    },
    error: error => {
       console.log(error);
       this.loading2 = false;
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

deleteprovpedsuc(id:number)
{

  this.confirmationService.confirm({
    header: 'Confirmación',
    message: '¿Está segur@ que desea eliminar?',
    acceptIcon: 'pi pi-check mr-2',
    rejectIcon: 'pi pi-times mr-2',
    acceptButtonStyleClass:"btn bg-p-b p-3",
    rejectButtonStyleClass:"btn btn-light me-3 p-3",
    accept: () => {
     
      this.loading2 = true;
      this.apiserv.deleteprovpedsuc(id).subscribe({
        next: data => {
           this.loading2 = false; 
           this.showMessage('success',"Success","Eliminado correctamente");
           this.cdr.detectChanges();
           this.getProveedores(); 
        },
        error: error => {
           console.log(error);
           this.loading2 = false;
           this.showMessage('error',"Error","Error al procesar la solicitud");
        }
    });

    },
    reject: () => {
        
    }
});

 
}


agregaritemsprov()
{
  this.loading3 = true;

  let data:number[] = []; 
  for(let item of this.selecteditemsconf)
    {
      data.push(item.cod); 
    }

  this.apiserv.agregaritemsprovpedsuc(this.itemprovarts!.codproveedor,JSON.stringify(data)).subscribe({
    next: data => {
       this.loading3 = false; 
       this.showMessage('success',"Success","Guardado correctamente");
       this.cdr.detectChanges();
       this.getProveedores(); 
    },
    error: error => {
       console.log(error);
       this.loading3 = false;
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

setstep1()
{
  this.step2 = false;
}

setstep2()
{
  this.loading = true; 
  this.step2 = true;
  let idarts:number[] = [];
  for(let item of this.selecteditems)
    {
      idarts.push(item.cod);
    }

  let data = 
  {
    idprov: this.provsel!.codproveedor,
    idsuc: this.sucursalsel!.cod,
    nombresuc: this.sucursalsel!.name,
    jdataart: JSON.stringify(idarts)
  }
  this.apiserv.previewpedidosuc(data).subscribe({
    next: data => {
       this.datatable=data;
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


guardarpedido()
{
  for(let item of this.datatable)
    {
      if(item.cajas <= 0)
        {
          this.showMessage('info',"Error","Todos los articulos deben tener más de 0 unidades");
          return;
        }
    }

    this.loading = true; 
    let data = 
    {
      idprov: this.provsel!.codproveedor,
      idsuc: this.sucursalsel!.cod,
      nombresuc: this.sucursalsel!.name,
      jdataart: JSON.stringify(this.datatable),
      fechaentrega: this.fechaentrega,
      nombresolicitante: this.nombreuserped.toUpperCase()
    }

    this.apiserv.guardarpedidosuc(data).subscribe({
      next: data => {
         this.loading = false; 
         this.modalagregar = false; 
         this.getPedidoshoySuc(this.sucursalsel!.cod); 
         this.showMessage('success',"Success","Guardado correctamente");
         this.nombreuserped = ""; 
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.loading = false;
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });

}

detallespedido(pedido:PedidoSuc)
{
  this.pedidosel= pedido; 
  this.fdescuento = pedido.cantidaddescuento!; 
  console.log(pedido); 
  this.verpedido = true; 
}

rechazarPedido()
{
  this.loading = true;
  this.apiserv.RechazarPedidoSuc(this.pedidosel!.id).subscribe({
    next: data => {
      this.loading = false; 
       this.verpedido= false;
       this.pedidosel = undefined; 
       this.getPedidoshoySuc(this.sucursalsel!.cod)
        this.showMessage('info',"Info","Pedido rechazado");
       this.cdr.detectChanges();
    },
    error: error => {
      this.loading = false; 
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

abrirhistorial()
{
  this.getpedidosSucH();
  this.modalhistorial = true; 
}

getpedidosSucH()
{
  this.loading2 = true; 
  let idsuc:number = 0; 
  if(this.idRol>18 && this.idRol<22)
    {
      idsuc = -1; 
    } else
    {
      idsuc = this.sucursalsel!.cod;
    }
  this.apiserv.getPedidosSucH(idsuc,this.fechainiH,this.fechafinH).subscribe({
   next: data => {
      this.arr_dataH=data;
      this.loading2 = false; 
    this.cdr.detectChanges();
   },
   error: error => {
      console.log(error);
      this.loading2 = false
      this.showMessage('error',"Error","Error al procesar la solicitud");
   }
});
}

updateDescuentoPedSuc()
{
  this.loading = true; 
  this.apiserv.updateDescuentoPedSuc(this.pedidosel!.id,this.fdescuento).subscribe({
    next: data => {
      this.showMessage('success',"Success","Actualizado correctamente");
      this.getPedidoshoySuc(this.sucursalsel!.cod); 
      this.loading = false;
    },
    error: error => {
      this.loading = false; 
      this.showMessage('error',"Error","Error al procesar la solicitud");
       console.log(error);
    }
});
}


eliminaritempedsuc(codart:number)
{

  this.confirmationService.confirm({
    header: 'Confirmación',
    message: '¿Está segur@ que desea eliminar?',
    acceptIcon: 'pi pi-check mr-2',
    rejectIcon: 'pi pi-times mr-2',
    acceptButtonStyleClass:"btn bg-p-b p-3",
    rejectButtonStyleClass:"btn btn-light me-3 p-3",
    accept: () => {
     
      this.loading2 = true;
      this.apiserv.eliminarItemPedidoSuc(this.pedidosel!.id,codart).subscribe({
        next: data => {
           this.loading2 = false; 
           this.pedidosel!.articulos = this.pedidosel!.articulos.filter( x => x.codArticulo != codart); 
           this.showMessage('success',"Success","Eliminado correctamente");
           this.cdr.detectChanges();
           this.getPedidoshoySuc(this.sucursalsel!.cod); 
        },
        error: error => {
           console.log(error);
           this.loading2 = false;
           this.showMessage('error',"Error","Error al procesar la solicitud");
        }
    });

    },
    reject: () => {
        
    }
}); 
}


showmodalajustec(item:ArticuloPedSuc)
{
  this.itemdetalles = item; 
  this.modalajusteItem = true; 
  this.unidadesajustec = this.itemdetalles!.cajas; 
}

aumentarac()
{
  this.unidadesajustec = this.unidadesajustec + 1;
}

restarac()
{
  if( (this.unidadesajustec - 1) >= 0)
    {
      this.unidadesajustec = this.unidadesajustec - 1;
    } else
    {
      this.showMessage('info',"Error","La cantidad de cajas debe ser mayor o igual a cero");
    }
 
}

calcularuds()
{  
  let uds = (this.unidadesajustec * this.itemdetalles!.unidadescaja);
  return uds;
}

updateItemPedSuc()
{
  this.modalajusteItem = false; 
  this.loading2 = true; 
  this.apiserv.updateItemPedSuc(this.pedidosel!.id,this.itemdetalles!.codArticulo,this.unidadesajustec,this.calcularuds()).subscribe({
    next: data => {
     
      this.showMessage('success',"Success","Actualizado correctamente");
      this.getPedidoshoySuc(this.sucursalsel!.cod); 
      this.loading2 = false;
    },
    error: error => {
      this.loading2 = false; 
      this.showMessage('error',"Error","Error al procesar la solicitud");
       console.log(error);
    }
});
}

confirmarpedidoSuc()
{
  this.loading = true;
  this.apiserv.ConfirmarPedidoSuc(this.pedidosel!.id).subscribe({
    next: data => {
      this.verpedido = false; 
      this.showMessage('success',"Success","Procesado correctamente");
      this.pedidosel = undefined; 
      this.loading = false;
      this.getPedidoshoySuc(this.sucursalsel!.cod); 
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
