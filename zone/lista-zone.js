// ==========================================================
//  LISTA ZONELOR
//
//  Fiecare fisier de zona se adauga singur in lista asta,
//  chemand inregistreazaZona() la sfarsitul lui.
//
//  Asa, ca sa adaugi o zona noua nu trebuie sa modifici jocul:
//  faci fisierul, il pui in dosarul "zone" si adaugi un rand
//  in index.html ca sa fie incarcat. Atat.
// ==========================================================

const ZONE = [];

function inregistreazaZona(zona) {
  ZONE.push(zona);
}
