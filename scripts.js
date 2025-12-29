// Bus button scroll
const busButton = document.getElementById('bus-button');
const paribahan = document.getElementById('paribahan'); 
busButton.addEventListener('click', function () {
    paribahan.scrollIntoView({ behavior: 'smooth' });
});

// Seat selection behavior
// Initialize seat selection after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (window.SeatSelection && typeof window.SeatSelection.init === 'function') {
        window.SeatSelection.init({ maxSelection: 4, pricePerSeat: 550 });
    }
});
