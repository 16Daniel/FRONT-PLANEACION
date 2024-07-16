export interface DiasEspecial 
{
    id:number;
    dia:number
    semana:number;
    fecha:Date;
    descripcion:string;
    factorConsumo:number;
 }
 
 export interface respuestaDiaEspecial
 {
   consumo: number;
   factor: number;
   descripcion:string; 
   prioridadsuc:number; 
 }

 export interface DiasEspecialSuc 
{
    id:number;
    dia:number
    semana:number;
    fecha:Date;
    descripcion:string;
    factorConsumo:number;
    sucursal:number; 
    articulos:string; 
 }