import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ItemInvSem } from '../../../Interfaces/Item';
import { ApiService } from '../../../Services/api.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-articulos-tipo-inventario',
  standalone: true,
  imports: [CommonModule, TabViewModule, TableModule, ToastModule],
  providers:[MessageService],
  templateUrl: './articulos-tipo-inventario.html',
  styleUrl: './articulos-tipo-inventario.scss',
})
export default class ArticulosTipoInventario implements OnInit {
  public catitemsbd:ItemInvSem[] = [];
  public catitemsdiario:ItemInvSem[] = [];
  public catitemsmensual:ItemInvSem[] = [];
   public loading:boolean = true; 

    constructor(public apiserv:ApiService,private messageService: MessageService,public cdr:ChangeDetectorRef,)
     {
     }
   
  ngOnInit(): void { this.getItemsbdSem();}

    getItemsbdSem()
{ 
  this.loading = true; 
  this.apiserv.getItemsinvsembd().subscribe({
    next: data => {
       this.catitemsbd=data;
       this.getItemsbdDiario(); 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.loading = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

    getItemsbdDiario()
{ 
  this.loading = true; 
  this.apiserv.getItemsinvDiairio().subscribe({
    next: data => {
       this.catitemsdiario=data;
      this.getItemsbdMes(); 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.loading = false; 
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

    getItemsbdMes()
{ 
  this.loading = true; 
  this.apiserv.getItemsinvMes().subscribe({
    next: data => {
       this.catitemsmensual=data;
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

 showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}



exportarExcelDiario()
{ 
  let data:any[] = []; 
  for(let item of this.catitemsdiario)
    {
        data.push(
          {
            CODARTICULO: item.cod,
            REFERENCIA:item.referencia,
            NOMBRE: item.descripcion,
            MARCA: item.marca, 
            MEDIDA_REFERENCIA: item.umedida
          });
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    
    // Crear libro de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  
  // Exportar a Excel
  XLSX.writeFile(wb, 'ARTICULOS_INV_DIARIO.xlsx');
}

exportarExcelsemana()
{ 
  let data:any[] = []; 
  for(let item of this.catitemsbd)
    {
        data.push(
          {
            CODARTICULO: item.cod,
            REFERENCIA:item.referencia,
            NOMBRE: item.descripcion,
            MARCA: item.marca, 
            MEDIDA_REFERENCIA: item.umedida
          });
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    
    // Crear libro de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  
  // Exportar a Excel
  XLSX.writeFile(wb, 'ARTICULOS_INV_SEMANAL.xlsx');
}

exportarExcelmes()
{ 
  let data:any[] = []; 
  for(let item of this.catitemsmensual)
    {
        data.push(
          {
            CODARTICULO: item.cod,
            REFERENCIA:item.referencia,
            NOMBRE: item.descripcion,
            MARCA: item.marca, 
            MEDIDA_REFERENCIA: item.umedida
          });
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    
    // Crear libro de trabajo
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  
  // Exportar a Excel
  XLSX.writeFile(wb, 'ARTICULOS_INV_MENSUAL.xlsx');
}

}
