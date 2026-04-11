document.addEventListener('DOMContentLoaded', function () {
    // --- Set active nav link based on current page ---
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html'; // default to index.html
        
        // Map page filenames to nav link selectors
        const pageToLinkSelector = {
            'index.html': 'a[href="index.html"]',
            'services.html': 'a[href="services.html"]',
            'pricing.html': 'a[href="pricing.html"]',
            'projects.html': 'a[href="projects.html"]',
            'contact.html': 'a[href="contact.html"]',
            'about.html': 'a[href="about.html"]'
        };
        
        // Remove 'active' class from all nav links
        const allNavLinks = document.querySelectorAll('.navbar-nav .nav-link');
        allNavLinks.forEach(link => link.classList.remove('active'));
        
        // Add 'active' class to the link matching current page
        const selector = pageToLinkSelector[currentPage];
        if (selector) {
            const activeLink = document.querySelector(selector);
            if (activeLink) activeLink.classList.add('active');
        }
    }
    
    setActiveNavLink();

    // --- Language Switcher Logic (unchanged) ---
    const langBtns = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('.trn');

    function setLanguage(lang) {
        translatableElements.forEach(el => {
            const translatedText = el.getAttribute('data-' + lang);
            if (translatedText) {
                el.textContent = translatedText;
            }
        });
        langBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.lang-btn[data-lang="${lang}"]`).classList.add('active');
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });

    // --- Mobile Menu Auto-Close (unchanged) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navbarNav');
    if (menuToggle) {
        const bsCollapse = new bootstrap.Collapse(menuToggle, { toggle: false });
        navLinks.forEach((l) => {
            l.addEventListener('click', () => {
                if (menuToggle.classList.contains('show')) {
                    bsCollapse.toggle();
                }
            });
        });
    }

    // --- Math Captcha Validation (unchanged) ---
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let captchaTotal = num1 + num2;

    const captchaQuestion = document.getElementById('captchaQuestion');
    if (captchaQuestion) {
        captchaQuestion.innerText = `Math Captcha: What is ${num1} + ${num2}?`;
    }

    const form = document.getElementById('contactForm');
    const captchaInput = document.getElementById('captchaInput');

    // --- Helper: Show Thank You Popup (same page, no reload) ---
    function showThankYouPopup(message) {
        const existingOverlay = document.getElementById('thank-you-popup-overlay');
        if (existingOverlay) existingOverlay.remove();

        const popupOverlay = document.createElement('div');
        popupOverlay.id = 'thank-you-popup-overlay';
        popupOverlay.style.position = 'fixed';
        popupOverlay.style.top = '0';
        popupOverlay.style.left = '0';
        popupOverlay.style.width = '100%';
        popupOverlay.style.height = '100%';
        popupOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        popupOverlay.style.display = 'flex';
        popupOverlay.style.justifyContent = 'center';
        popupOverlay.style.alignItems = 'center';
        popupOverlay.style.zIndex = '1100';

        const popupContent = document.createElement('div');
        popupContent.id = 'thank-you-popup-content';
        popupContent.style.backgroundColor = 'white';
        popupContent.style.padding = '30px';
        popupContent.style.borderRadius = '8px';
        popupContent.style.textAlign = 'center';
        popupContent.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.style.fontSize = '18px';
        messageElement.style.marginBottom = '20px';
        messageElement.style.color = '#1e2a3a';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = 'var(--accent, #ff6600)';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontWeight = '600';
        closeButton.onclick = function() {
            popupOverlay.remove();
        };

        popupContent.appendChild(messageElement);
        popupContent.appendChild(closeButton);
        popupOverlay.appendChild(popupContent);
        document.body.appendChild(popupOverlay);
    }

    // --- Modified Form Submission: AJAX to Formspree, then popup ---
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            captchaInput.setCustomValidity('');

            if (!form.checkValidity()) {
                event.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            if (parseInt(captchaInput.value) !== captchaTotal) {
                captchaInput.setCustomValidity('Invalid');
                document.getElementById('captchaError').style.display = 'block';
                form.classList.add('was-validated');
                return;
            } else {
                document.getElementById('captchaError').style.display = 'none';
                captchaInput.setCustomValidity('');
            }

            const formData = new FormData(form);
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    showThankYouPopup('Thank you for your message! We will get back to you soon.');
                    form.reset();
                    // Reset captcha
                    num1 = Math.floor(Math.random() * 10) + 1;
                    num2 = Math.floor(Math.random() * 10) + 1;
                    captchaTotal = num1 + num2;
                    captchaQuestion.innerText = `Math Captcha: What is ${num1} + ${num2}?`;
                    captchaInput.value = '';
                    form.classList.remove('was-validated');
                } else {
                    showThankYouPopup('Something went wrong. Please try again or call us directly.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showThankYouPopup('Network error. Please check your connection and try again.');
            });
        });
    }
});