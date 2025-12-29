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

        let appliedDiscountPercent = 0;

        function applyCouponCode(code) {
            if (!code) return 0;
            const c = code.trim().toUpperCase();
            if (c === 'NEW15') return 15;
            if (c === 'COUPLE20') return 20;
            return 0;
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
            // compute totals and discount
            const subtotal = selected.size * PRICE;
            const discount = Math.round((subtotal * appliedDiscountPercent) / 100);
            const grandTotal = subtotal - discount;

            // Update Total Price elements (may be duplicate IDs)
            const totalEls = Array.from(document.querySelectorAll('#total-price'));
            if (totalEls.length > 0) {
                totalEls.forEach(el => {
                    el.textContent = `BDT ${subtotal}`;
                });
            } else {
                const totalDiv = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Total Price'));
                if (totalDiv) {
                    const spans = totalDiv.querySelectorAll('span');
                    if (spans.length >= 2) spans[1].textContent = `BDT ${subtotal}`;
                }
            }

            // Update Grand Total elements
            const grandEls = Array.from(document.querySelectorAll('#grand-total'));
            if (grandEls.length > 0) {
                grandEls.forEach(el => el.textContent = `BDT ${grandTotal}`);
            } else {
                const grandDiv = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Grand Total'));
                if (grandDiv) {
                    const spans = grandDiv.querySelectorAll('span');
                    if (spans.length >= 2) spans[1].textContent = `BDT ${grandTotal}`;
                }
            }

            // Enable/disable coupon UI when user has selected enough seats
            try {
                const couponInput = document.getElementById('coupon-code');
                const applyBtn = document.getElementById('apply-coupon');
                if (couponInput && applyBtn) {
                    const enableCoupon = selected.size >= MAX_SELECTION;
                    couponInput.disabled = !enableCoupon;
                    applyBtn.disabled = !enableCoupon;
                    if (!enableCoupon) {
                        // clear any applied coupon when not eligible
                        appliedDiscountPercent = 0;
                        couponInput.value = '';
                    }
                }
            } catch (e) {
                // ignore if elements not present
            }
        }

        // wire up coupon apply handler (if present)
        function setupCouponHandlers() {
            const couponInput = document.getElementById('coupon-code');
            const applyBtn = document.getElementById('apply-coupon');
            if (!couponInput || !applyBtn) return;

            applyBtn.addEventListener('click', (e) => {
                const code = couponInput.value || '';
                const pct = applyCouponCode(code);
                if (pct === 0) {
                    alert('Invalid coupon code');
                    appliedDiscountPercent = 0;
                } else {
                    appliedDiscountPercent = pct;
                }
                updateSelectedListUI();
            });
        }

        // form handlers: enable Next when passenger info filled; show modal on Next
        function setupFormHandlers() {
            const nameEl = document.getElementById('passenger-name');
            const phoneEl = document.getElementById('passenger-phone');
            const emailEl = document.getElementById('passenger-email');
            const nextBtn = document.getElementById('next-button');
            const modal = document.getElementById('success-message');
            const modalContinue = document.getElementById('confirm-continue');

            if (!nextBtn) return;

            function validateForm() {
                const nameOk = nameEl && nameEl.value.trim() !== '';
                const phoneOk = phoneEl && phoneEl.value.trim() !== '';
                const emailOk = emailEl && emailEl.value.trim() !== '';
                nextBtn.disabled = !(nameOk && phoneOk && emailOk);
            }

            // attach listeners
            [nameEl, phoneEl, emailEl].forEach(el => {
                if (el) el.addEventListener('input', validateForm);
            });

            // ensure initial state
            validateForm();

            let reloadTimer = null;

            nextBtn.addEventListener('click', (e) => {
                // only open modal when enabled
                if (nextBtn.disabled) return;
                if (modal) {
                    modal.classList.remove('hidden');
                    // schedule reload after 3 seconds to clear selections
                    reloadTimer = setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }
            });

            if (modalContinue) {
                modalContinue.addEventListener('click', () => {
                    // if timer present, clear and reload immediately
                    if (reloadTimer) {
                        clearTimeout(reloadTimer);
                        reloadTimer = null;
                    }
                    window.location.reload();
                });
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

        // setup coupon and form handlers and initial render
        setupCouponHandlers();
        setupFormHandlers();
        updateCounters();
        updateSelectedListUI();
    };

    window.SeatSelection = SeatSelection;
})(window);

