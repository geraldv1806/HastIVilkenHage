// script.js

document.addEventListener('DOMContentLoaded', () => {
  //
  // 1) Add / Change Horses page logic
  //
  const addForm = document.getElementById('horse-form');
  if (addForm) {
    const nameInput    = document.getElementById('horse-name');
    const paddockInput = document.getElementById('paddock-number');
    const farmSelect   = document.getElementById('farm-select');
    const listDiv      = document.getElementById('horse-list');

    // Load or initialize
    let horses = JSON.parse(localStorage.getItem('horses') || '[]');

    // Render the list of mini-forms
    function renderList() {
      listDiv.innerHTML = '';
      if (horses.length === 0) {
        listDiv.textContent = 'INGEN HÄST FINNS I LISTAN!';
        return;
      }
      horses.forEach((horse, idx) => {
        const f = document.createElement('form');
        f.className = 'edit-horse-form';
        f.dataset.index = idx;
        f.innerHTML = `
          <input type="text"   name="name"    value="${horse.name}"    required />
          <input type="number" name="paddock" value="${horse.paddock}" required />
          <select name="farm" required>
            <option value="Granliden"${horse.farm==='Granliden' ? ' selected':''}>Granliden</option>
            <option value="Janstorp"  ${horse.farm==='Janstorp'   ? ' selected':''}>Janstorp</option>
            <option value="Kämparp"   ${horse.farm==='Kämparp'    ? ' selected':''}>Kämparp</option>
          </select>
          <button type="submit">SPARA</button>
          <button type="button" class="delete-btn">RADERA</button>
        `;
        // Save edits
        f.addEventListener('submit', e => {
          e.preventDefault();
          const data = new FormData(f);
          horses[idx] = {
            name:    data.get('name').trim(),
            paddock: data.get('paddock').trim(),
            farm:    data.get('farm')
          };
          localStorage.setItem('horses', JSON.stringify(horses));
          renderList();
        });
        // Delete
        f.querySelector('.delete-btn').addEventListener('click', () => {
          horses.splice(idx, 1);
          localStorage.setItem('horses', JSON.stringify(horses));
          renderList();
        });
        listDiv.appendChild(f);
      });
    }

    // Initial render
    renderList();

    // Handle new-horse submissions
    addForm.addEventListener('submit', e => {
      e.preventDefault();
      const name    = nameInput.value.trim();
      const paddock = paddockInput.value.trim();
      const farm    = farmSelect.value;
      if (!name || !paddock || !farm) return;
      horses.push({ name, paddock, farm });
      localStorage.setItem('horses', JSON.stringify(horses));
      // reset
      nameInput.value    = '';
      paddockInput.value = '';
      farmSelect.selectedIndex = 0;
      renderList();
    });
  }

  //
  // 2) Farm-page selector logic
  //
  const horseSelect = document.getElementById('horse-select');
  if (horseSelect) {
    const displayEl  = document.getElementById('paddock-display');
    const farmNameEl = document.getElementById('farm-name');
    if (displayEl && farmNameEl) {
      const farm       = farmNameEl.textContent.trim();
      const allHorses  = JSON.parse(localStorage.getItem('horses') || '[]');
      const farmHorses = allHorses.filter(h => h.farm === farm);

      // Populate dropdown
      if (farmHorses.length === 0) {
        horseSelect.innerHTML = `<option value="">No horses for ${farm}</option>`;
      } else {
        horseSelect.innerHTML = '<option value="">-- Select a horse --</option>';
        farmHorses.forEach(h => {
          const opt = document.createElement('option');
          opt.value           = h.name;
          opt.textContent     = h.name;
          opt.dataset.paddock = h.paddock;
          horseSelect.appendChild(opt);
        });
      }

      // Show paddock on select
      horseSelect.addEventListener('change', () => {
        const chosen = horseSelect.selectedOptions[0];
        displayEl.textContent = chosen && chosen.dataset.paddock
          ? chosen.dataset.paddock
          : '';
      });
    }
  }
});
