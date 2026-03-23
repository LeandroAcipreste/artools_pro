// Formatadores de Entrada e Strings
// Funções puras sem dependências externas. Módulos fechados.

export const formatCPF = (v) => {
  v = v.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return v;
};

export const formatPhone = (v) => {
  v = v.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
  v = v.replace(/(\d)(\d{4})$/, '$1-$2');
  return v;
};

export const formatCard = (v) => {
  v = v.replace(/\D/g, '');
  if (v.length > 16) v = v.slice(0, 16);
  v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
  return v;
};

export const formatDate = (v) => {
  v = v.replace(/\D/g, '');
  if (v.length > 4) v = v.slice(0, 4);
  v = v.replace(/^(\d{2})(\d)/, '$1/$2');
  return v;
};

export const formatCEP = (v) => {
  v = v.replace(/\D/g, '');
  if (v.length > 8) v = v.slice(0, 8);
  return v.replace(/^(\d{5})(\d)/, '$1-$2');
};
