import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../Shared/SideMenu/SideMenu.component';
import { UsuarioLogin } from '../Interfaces/Usuario';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SideMenuComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MainComponent implements OnInit {
  public userdata:UsuarioLogin|undefined; 
  constructor(private router: Router)
  { 
    if(localStorage.getItem("rwuserdata") == null)
    {
      this.router.navigate(["/auth"]);
    }
  }

  ngOnInit(): void { }

}
