// ========== СТАРАЯ МОДАЛКА (Подать заявку) ==========
const oldModal = document.getElementById('modal');
const closeOldSpan = document.querySelector('#modal .close');

function openOldModal() {
    if (oldModal) oldModal.style.display = 'flex';
}
function closeOldModal() {
    if (oldModal) oldModal.style.display = 'none';
}

// Кнопка "Подать заявку" (id="openModalBtn")
const openModalBtn = document.getElementById('openModalBtn');
if (openModalBtn) {
    openModalBtn.addEventListener('click', openOldModal);
}
if (closeOldSpan) {
    closeOldSpan.addEventListener('click', closeOldModal);
}
window.addEventListener('click', (e) => {
    if (e.target === oldModal) closeOldModal();
});

// Обработка старой формы
const oldForm = document.getElementById('requestForm');
if (oldForm) {
    oldForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами.');
        closeOldModal();
        oldForm.reset();
    });
}

// ========== НОВАЯ МОДАЛКА (Написать о проблеме) ==========
const problemModal = document.getElementById('problemModal');
const closeProblemSpan = document.querySelector('.close-problem-modal');

function openProblemModal() {
    if (problemModal) problemModal.style.display = 'flex';
}
function closeProblemModal() {
    if (problemModal) problemModal.style.display = 'none';
}

// Кнопки "Написать о проблеме" (id="openProblemModal" и классы)
const problemBtns = document.querySelectorAll('#openProblemModal, .secondary-btn, .open-modal-btn');
problemBtns.forEach(btn => {
    // Фильтруем только те кнопки, у которых текст "Написать о проблеме"
    if (btn.textContent.trim() === 'Написать о проблеме') {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openProblemModal();
        });
    }
});
// Дополнительно, если есть id
const specificBtns = ['openProblemModal', 'openProblemModalFooter'];
specificBtns.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', openProblemModal);
});

if (closeProblemSpan) closeProblemSpan.addEventListener('click', closeProblemModal);
window.addEventListener('click', (e) => {
    if (e.target === problemModal) closeProblemModal();
});

// Обработка расширенной формы
const problemForm = document.getElementById('problemForm');
if (problemForm) {
    problemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(problemForm);
        const data = {};
        formData.forEach((value, key) => {
            if (key !== 'files') data[key] = value;
        });
        const files = document.getElementById('fileInput').files;
        let fileNames = [];
        for (let i = 0; i < files.length; i++) {
            fileNames.push(files[i].name);
        }
        data.files = fileNames;
        console.log('Отправляем данные:', data);
        alert('Спасибо! Ваше обращение принято. В ближайшее время мы свяжемся с вами.');
        problemForm.reset();
        selectedFiles = [];
        updateFileList();
        document.getElementById('fileList').innerHTML = '';
        closeProblemModal();
    });
}

// ========== РАБОТА С ФАЙЛАМИ (НАКОПЛЕНИЕ) ==========
let selectedFiles = []; // массив для хранения выбранных файлов
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const uploadArea = document.getElementById('fileUploadArea');

function updateFileList() {
    if (!fileList) return;
    fileList.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        const li = document.createElement('li');
        li.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} КБ)`;
        
        // Кнопка удаления
        const removeBtn = document.createElement('span');
        removeBtn.textContent = ' ❌';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.marginLeft = '10px';
        removeBtn.style.fontSize = '1rem';
        removeBtn.addEventListener('click', () => {
            selectedFiles.splice(index, 1);
            updateFileList();
            // Обновляем files в input
            const dataTransfer = new DataTransfer();
            selectedFiles.forEach(f => dataTransfer.items.add(f));
            if (fileInput) fileInput.files = dataTransfer.files;
        });
        li.appendChild(removeBtn);
        fileList.appendChild(li);
    });
    
    // Обновляем files в input для отправки формы
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach(file => dataTransfer.items.add(file));
    if (fileInput) fileInput.files = dataTransfer.files;
}

function handleFiles(files) {
    // Проверка на количество
    if (selectedFiles.length + files.length > 10) {
        alert(`Можно загрузить не более 10 файлов. Уже выбрано ${selectedFiles.length}.`);
        return;
    }
    // Проверка размера каждого нового файла
    for (let i = 0; i < files.length; i++) {
        if (files[i].size > 10 * 1024 * 1024) {
            alert(`Файл ${files[i].name} превышает 10 Мб`);
            return;
        }
        selectedFiles.push(files[i]);
    }
    updateFileList();
}

// Обработчик выбора файлов через input
if (fileInput) {
    fileInput.addEventListener('change', (e) => {
        handleFiles(Array.from(e.target.files));
        fileInput.value = ''; // очищаем, чтобы можно было добавить те же файлы снова
    });
}

// Drag & Drop
if (uploadArea) {
    uploadArea.addEventListener('click', () => {
        if (fileInput) fileInput.click();
    });
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#e2edf2';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '#f8fafc';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#f8fafc';
        handleFiles(Array.from(e.dataTransfer.files));
    });
}