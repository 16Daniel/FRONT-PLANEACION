export interface Diferencia 
{
    cod: string;
    region: string;
    sucursal: string;
    articulo: string;
    invAyer: string;
    traspasoAyer: number;
    consumoAyer: number;
    invHoy: string;
    invFormula: number;
    diferencia: number;
    captura: Date;
    seccion: string;
    mermasayer?: number;
    codart:number
    status:string; 
 }
