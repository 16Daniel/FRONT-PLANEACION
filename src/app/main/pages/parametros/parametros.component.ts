import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ApiService } from '../../../Services/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { Parametro } from '../../../Interfaces/Parametro';
@Component({
  selector: 'app-parametros',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule
  ],
  providers:[MessageService],
  templateUrl: './parametros.component.html',
})
export default class ParametrosComponent implements OnInit {
 public diasconprom:number= 4;
 public factorstock:number= 1.5;
 public parametros: Parametro | undefined; 

 constructor(public apiserv:ApiService, public cdr:ChangeDetectorRef,private messageService: MessageService)
 {
  
 }

  ngOnInit(): void 
  {
    this.getParametros(); 
   }
  
showMessage(sev:string,summ:string,det:string) {
  this.messageService.add({ severity: sev, summary: summ, detail: det });
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

           this.diasconprom = obj.pedido.diasconprom;
           this.factorstock = obj.pedido.factorstock; 
        } 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

guardarParametros()
{
  let obj = 
  {
    pedido:
    {
      diasconprom: this.diasconprom,
      factorstock: this.factorstock
    }
  }

  let stringdata:Parametro = {
    jdata : JSON.stringify(obj)
  }; 

  this.apiserv.guardarParametros(stringdata).subscribe({
    next: data => {
      this.getParametros(); 
      this.showMessage('success',"Success","Guardado correctamente");
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

}
