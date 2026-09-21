import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { MessageService } from 'primeng/api';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { Item } from '../../../Interfaces/Item';
import { ParametrosConfig } from '../../../Interfaces/invDiarioASem';

@Component({
  selector: 'app-inv-diario-asem',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    ButtonModule,
    ToastModule,
    CardModule],
  providers:[MessageService], 
  templateUrl: './invDiarioASem.html',
  styleUrl: './invDiarioASem.scss',
})
export default class InvDiarioASem implements OnInit {
public catsucursales:Sucursal[] = []; 
public catItems:Item[] = []; 
form!: FormGroup;
  loading: boolean = false;

    constructor(public apiserv:ApiService, public cdr:ChangeDetectorRef,private messageService: MessageService,private fb: FormBuilder)
    {
      this.getSucursales(); 
      this.getCatItems(); 
    }

  ngOnInit(): void 
  {
    this.initForm();
    this.cargarDatos();
  }
  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

  getSucursales()
{
   this.apiserv.getSucursales().subscribe({
    next: data => {
       this.catsucursales=data;
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

  getCatItems()
{
   this.apiserv.getItemsinvDiario().subscribe({
    next: data => {
       this.catItems=data;
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

private initForm(): void {
    this.form = this.fb.group({
      sucursalIds: [[], Validators.required],
      articuloIds: [[], Validators.required]
    });
  }

cargarDatos(): void {
    this.loading = true;
    
    this.apiserv.getconfigInvDiarioASem().subscribe({
          next: (config) => {
            this.form.patchValue({
              sucursalIds: config.sucursalIds || [],
              articuloIds: config.articuloIds || []
            });
            this.loading = false;
          },
          error: () =>{ this.loading = false 
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los catálogos' }); }
        });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload: ParametrosConfig = this.form.value;

    this.apiserv.guardarconfigInvDiarioASem(payload).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Los parámetros se guardaron con éxito en SQL Server'
        });
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al guardar'
        });
      }
    });
  }

}
