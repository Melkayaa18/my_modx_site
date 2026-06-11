// Модальное окно
const modal = document.getElementById('modal');
const closeSpan = document.querySelector('.close');

function openModal() {
    modal.style.display = 'flex';
}
function closeModal() {
    modal.style.display = 'none';
}

// Находим все кнопки для открытия
const openButtons = document.querySelectorAll('#openModalBtn, #openProblemModal, #openProblemModalFooter');
openButtons.forEach(btn => {
    if (btn) btn.addEventListener('click', openModal);
});

if (closeSpan) closeSpan.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Форма
const form = document.getElementById('requestForm');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
        closeModal();
        form.reset();
    });
}