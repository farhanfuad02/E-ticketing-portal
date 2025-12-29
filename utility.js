// SeatSelection utility module
// Provides `SeatSelection.init({ maxSelection, pricePerSeat })`
(function (window) {
    const SeatSelection = {};

    SeatSelection.init = function (opts = {}) {
        const MAX_SELECTION = typeof opts.maxSelection === 'number' ? opts.maxSelection : 4;
        const PRICE = typeof opts.pricePerSeat === 'number' ? opts.pricePerSeat : 550;

        const leftHeading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.trim() === 'Select Your Seat');
        const seatArea = leftHeading ? leftHeading.parentElement : document;
        const seatButtons = Array.from(seatArea.querySelectorAll('button')).filter(b => /^[A-J]\d$/.test(b.textContent.trim()));

        const remainingBtn = document.getElementById('remaining-seat');
        const seatCountEl = document.getElementById('seat-count');

        let initialRemaining = 40;
        if (remainingBtn) {
            const found = remainingBtn.textContent.match(/(\d+)/);
            if (found) initialRemaining = parseInt(found[1], 10);
        }

        const selected = new Set();

        function updateCounters() {
            const selCount = selected.size;
            if (seatCountEl) seatCountEl.textContent = selCount;
            if (remainingBtn) {
                const img = remainingBtn.querySelector('img');
                const imgHtml = img ? img.outerHTML : '';
                remainingBtn.innerHTML = `${imgHtml} ${initialRemaining - selCount} Seats left`;
            }
        }

        function updateSelectedListUI() {
            const list = document.querySelector('ul.space-y-4');
            if (!list) return;
            list.innerHTML = '';
            selected.forEach(label => {
                const li = document.createElement('li');
                li.className = 'flex justify-between';
                li.innerHTML = `<span>${label}</span><span>Class</span><span>BDT ${PRICE}</span>`;
                list.appendChild(li);
            });

            // Update Total Price and Grand Total: handle multiple elements (duplicate IDs) and fallbacks
            const totalEls = Array.from(document.querySelectorAll('#total-price'));
            if (totalEls.length > 0) {
                totalEls.forEach(el => {
                    el.textContent = `BDT ${selected.size * PRICE}`;
                });
            } else {
                const totalDiv = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Total Price'));
                if (totalDiv) {
                    const spans = totalDiv.querySelectorAll('span');
                    if (spans.length >= 2) spans[1].textContent = `BDT ${selected.size * PRICE}`;
                }
            }

            const grandEls = Array.from(document.querySelectorAll('#grand-total'));
            if (grandEls.length > 0) {
                grandEls.forEach(el => el.textContent = `BDT ${selected.size * PRICE}`);
            } else {
                const grandDiv = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Grand Total'));
                if (grandDiv) {
                    const spans = grandDiv.querySelectorAll('span');
                    if (spans.length >= 2) spans[1].textContent = `BDT ${selected.size * PRICE}`;
                }
            }
        }

        seatButtons.forEach(btn => {
            btn.style.cursor = 'pointer';
            btn.style.transition = 'background-color 0.15s, color 0.15s';
            btn.addEventListener('click', () => {
                const label = btn.textContent.trim();
                if (selected.has(label)) {
                    selected.delete(label);
                    btn.style.backgroundColor = '#F7F8F8';
                    btn.style.color = '#03071280';
                } else {
                    if (selected.size >= MAX_SELECTION) {
                        // simple feedback; caller can replace with custom UI if desired
                        alert(`You can select a maximum of ${MAX_SELECTION} seats.`);
                        return;
                    }
                    selected.add(label);
                    btn.style.backgroundColor = '#1DD100';
                    btn.style.color = 'white';
                }

                updateCounters();
                updateSelectedListUI();
            });
        });

        // initial render
        updateCounters();
        updateSelectedListUI();
    };

    window.SeatSelection = SeatSelection;
})(window);

