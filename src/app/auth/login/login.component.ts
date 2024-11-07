import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../Services/api.service';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { UsuarioLogin } from '../../Interfaces/Usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule
  ],
  providers:[MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export default class LoginComponent {
public email:string = '';
public pass:string = '';
public loading:boolean = false; 
public showpass:boolean = false;
public typei:string = 'password'; 

constructor(public apiserv:ApiService, public cdr:ChangeDetectorRef,private messageService: MessageService,private router: Router)
{
  if(localStorage.getItem("rwuserdata") != null)
    {
      this.router.navigate(["/main/home"]);
    }
   

}


showMessage(sev:string,summ:string,det:string) {
  this.messageService.add({ severity: sev, summary: summ, detail: det });
}

  login()
  {
    this.loading = true; 
      if(this.email == '' || this.pass == '')
        {
          this.showMessage('info',"Error","Ingresar correo y contraseña");
          this.loading = false; 
          return; 
        }

        const data = {
          email: this.email,
          pass: this.pass
        };

        this.apiserv.login(data).subscribe({
          next: data => {
            debugger
            let user:UsuarioLogin = data; 
            localStorage.setItem("rwuserdata",JSON.stringify(user));
             this.loading = false; 
            this.getRutas(user.idRol);
          },
          error: error => {
             console.log(error);
             this.loading = false; 
             if(error.status == 404)
              {
                this.showMessage('error',"Error","Credenciales incorrectas");
              }

              if(error.status == 423)
                {
                  this.showMessage('error',"Error","Hay una sesión iniciada con este usuario");
                }else
                {
                  this.showMessage('error',"Error","Error al procesar la solicitud");
                }
            
          }
      });


  }

  showpasschange()
  {
     this.showpass = !this.showpass;
      if(this.showpass == true)
        {
          this.typei= 'text';
          this.cdr.detectChanges();
        } else
        {
          this.typei= 'password';
          this.cdr.detectChanges();
        }
  }

  getRutas(id:number)
  {
   this.loading = true; 
   this.apiserv.getRutasRol(id).subscribe({
     next: data => {
      localStorage.setItem("catRutas",JSON.stringify(data));
       this.loading = false; 
       this.router.navigate(["/main/home"]);
      this.cdr.detectChanges();
     },
     error: error => {
       this.loading = false; 
        console.log(error);
     }
 });
  }

}
