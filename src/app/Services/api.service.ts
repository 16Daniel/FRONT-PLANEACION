import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, throwError, timeout } from "rxjs";
import { environment } from '../../environments/enviroments';
import { Sucursal } from '../Interfaces/Sucursal';
import { Proveedor } from '../Interfaces/Proveedor';
import { Item, ItemPS } from '../Interfaces/Item';
import { Consumo } from '../Interfaces/Consumo';
import { Calendario, CalendarioTemporal } from '../Interfaces/Calendario';
import { DiasEspecial,DiasEspecialSuc,respuestaDiaEspecial } from '../Interfaces/DiasEspecial';
import { Inventario } from '../Interfaces/inventario';
import { ArticuloPedSuc, Pedido, PedidoH, PedidoSuc } from '../Interfaces/pedido';
import { ItProducto } from '../Interfaces/ItProducto';
import { Parametro } from '../Interfaces/Parametro';
import { Modioficacion } from '../Interfaces/Modioficacion';
import { Rol } from '../Interfaces/Rol';
import { Ruta } from '../Interfaces/Ruta';
import { Usuario, UsuarioLogin } from '../Interfaces/Usuario';
import { Asignacion } from '../Interfaces/Asignacion.';
import { Retornable } from '../Interfaces/Retornable.';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { Almacenaje } from '../Interfaces/Almacenaje';
import { Diferencia } from '../Interfaces/Diferencia';

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
   getProveedoresAllPedSuc():Observable<Proveedor[]>
   {
      return this.http.get<Proveedor[]>(this.url+'Catalogos/getProveedoresPedSuc',{headers:this.headers})
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
      //return this.http.get<Pedido[]>(this.url+`Pedidosprueba/getPedidos/${idu}`,{headers:this.headers})
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

   getMedidasudsSucursales():Observable<ItProducto[]>
   {
      return this.http.get<ItProducto[]>(this.url+`Pedidos/GetMedidasUdsSucursales`,{headers:this.headers})
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

   getPedidosSucF(fechap:Date,ids:number):Observable<PedidoSuc[]>
   {  
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id;
      let formdata = new FormData();
      formdata.append("fecha",fechap.toString());
      formdata.append("ids",ids.toString());
      formdata.append("idu",idu.toString())
      return this.http.post<PedidoSuc[]>(this.url+`PedidosSucursal/getPedidosFecha`,formdata,{headers:this.headers})
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

   getItemprovp(idp:number):Observable<any>
   {
      return this.http.get<any>(this.url+`Catalogos/getItemsprovPlaneacion/${idp}`,{headers:this.headers})
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

   login(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+`Usuarios/Login`,data,{headers:this.headers})
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

   guardarAsignacionesPedSuc(idprov:number, idu:number, sucursales:string):Observable<any>
   {
      let formdata = new FormData();
      formdata.append("idprov",idprov.toString());
      formdata.append("idu",idu.toString());
      formdata.append("jdsucursales",sucursales);
      return this.http.post<any>(this.url+'AsignacionProv/addAsignacionProvPedSuc',formdata,{headers:this.headers})
   }


   getAsignaiones():Observable<Asignacion[]>
   {
      return this.http.get<Asignacion[]>(this.url+`AsignacionProv/getAsignaciones`,{headers:this.headers})
   }

   getPedSucAsignaiones():Observable<Asignacion[]>
   {
      return this.http.get<Asignacion[]>(this.url+`AsignacionProv/getAsignacionesPedSuc`,{headers:this.headers})
   }


   deleteAsignaciones(jdata:string):Observable<any>
   {
      let formdata = new FormData();
      return this.http.delete<any>(this.url+`AsignacionProv/deleteAsignacionesProv/${jdata}`,{headers:this.headers})
   }

   deleteAsignacionesPedSuc(jdata:string):Observable<any>
   {
      let formdata = new FormData();
      return this.http.delete<any>(this.url+`AsignacionProv/deleteAsignacionesProvPedSuc/${jdata}`,{headers:this.headers})
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
      //return this.http.post<any>(this.url+`Pedidosprueba/recalcularpedidos`,formdata,{headers:this.headers})
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

   saveDatatAlmacen(data:any):Observable<any>
   {
      return this.http.post<any>(this.url+'Almacenaje/Savedata',data,{headers:this.headers})
   }


   getDataAlmacenaje():Observable<Almacenaje[]>
   {
      return this.http.get<Almacenaje[]>(this.url+`Almacenaje/getdata`,{headers:this.headers})
   }

   deleteAlmacenajes(jdata:string):Observable<any>
   {
      return this.http.delete<any>(this.url+`Almacenaje/deleteData/${jdata}`,{headers:this.headers})
   }

   getDiferencias(fecha:Date):Observable<Diferencia[]>
   {
    let formdata = new FormData();
    formdata.append("fecha",fecha.toISOString());
    return this.http.post<Diferencia[]>(this.url+'Diferencias/getDiferencias',formdata,{headers:this.headers})
   }

   getMermasSuc(fecha:Date,ids:string,codart:number):Observable<any[]>
   {
    let formdata = new FormData();
    formdata.append("fecha",fecha.toISOString());
    formdata.append("sucursal",ids);
    formdata.append("codart",codart.toString());
    return this.http.post<any[]>(this.url+'Diferencias/getMermasSucursal',formdata,{headers:this.headers})
   }

   getLineaInv(fecha:Date,ids:string,codart:number):Observable<any[]>
   {
     
    let formdata = new FormData();
    formdata.append("sucursal",ids);
    formdata.append("articulo",codart.toString());
    formdata.append("fecha",fecha.toISOString());
    return this.http.post<any[]>(this.url+'Diferencias/getLineaInv',formdata,{headers:this.headers})
   }

   UpdateInv(id:number,unidades:number):Observable<any[]>
   {
       let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
    let formdata = new FormData();
    formdata.append("id",id.toString());
    formdata.append("unidades",unidades.toString());
    formdata.append("idu",idu); 
    return this.http.post<any[]>(this.url+'Diferencias/UpdateUnidades',formdata,{headers:this.headers})
   }

   addInv(codalm:string,unidades:number,codart:number,fecha:Date):Observable<any[]>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
    let formdata = new FormData();
    formdata.append("codalm",codalm);
    formdata.append("unidades",unidades.toString());
    formdata.append("codart",codart.toString()); 
    formdata.append("idu",idu); 
    formdata.append("fecha",fecha.toISOString()); 
    return this.http.post<any[]>(this.url+'Diferencias/AddInv',formdata,{headers:this.headers})
   }

   updatemermas(codalm:string,unidadesanterior:number,unidades:number,codart:number,fecha:Date):Observable<any[]>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      let data = 
      {
         codalmacen: codalm,
         codarticulo: codart,
         cantidadanterior: unidadesanterior,
         nuevacantidad: unidades,
         fecha: fecha,
         idu: idu.toString()
      }
    return this.http.post<any[]>(this.url+'Diferencias/updateMermas',data,{headers:this.headers})
   }

   getDescuentos():Observable<any[]>
   {
      return this.http.get<any[]>(this.url+`Descuentos/getProveedoresDescuentos`,{headers:this.headers})
   }
   deleteDescuento(id:number):Observable<any>
   {
      return this.http.delete<any>(this.url+`Descuentos/deleteDescuento/${id}`,{headers:this.headers})
   } 

   addDescuento(codprov:number):Observable<any[]>
   {
    return this.http.post<any[]>(this.url+'Descuentos/addDescuento/'+codprov,{headers:this.headers})
   }

   updateDescuentoPed(idp:number,descuento:number):Observable<any[]>
   {
      let formdata = new FormData();
      formdata.append("idp",idp.toString());
      formdata.append("descuento",descuento.toString());
    return this.http.post<any[]>(this.url+'Descuentos/UpdateDescuentoPedido',formdata,{headers:this.headers})
   }


   getDiferenciaLin(fecha:Date,codalm:string,codart:number):Observable<Diferencia[]>
   {
    let formdata = new FormData();
    formdata.append("fecha",fecha.toISOString());
    formdata.append("codalm",codalm);
    formdata.append("codart",codart.toString());
    return this.http.post<Diferencia[]>(this.url+'Diferencias/getDiferenciaLin',formdata,{headers:this.headers})
   }

   getProveedoresPedSuc(idperfil:number,idsuc:number):Observable<Proveedor[]>
   {
      return this.http.get<Proveedor[]>(this.url+'PedidosSucursal/getProveedoresPedSuc/'+idperfil+'/'+idsuc,{headers:this.headers})
   }

   getItemprovPedSuc(idprov:number,idperfil:number):Observable<ItemPS[]>
   {
      return this.http.get<ItemPS[]>(this.url+'PedidosSucursal/getItemsprovPedSuc/'+idprov+'/'+idperfil,{headers:this.headers})
   } 

   getProveedoresPedSucConfig():Observable<Proveedor[]>
   {
      return this.http.get<Proveedor[]>(this.url+'PedidosSucursal/getProveedores',{headers:this.headers})
   }

   getItemprovPedSucConfig(idprov:number):Observable<ItemPS[]>
   {
      return this.http.get<ItemPS[]>(this.url+'PedidosSucursal/getItemsprov/'+idprov,{headers:this.headers})
   } 

   getSucursalesProvPedSucConfig(idprov:number,idperfil:number):Observable<Sucursal[]>
   {
      return this.http.get<Sucursal[]>(this.url+'PedidosSucursal/getSucursalesProvPedSuc/'+idprov+'/'+idperfil,{headers:this.headers})
   } 

   addProvPedSuc(idprov:number,jdata:string,idperfil:number):Observable<Diferencia[]>
   {
    let formdata = new FormData();
    formdata.append("idprov",idprov.toString());
    formdata.append("jdata",jdata);
    formdata.append("idperfil",idperfil.toString(9)); 
    return this.http.post<Diferencia[]>(this.url+'PedidosSucursal/agregarProveedor',formdata,{headers:this.headers})
   }

   deleteprovpedsuc(id:number,idperfil:number):Observable<any>
   {
      return this.http.delete<any>(this.url+`PedidosSucursal/deleteProvPedSuc/${id}/${idperfil}`,{headers:this.headers})
   }

   agregaritemsprovpedsuc(idprov:number,jdata:string,idperfil:number,sucursales:string):Observable<any>
   {
    let formdata = new FormData();
    formdata.append("idprov",idprov.toString());
    formdata.append("jdata",jdata);
    formdata.append("idperfil",idperfil.toString()); 
    formdata.append("sucursales",sucursales); 
    return this.http.post<any>(this.url+'PedidosSucursal/agregarItems',formdata,{headers:this.headers})
   }

   getSucursaluser():Observable<Sucursal>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      return this.http.get<Sucursal>(this.url+`PedidosSucursal/getSucUser/${idu}`,{headers:this.headers})
   }

   previewpedidosuc(data:any):Observable<ArticuloPedSuc[]>
   {
    return this.http.post<ArticuloPedSuc[]>(this.url+'PedidosSucursal/PreviewPedido',data,{headers:this.headers})
   }

   guardarpedidosuc(data:any):Observable<any>
   {
    return this.http.post<any>(this.url+'PedidosSucursal/GuardarPedido',data,{headers:this.headers})
   }

   getPedidosSuc(idsuc:number):Observable<PedidoSuc[]>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id;

      return this.http.get<PedidoSuc[]>(this.url+`PedidosSucursal/getPedidos/${idsuc}/${idu}`,{headers:this.headers})
   }

   RechazarPedidoSuc(id:number):Observable<any>
   {
      return this.http.get<any>(this.url+`PedidosSucursal/rechazarPedido/${id}`,{headers:this.headers})
   }

   getPedidosSucH(idsuc:number,fechaini:Date,fechafin:Date):Observable<PedidoSuc[]>
   {
      let formdata = new FormData();
      formdata.append("fechaini",fechaini.toISOString());
      formdata.append("fechafin",fechafin.toISOString());
      formdata.append("idsuc",idsuc.toString()); 
      return this.http.post<PedidoSuc[]>(this.url+`PedidosSucursal/getPedidosH`,formdata,{headers:this.headers})
   }

   updateDescuentoPedSuc(idp:number,descuento:number):Observable<any[]>
   {
      let formdata = new FormData();
      formdata.append("idp",idp.toString());
      formdata.append("descuento",descuento.toString());
    return this.http.post<any[]>(this.url+'Descuentos/UpdateDescuentoPedidoSuc',formdata,{headers:this.headers})
   }

   eliminarItemPedidoSuc(idp:number,codart:number):Observable<any>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      return this.http.delete<any>(this.url+`PedidosSucursal/eliminarItem/${idp}/${codart}/${idu}`,{headers:this.headers})
   }

   updateItemPedSuc(idp:number,codart:number,cajas:number,unidades:number,justificacion:string,comentario:string):Observable<PedidoSuc[]>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      let formdata = new FormData();
      formdata.append("idp",idp.toString());
      formdata.append("codart",codart.toString());
      formdata.append("cajas",cajas.toString());
      formdata.append("unidades",unidades.toString()); 
      formdata.append("idu",idu.toString());
      formdata.append("justificacion",justificacion);
      formdata.append("comentario",comentario);
      return this.http.post<PedidoSuc[]>(this.url+`PedidosSucursal/updateitemPedSuc`,formdata,{headers:this.headers})
   }

   ConfirmarPedidoSuc(id:number):Observable<any>
   {
      return this.http.get<any>(this.url+`PedidosSucursal/ConfirmarPedido/${id}`,{headers:this.headers})
   }

   getSucursalesInvT():Observable<any[]>
   {
      return this.http.get<any[]>(this.url+'Inventarioteorico/getSucsinvt',{headers:this.headers})
   }

   getProvsSucinvT(ids:number):Observable<any[]>
   {
      return this.http.get<any[]>(this.url+'Inventarioteorico/getProvsSuc/'+ids,{headers:this.headers})
   }

   deletesucursalInvt(id:number):Observable<any[]>
   {
      return this.http.get<any[]>(this.url+'Inventarioteorico/deleteSuc/'+id,{headers:this.headers})
   }

   addsucursalInvt(id:number,jdata:string):Observable<any[]>
   {
      return this.http.get<any[]>(this.url+'Inventarioteorico/addSuc/'+id+'/'+jdata,{headers:this.headers})
   }

   getItemsDisponiblesPed(id:number):Observable<ArticuloPedSuc[]>
   {
      return this.http.get<ArticuloPedSuc[]>(this.url+'PedidosSucursal/getItemsDisponibles/'+id,{headers:this.headers})
   }

   addItemPedSuc(idp:number,items:ArticuloPedSuc[]):Observable<PedidoSuc[]>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      let formdata = new FormData();
      formdata.append("idp",idp.toString());
      formdata.append("items",JSON.stringify(items));
      formdata.append("idu",idu.toString());
      return this.http.post<PedidoSuc[]>(this.url+`PedidosSucursal/addItemPed`,formdata,{headers:this.headers})
   }

   validarToken():Observable<any>
   {
      let userdata = JSON.parse(localStorage.getItem("rwuserdata")!);
      let idu = userdata.id; 
      let token = "no-data"; 

      if(userdata.token != undefined)
         {
            token = userdata.token; 
         }
      return this.http.get<any>(this.url+`Usuarios/ValidarToken/${idu}/${token}`,{headers:this.headers})
   }

}

