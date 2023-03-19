import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-listar-tarjeta',
  templateUrl: './listar-tarjeta.component.html',
  styleUrls: ['./listar-tarjeta.component.scss']
})
export class ListarTarjetaComponent implements OnInit {

  constructor(private _tarjetaService: TarjetaService, private toastr: ToastrService) { }

  listaTarjetas: TarjetaCredito[] = []



  ngOnInit(): void {
    this.obtenerTarjetas()
  }

  obtenerTarjetas() {
    this._tarjetaService.obtenerTarjetas().subscribe({
      next: (value) => {
        this.listaTarjetas = []
        value.forEach(element => {
          this.listaTarjetas.push({
            id: element.payload.doc['id'],
            ...element.payload.doc.data() as TarjetaCredito
          })
        });
        console.log(this.listaTarjetas)
      }
    })
  }


  borrarTarjeta(id: string) {
    this._tarjetaService.eliminarTarjeta(id)
      .then(() => {
        this.toastr.error('Eliminada tarjeta con exito', 'Registro eliminado')
      },
        (error) => { console.log(error) }
      )
  }


  editarTarjeta(tarjeta: TarjetaCredito) {
    this._tarjetaService.addTarjeta(tarjeta)
  }
}
