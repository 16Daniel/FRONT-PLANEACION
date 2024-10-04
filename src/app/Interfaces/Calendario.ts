export interface Calendario 
{
    id:number;
    codsucursal:number;
    codproveedor:number;
    jdata:string; 
    especial:boolean; 
    temporal:boolean;
 }

 export interface CalendarioUpdate 
{
    id:number;
    nombresuc:string;
 }

 export interface CalendarioTemporal 
 {
     id:number;
     nomprov:string;
     nomsuc:string;
     codprov:number;
     codsuc:number; 
  }
 