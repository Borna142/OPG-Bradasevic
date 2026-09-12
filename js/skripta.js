document.addEventListener('DOMContentLoaded', () => {

    
    window.showPage = function(pageId) {
        const sections = document.querySelectorAll('.page-section');
        sections.forEach(section => {
            section.classList.remove('active-page');
        });

        const selectedPage = document.getElementById(pageId);
        if (selectedPage) {
            selectedPage.classList.add('active-page');
        }

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });

        const navLinksContainer = document.getElementById('navLinks');
        if (navLinksContainer) {
            navLinksContainer.classList.remove('show');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('show');
        });
    }

    const currentHash = window.location.hash.substring(1);
    if (currentHash && document.getElementById(currentHash)) {
        showPage(currentHash);
    }

    // 2. JS VALIDACIJA FORME I LOCAL STORAGE
    const orderForm = document.getElementById('orderForm');
    const localStorageOutput = document.getElementById('localStorageOutput');
    const clearStorageBtn = document.getElementById('clearStorageBtn');
    const formSuccessAlert = document.getElementById('formSuccess');

    displayStoredOrders();

    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const ime = document.getElementById('imePrezime');
            const email = document.getElementById('email');
            const telefon = document.getElementById('telefon');
            const proizvod = document.getElementById('proizvod');
            const kolicina = document.getElementById('kolicina');
            const poruka = document.getElementById('poruka');

            let isValid = true;

            if (ime.value.trim() === '') {
                showError('errorIme', ime);
                isValid = false;
            } else {
                hideError('errorIme', ime);
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                showError('errorEmail', email);
                isValid = false;
            } else {
                hideError('errorEmail', email);
            }

            if (telefon.value.trim().length < 6) {
                showError('errorTelefon', telefon);
                isValid = false;
            } else {
                hideError('errorTelefon', telefon);
            }

            if (proizvod.value === '') {
                showError('errorProizvod', proizvod);
                isValid = false;
            } else {
                hideError('errorProizvod', proizvod);
            }

            if (kolicina.value <= 0 || kolicina.value === '') {
                showError('errorKolicina', kolicina);
                isValid = false;
            } else {
                hideError('errorKolicina', kolicina);
            }

            if (isValid) {
                const newOrder = {
                    id: Date.now(),
                    ime: ime.value.trim(),
                    email: email.value.trim(),
                    telefon: telefon.value.trim(),
                    proizvod: proizvod.value,
                    kolicina: kolicina.value,
                    poruka: poruka.value.trim(),
                    datum: new Date().toLocaleString('hr-HR')
                };

                saveOrderToLocalStorage(newOrder);
                displayStoredOrders();

                formSuccessAlert.style.display = 'block';
                orderForm.reset();

                setTimeout(() => {
                    formSuccessAlert.style.display = 'none';
                }, 5000);
            }
        });
    }

    function showError(errorId, inputElem) {
        document.getElementById(errorId).style.display = 'block';
        inputElem.classList.add('invalid');
    }

    function hideError(errorId, inputElem) {
        document.getElementById(errorId).style.display = 'none';
        inputElem.classList.remove('invalid');
    }

    function saveOrderToLocalStorage(order) {
        let orders = JSON.parse(localStorage.getItem('opg_orders')) || [];
        orders.push(order);
        localStorage.setItem('opg_orders', JSON.stringify(orders));
    }

    function displayStoredOrders() {
        if (!localStorageOutput) return;

        let orders = JSON.parse(localStorage.getItem('opg_orders')) || [];

        if (orders.length === 0) {
            localStorageOutput.innerHTML = '<p class="text-muted">Nemate spremljenih narudžbi na ovom uređaju.</p>';
            return;
        }

        let html = '';
        orders.reverse().forEach(ord => {
            html += `
                <div class="order-item-card">
                    <strong>${ord.proizvod}</strong> - ${ord.kolicina} unit<br>
                    <small>Naručitelj: ${ord.ime} (${ord.datum})</small>
                </div>
            `;
        });

        localStorageOutput.innerHTML = html;
    }

    if (clearStorageBtn) {
        clearStorageBtn.addEventListener('click', () => {
            localStorage.removeItem('opg_orders');
            displayStoredOrders();
        });
    }
});