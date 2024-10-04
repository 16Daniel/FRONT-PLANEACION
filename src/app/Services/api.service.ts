import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, throwError, timeout } from "rxjs";
import { environment } from '../../environments/enviroments';
import { Sucursal } from '../Interfaces/Sucursal';
import { Proveedor } from '../Interfaces/Proveedor';
import { Item } from '../Interfaces/Item';
import { Consumo } from '../Interfaces/Consumo';
import { Calendario, CalendarioTemporal } from '../Interfaces/Calendario';
import { DiasEspecial,DiasEspecialSuc,respuestaDiaEspecial } from '../Interfaces/DiasEspecial';
import { Inventario } from '../Interfaces/inventario';
import { Pedido, PedidoH } from '../Interfaces/pedido';
import { ItProducto } from '../Interfaces/ItProducto';
import { Parametro } from '../Interfaces/Parametro';
import { Modioficacion } from '../Interfaces/Modioficacion';
import { Rol } from '../Interfaces/Rol';
import { Ruta } from '../Interfaces/Ruta';
import { Usuario, UsuarioLogin } from '../Interfaces/Usuario';
import { Asignacion } from '../Interfaces/Asignacion.';
import { Retornable } from '../Interfaces/Retornable.';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL to web api
  public apiURL = environment.apiURL;
  // URL api server
  private url: string = environment.apiURL;
  private headers = new HttpHeaders();

  constructor(private http: HttpClient) 
  {
    this.headers.append("Accept", "application/json");
    this.headers.append("content-type", "application/json");
   }

   getSucursales():Observable<Sucursal[]>
   {
      return this.http.get<Sucursal[]>(this.url+'Catalogos/getSucursales',{headers:this.headers})
   }

   getProveedores():Observable<Proveedor[]>
   {
      return this.http.get<Proveedor[]>(this.url+'Catalogos/getProveedores',{headers:this.headers})
   }

   getItemprov():Observable<Item[]>
   {
      return this.http.get<Item[]>(this.url+'Catalogos/getItemsprov',{headers:this.headers})
   } 

   getConsumoPromedio(codsucursal:number, codarticulo:number, semanas:number, fecha:string):Observable<Consumo[]>
   {
      return this.http.get<Consumo[]>(this.url+`Catalogos/getConsumo/${codsucursal}/${codarticulo}/${semanas}/${fecha}`,{headers:this.headers})
   }

   saveCalendar(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+'Calendarios/saveCalendario',data,{headers:this.headers})
   }


   updateCalendar(data:any):Observable<any>
   {
      return this.http.put<any>(this.url+'Calendarios/updateCalendar',data,{headers:this.headers})
   }



   getCalendariosProv(codprov:number):Observable<Calendario[]>
   {
      return this.http.get<Calendario[]>(this.url+`Calendarios/getCalendarios/${codprov}`,{headers:this.headers})
   }


   deleteCalendar(id:number):Observable<any>
   {
      return this.http.delete<any>(this.url+`Calendarios/delete/${id}`,{headers:this.headers})
   }

   getDiasEspeciales():Observable<DiasEspecial[]>
   {
      return this.http.get<DiasEspecial[]>(this.url+'Calendarios/getDiasEspeciales',{headers:this.headers})
   }

   getDiasEspecialesSuc():Observable<DiasEspecialSuc[]>
   {
      return this.http.get<DiasEspecialSuc[]>(this.url+'DiaEspecialSucursal/getDiasEspecialesSucursales',{headers:this.headers})
   }

   createDiaEspecial(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+'Calendarios/CreateDiaEspecial',data,{headers:this.headers})
   }

   createDiaEspecialS(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+'DiaEspecialSucursal/CreateDiaEspecialSucursal',data,{headers:this.headers})
   }

   createDiasEspecialesS(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+'DiaEspecialSucursal/CreateDiasEspecialesSucursal',data,{headers:this.headers})
   }



   deleteDiaEspecial(id:number):Observable<any>
   {
      return this.http.delete<any>(this.url+`Calendarios/deleteDiaEspecial/${id}`,{headers:this.headers})
   }

   deleteDiasEspecialesSuc(data:string):Observable<any>
   {
      let formdata = new FormData();
      formdata.append("sucursales",data);
      return this.http.post<any>(this.url+'DiaEspecialSucursal/deleteC',formdata,{headers:this.headers})
   }


   updateDiaEspecial(data:DiasEspecial):Observable<any>
   {
      return this.http.put<any>(this.url+`Calendarios/UpdateDiaEspecial`,data,{headers:this.headers})
   }

   updateDiaEspecialSuc(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+`DiaEspecialSucursal/UpdateDiaEspecialSucursal`,data,{headers:this.headers})
   }

   esdiaespecial(data:any):Observable<respuestaDiaEspecial>
   {
      return this.http.post<respuestaDiaEspecial>(this.url+'Calendarios/esDiaEspecial',data,{headers:this.headers})
   }

   getCalenadrio(codprov:number,codsucursal:number):Observable<Calendario>
   {
      return this.http.get<Calendario>(this.url+`Calendarios/getCalendario/${codprov}/${codsucursal}`,{headers:this.headers})
   }

   getInventarios(sucursal:number,articulo:number,fechainicio:string,fechafin:string):Observable<Inventario[]>
   {
      return this.http.get<Inventario[]>(this.url+`Pedidos/getinventarios/${sucursal}/${articulo}?fechainicio=${fechainicio}&fechafin=${fechafin}`,{headers:this.headers})
   }

   getPedidos():Observable<Pedido[]>
   {

      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      return this.http.get<Pedido[]>(this.url+`Pedidos/getPedidos/${idu}`,{headers:this.headers})
   }

   getPedidosT():Observable<Pedido[]>
   {

      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      return this.http.get<Pedido[]>(this.url+`PedidoTemporal/getPedidos/${idu}`,{headers:this.headers})
   }

   refreshPedidos():Observable<Pedido[]>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      return this.http.get<Pedido[]>(this.url+`Pedidos/getPedidosHoy/${idu}`,{headers:this.headers})
   }

   refreshPedidosT():Observable<Pedido[]>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      return this.http.get<Pedido[]>(this.url+`PedidoTemporal/getPedidosHoy/${idu}`,{headers:this.headers})
   }

   saveumedida(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+'Pedidos/GuardarMedidaUds',data,{headers:this.headers})
   }

   getMedidasuds():Observable<ItProducto[]>
   {
      return this.http.get<ItProducto[]>(this.url+`Pedidos/GetMedidasUds`,{headers:this.headers})
   }

   deleteUmedida(id:string):Observable<any>
   {
      return this.http.delete<any>(this.url+`Pedidos/DeleteMedidaUds/${id}`,{headers:this.headers})
   }

   UpdateMedidauds(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+`Pedidos/UpdateMedidaUds`,data,{headers:this.headers})
   }

   UpdatePedido(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+`Pedidos/UpdatePedido`,data,{headers:this.headers})
   }

   ConfirmarPedido(id:number):Observable<any>
   {
      return this.http.get<any>(this.url+`Pedidos/ConfirmarPedido/${id}`,{headers:this.headers})
   }

   RechazarPedido(id:number):Observable<any>
   {
      return this.http.get<any>(this.url+`Pedidos/rechazarPedido/${id}`,{headers:this.headers})
   }

   RechazarPedidos(data:string):Observable<any>
   {
      let formdata = new FormData();
      formdata.append("jdata",data);
      return this.http.post<any>(this.url+`Pedidos/rechazarPedidos`,formdata,{headers:this.headers})
   }
   
   getPedidosH():Observable<PedidoH[]>
   {
      return this.http.get<PedidoH[]>(this.url+`Pedidos/getHistorialPedidos`,{headers:this.headers})
   }

   getParametros():Observable<Parametro>
   {
      return this.http.get<Parametro>(this.url+`Pedidos/getParametros`,{headers:this.headers})
   }

   guardarParametros(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+`Pedidos/guardarParametros`,data,{headers:this.headers})
   }

   guardarajustecompras(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+`Pedidos/AjusteCompras`,data,{headers:this.headers})
   }

   getModificacion(idp:number, codArticulo:number):Observable<Modioficacion>
   {
      return this.http.get<Modioficacion>(this.url+`Pedidos/estatusAjusteC/${idp}/${codArticulo}`,{headers:this.headers})
   }

   BorrarAjuste(idp:number, codArticulo:number):Observable<Modioficacion>
   {
      return this.http.get<Modioficacion>(this.url+`Pedidos/BorrarAjusteC/${idp}/${codArticulo}`,{headers:this.headers})
   }

   getRoles():Observable<Rol[]>
   {
      return this.http.get<Rol[]>(this.url+`Roles/getRoles`,{headers:this.headers})
   }

   createRol(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+'Roles/createRol',data,{headers:this.headers})
   }

   deleteRol(id:number):Observable<any>
   {
      return this.http.get<any>(this.url+`Roles/deleteRol/${id}`,{headers:this.headers})
   }

   updateRol(data:Rol):Observable<any>
   {
      return this.http.post<any>(this.url+`Roles/updateRol`,data,{headers:this.headers})
   }

   getPedidosF(fechap:Date):Observable<Pedido[]>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      let formdata = new FormData();
      formdata.append("fecha",fechap.toString());
      formdata.append("idu",idu)
      return this.http.post<Pedido[]>(this.url+`Pedidos/getPedidosFecha`,formdata,{headers:this.headers})
   }

   getPedidosTF(fechap:Date):Observable<Pedido[]>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      let formdata = new FormData();
      formdata.append("fecha",fechap.toString());
      formdata.append("idu",idu)
      return this.http.post<Pedido[]>(this.url+`PedidoTemporal/getPedidosFecha`,formdata,{headers:this.headers})
   }

   getItemprovp(idp:number):Observable<Item[]>
   {
      return this.http.get<Item[]>(this.url+`Catalogos/getItemsprovPlaneacion/${idp}`,{headers:this.headers})
   } 

   getItemsCal(idc:number):Observable<Item[]>
   {
      return this.http.get<Item[]>(this.url+`Catalogos/getItemsCal/${idc}`,{headers:this.headers})
   } 


   getPedidosFH(fechai:Date,fechaf:Date):Observable<PedidoH[]>
   {
      let formdata = new FormData();
      formdata.append("fechai",fechai.toString());
      formdata.append("fechaf",fechaf.toString());
      return this.http.post<PedidoH[]>(this.url+`Pedidos/getPedidosFechaH`,formdata,{headers:this.headers})
   }

   enviarNotificaciones():Observable<any>
   {
      return this.http.get<Item[]>(`https://operamx.no-ip.net/WS_RebelNotificaciones/Notificaciones`,{headers:this.headers})
   }

   ExcelHistorialPedidos(data:string):Observable<any>
   {
      let formdata = new FormData();
      formdata.append("jdata",data);
      return this.http.post<any>(this.url+`Pedidos/ExcelHistorialpedidos`,formdata,{headers:this.headers})
   }

   ExcelPedidos(data:string):Observable<any>
   {
      let formdata = new FormData();
      formdata.append("jdata",data);
      return this.http.post<any>(this.url+`Pedidos/ExcelPedidos`,formdata,{headers:this.headers})
   }

   getRutas():Observable<Ruta[]>
   {
      return this.http.get<Ruta[]>(this.url+`Roles/getRutas`,{headers:this.headers})
   }

   guardaraccesos(jdata:string,idr:number):Observable<any>
   {
      let formdata = new FormData();
      formdata.append("jdata",jdata);
      formdata.append("idr",idr.toString());
      return this.http.post<any>(this.url+`Roles/saveAccesos`,formdata,{headers:this.headers})
   }

   getRutasRol(idr:number):Observable<Ruta[]>
   {
      return this.http.get<Ruta[]>(this.url+`Roles/getRutasRol/${idr}`,{headers:this.headers})
   }

   getusuarios():Observable<Usuario[]>
   {
      return this.http.get<Usuario[]>(this.url+`Usuarios/getusUarios`,{headers:this.headers})
   }

   createUser(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+'Usuarios/createUser',data,{headers:this.headers})
   }

   deleteUser(id:number):Observable<any>
   {
      return this.http.get<any>(this.url+`Usuarios/deleteUser/${id}`,{headers:this.headers})
   }

   updateUser(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+'Usuarios/updateUser',data,{headers:this.headers})
   }

   AceptaroTodosLosPedidos(idprov:number,idsuc:number,fecha:Date|undefined):Observable<any>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      let formdata = new FormData();
      formdata.append("proveedor",idprov.toString());
      formdata.append("sucursal",idsuc.toString());
      formdata.append("idu",idu); 
      if(fecha != undefined)
         {
            formdata.append("fecha",fecha.toString());
         }
      return this.http.post<any>(this.url+`Pedidos/AceptarTodo`,formdata,{headers:this.headers})
   }

   AceptaroTodosLosPedidosT(idprov:number,idsuc:number,fecha:Date|undefined):Observable<any>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      let formdata = new FormData();
      formdata.append("proveedor",idprov.toString());
      formdata.append("sucursal",idsuc.toString());
      formdata.append("idu",idu); 
      if(fecha != undefined)
         {
            formdata.append("fecha",fecha.toString());
         }
      return this.http.post<any>(this.url+`PedidoTemporal/AceptarTodo`,formdata,{headers:this.headers})
   }

   registroNotificacion(resp:number):Observable<any>
   {
      return this.http.get<any>(this.url+`Pedidos/notificar/${resp}`,{headers:this.headers})
   }

   getNotificacion(resp:number):Observable<any>
   {
      return this.http.get<any>(this.url+`Pedidos/getNotificacion`,{headers:this.headers})
   }

   login(data:any):Observable<UsuarioLogin>
   {
      return this.http.post<UsuarioLogin>(this.url+`Usuarios/Login`,data,{headers:this.headers})
   }

   EliminarLineaPedido(idp:number,codart:number):Observable<any>
   {
      let formdata = new FormData();
      formdata.append("idp",idp.toString());
      formdata.append("codart",codart.toString());
      return this.http.post<any>(this.url+`Pedidos/EliminarLinea`,formdata,{headers:this.headers})
   }

   eliminarlineasrojas(idp:number, articulos:string,idu:number):Observable<respuestaDiaEspecial>
   {
      let formdata = new FormData();
      formdata.append("idp",idp.toString());
      formdata.append("articulosp",articulos);
      formdata.append("idu",idu.toString());
      return this.http.post<respuestaDiaEspecial>(this.url+'Pedidos/EliminarLineas',formdata,{headers:this.headers})
   }

   testvpn():Observable<any>
   {
      return this.http.get<any>("https://operamx.no-ip.net/back/api_planeacion/api/Usuarios/TestCon",{headers:this.headers}).pipe(
         timeout(5000), // Tiempo de espera de 5 segundos
         catchError(error => {
           return throwError(error);
         })
       );
   }

   
   getStatusPedidos():Observable<any>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      return this.http.get<any>(this.url+`Pedidos/StatusPedidos/${idu}`,{headers:this.headers})
   }

   guardarAsignacioones(idprov:number, idu:number, sucursales:string):Observable<any>
   {
      let formdata = new FormData();
      formdata.append("idprov",idprov.toString());
      formdata.append("idu",idu.toString());
      formdata.append("jdsucursales",sucursales);
      return this.http.post<any>(this.url+'AsignacionProv/addAsignacionProv',formdata,{headers:this.headers})
   }

   getAsignaiones():Observable<Asignacion[]>
   {
      return this.http.get<Asignacion[]>(this.url+`AsignacionProv/getAsignaciones`,{headers:this.headers})
   }


   deleteAsignaciones(jdata:string):Observable<any>
   {
      let formdata = new FormData();
      return this.http.delete<any>(this.url+`AsignacionProv/deleteAsignacionesProv/${jdata}`,{headers:this.headers})
   }

   logout():Observable<any>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      return this.http.get<any>(this.url+`Usuarios/logout/${idu}`,{headers:this.headers})
   }

   saveRetornable(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+'Retornables/AgregarArticulo',data,{headers:this.headers})
   }

   getDataRetornables():Observable<Retornable[]>
   {
      return this.http.get<Retornable[]>(this.url+`Retornables/getData`,{headers:this.headers})
   }

   deleteRetornable(id:number):Observable<any>
   {
      return this.http.delete<any>(this.url+`Retornables/DeleteArt/${id}`,{headers:this.headers})
   }

   updateCartones(idp:number,cartones:number,justificacion:string):Observable<any>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      let formdata = new FormData();
      formdata.append("idu",idu); 
      formdata.append("cartones",cartones.toString()); 
      formdata.append("justificacion",justificacion); 
      formdata.append("idp",idp.toString()); 

      return this.http.post<any>(this.url+`Pedidos/UpdateCartonesPedido`,formdata,{headers:this.headers})
   }

   refreshPedidosf(filtroprov:number,filtrosuc:number):Observable<any>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      let formdata = new FormData();
      formdata.append("idu",idu); 
      formdata.append("filtroproveedor",filtroprov.toString()); 
      formdata.append("filtrosucursal",filtrosuc.toString()); 

      return this.http.post<any>(this.url+`Pedidos/recalcularpedidos`,formdata,{headers:this.headers})
   }

   refreshPedidosTf(filtroprov:number,filtrosuc:number):Observable<any>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      let formdata = new FormData();
      formdata.append("idu",idu); 
      formdata.append("filtroproveedor",filtroprov.toString()); 
      formdata.append("filtrosucursal",filtrosuc.toString()); 

      return this.http.post<any>(this.url+`PedidoTemporal/recalcularpedidos`,formdata,{headers:this.headers})
   }

   getCalendariosTemporales():Observable<CalendarioTemporal[]>
   {
      return this.http.get<CalendarioTemporal[]>(this.url+`Calendarios/getCalendariosTemporales`,{headers:this.headers})
   }

   
   deleteCalendariosTemporales(jdata:string):Observable<any>
   {
      return this.http.delete<any>(this.url+`Calendarios/deleteCalendariostemporales/${jdata}`,{headers:this.headers})
   }

}

