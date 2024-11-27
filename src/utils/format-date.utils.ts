let dataAtual = new Date();

dataAtual.setDate(dataAtual.getDate() - 30);

export function formatarData(data = new Date()) {
  let ano = data.getFullYear();
  let mes = (data.getMonth() + 1).toString().padStart(2, "0");
  let dia = data.getDate().toString().padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}
