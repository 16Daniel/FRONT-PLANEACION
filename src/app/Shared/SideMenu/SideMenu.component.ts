import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { MenuItem } from 'primeng/api'
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { UsuarioLogin } from '../../Interfaces/Usuario';
import { ApiService } from '../../Services/api.service';
import { Ruta } from '../../Interfaces/Ruta';
@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    MenuModule,
    SidebarModule,
    FormsModule,
    OverlayPanelModule
  ],
  templateUrl: './SideMenu.component.html',
  styleUrl: './SideMenu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent implements OnInit {
  public sidebarVisible:boolean = true;
  public sbclose:boolean = false; 
  public userdata:UsuarioLogin|undefined;
  public loading:boolean = true; 
  public catRutas:Ruta[] = []; 

  constructor(public cdr:ChangeDetectorRef,private router: Router,public apiserv:ApiService)
  {
      let jsondata:string|null = localStorage.getItem("rwuserdata");
      this.userdata = JSON.parse(jsondata!);
      this.getRutas(this.userdata!.idRol);
  }

  ngOnInit(): void 
  {
    const body = document.querySelector("body");
const sidebar = document.querySelector(".sidebar");
const submenuItems = document.querySelectorAll(".submenu_item");
const sidebarExpand = document.querySelector(".expanded");
const home = document.querySelector('#home');
const toggle = body!.querySelector(".toggle");


toggle!.addEventListener("click" , () =>{
  sidebar!.classList.toggle("close");
  home!.classList.toggle("expanded"); 
  if(this.sbclose)
  {
    this.sbclose = false;
    this.cdr.detectChanges();
  } else { this.sbclose = true;  this.cdr.detectChanges();}
  })



submenuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    item.classList.toggle("show_submenu");
    submenuItems.forEach((item2, index2) => {
      if (index !== index2) {
        item2.classList.remove("show_submenu");
      }
    });
  });
});
if (window.innerWidth < 768) {
  sidebar!.classList.add("close");
} else {
  sidebar!.classList.remove("close");
}
   }

   logout()
   {
     localStorage.removeItem("rwuserdata");
     localStorage.removeItem("catRutas");
     
     this.router.navigate(["/auth/login"]);
   }

   getRutas(id:number)
   {
    this.loading = true; 
    this.apiserv.getRutasRol(id).subscribe({
      next: data => {
        this.catRutas = data;
        this.loading = false; 
       this.cdr.detectChanges();
      },
      error: error => {
        this.loading = false; 
         console.log(error);
      }
  });
   }


   comprobaracceso(ruta:string):boolean
   {
      let permitir:boolean = false;
      let filtro = this.catRutas.filter(x => x.ruta == ruta);

      if(filtro.length>0)
        {
          permitir = true; 
        }

      return permitir; 
   }

}
