// Bus button scroll
const busButton = document.getElementById('bus-button');
const paribahan = document.getElementById('paribahan'); 
busButton.addEventListener('click', function () {
    paribahan.scrollIntoView({ behavior: 'smooth' });
});
