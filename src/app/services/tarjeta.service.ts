import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Observable } from '@firebase/util';
import { Subject } from 'rxjs';
import { TarjetaCredito } from '../models/TarjetaCredito';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {

  tarjeta$: Subject<TarjetaCredito> = new Subject<TarjetaCredito>()


  constructor(private firestore: AngularFirestore) { }


  guardarTarjeta(tarjeta: TarjetaCredito): Promise<any>{
    return this.firestore.collection('tarjetas').add(tarjeta)
  }

  obtenerTarjetas() {
    return this.firestore.collection('tarjetas', (ref) => ref.orderBy('fechaCreacion', 'asc')).snapshotChanges();
}

eliminarTarjeta(id: string): Promise<any>{
  return this.firestore.collection('tarjetas').doc(id).delete()
}

addTarjeta(tarjeta: TarjetaCredito){
  this.tarjeta$.next(tarjeta)
}

getTarjeta(){
  return this.tarjeta$.asObservable()
}

editarTarjeta(id:string, data:TarjetaCredito): Promise<any>{
  return this.firestore.collection('tarjetas').doc(id).update(data)
}
}
