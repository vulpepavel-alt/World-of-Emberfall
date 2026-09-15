// Proba de nivel 20 a fost retrasa la cererea Sandrei. Vechiul link
// nu mai creeaza personaje. Stergerea pastreaza o copie recuperabila.
function gestioneazaSalvareaDeProba() {
  const optiuni = new URLSearchParams(location.search);
  const sterge = optiuni.get('sterge-test') === 'moorhollow20';
  const reface = optiuni.get('restaureaza-test') === 'moorhollow20';
  if (!sterge && !reface) return;
  const cheieCopie = 'joc-rpg-proba-arhivata';
  if (sterge) {
    for (let nr = 1; nr <= NUMAR_SLOTURI; nr++) {
      const s = citesteSlotul(nr);
      if (!s || s.nume !== TEXT.TEST_CHARACTER_NAME || s.idRasa !== 'human' || s.idClasa !== 'warrior') continue;
      const original = localStorage.getItem(cheiaSlotului(nr));
      localStorage.setItem(cheieCopie, original);
      localStorage.removeItem(cheiaSlotului(nr));
    }
  } else {
    const copie = localStorage.getItem(cheieCopie);
    if (!copie) return;
    for (let nr = 1; nr <= NUMAR_SLOTURI; nr++) {
      if (localStorage.getItem(cheiaSlotului(nr)) !== null) continue;
      localStorage.setItem(cheiaSlotului(nr), copie);
      return;
    }
  }
}
try { gestioneazaSalvareaDeProba(); }
catch (e) { console.error('Salvarea de proba: ' + e.message); }
