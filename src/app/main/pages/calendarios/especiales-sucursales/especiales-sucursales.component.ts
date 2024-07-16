import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { Component,ChangeDetectorRef  } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../../Services/api.service';
import { DiasEspecial, DiasEspecialSuc } from '../../../../Interfaces/DiasEspecial';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Sucursal } from '../../../../Interfaces/Sucursal';
import { Item } from '../../../../Interfaces/Item';
import { MultiSelectModule } from 'primeng/multiselect';
@Component({
  selector: 'app-especiales-sucursales',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonModule,
    DialogModule,
    ToastModule,
    CalendarModule,
    FormsModule,
    ConfirmDialogModule,
    MultiSelectModule
  ],
  providers:[MessageService,ConfirmationService],
  templateUrl: './especiales-sucursales.component.html',
})
export default class EspecialesSucursalesComponent {
  public foundData:boolean = true;
  public loading:boolean = true; 
  modalAgregar:boolean = false; 
  public modaleliminar:boolean = false;
  
  public formDate:Date | undefined;
  public formDia:number | undefined;
  public formsemana:number | undefined;
  public formdDescripcion:string | undefined;
  public formFactor:number = 1.5;
  
  public diasespeciales:DiasEspecialSuc[] = []
  public datadiases:DiasEspecialSuc[] = []; 
  public es:any; 
  public actualizar:boolean = false; 
  public diasespecialsel:DiasEspecialSuc | undefined; 
  public catsucursales:Sucursal[] = [];
  public datacatsucursales:Sucursal[] = [];
  public sucursalesseleccionadas:number[] = []; 
  public diaespecialsuc:DiasEspecialSuc[] = []; 

  public catitems:Item[] = []; 
  public selecteditems:Item[] = []; 
  public sucursal:number|undefined;
  
  
  constructor(public apiserv:ApiService,private messageService: MessageService,public cdr:ChangeDetectorRef, private config: PrimeNGConfig,
    private confirmationService: ConfirmationService)
  {
    this.getDiasespeciales(); 
  }
    ngOnInit(): void
     {
      this.es = {
        closeText: "Cerrar",
        prevText: "<Ant",
        nextText: "Sig>",
        currentText: "Hoy",
        monthNames: [
          "enero", "febrero", "marzo", "abril", "mayo", "junio",
          "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ],
        monthNamesShort: [
          "ene", "feb", "mar", "abr", "may", "jun",
          "jul", "ago", "sep", "oct", "nov", "dic"
        ],
        dayNames: [
          "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"
        ],
        dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
        dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
        weekHeader: "Sm",
        dateFormat: "dd/mm/yy",
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
      }; 
  
      this.config.setTranslation({
        monthNames: [
          "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ],
        monthNamesShort: [
          "Ene", "Feb", "Mar", "Abr", "May", "Jun",
          "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
        ],
        dayNames: [
          "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
        ],
        dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        dayNamesMin: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        weekHeader: "Sem",
    });
  
    this.getSucursales(); 
    this.getItemsProv(); 

      }
  
    getDiasespeciales()
    {
      this.apiserv.getDiasEspecialesSuc().subscribe({
        next: data => {
           this.diasespeciales=data;
           this.datadiases = data; 
           this.loading = false;
           if(data.length==0)
           {
            this.foundData = false; 
           }
           const registrosUnicos = this.diasespeciales.filter((registro, index, self) =>
            index === self.findIndex((r) => (
              r.fecha === registro.fecha && r.descripcion === registro.descripcion
            ))
          );
          this.diasespeciales = [];
          this.diasespeciales = registrosUnicos; 
          console.log(registrosUnicos,this.datadiases);
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
  
  showAgregar()
  {
    this.selecteditems = [];
    this.sucursalesseleccionadas = []; 
    this.getItemsProv(); 
    this.getSucursales();
    this.actualizar=false;
    this.modalAgregar = true; 

    this.diaespecialsuc= []; 
    this.formDate = undefined;
    this.formDia = undefined;
    this.formFactor = 1.5;
    this.formsemana = undefined;
    this.formdDescripcion = ''; 
  }
  
  // Función para obtener el día del año
   obtenerDiaDelAño(fecha: Date | undefined) {
    const comienzoDeAño = new Date(fecha!.getFullYear(), 0, 0);
    const diferencia = fecha!.getTime() - comienzoDeAño.getTime();
    const unDiaEnMilisegundos = 1000 * 60 * 60 * 24;
    this.formDia = Math.floor(diferencia / unDiaEnMilisegundos);
  }
  
  // Función para obtener la semana del año
   obtenerSemanaDelAño(fecha: Date | undefined) {
    const comienzoDeAño = new Date(fecha!.getFullYear(), 0, 0);
    const diferencia = fecha!.getTime() - comienzoDeAño.getTime();
    const unaSemanaEnMilisegundos = 1000 * 60 * 60 * 24 * 7;
    this.formsemana = Math.floor(diferencia / unaSemanaEnMilisegundos);
  }
  
  clickCalendar()
  {
    this.obtenerDiaDelAño(this.formDate);
    this.obtenerSemanaDelAño(this.formDate);
  }
  
  saveData()
  {  
    if(this.formDate == undefined)
    {
      this.showMessage('info',"Info","Favor de seleccionar una fecha");
      return;
    }
    if(this.formdDescripcion == undefined)
    {
      this.showMessage('info',"Info","Favor de ingresar una descripción");
      return
    }
    if(this.formFactor == undefined)
    {
      this.showMessage('info',"Info","Favor de ingresar un factor de consumo");
      return;
    }
    if(this.selecteditems.length==0)
      {
        this.showMessage('info',"Info","Favor de seleccionar por lo menos un artículo");
        return;
      }
    let dataS:number[] = this.sucursalesseleccionadas.filter((element) => element ==1);
    if(dataS.length<1)
    {
      this.showMessage('info','Error','Seleccione mínimo una sucursal');
      return;
    }

    let sucursalesarr:number[] = [];
    for(let i=0; i<this.sucursalesseleccionadas.length; i++)
      {
        if(this.sucursalesseleccionadas[i] == 1)
        {
          sucursalesarr.push(this.catsucursales[i].cod);
        }
      }


    this.modalAgregar = false; 
    this.loading = true; 

    let listaart:number[] = [];
      for(var art of this.selecteditems)
        {
          listaart.push(art.cod);
        }

    const data =
    {
    dia: this.formDia,
    semana: this.formsemana,
    fecha: this.formDate,
    descripcion: this.formdDescripcion,
    factorConsumo: this.formFactor,
    sucursales: JSON.stringify(sucursalesarr),
    articulos: JSON.stringify(listaart)
    };

    this.apiserv.createDiaEspecialS(data).subscribe({
      next: data => {
         this.getDiasespeciales(); 
         this.loading = false;        
       this.showMessage('success',"Success","Guardado correctamente");
      },
      error: error => {
        this.modalAgregar=true;
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
  
  } 
  
  deleteDias()
  {
    this.modaleliminar = false; 
   this.loading = true; 
   let sucursalesarr:number[] = [];
   for(let i=0; i<this.sucursalesseleccionadas.length; i++)
     {
       if(this.sucursalesseleccionadas[i] == 1)
       {
          let filtro = this.diaespecialsuc.filter(x => x.sucursal == this.catsucursales[i].cod)
          if(filtro.length>0)
            {
              sucursalesarr.push(filtro[0].id);
            }
       }
     }

    this.apiserv.deleteDiasEspecialesSuc(JSON.stringify(sucursalesarr)).subscribe({
      next: data => {
         this.getDiasespeciales(); 
         this.loading = false;        
       this.showMessage('success',"Success","Eliminado correctamente");
      },
      error: error => {
        this.loading = false; 
        this.modaleliminar=true;
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
  
  }
  
  confirm() {

    let dataS:number[] = this.sucursalesseleccionadas.filter((element) => element ==1);
    if(dataS.length<1)
    {
      this.showMessage('info','Error','Seleccione mínimo una sucursal');
      return;
    }

    this.confirmationService.confirm({
        header: 'Confirmación',
        message: '¿Está seguro que desea eliminar?',
        acceptIcon: 'pi pi-check mr-2',
        rejectIcon: 'pi pi-times mr-2',
        acceptButtonStyleClass:"btn bg-p-b p-3",
        rejectButtonStyleClass:"btn btn-light me-3 p-3",
        accept: () => {
           this.deleteDias();
        },
        reject: () => {
            
        }
    });
  }
  
  showEdit(data:DiasEspecialSuc)
  { 
    this.diaespecialsuc= []; 
    this.formDate = data.fecha;
    this.formDia = data.dia;
    this.formFactor = data.factorConsumo;
    this.formsemana = data.semana
    this.formdDescripcion = data.descripcion; 
    this.actualizar=true;
    this.modalAgregar = true;
    this.diasespecialsel = data;
    this.sucursal = data.sucursal; 

    this.diaespecialsuc = this.datadiases.filter(x => x.fecha == data.fecha && x.descripcion == data.descripcion);
    this.catsucursales = []; 
    for(var item of this.diaespecialsuc)
      { 
        let filtersuc = this.datacatsucursales.filter(x =>x.cod == item.sucursal);

        if(filtersuc.length>0)
          {
            this.catsucursales.push(filtersuc[0]); 
          }

          this.sucursalesseleccionadas = [];

          for(let ix = 0; ix< this.catsucursales.length; ix++)
            {
              this.sucursalesseleccionadas.push(0); 
            }

      }
      let obj = JSON.parse(data.articulos);
      this.selecteditems = [];
      for(var codart of obj)
        {
          let item = this.catitems.filter(x => x.cod == codart);
          if(item.length>0)
            {
              this.selecteditems.push(item[0]); 
            }
        }

  }

  showDelete(data:DiasEspecialSuc)
  { 
    this.diaespecialsuc= []; 
    this.formDate = data.fecha;
    this.formDia = data.dia;
    this.formFactor = data.factorConsumo;
    this.formsemana = data.semana
    this.formdDescripcion = data.descripcion; 
    this.actualizar=true;
    this.modaleliminar = true;
    this.diasespecialsel = data;

    this.diaespecialsuc = this.datadiases.filter(x => x.fecha == data.fecha && x.descripcion == data.descripcion);
    this.catsucursales = []; 
    for(var item of this.diaespecialsuc)
      { 
        let filtersuc = this.datacatsucursales.filter(x =>x.cod == item.sucursal);

        if(filtersuc.length>0)
          {
            this.catsucursales.push(filtersuc[0]); 
          }

          this.sucursalesseleccionadas = [];

          for(let ix = 0; ix< this.catsucursales.length; ix++)
            {
              this.sucursalesseleccionadas.push(0); 
            }

      }
      let obj = JSON.parse(data.articulos);
      this.selecteditems = [];
      for(var codart of obj)
        {
          let item = this.catitems.filter(x => x.cod == codart);
          if(item.length>0)
            {
              this.selecteditems.push(item[0]); 
            }
        }

        console.log(this.catitems,this.selecteditems);

  }

  updateData()
  { 
    if(this.formDate == undefined)
      {
        this.showMessage('info',"Info","Favor de seleccionar una fecha");
        return;
      }
      if(this.formdDescripcion == undefined)
      {
        this.showMessage('info',"Info","Favor de ingresar una descripción");
        return
      }
      if(this.formFactor == undefined)
      {
        this.showMessage('info',"Info","Favor de ingresar un factor de consumo");
        return;
      }
      if(this.selecteditems.length==0)
        {
          this.showMessage('info',"Info","Favor de seleccionar por lo menos un artículo");
          return;
        }
      let dataS:number[] = this.sucursalesseleccionadas.filter((element) => element ==1);
      if(dataS.length<1)
      {
        this.showMessage('info','Error','Seleccione mínimo una sucursal');
        return;
      }


    let listaart:number[] = [];
    for(var art of this.selecteditems)
      {
        listaart.push(art.cod);
      }
  

      let dias:number[] = []; 
      for(let is= 0; is< this.sucursalesseleccionadas.length; is++)
        {
          if(this.sucursalesseleccionadas[is]==1)
            {
              let filtro = this.diaespecialsuc.filter(x => x.sucursal == this.catsucursales[is].cod);
              if(filtro.length > 0 )
                {
                  dias.push(filtro[0].id); 
                }
            }
        }


  const data =
  {
  dia: this.formDia,
  semana: this.formsemana,
  fecha: this.formDate,
  descripcion: this.formdDescripcion,
  factorConsumo: this.formFactor,
  articulos: JSON.stringify(listaart),
  ids: JSON.stringify(dias)
  };

  console.log(data);

    this.loading = true; 
    this.apiserv.updateDiaEspecialSuc(data).subscribe({
      next: data => {
         this.getDiasespeciales(); 
         this.loading = false;        
         this.modalAgregar = false; 
       this.showMessage('success',"Success","Actualizado correctamente");
      },
      error: error => {
        this.loading = false; 
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
          this.datacatsucursales = data; 
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

  seleccionarTodo()
{
  for(let i =0; i< this.sucursalesseleccionadas.length; i++)
  {
      this.sucursalesseleccionadas[i] = 1; 
  }
}

quitarselecciones()
{
  for(let i =0; i< this.sucursalesseleccionadas.length; i++)
  {
      this.sucursalesseleccionadas[i] = 0; 
  }
}

chageStatusSucursal(index:number)
{
  let status = this.sucursalesseleccionadas[index];
  if(status == 1)
  {
    this.sucursalesseleccionadas[index] = 0;
  } else 
  {
    this.sucursalesseleccionadas[index] = 1; 
  }
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

changeSuc()
{
  let filtro:DiasEspecialSuc[] = this.diaespecialsuc.filter(x => x.sucursal == this.sucursal);
  let data:DiasEspecialSuc = filtro[0]; 
  
    this.formDate = data.fecha;
    this.formDia = data.dia;
    this.formFactor = data.factorConsumo;
    this.formsemana = data.semana
    this.formdDescripcion = data.descripcion; 
    this.diasespecialsel = data;

    // cambiar articulos seleccionados 
    let obj = JSON.parse(data.articulos);
    this.selecteditems = [];
    for(var codart of obj)
      {
        let item = this.catitems.filter(x => x.cod == codart);
        if(item.length>0)
          {
            this.selecteditems.push(item[0]); 
          }
      }
   //console.log(this.diasespecialsel);
}

}