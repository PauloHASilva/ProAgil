import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Evento } from 'src/app/_models/Evento';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';

import { ToastrService } from 'ngx-toastr';
import { EventoService } from 'src/app/_services/Evento.service';
// import { read } from 'fs';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-evento-edit',
  templateUrl: './eventoEdit.component.html',
  styleUrls: ['./eventoEdit.component.scss']
})
export class EventoEditComponent implements OnInit {

  titulo = 'Editar Evento';
  evento: Evento = new Evento();
  imagemURL = 'assets/img/upload.png';
  registerForm: FormGroup;
  file: File;
  fileNameToUpdate: string;

  dataAtual = '';

  constructor(private eventoService: EventoService
            , private fb: FormBuilder
            , private localService: BsLocaleService
            , private toastr: ToastrService
            , private router: ActivatedRoute
    ) {
      this.localService.use('pt-br');
     }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.validation();
    this.carregarEvento();
  }

  // tslint:disable-next-line: typedef
  carregarEvento() {
    const idEvento = +this.router.snapshot.paramMap.get('id');
    this.eventoService.getEventoById(idEvento).subscribe(
      (evento: Evento) => {
        this.evento = Object.assign({}, evento);
        this.fileNameToUpdate = evento.imagemURL.toString();

        this.imagemURL = `http://localhost:5000/Resources/Images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;

        this.evento.imagemURL = '';
        this.registerForm.patchValue(this.evento);

        this.evento.lotes.forEach(lote => {
          this.lotes.push(this.criaLote(lote));
        });

        this.evento.redesSociais.forEach(redeSocial => {
          this.redesSociais.push(this.criaRedeSocial(redeSocial));
        });
      }
    );
  }

  // tslint:disable-next-line: typedef
  validation() {
    this.registerForm = this.fb.group({
      id: [],
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemURL: [''],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([]),
      redesSociais: this.fb.array([])
    });
  }

  get lotes(): FormArray {
    return this.registerForm.get('lotes') as FormArray;
  }

  criaLote(lote: any): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required] ,
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio] ,
      dataFim: [lote.dataFim]
    });
  }

  // tslint:disable-next-line: typedef
  adicionarLote() {
    this.lotes.push(this.criaLote({ id: 0}));
  }

  // tslint:disable-next-line: typedef
  removerLote(id: number) {
    this.lotes.removeAt(id);
  }

  get redesSociais(): FormArray {
    return this.registerForm.get('redesSociais') as FormArray;
  }

  criaRedeSocial(redeSocial: any): FormGroup {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required] ,
      url: [redeSocial.url, Validators.required]
    });
  }

  // tslint:disable-next-line: typedef
  adicionarRedeSocial() {
    this.redesSociais.push(this.criaRedeSocial({ id: 0}));
  }

  // tslint:disable-next-line: typedef
  removerRedeSocial(id: number) {
    this.redesSociais.removeAt(id);
  }

  // tslint:disable-next-line: typedef
  onFileChange(event) {
    const reader = new FileReader();

    this.file = event.target.files;
    reader.onload = (ev: any) => this.imagemURL = ev.target.result;

    reader.readAsDataURL(event.target.files[0]);
  }

  // tslint:disable-next-line: typedef
  uploadImagem() {
    if (this.registerForm.get('imagemURL').value !== '') {
      this.eventoService.postUpload(this.file, this.fileNameToUpdate)
      .subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.imagemURL = `http://localhost:5000/Resources/Images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;
        }
      );
    }
  }

  // tslint:disable-next-line: typedef
  salvarEvento() {
    this.evento = Object.assign({id: this.evento.id} , this.registerForm.value);
    this.evento.imagemURL = this.fileNameToUpdate;

    this.uploadImagem();

    this.eventoService.putEvento(this.evento).subscribe(
      () => {
        this.toastr.success('Alterado com sucesso!');
      }, error => {
        this.toastr.error(`Erro ao tentar alterar: ${error}`);
      }
    );
  }

}
