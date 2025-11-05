export enum ClassStatus {
  ACTIVE = 'ACTIVE',        // Classe ativa
  INACTIVE = 'INACTIVE',    // Classe inativa
  COMPLETED = 'COMPLETED',  // Classe finalizada
  CANCELLED = 'CANCELLED'   // Classe cancelada
}

export enum ClassNameFaixaEtaria {
  MATERNAL = 'MATERNAL',           // Crianças de 4 a 5 anos
  PRIMARIO = 'PRIMARIO',           // Crianças de 6 a 10 anos
  JUNIORES = 'JUNIORES',           // Crianças de 11 a 14 anos
  PREADOLESCENTE = 'PRE-ADOLESCENTE', // Adolescentes de 15 a 17 anos
  ADOLESCENTE = 'ADOLESCENTE',     // Jovens de 18 a 21 anos
  JOVENS = 'JOVENS',               // Jovens adultos de 22 a 30 anos
  MULHERES = 'MULHERES',           // Adultos de 31 a 59 anos
  HOMENS = 'HOMENS'                // Adultos acima de 60 anos
}

// Para constantes simples como idade máxima, é melhor usar const
export const MAX_IDADE = 100;
export const MIN_IDADE = 1;