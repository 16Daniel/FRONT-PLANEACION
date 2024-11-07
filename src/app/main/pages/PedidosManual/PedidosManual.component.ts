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
import { Item } from '../../../Interfaces/Item';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { PickListModule } from 'primeng/picklist';

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
    PickListModule
  ],
  providers:[MessageService,ConfirmationService],
  templateUrl: './PedidosManual.component.html',
})
export default class PedidosManualComponent implements OnInit {
public modalagregar:boolean = false; 
public modalconfig:boolean = false; 
public modalconfigarts:boolean = false; 
public catsucursales:Sucursal[] = [];
public catproveedores:Proveedor[] = [];
public catproveedoresconf:Proveedor[] = [];
public loading:boolean = false; 
public loading2:boolean = false; 
public loading3:boolean = false; 
public provsel:Proveedor|undefined;
public provselconf:Proveedor|undefined;
public sucursalsel:Sucursal|undefined; 

public catitems:Item[] = []; 
public selecteditems:Item[] = []; 
public catitemsconf:Item[] = []; 
public selecteditemsconf:Item[] = []; 
public datatable:any[] = []; 

public itemprovarts:Proveedor|undefined; 

  ngOnInit(): void { }

  constructor(public apiserv:ApiService,private messageService: MessageService,public cdr:ChangeDetectorRef,private confirmationService: ConfirmationService)
  {
    this.getSucursales();
    this.getProveedores();
    this.getProveedoresConfig(); 
  }

  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

openmodaladd()
{
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
  this.apiserv.getItemprovPedSuc(this.provsel!.codproveedor).subscribe({
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

updatetable()
{
  this.datatable = []; 

  for(let item of this.selecteditems)
    {
      this.datatable.push(
        {
          cod:item.cod,
          name:item.descripcion,
          cantidad:0
        });
    }
  
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

}
