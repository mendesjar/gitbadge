export function formatarData(data = new Date()) {
  data.setDate(data.getDate() - 30);
  let ano = data.getFullYear();
  let mes = (data.getMonth() + 1).toString().padStart(2, "0");
  let dia = data.getDate().toString().padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}
