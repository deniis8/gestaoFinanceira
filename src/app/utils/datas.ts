const doisDigitos = (n: number): string => String(n).padStart(2, '0');

/** Data local no formato yyyy-MM-dd (toISOString() usaria UTC e viraria o dia à noite). */
export function paraDataISO(data: Date): string {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`;
}

export function hojeISO(): string {
  return paraDataISO(new Date());
}

/** Data e hora locais no formato do input datetime-local (yyyy-MM-ddTHH:mm). */
export function agoraParaInput(): string {
  const agora = new Date();
  return `${paraDataISO(agora)}T${doisDigitos(agora.getHours())}:${doisDigitos(agora.getMinutes())}`;
}

/** Dia local sem hora, para comparar e agrupar. */
export function chaveDoDia(data: Date | string): string {
  return paraDataISO(new Date(data));
}

/** "Hoje", "Ontem" ou "qui., 12 de setembro". */
export function rotuloDoDia(chave: string): string {
  const [ano, mes, dia] = chave.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);

  if (chave === paraDataISO(hoje)) return 'Hoje';
  if (chave === paraDataISO(ontem)) return 'Ontem';

  const texto = data.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'long' });
  const comAno = ano !== hoje.getFullYear() ? `${texto} de ${ano}` : texto;
  return comAno.charAt(0).toUpperCase() + comAno.slice(1);
}
