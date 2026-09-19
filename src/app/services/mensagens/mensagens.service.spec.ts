import { fakeAsync, tick } from '@angular/core/testing';
import { MensagensService } from './mensagens.service';

describe('MensagensService', () => {
  let service: MensagensService;

  beforeEach(() => {
    service = new MensagensService();
  });

  it('mostra o toast e o remove depois do tempo', fakeAsync(() => {
    service.sucesso('Salvo.');
    expect(service.toasts().length).toBe(1);
    expect(service.toasts()[0]).toEqual(jasmine.objectContaining({ tipo: 'sucesso', texto: 'Salvo.' }));

    tick(3500);
    expect(service.toasts().length).toBe(0);
  }));

  it('mantém no máximo três toasts', () => {
    ['a', 'b', 'c', 'd'].forEach(texto => service.aviso(texto));
    expect(service.toasts().map(t => t.texto)).toEqual(['b', 'c', 'd']);
  });

  it('confirmar resolve com a resposta do usuário', async () => {
    const resposta = service.confirmar({ titulo: 'Excluir?', texto: 'Tem certeza?', confirmar: 'Excluir', perigo: true });
    expect(service.confirmacao()?.cancelar).toBe('Cancelar');

    service.responder(true);

    expect(await resposta).toBeTrue();
    expect(service.confirmacao()).toBeNull();
  });

  it('alertar é um aviso sem botão de cancelar', () => {
    service.alertar('Atenção', 'Texto');
    expect(service.confirmacao()?.cancelar).toBeUndefined();
  });
});
