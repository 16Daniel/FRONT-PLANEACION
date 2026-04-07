import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { Item, ItemInvSem } from '../../../Interfaces/Item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ApiService } from '../../../Services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Inventario } from '../../../Interfaces/inventario';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-check-inv-semanal',
  standalone: true,
  imports: [CommonModule,FormsModule,MultiSelectModule,ToastModule,TableModule,ConfirmDialogModule,DialogModule],
  providers:[MessageService,ConfirmationService],
  templateUrl: './check-inv-semanal.html',
  styleUrl: './check-inv-semanal.scss',
})
export default class CheckInvSemanal implements OnInit {
 public catitems:Item[] = [];
  public catitemsbd:ItemInvSem[] = [];
  public selecteditems:Item[] = [];
  public loading:boolean = true; 
  public modalPrioridad:boolean = false; 
  public itemSel:ItemInvSem|undefined; 
  public valOriginal:number|undefined; 
  public arr_eliminar:number[] = []; 
 constructor(public apiserv:ApiService,private messageService: MessageService,public cdr:ChangeDetectorRef,private confirmationService: ConfirmationService)
  {
  }

  ngOnInit(): void { this.getItems(); }

 showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

  getItems()
{ 

  this.apiserv.getItemsinvsem().subscribe({
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

  getItemsbd()
{ 
  this.loading = true; 
  this.apiserv.getItemsinvsembd().subscribe({
    next: data => {
       this.catitemsbd=data;
       this.catitemsbd.sort((a, b) => {
         const prioridadA = a.prioridad ?? Infinity;
         const prioridadB = b.prioridad ?? Infinity;
         return prioridadA - prioridadB;
         });

         this.catitems= this.catitems.filter(item1 => 
         !this.catitemsbd.some(item2 => item2.cod === item1.cod)
         );

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
  
  for(let item of this.selecteditems)
    {
      articulos.push(item.cod); 
    }

   this.apiserv.agregarArticulosInvSem(JSON.stringify(articulos)).subscribe({
    next: data => {
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

eliminarArticulos()
{
  
  this.loading = true; 
   this.apiserv.eliminarArticulosInvSem(JSON.stringify(this.arr_eliminar)).subscribe({
    next: data => {
       this.showMessage('success',"Success","Eliminado correctamente");
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

abrirModal(item:ItemInvSem)
{
   this.valOriginal = item.prioridad; 
   this.itemSel = item; 
   this.modalPrioridad = true; 
}

ordenar()
{  
   this.modalPrioridad = false; 
   this.loading = true; 
   let articulosmayores = this.catitemsbd.filter(x => x.prioridad != undefined && x.prioridad>= this.itemSel!.prioridad! && x.cod != this.itemSel!.cod); 
   articulosmayores.sort(x=> x.prioridad!)
   let temp:ItemInvSem[] =[...articulosmayores];
   
   for(let i = 0; i<temp.length; i++)
      {
         if(i==0){ 
            let artdb = this.catitemsbd.filter(x=> x.cod == articulosmayores[0].cod)[0]; 
            articulosmayores[0].prioridad = this.itemSel!.prioridad!+1;
            if(artdb != undefined){ artdb.prioridad = this.itemSel!.prioridad!+1; }
         }
         else
            {
               let artdb = this.catitemsbd.filter(x=> x.cod == articulosmayores[i].cod)[0]; 
               articulosmayores[i].prioridad = articulosmayores[i-1].prioridad!+1; 
               if(artdb != undefined){ artdb.prioridad = articulosmayores[i-1].prioridad!+1}  
            }
      }

   let parametro:any[] = []; 
   for(let item of this.catitemsbd.filter(x=>x.prioridad))
      {
         parametro.push({cod:item.cod,prioridad: item.prioridad}); 
      } 
     
   this.apiserv.actualizarArticulosInvSem(JSON.stringify(parametro)).subscribe({
    next: data => {
       this.showMessage('success',"Success","Actualizado correctamente");
       this.loading = false; 
       this.catitemsbd.sort((a, b) => {
         const prioridadA = a.prioridad ?? Infinity;
         const prioridadB = b.prioridad ?? Infinity;
         return prioridadA - prioridadB;
         });
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.loading = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

cancelar()
{
   this.itemSel!.prioridad = this.valOriginal; 
   this.modalPrioridad = false; 
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

}
