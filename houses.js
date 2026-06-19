document.addEventListener('DOMContentLoaded', function() {
    const accordion = document.getElementById('housesAccordion');
    const searchInput = document.getElementById('houseSearch');
    const modal = document.getElementById('houseModal');
    const modalTitle = document.getElementById('houseModalTitle');
    const modalBody = document.getElementById('houseModalBody');
    const closeSpan = modal.querySelector('.close');
    const totalSpan = document.getElementById('totalHouses');

    function renderHouses(data) {
        accordion.innerHTML = '';
        let totalCount = 0;

        const sorted = [...data].sort((a, b) => a.street.localeCompare(b.street));

        sorted.forEach(streetData => {
            const streetDiv = document.createElement('div');
            streetDiv.className = 'house-street-item';

            // Сортируем дома по номеру (сложные номера с корпусами оставляем как есть)
            const sortedHouses = [...streetData.houses].sort((a, b) => {
                // если есть числовая часть, сравниваем числа
                const numA = parseInt(a.number);
                const numB = parseInt(b.number);
                if (!isNaN(numA) && !isNaN(numB) && numA !== numB) return numA - numB;
                return a.number.localeCompare(b.number);
            });

            const streetHeader = document.createElement('button');
            streetHeader.className = 'house-street-header';
            streetHeader.innerHTML = `
                <span class="street-name">${streetData.street}</span>
                <span class="street-badge">
                    <span class="house-count">${sortedHouses.length}</span>
                    <span class="arrow">▶</span>
                </span>
            `;
            streetHeader.addEventListener('click', () => {
                const content = streetDiv.querySelector('.house-street-content');
                const arrow = streetHeader.querySelector('.arrow');
                content.classList.toggle('open');
                arrow.textContent = content.classList.contains('open') ? '▼' : '▶';
            });

            const contentDiv = document.createElement('div');
            contentDiv.className = 'house-street-content';

            const innerWrapper = document.createElement('div');
            const houseList = document.createElement('div');
            houseList.className = 'house-list';

            sortedHouses.forEach(houseObj => {
                const houseBtn = document.createElement('button');
                houseBtn.className = 'house-btn';
                houseBtn.textContent = `Дом ${houseObj.number}`;
                houseBtn.addEventListener('click', () => {
                    modalTitle.textContent = `${streetData.street}, ${houseObj.number}`;
                    // Формируем модалку
                    let html = `
                        <div class="house-modal-info">
                            <div class="modal-row">
                                <span class="modal-label">🏢 ЖКО:</span>
                                <span class="modal-value"><strong>${streetData.jko}</strong></span>
                            </div>
                            <div class="modal-row">
                                <span class="modal-label">📍 Адрес ЖКО:</span>
                                <span class="modal-value">${streetData.jkoAddress}</span>
                            </div>
                            <div class="modal-row">
                                <span class="modal-label">📞 Телефон ЖКО:</span>
                                <span class="modal-value"><a href="tel:${streetData.jkoPhone.replace(/\s/g, '')}">${streetData.jkoPhone}</a></span>
                            </div>
                            <div class="modal-row">
                                <span class="modal-label">👨🏻‍💼 Начальник:</span>
                                <span class="modal-value">${streetData.jkoChief}</span>
                            </div>
                            <div class="modal-row">
                                <span class="modal-label">⏰ Режим работы:</span>
                                <span class="modal-value">${streetData.jkoHours}</span>
                            </div>
                            <div class="modal-divider"></div>
                            <div class="modal-row">
                                <span class="modal-label">🆘 Аварийная служба:</span>
                                <span class="modal-value"><a href="tel:${streetData.emergencyPhone.replace(/\s/g, '')}">${streetData.emergencyPhone}</a></span>
                            </div>
                            <div class="modal-row">
                                <span class="modal-label">🏢 Управляющая компания:</span>
                                <span class="modal-value"><a href="tel:${streetData.ukPhone.replace(/\s/g, '')}">${streetData.ukPhone}</a></span>
                            </div>
                    `;

                    // Добавляем документы, если они есть
                    if (houseObj.documents && houseObj.documents.length > 0) {
                        html += `
                            <div class="modal-divider"></div>
                            <div class="modal-row" style="flex-direction: column; align-items: stretch;">
                                <span class="modal-label" style="margin-bottom: 8px;">📄 Документы по дому:</span>
                                <ul class="documents-list">
                        `;
                        houseObj.documents.forEach(doc => {
                            html += `
                                <li><a href="${doc.link}" target="_blank">${doc.name}</a></li>
                            `;
                        });
                        html += `
                                </ul>
                            </div>
                        `;
                    }

                    html += `</div>`; // закрываем house-modal-info
                    modalBody.innerHTML = html;
                    modal.style.display = 'flex';
                });
                houseList.appendChild(houseBtn);
            });

            innerWrapper.appendChild(houseList);
            contentDiv.appendChild(innerWrapper);
            streetDiv.appendChild(streetHeader);
            streetDiv.appendChild(contentDiv);
            accordion.appendChild(streetDiv);
            totalCount += sortedHouses.length;
        });

        totalSpan.textContent = totalCount;
    }

    function searchHouses(query) {
        const q = query.toLowerCase().trim();
        if (q === '') {
            renderHouses(housesData);
            return;
        }
        const filtered = housesData.map(streetData => ({
            ...streetData,
            houses: streetData.houses.filter(houseObj =>
                streetData.street.toLowerCase().includes(q) ||
                houseObj.number.toLowerCase().includes(q)
            )
        })).filter(item => item.houses.length > 0);
        renderHouses(filtered);
    }

    searchInput.addEventListener('input', (e) => {
        searchHouses(e.target.value);
    });

    if (closeSpan) closeSpan.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    renderHouses(housesData);
});