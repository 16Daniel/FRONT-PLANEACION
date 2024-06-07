import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { Component,ChangeDetectorRef, destroyPlatform  } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Dialog, DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ApiService } from '../../../Services/api.service';
import { Rol } from '../../../Interfaces/Rol';
import { Ruta } from '../../../Interfaces/Ruta';
import { MultiSelectModule } from 'primeng/multiselect';
import { Usuario } from '../../../Interfaces/Usuario';

@Component({
  selector: 'app-roles',
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
  templateUrl: './Users.component.html'
})
export default class UsersComponent {
  public foundData:boolean = true;
  public loading:boolean = true; 
  public modalAgregar:boolean = false; 
  public actualizar:boolean = false; 
  public catusuarios:Usuario[] = []; 
  public usuariosel:Usuario|undefined;  
  public catroles:Rol[] = [];
  public formrolsel:number | undefined;
  public formnombre:string | undefined;
  public formapellidop:string | undefined;
  public formapellidom:string | undefined;
  public formemail:string | undefined;
  public formpass:string | undefined;


  constructor(public apiserv:ApiService,private messageService: MessageService,public cdr:ChangeDetectorRef, private config: PrimeNGConfig,
    private confirmationService: ConfirmationService)
  {
    this.getRoles();
    this.getusuarios(); 
  }
  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}
  ngOnInit(): void { }

  showAgregar()
{
  this.actualizar=false;
  this.modalAgregar = true; 
}

getusuarios()
{
  this.apiserv.getusuarios().subscribe({
    next: data => {
       this.catusuarios =data;
       this.loading = false;
       if(data.length==0)
       {
        this.foundData = false; 
       }
     this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

getRoles()
{
  this.apiserv.getRoles().subscribe({
    next: data => {
       this.catroles =data;
       this.loading = false;
       if(data.length==0)
       {
        this.foundData = false; 
       }
     this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

getrolname(idr:number):string
{
  let name = "";
  let rol = this.catroles.filter(x => x.id == idr);
  if(rol.length>0)
    {
      name = rol[0].descripcion;
    }
 return name; 
}

confirm(id:number) {
  this.confirmationService.confirm({
      header: 'Confirmación',
      message: '¿Está seguro que desea eliminar?',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      acceptButtonStyleClass:"btn bg-p-b p-3",
      rejectButtonStyleClass:"btn btn-light me-3 p-3",
      accept: () => {
         this.deleteUser(id);
      },
      reject: () => {
          
      }
  });
}

showEdit(data:Usuario)
{ 
  this.actualizar=true;
  this.modalAgregar = true;
  this.usuariosel = data;

  this.formnombre = data.nombre;
  this.formapellidop = data.apellidoP;
  this.formapellidom = data.apellidoM; 
  this.formemail = data.email;
  this.formpass = data.pass;
  this.formrolsel = data.idRol; 
}


saveData()
  {  
    const data =
    {
      Nombre: this.formnombre,
      ApellidoP: this.formapellidop,
      ApellidoM: this.formapellidom,
      IdRol: this.formrolsel,
      Email: this.formemail,
      Pass: this.formpass,  
    };
    this.apiserv.createUser(data).subscribe({
      next: data => {
        this.modalAgregar =false;
        this.formnombre = undefined; 
        this.formapellidop = undefined; 
        this.formapellidom = undefined; 
        this.formrolsel = undefined; 
        this.formemail = undefined; 
        this.formpass = undefined; 

        this.cdr.detectChanges();
        this.getusuarios();
        this.showMessage('success',"Success","Guardado correctamente");
     
      },
      error: error => {
        this.modalAgregar=true;
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
  } 
  
  updateData()
{  
  const data =
  {
    Id:this.usuariosel!.id,
    Nombre: this.formnombre,
    ApellidoP: this.formapellidop,
    ApellidoM: this.formapellidom,
    IdRol: this.formrolsel,
    Email: this.formemail,
    Pass: this.formpass,  
  };
  this.apiserv.updateUser(data).subscribe({
    next: data => {
      this.modalAgregar =false;
      this.formnombre = undefined; 
      this.formapellidop = undefined; 
      this.formapellidom = undefined; 
      this.formrolsel = undefined; 
      this.formemail = undefined; 
      this.formpass = undefined; 

      this.cdr.detectChanges();
      this.getusuarios();
      this.showMessage('success',"Success","Guardado correctamente");
   
    },
    error: error => {
      this.modalAgregar=true;
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

deleteUser(id:number)
{
  this.apiserv.deleteUser(id).subscribe({
    next: data => {
      this.getusuarios();
      this.showMessage('success',"Success","Eliminado correctamente");
     this.cdr.detectChanges();
    },
    error: error => {
      this.modalAgregar=true;
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

}
