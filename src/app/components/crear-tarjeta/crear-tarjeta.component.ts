import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.scss']
})
export class CrearTarjetaComponent implements OnInit{

  form: FormGroup;
  loading: boolean = false
  titulo: string = 'Agregar Tarjeta'
  suscripcion: Subscription = new Subscription
  id: string = ''

  constructor(private _fb: FormBuilder, private _tarjetaService: TarjetaService, private toastr: ToastrService){

    this.form = _fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    })
  }
  ngOnInit(): void {
    this.suscripcion = this._tarjetaService.getTarjeta().subscribe({
      next: (data) => {
        this.id = data.id!
        this.titulo = 'Editar Tarjeta'
        this.form.patchValue({
          titular: data.titular,
          numeroTarjeta: data.numeroTarjeta,
          fechaExpiracion: data.fechaExpiracion,
          cvv: data.cvv
        })
      }
    })
  }


  guardarTarjeta(){


    if(!this.id){
      //Creamos nueva tarjeta

      const TARJETA_CREDITO: TarjetaCredito = {
        titular: this.form.value['titular'],
        numeroTarjeta: this.form.value['numeroTarjeta'],
        fechaExpiracion: this.form.value['fechaExpiracion'],
        cvv: this.form.value['cvv'],
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }
  
      this.loading = true
      this._tarjetaService.guardarTarjeta(TARJETA_CREDITO)
        .then(() => {
          this.loading = false 
          console.log('Tarjeta registrada') 
          this.toastr.success('La tarjeta fue registrada con exito!', 'Tarjeta registada')
          this.form.reset()
        },
        (error) => { 
          this.loading = false 
          console.log(error) 
          this.toastr.error('Opps... ocurrio un error', 'Error')
        })


    } else{
      //Actualizamos tarjeta

      const TARJETA_CREDITO: TarjetaCredito = {
        titular: this.form.value['titular'],
        numeroTarjeta: this.form.value['numeroTarjeta'],
        fechaExpiracion: this.form.value['fechaExpiracion'],
        cvv: this.form.value['cvv'],
        fechaActualizacion: new Date()
      }
      this.loading = true
      this._tarjetaService.editarTarjeta(this.id, TARJETA_CREDITO)
        .then(()=> {
          this.loading = false
          this.titulo = 'Agregar Tarjeta'
          this.toastr.info('Tarjeta actualizada con exito', 'Registro actualizado')
          this.form.reset()
          this.id = ''
        }, (error)=> {
          console.log(error)
        })


      
    }
    
  }
  
}
