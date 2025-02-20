import { CommonModule } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { Sucursal } from '../../../Interfaces/Sucursal';
import { Proveedor } from '../../../Interfaces/Proveedor';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ConsumoModel, Pedido } from '../../../Interfaces/pedido';
import { ArticuloPedido } from '../../../Interfaces/pedido';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { UsuarioLogin } from '../../../Interfaces/Usuario';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { KnobModule } from 'primeng/knob';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-pedido-temporal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    CheckboxModule,
    OverlayPanelModule,
    RadioButtonModule,
    KnobModule,
    TooltipModule
  ],
  providers:[MessageService,DatePipe,ConfirmationService],
  templateUrl: './PedidoTemporal.component.html',
})
export default class PedidoTemporalComponent implements OnInit {
  public catsucursales:Sucursal[] = [];
  public catproveedores:Proveedor[] = [];
  public proveedorsel:number = -999; 
  public sucursal:number = -999; 
  public loading:boolean= true;
  public verpedido:boolean = false;
  public pedidos:Pedido[] = [];
  public pedidosall:Pedido[] = []; 
  public pedidosel: Pedido | undefined; 
  public modaladduds:boolean = false; 
  public itemadduds:ArticuloPedido | undefined;
  public itemdetalles:ArticuloPedido | undefined;

  public modelmedida:string | undefined; 
  public modeluds:number | undefined;
  public modaldetallesart:boolean = false; 
  public justificacion:string = "NO SE REALIZO EL INVENTARIO";
  public errorsave:boolean = false;
  public inventariovalue:number = 0;

  public editarinventario:boolean = false; 
  public modalajustecompras:boolean = false; 
  public unidadesajustec:number = 0;
  public justificacionac:string = ""; 
  public tieneajustefinal:boolean = false; 
  public comentarioajuste:string = ''; 
  public filtrofecha:Date | undefined; 
  public btnrefresh:boolean = false; 
  public btnconfirmar:boolean = true; 
  public userdata:UsuarioLogin | undefined;

  public pedidosseleccionados:number[] = []; 
  public modaleliminarlineas:boolean= false; 
  public lineasrojas:ArticuloPedido[] = []; 
  public lineasrojassel:ArticuloPedido[] = []; 

  public cartonesplaneacion:number =0; 
  public diferenciacartones:number =0; 
  public editarcartones:boolean = false; 
  public cartonesupdate:number =0; 

  public oprecalcular:number = 1; 
  public recfiltroproveedor = -999; 
  public recfiltrosucursal = -999; 
  public fdescuento:number = 0; 
  constructor(public apiserv:ApiService, public cdr:ChangeDetectorRef,private messageService: MessageService,private datePipe: DatePipe,private confirmationService: ConfirmationService)
  {
    this.userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
    this.getSucursales();
    this.getProveedores();
    this.getPedidos();
  }


  ngOnInit(): void { }

  showMessage(sev:string,summ:string,det:string) {
    this.messageService.add({ severity: sev, summary: summ, detail: det });
}

getPedidos()
{
  this.apiserv.getPedidosT().subscribe({
    next: data => {
       this.pedidos = data; 

      this.calcularcartones(); 

       this.pedidosall = [...this.pedidos]; 
       this.loading = false; 
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

calcularcartones()
{
  this.pedidos.sort((a, b) => {
    if (a.nombreproveedor.toLowerCase() < b.nombreproveedor.toLowerCase()) {
      return -1;
    }
    if (a.nombreproveedor.toLowerCase() > b.nombreproveedor.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  for(let item of this.pedidos)
    {
        let cartonesplaneacion =0;
        let diferenciacartones =0;  
        if(item.tieneretornables)
          {
            for(let art of item.articulos)
              {
                if(art.esretornable && art.cajas>0)
                  {
                    cartonesplaneacion = cartonesplaneacion + art.cajas; 
                  }
              }
              diferenciacartones = item.cartones - cartonesplaneacion;
          }
        item.cartonesplaneacion = cartonesplaneacion;
        item.diferenciacartones = diferenciacartones; 

        item.articulos.sort((a, b) => {
          if (a.nombre.toLowerCase() < b.nombre.toLowerCase()) {
            return -1;
          }
          if (a.nombre.toLowerCase() > b.nombre.toLowerCase()) {
            return 1;
          }
          return 0;
        });
    }
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

  getProveedores()
  {
     this.apiserv.getProveedores().subscribe({
      next: data => {
         this.catproveedores=data;
         
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });

  }

  detallesPedido(pedido:Pedido)
  {
      this.btnconfirmar = true
    for(let item of pedido.articulos)
      {
          if(item.total_linea<0)
            {
              this.btnconfirmar = false; 
            }
      }
      this.pedidosel = undefined; 
      this.pedidosel = pedido; 
  
      if(pedido.cantidaddescuento)
        {
          this.fdescuento = pedido.cantidaddescuento; 
        } else{ this.fdescuento = 0;}
        
  
    this.verpedido = true; 
    if(this.btnconfirmar == false)
      {
        this.showMessage('info',"Info","El pedido no se puede confirmar con líneas en negativo");
      }
      console.log(this.pedidosel);
    this.cdr.detectChanges(); 
  }
  
  showModalAdduds(item:ArticuloPedido)
  {
    this.modaladduds = true;
    this.itemadduds = item; 
  }

  guardarMedidaUds()
  {  

    if(this.modelmedida == undefined || this.modelmedida == "")
      {
        this.showMessage('info',"Error","Favor de agregar una unidad de medida");
        return
      }

      if(this.modeluds == undefined || this.modeluds == 0)
        {
          this.showMessage('info',"Error","Favor de agregar la cantidad de unidades");
          return
        }
    const data =
    {
      rfc: this.pedidosel?.rfc,
      codarticulo: this.itemadduds?.codArticulo,
      umedida: this.modelmedida.toUpperCase(),
      uds: this.modeluds
    };

    this.apiserv.saveumedida(data).subscribe({
      next: data => {
        this.modaladduds = false
        this.showMessage('success',"Success","Guardado correctamente");
        this.modelmedida = undefined;
        this.modeluds = undefined;
        
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
  }

  showDetallesArt(item:ArticuloPedido)
  {
    this.modaldetallesart = true; 
   this.itemdetalles = item; 
   this.inventariovalue = item.inventariohoy;
   this.getModificacion(item.codArticulo);
  }

  getModificacion(idart:number)
  {
    this.apiserv.getModificacion(this.pedidosel!.id, idart).subscribe({
      next: data => {
        debugger
            if(data != null)
            {
                this.tieneajustefinal = true; 
            }else{ this.tieneajustefinal = false; }
         this.cdr.detectChanges();
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
  }

  getconsumopedidocad(arraycal:number[],consumos:ConsumoModel[]):string
  {
    let cad = '';  
    for(let i=0; i<arraycal.length; i++)
    {
      if(arraycal[i]>0)
        {  
          if(this.itemdetalles?.diasespeciales[i] != null)
            {
              cad+= '('+consumos[i].consumo+' * '+this.itemdetalles.diasespeciales[i].factorConsumo+") + ";
            } else 
            {
              cad+= consumos[i].consumo +" + ";
            }
          
        }
    }

     return cad.slice(0, -2);; 
  }

  getconsumopedido(arraycal:number[],consumos:ConsumoModel[]):number
  {
    let cad:number = 0;  
    for(let i=0; i<arraycal.length; i++)
    {
      if(arraycal[i]>0)
        {
          if(this.itemdetalles?.diasespeciales[i] != null)
            {
              cad+= (consumos[i].consumo*+this.itemdetalles.diasespeciales[i].factorConsumo);
            } else 
            {
              cad+= consumos[i].consumo;
            }
        }
    }

     return cad;
  }

 getStockSeguridad(factor:number,mayorc:number):number
 {
     return mayorc * factor;
 }

 getproyeccion(num1:number,num2:number,num3:number):number
 {
   let total = num1+num2-num3; 
   if(this.itemdetalles!.calendarioespecial){ total = total - this.itemdetalles!.unidadesextra }
    return total
 }   

updatepedido()
{
  const data = 
  {
    id: this.pedidosel?.id,
    codarticulo: this.itemdetalles?.codArticulo,
    justificacion: this.justificacion,
    inventario: this.inventariovalue,
    idusuario: this.userdata?.id
  };

  
  this.apiserv.UpdatePedido(data).subscribe({
    next: data => {
      this.showMessage('success',"Success","Guardado correctamente");
     // this.modaldetallesart = false;
      //this.verpedido = false; 
      if(this.filtrofecha == undefined)
        {
                  this.apiserv.getPedidosT().subscribe({
                    next: data => {
                      this.pedidos = data; 
                      this.calcularcartones(); 
                      this.pedidosall = [...this.pedidos]; 
                      this.loading = false; 
                
                      if(this.pedidosel != undefined)
                        {
                          let pedidoupdate = this.pedidos.filter(x =>x.id == this.pedidosel?.id);
                          if(pedidoupdate.length>0)
                           {
                             this.pedidosel = pedidoupdate[0];
                            if(this.itemdetalles != undefined)
                              {
                                let tempitem = this.pedidosel.articulos.filter(x => x.codArticulo == this.itemdetalles?.codArticulo);
                                if(tempitem.length>0)
                                  {
                                    this.itemdetalles = tempitem[0]; 
                                  }
                              }

                           }
                          this.cdr.detectChanges();
                        }
                
                      this.cdr.detectChanges();
                    },
                    error: error => {
                      console.log(error);
                      this.showMessage('error',"Error","Error al procesar la solicitud");
                    }
                });

        } else 
        {
          this.loading = true;

                this.apiserv.getPedidosTF(this.filtrofecha).subscribe({
                  next: data => {
                    this.pedidos = data; 
                    this.calcularcartones(); 
                  this.pedidosall = [...this.pedidos]; 
                  this.loading = false; 

                   if(this.pedidosel != undefined)
                    {
                       let pedidoupdate = this.pedidos.filter(x =>x.id == this.pedidosel?.id);
                       if(pedidoupdate.length>0)
                        {
                          this.pedidosel = pedidoupdate[0];
                          if(this.itemdetalles != undefined)
                            {
                              let tempitem = this.pedidosel.articulos.filter(x => x.codArticulo == this.itemdetalles?.codArticulo);
                              if(tempitem.length>0)
                                {
                                  this.itemdetalles = tempitem[0]; 
                                }
                            }
                        }
                       this.cdr.detectChanges();
                    }

                  
                  },
                  error: error => {
                    console.log(error);
                    this.showMessage('error',"Error","Error al procesar la solicitud");
                  }
              });
        }
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}  

filtrar()
{  
  this.pedidos = [...this.pedidosall]; 
  if(this.proveedorsel == -999 && this.sucursal == -999)
  {
    this.pedidos = [...this.pedidosall]; 
  }

  if(this.proveedorsel! > -999 && this.sucursal > -999)
    {  
      this.pedidos = this.pedidos.filter(p => p.codProveedor == this.proveedorsel && p.idSucursal == ''+this.sucursal);
    }

    if(this.proveedorsel! > -999 && this.sucursal == -999)
      {  
        this.pedidos = this.pedidos.filter(p => p.codProveedor == this.proveedorsel);
      }

      if(this.proveedorsel! == -999 && this.sucursal > -999)
        {  
          this.pedidos = this.pedidos.filter(p => p.idSucursal == ''+this.sucursal);
        }
}

editarinv()
{
  this.editarinventario = true; 
}

canceledit()
{
  this.editarinventario = false; 
}


confirmarpedido()
{
  this.loading = true;
  this.apiserv.ConfirmarPedido(this.pedidosel!.id).subscribe({
    next: data => {
      this.verpedido = false; 
      this.showMessage('success',"Success","Procesado correctamente");
      this.pedidosel = undefined; 
      this.loading = false;
       this.cdr.detectChanges();
       if(this.filtrofecha == undefined)
        {
          this.getPedidos();
        } else 
        {
          this.getpedidosFecha(); 
        }
    },
    error: error => {
       console.log(error);
       this.loading = false;
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

refreshpedidos()
{ 
  this.btnrefresh = true; 
  this.loading = true;

  this.apiserv.getStatusPedidos().subscribe({
    next: data => {

      if(data.status == 0)
        {
          this.apiserv.refreshPedidosT().subscribe({
            next: data => {
              this.showMessage('success',"Success","Lista de pedidos actualizada");
              this.btnrefresh = false; 
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            },
            error: error => {
              console.log(error);
              this.showMessage('error',"Error","Error al procesar la solicitud");
              this.btnrefresh = false; 
            }
        });
        
        }else
        {
          this.showMessage('error',"info","Hay una solicitud en proceso, intente más tarde");
          this.loading = false;
          this.btnrefresh  = false;
        }

    },
    error: error => {
      console.log(error);
      this.showMessage('error',"Error","Error al procesar la solicitud");
      this.btnrefresh = false; 
      this.loading = false; 
    }
});

}   


confirmartodo(event: Event)
{
  this.loading = true;
  let pedidosc = this.pedidos.filter(p => p.status == 1); 
  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: 'SE PROCESARAN '+pedidosc.length+' PEDIDO(S), DESEA CONTINUAR',
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon:"none",
    rejectIcon:"none",
    rejectButtonStyleClass:"btn btn-secondary me-2",
    acceptButtonStyleClass:"btn btn-success",
    accept: () => {
       
      //  this.confirmado(); 
       this.aceptartodoBack(); 

    },
    reject: () => {
      this.loading = false; 
    }
});




}

 async confirmado():Promise<void>
{  
  this.errorsave = false; 
  let pedidosc = this.pedidos.filter(p => p.status == 1 && p.total>0); 
  for(let pedido of pedidosc)
  {
    await this.save(pedido.id);
  } 
  
  if(this.filtrofecha == undefined)
    {
      this.getPedidos();
    } else 
    {
      this.getpedidosFecha(); 
    }

  if(this.errorsave == false)
    { 
     
      this.showMessage('success','Success','Procesado correctamente');
    }
    this.loading = false;
}


async save(id:number):Promise<void>
{
return new Promise<void>((resolve, reject) => {
  this.apiserv.ConfirmarPedido(id).subscribe({
      next: (data) => {
          resolve(); // Resuelve la promesa
      },
      error: (error) => {
          console.log(error);
          this.showMessage('error',"Error","Error al procesar la solicitud");
           this.loading=false; 
           this.errorsave = true;
          reject(error); 
      }
  });
});


}

aload()
{
  this.loading = true; 
}

getCajas(proyeccion:number):number
{
    return Math.ceil(proyeccion);
}

rechazarPedido()
{
  this.loading = true;
  this.apiserv.RechazarPedido(this.pedidosel!.id).subscribe({
    next: data => {
      this.loading = false; 
       this.verpedido= false;
       this.pedidosel = undefined; 
       if(this.filtrofecha == undefined)
        {
          this.getPedidos();
        } else 
        {
          this.getpedidosFecha(); 
        }
        this.showMessage('info',"Info","Pedido rechazado");
       this.cdr.detectChanges();
    },
    error: error => {
      this.loading = false; 
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

showmodalajustec()
{
  this.modalajustecompras = true; 
  this.unidadesajustec = this.itemdetalles!.cajas; 
}

aumentarac()
{
  this.unidadesajustec = this.unidadesajustec + 1;
}

restarac()
{
  if( (this.unidadesajustec - 1) >= 0)
    {
      this.unidadesajustec = this.unidadesajustec - 1;
    } else
    {
      this.showMessage('info',"Error","La cantidad de cajas debe ser mayor o igual a cero");
    }
 
}

guardarac()
{  
  if(this.comentarioajuste == "")
    {
      this.showMessage('info',"Error","Debe seleccionar un comentario");
      return;
    }

  if(this.justificacionac == "")
    {
      this.showMessage('info',"Error","Debe ingresar una justificación");
      return;
    }

   const data = {
    id: this.pedidosel?.id,
    justificacion: this.justificacionac,
    unidades: (this.unidadesajustec*this.itemdetalles!.unidadescaja),
    cajas : this.unidadesajustec,
    idusuario: this.userdata?.id,
    codarticulo: this.itemdetalles!.codArticulo,
    comentario: this.comentarioajuste
    };


    if(this.unidadesajustec == 0)
      {
        this.confirmarLineaEnCero(data); 
      } else
      {
        this.apiserv.guardarajustecompras(data).subscribe({
          next: data => {
            //this.tieneajustefinal = true; 
            this.modalajustecompras = false; 
            this.modaldetallesart = false;
            //this.verpedido = false; 
            this.justificacionac = '';
            this.comentarioajuste= ''; 
            if(this.filtrofecha == undefined)
              {
                        this.apiserv.getPedidosT().subscribe({
                          next: data => {
                            this.pedidos = data; 
                            this.calcularcartones(); 
                            this.pedidosall = [...this.pedidos]; 
                            this.loading = false; 
                      
                            if(this.pedidosel != undefined)
                              {
                                let pedidoupdate = this.pedidos.filter(x =>x.id == this.pedidosel?.id);
                                if(pedidoupdate.length>0)
                                 {
                                   this.pedidosel = pedidoupdate[0];
                                 }
                                this.cdr.detectChanges();
                              }
                      
                            this.cdr.detectChanges();
                          },
                          error: error => {
                            console.log(error);
                            this.showMessage('error',"Error","Error al procesar la solicitud");
                          }
                      });
  
              } else 
              {
                this.loading = true;
  
                      this.apiserv.getPedidosTF(this.filtrofecha).subscribe({
                        next: data => {
                          this.pedidos = data; 
                          this.calcularcartones(); 
                        this.pedidosall = [...this.pedidos]; 
                        this.loading = false; 
  
                         if(this.pedidosel != undefined)
                          {
                            debugger
                             let pedidoupdate = this.pedidos.filter(x =>x.id == this.pedidosel?.id);
                             if(pedidoupdate.length>0)
                              {
                                this.pedidosel = pedidoupdate[0];
                              }
                             this.cdr.detectChanges();
                          }
  
                        
                        },
                        error: error => {
                          console.log(error);
                          this.showMessage('error',"Error","Error al procesar la solicitud");
                        }
                    });
              }
             this.cdr.detectChanges();
             
             this.showMessage('success','Success','Guardado correctamente');
          },
          error: error => {
             console.log(error);
             this.showMessage('error',"Error","Error al procesar la solicitud");
          }
      });
      }


}


calcularuds()
{  
  let uds = (this.unidadesajustec * this.itemdetalles!.unidadescaja);
  return uds;
}


borrarajuste()
{
  this.apiserv.BorrarAjuste(this.pedidosel!.id, this.itemdetalles!.codArticulo).subscribe({
    next: data => {
      this.tieneajustefinal = false; 
      if(this.filtrofecha == undefined)
        {
                  this.apiserv.getPedidosT().subscribe({
                    next: data => {
                      this.pedidos = data; 
                      this.calcularcartones(); 
                      this.pedidosall = [...this.pedidos]; 
                      this.loading = false; 
                
                      if(this.pedidosel != undefined)
                        {
                          let pedidoupdate = this.pedidos.filter(x =>x.id == this.pedidosel?.id);
                          if(pedidoupdate.length>0)
                           {
                             this.pedidosel = pedidoupdate[0];
                             if(this.itemdetalles != undefined)
                              {
                                let tempitem = this.pedidosel.articulos.filter(x => x.codArticulo == this.itemdetalles?.codArticulo);
                                if(tempitem.length>0)
                                  {
                                    this.itemdetalles = tempitem[0]; 
                                  }
                              }
                           }
                          this.cdr.detectChanges();
                        }
                
                      this.cdr.detectChanges();
                    },
                    error: error => {
                      console.log(error);
                      this.showMessage('error',"Error","Error al procesar la solicitud");
                    }
                });

        } else 
        {
          this.loading = true;

                this.apiserv.getPedidosTF(this.filtrofecha).subscribe({
                  next: data => {
                    this.pedidos = data; 
                    this.calcularcartones(); 
                  this.pedidosall = [...this.pedidos]; 
                  this.loading = false; 

                   if(this.pedidosel != undefined)
                    {
                       let pedidoupdate = this.pedidos.filter(x =>x.id == this.pedidosel?.id);
                       if(pedidoupdate.length>0)
                        {
                          this.pedidosel = pedidoupdate[0];
                          if(this.itemdetalles != undefined)
                            {
                              let tempitem = this.pedidosel.articulos.filter(x => x.codArticulo == this.itemdetalles?.codArticulo);
                              if(tempitem.length>0)
                                {
                                  this.itemdetalles = tempitem[0]; 
                                }
                            }
                        }
                       this.cdr.detectChanges();
                    }

                  
                  },
                  error: error => {
                    console.log(error);
                    this.showMessage('error',"Error","Error al procesar la solicitud");
                  }
              });
        }
       this.cdr.detectChanges();
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}


getpedidosFecha()
{
  this.loading = true;
  if(this.filtrofecha == undefined)
    {
      this.showMessage('info',"Error","Favor de seleccionar un fecha");
      return;
    }

    this.apiserv.getPedidosTF(this.filtrofecha).subscribe({
      next: data => {
        this.pedidos = data; 
        this.calcularcartones(); 
       this.pedidosall = [...this.pedidos]; 
       this.loading = false; 

       this.cdr.detectChanges();
       console.log(this.pedidos);
      },
      error: error => {
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
}

notificarProv()
{
  this.loading = true;
    this.apiserv.enviarNotificaciones().subscribe({
      next: data => {
       if(data.success == true)
        {
          this.loading = false; 
          this.registrarnotificacion(1); 
          this.showMessage('success',"Success","Enviado correctamente");

        } else
        {
          this.loading = false; 
          this.showMessage('error',"Error",data.error);
        }
      },
      error: error => {
        this.loading = false; 
        this.registrarnotificacion(0); 
         console.log(error);
         this.showMessage('error',"Error","Error al procesar la solicitud");
      }
  });
}

aceptartodoBack()
{
  this.loading = true;
  let proveedor = -1;
  let sucursal = -1;

  if(this.proveedorsel>-1)
    {
      proveedor = this.proveedorsel; 
    }

    if(this.sucursal >-1)
      {
        sucursal = this.sucursal; 
      }
  this.apiserv.AceptaroTodosLosPedidosT(proveedor,sucursal,this.filtrofecha).subscribe({
    next: data => {
      this.loading = false; 
      if(this.filtrofecha == undefined)
        {
          this.getPedidos();
        } else 
        {
          this.getpedidosFecha(); 
        }
    
        this.showMessage('success',"Success","Procesados correctamente");
    },
    error: error => {
      this.loading = false; 
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}


registrarnotificacion(resp:number)
{
  this.apiserv.registroNotificacion(resp).subscribe({
    next: data => {
      this.loading = false;
    },
    error: error => {
      this.loading = false; 
       console.log(error);
    }
});
}

exportarExcel()
{ 
  this.loading = true;
  let data = JSON.stringify(this.pedidos);
  this.apiserv.ExcelPedidos(data).subscribe({
    next: data => {
      this.loading = false;
      this.cdr.detectChanges();
      const base64String = data.base64File; // Aquí debes colocar tu cadena base64 del archivo Excel

      // Decodificar la cadena base64
      const binaryString = window.atob(base64String);
  
      // Convertir a un array de bytes
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
  
      // Crear un Blob con los datos binarios
      const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
      // Crear una URL para el Blob
      const url = window.URL.createObjectURL(blob);
  
      // Crear un enlace para la descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = 'PEDIDOS PROGRAMADOS.xlsx'; // Establecer el nombre del archivo
      document.body.appendChild(link);
  
      // Hacer clic en el enlace para iniciar la descarga
      link.click();
  
      // Limpiar la URL y el enlace después de la descarga
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    },
    error: error => {
      this.loading = false; 
      this.showMessage('error','Error','Error al generar el archivo de excel');
      console.log(error);
     
    }
});
}

checkpedido(idp:number)
{

  const index = this.pedidosseleccionados.indexOf(idp);

    if (index > -1) {
      // El número existe, lo eliminamos
      this.pedidosseleccionados.splice(index, 1);
    } else {
      // El número no existe, lo agregamos
      this.pedidosseleccionados.push(idp);
    }

}

confirmarrechazar(event: Event)
{
  this.loading = true;
  let pedidosc = this.pedidos.filter(p => p.status == 1); 
  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: 'SE RECHAZARÁN '+this.pedidosseleccionados.length+' PEDIDO(S), ¿DESEA CONTINUAR?',
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon:"none",
    rejectIcon:"none",
    rejectButtonStyleClass:"btn btn-secondary me-2",
    acceptButtonStyleClass:"btn btn-success",
    accept: () => {
      this.rechazarPedidos(); 
    },
    reject: () => {
      this.loading = false; 
    }
});
}


rechazarPedidos()
{
  let data = JSON.stringify(this.pedidosseleccionados); 
  this.loading = true;
  this.apiserv.RechazarPedidos(data).subscribe({
    next: data => {
      this.loading = false; 
       this.verpedido= false;
       this.pedidosel = undefined; 
       if(this.filtrofecha == undefined)
        {
          this.getPedidos();
        } else 
        {
          this.getpedidosFecha(); 
        }
        this.showMessage('info',"Info","Pedidos rechazados");
       this.cdr.detectChanges();
    },
    error: error => {
      this.loading = false; 
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}


confirmarLineaEnCero(datareg:any)
{
  this.confirmationService.confirm({
    message: 'LAS LINEAS EN CERO SE ELIMINARAN DEL PEDIDO, ¿DESEA CONTINUAR?',
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon:"none",
    rejectIcon:"none",
    rejectButtonStyleClass:"btn btn-secondary me-2",
    acceptButtonStyleClass:"btn btn-danger",
    accept: () => {
      
      this.apiserv.guardarajustecompras(datareg).subscribe({
        next: data => {
          
          this.justificacionac = '';
          this.comentarioajuste= ''; 
          this.modalajustecompras = false; 
          this.modaldetallesart = false;
          this.EliminarLineaencero(datareg.id,datareg.codarticulo); 
           
        },
        error: error => {
           console.log(error);
           this.showMessage('error',"Error","Error al procesar la solicitud");
        }
    });

    },
    reject: () => {
      this.loading = false; 
    }
});
}


EliminarLineaencero(idpedido:number,codart:number)
{
  this.apiserv.EliminarLineaPedido(idpedido,codart).subscribe({
    next: data => {
      if(this.filtrofecha == undefined)
        {
                  this.apiserv.getPedidosT().subscribe({
                    next: data => {
                      this.pedidos = data; 
                      this.calcularcartones(); 
                      this.pedidosall = [...this.pedidos]; 
                      this.loading = false; 
                
                      if(this.pedidosel != undefined)
                        {
                          let pedidoupdate = this.pedidos.filter(x =>x.id == this.pedidosel?.id);
                          if(pedidoupdate.length>0)
                           {
                             this.pedidosel = pedidoupdate[0];
                           }
                          this.cdr.detectChanges();
                        }
                
                      this.cdr.detectChanges();
                    },
                    error: error => {
                      console.log(error);
                      this.showMessage('error',"Error","Error al procesar la solicitud");
                    }
                });

        } else 
        {
          this.loading = true;

                this.apiserv.getPedidosTF(this.filtrofecha).subscribe({
                  next: data => {
                    this.pedidos = data; 
                    this.calcularcartones(); 
                  this.pedidosall = [...this.pedidos]; 
                  this.loading = false; 

                   if(this.pedidosel != undefined)
                    {
                       let pedidoupdate = this.pedidos.filter(x =>x.id == this.pedidosel?.id);
                       if(pedidoupdate.length>0)
                        {
                          this.pedidosel = pedidoupdate[0];
                        }
                       this.cdr.detectChanges();
                    }

                  
                  },
                  error: error => {
                    console.log(error);
                    this.showMessage('error',"Error","Error al procesar la solicitud");
                  }
              });
        }
       this.cdr.detectChanges();
       
       
       this.showMessage('success','Success','Guardado correctamente');
    },
    error: error => {
       console.log(error);
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});

}

showEliminarlineas()
{
    this.modaleliminarlineas = true; 
    this.lineasrojas = this.pedidosel!.articulos.filter(x => x.total_linea<=0); 
    this.lineasrojassel = this.lineasrojas; 
}

eliminarlineas()
{
  this.confirmationService.confirm({
    message: 'SE ELIMINARAN '+this.lineasrojassel.length+' ARTÍCULOS DEL PEDIDO, ¿DESEA CONTINUAR?',
    header: 'Confirmación',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon:"none",
    rejectIcon:"none",
    rejectButtonStyleClass:"btn btn-secondary me-2",
    acceptButtonStyleClass:"btn btn-success",
    accept: () => {

      let arr_articulos:number[] =[];
      for(let item of this.lineasrojassel)
        {
          arr_articulos.push(item.codArticulo);
        }

      this.apiserv.eliminarlineasrojas(this.pedidosel!.id,JSON.stringify(arr_articulos),this.userdata!.id,).subscribe({
        next: data => {
          this.modaleliminarlineas = false;
         // this.verpedido = false; 
          if(this.filtrofecha == undefined)
            {
                      this.apiserv.getPedidosT().subscribe({
                        next: data => {
                          this.pedidos = data; 
                          this.calcularcartones(); 
                          this.pedidosall = [...this.pedidos]; 
                          this.loading = false; 
                    
                          if(this.pedidosel != undefined)
                            {
                              let pedidoupdate = this.pedidos.filter(x =>x.id == this.pedidosel?.id);
                              if(pedidoupdate.length>0)
                               {
                                 this.pedidosel = pedidoupdate[0];
                               }
                              this.cdr.detectChanges();
                            }
                    
                          this.cdr.detectChanges();
                        },
                        error: error => {
                          console.log(error);
                          this.showMessage('error',"Error","Error al procesar la solicitud");
                        }
                    });

            } else 
            {
              this.loading = true;

                    this.apiserv.getPedidosTF(this.filtrofecha).subscribe({
                      next: data => {
                        this.pedidos = data; 
                        this.calcularcartones(); 
                      this.pedidosall = [...this.pedidos]; 
                      this.loading = false; 

                       if(this.pedidosel != undefined)
                        {
                           let pedidoupdate = this.pedidos.filter(x =>x.id == this.pedidosel?.id);
                           if(pedidoupdate.length>0)
                            {
                              this.pedidosel = pedidoupdate[0];
                            }
                           this.cdr.detectChanges();
                        }

                      
                      },
                      error: error => {
                        console.log(error);
                        this.showMessage('error',"Error","Error al procesar la solicitud");
                      }
                  });
            }
           this.cdr.detectChanges();
           
           this.showMessage('success','Success','Guardado correctamente');
        },
        error: error => {
           console.log(error);
           this.showMessage('error',"Error","Error al procesar la solicitud");
        }
    });

    },
    reject: () => {
      this.loading = false; 
    }
});
 
}

tienelineasrojas(item:Pedido):boolean
{
  
  let tlr:boolean =false; 
  let lineasrojas = item.articulos.filter(x => x.total_linea<=0);
  if(lineasrojas.length>0)
    {
      tlr = true; 
    }

    let cartonesplaneacion =0;
    let diferenciacartones =0;  
    if(item.tieneretornables)
      {
        for(let itemp of item.articulos)
          {
            if(itemp.esretornable)
              {
                cartonesplaneacion = this.cartonesplaneacion + itemp.cajas; 
              }
          }
          diferenciacartones = item.cartones - cartonesplaneacion;
      }

      if(diferenciacartones<0)
        {
          tlr = true; 
        }

      
        for(let art of item.articulos)
          {
              if(art.tienelimitealmacen)
                {
                  if(art.unidadestotales>art.capacidadalmfinal)
                    {
                      tlr = true; 
                    }
                }
          }
  return tlr; 
}

showEditarCartones()
{
  this.editarcartones = true;
  this.justificacion = "NO SE REALIZO EL INVENTARIO"; 
  this.cartonesupdate = this.pedidosel!.cartones; 
}

cancelarEditarcartones()
{
  this.editarcartones = false;
}

updatecartones()
{
  this.loading = true;
  this.apiserv.updateCartones(this.pedidosel!.id,this.cartonesupdate,this.justificacion).subscribe({
    next: data => {
      // let i = this.pedidos.indexOf(this.pedidosel!); 
      // this.pedidosel!.cartones= this.cartonesupdate; 
      // this.pedidos[i] = this.pedidosel!; 
      this.editarcartones = false; 
      this.showMessage('success',"Success","Guardado correctamente"); 
      this.loading = false;

      if(this.filtrofecha == undefined)
        {
                  this.apiserv.getPedidosT().subscribe({
                    next: data => {
                      this.pedidos = data; 
                      this.calcularcartones(); 
                      this.pedidosall = [...this.pedidos]; 
                      this.loading = false; 
                
                      if(this.pedidosel != undefined)
                        {
                          let pedidoupdate = this.pedidos.filter(x =>x.id == this.pedidosel?.id);
                          if(pedidoupdate.length>0)
                           {
                             this.pedidosel = pedidoupdate[0];
                            if(this.itemdetalles != undefined)
                              {
                                let tempitem = this.pedidosel.articulos.filter(x => x.codArticulo == this.itemdetalles?.codArticulo);
                                if(tempitem.length>0)
                                  {
                                    this.itemdetalles = tempitem[0]; 
                                  }
                              }

                           }
                          this.cdr.detectChanges();
                        }
                
                      this.cdr.detectChanges();
                    },
                    error: error => {
                      console.log(error);
                      this.showMessage('error',"Error","Error al procesar la solicitud");
                    }
                });

        } else 
        {
          this.loading = true;

                this.apiserv.getPedidosTF(this.filtrofecha).subscribe({
                  next: data => {
                    this.pedidos = data; 
                    this.calcularcartones(); 
                  this.pedidosall = [...this.pedidos]; 
                  this.loading = false; 

                   if(this.pedidosel != undefined)
                    {
                       let pedidoupdate = this.pedidos.filter(x =>x.id == this.pedidosel?.id);
                       if(pedidoupdate.length>0)
                        {
                          this.pedidosel = pedidoupdate[0];
                          if(this.itemdetalles != undefined)
                            {
                              let tempitem = this.pedidosel.articulos.filter(x => x.codArticulo == this.itemdetalles?.codArticulo);
                              if(tempitem.length>0)
                                {
                                  this.itemdetalles = tempitem[0]; 
                                }
                            }
                        }
                       this.cdr.detectChanges();
                    }

                  
                  },
                  error: error => {
                    console.log(error);
                    this.showMessage('error',"Error","Error al procesar la solicitud");
                  }
              });
        }
      
    },
    error: error => {
       console.log(error);
       this.loading = false;
       this.showMessage('error',"Error","Error al procesar la solicitud");
    }
});
}

refreshpedidosF()
{ 
  this.btnrefresh = true; 
  this.loading = true;

  this.apiserv.getStatusPedidos().subscribe({
    next: data => {

      if(data.status == 0)
        {
          this.apiserv.refreshPedidosTf(this.recfiltroproveedor,this.recfiltrosucursal).subscribe({
            next: data => {
              this.showMessage('success',"Success","Lista de pedidos actualizada");
              this.btnrefresh = false; 
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            },
            error: error => {
              console.log(error);
              this.showMessage('error',"Error","Error al procesar la solicitud");
              this.btnrefresh = false; 
            }
        });
        
        }else
        {
          this.showMessage('error',"info","Hay una solicitud en proceso, intente más tarde");
          this.loading = false;
          this.btnrefresh  = false;
        }

    },
    error: error => {
      console.log(error);
      this.showMessage('error',"Error","Error al procesar la solicitud");
      this.btnrefresh = false; 
      this.loading = false; 
    }
});

}   

updateDescuentoPed()
{
  this.loading = true; 
  this.apiserv.updateDescuentoPed(this.pedidosel!.id,this.fdescuento).subscribe({
    next: data => {
      this.showMessage('success',"Success","Actualizado correctamente");
      this.refreshdataped();

      this.loading = false;
    },
    error: error => {
      this.loading = false; 
      this.showMessage('error',"Error","Error al procesar la solicitud");
       console.log(error);
    }
});
}

refreshdataped()
{
  if(this.filtrofecha == undefined)
    {
              this.apiserv.getPedidos().subscribe({
                next: data => {
                  this.pedidos = data; 
                  this.calcularcartones(); 
                  this.pedidosall = [...this.pedidos]; 
                  this.loading = false; 
            
                  if(this.pedidosel != undefined)
                    {
                      let pedidoupdate = this.pedidos.filter(x =>x.id == this.pedidosel?.id);
                      if(pedidoupdate.length>0)
                       {
                         this.pedidosel = pedidoupdate[0];
                        if(this.itemdetalles != undefined)
                          {
                            let tempitem = this.pedidosel.articulos.filter(x => x.codArticulo == this.itemdetalles?.codArticulo);
                            if(tempitem.length>0)
                              {
                                this.itemdetalles = tempitem[0]; 
                              }
                          }

                       }
                      this.cdr.detectChanges();
                    }
            
                  this.cdr.detectChanges();
                },
                error: error => {
                  console.log(error);
                  this.showMessage('error',"Error","Error al procesar la solicitud");
                }
            });

    } else 
    {
      this.loading = true;

            this.apiserv.getPedidosF(this.filtrofecha).subscribe({
              next: data => {
                this.pedidos = data; 
                this.calcularcartones(); 
              this.pedidosall = [...this.pedidos]; 
              this.loading = false; 

               if(this.pedidosel != undefined)
                {
                   let pedidoupdate = this.pedidos.filter(x =>x.id == this.pedidosel?.id);
                   if(pedidoupdate.length>0)
                    {
                      this.pedidosel = pedidoupdate[0];
                      if(this.itemdetalles != undefined)
                        {
                          let tempitem = this.pedidosel.articulos.filter(x => x.codArticulo == this.itemdetalles?.codArticulo);
                          if(tempitem.length>0)
                            {
                              this.itemdetalles = tempitem[0]; 
                            }
                        }
                    }
                   this.cdr.detectChanges();
                }

              
              },
              error: error => {
                console.log(error);
                this.showMessage('error',"Error","Error al procesar la solicitud");
              }
          });
    }
  
}

getConsumodp(item:ArticuloPedido):number
{
  let consumo = 0
  let index = item.arraycalendario.indexOf(1); 
  if(index>-1)
    {
      consumo = item.consumospromedios[index].consumo; 
    }
return consumo;
}

}
