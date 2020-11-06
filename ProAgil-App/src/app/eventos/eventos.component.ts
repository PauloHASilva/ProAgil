import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/Evento.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

import { ToastrService } from 'ngx-toastr';
import { getMilliseconds } from 'ngx-bootstrap/chronos/utils/date-getters';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {
  titulo = 'Eventos';

  eventosFiltrados: Evento[];
  eventos: Evento[];

  evento: Evento;

  modoSalvar = 'post';

  bodyDeletarEvento = '';

  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup;

  // tslint:disable-next-line: variable-name
  _filtroLista = '';

  file: File;
  fileNameToUpdate: string;
  dataAtual: string;

  constructor(
    private eventoService: EventoService
  , private fb: FormBuilder
  , private localService: BsLocaleService
  , private toastr: ToastrService
  ) {
    this.localService.use('pt-br');
   }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  get filtroLista(): string {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  // tslint:disable-next-line: typedef
  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fileNameToUpdate = evento.imagemURL.toString();
    this.evento.imagemURL = '';
    this.registerForm.patchValue(this.evento);
  }

  // tslint:disable-next-line: typedef
  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  // tslint:disable-next-line: typedef
  openModal(template: any){
    this.registerForm.reset();
    template.show();
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  // tslint:disable-next-line: typedef
  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  // tslint:disable-next-line: typedef
  validation() {
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      imagemURL: ['', Validators.required],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // tslint:disable-next-line: typedef
  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
      console.log(this.file);
    }
  }

  // tslint:disable-next-line: typedef
  uploadImagem() {
    if (this.modoSalvar === 'post') {
        const nomeArquivo = this.evento.imagemURL.split('\\', 3);
        this.evento.imagemURL = nomeArquivo[2];

        this.eventoService.postUpload(this.file, nomeArquivo[2])
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getEventos();
          }
        );
      } else {
        this.evento.imagemURL = this.fileNameToUpdate;
        this.eventoService.postUpload(this.file, this.fileNameToUpdate)
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getEventos();
          }
        );
    }
  }

  // tslint:disable-next-line: typedef
  salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post') {
        this.evento = Object.assign({}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com sucesso!');
          }, error => {
            this.toastr.error(`Erro ao tentar inserir: ${error}`);
          }
        );
      } else {
        this.evento = Object.assign({id: this.evento.id} , this.registerForm.value);

        this.uploadImagem();

        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Alterado com sucesso!');
          }, error => {
            this.toastr.error(`Erro ao tentar alterar: ${error}`);
          }
        );
      }
    }
  }

  // tslint:disable-next-line: typedef
  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  // tslint:disable-next-line: typedef
  confirmeDelete(template: any) {
    // template.hide();
    // this.getEventos();
    // this.toastr.success('Deletado com sucesso!');

    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com sucesso!');
        }, error => {
          this.toastr.error(`Erro ao tentar excluir: ${error}`);
        }
    );
  }

  // tslint:disable-next-line: typedef
  getEventos() {
    this.eventoService.getAllEventos().subscribe(
      // tslint:disable-next-line: variable-name
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = _eventos;
      }, error => {
        this.toastr.error(`Erro ao tentar carregar eventos: ${error}`);
      }
    );
  }

}
