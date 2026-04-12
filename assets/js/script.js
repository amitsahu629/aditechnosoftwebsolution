document.addEventListener('DOMContentLoaded', function () {

    // --- ACTIVE NAV LINK ---
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';

        const pageToLinkSelector = {
            'index.html': 'a[href="index.html"]',
            'services.html': 'a[href="services.html"]',
            'pricing.html': 'a[href="pricing.html"]',
            'projects.html': 'a[href="projects.html"]',
            'contact.html': 'a[href="contact.html"]',
            'about.html': 'a[href="about.html"]'
        };

        document.querySelectorAll('.navbar-nav .nav-link')
            .forEach(link => link.classList.remove('active'));

        const selector = pageToLinkSelector[currentPage];
        if (selector) {
            const activeLink = document.querySelector(selector);
            if (activeLink) activeLink.classList.add('active');
        }
    }
    setActiveNavLink();

    // --- LANGUAGE SWITCH ---
    const langBtns = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('.trn');

    function setLanguage(lang) {
        translatableElements.forEach(el => {
            const text = el.getAttribute('data-' + lang);
            if (text) el.textContent = text;
        });

        langBtns.forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });

    // --- MOBILE MENU CLOSE ---
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navbarNav');

    if (menuToggle && typeof bootstrap !== 'undefined') {
        const bsCollapse = new bootstrap.Collapse(menuToggle, { toggle: false });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (menuToggle.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });
    }

    // --- CAPTCHA ---
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    let captchaTotal = num1 + num2;

    const captchaQuestion = document.getElementById('captchaQuestion');
    if (captchaQuestion) {
        captchaQuestion.innerText = `Math Captcha: What is ${num1} + ${num2}?`;
    }

    const form = document.getElementById('contactForm');
    const captchaInput = document.getElementById('captchaInput');

    // --- POPUP FUNCTION (CLEAN VERSION) ---
    function showThankYouPopup(message) {
        if (document.getElementById('popup-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'popup-overlay';
        overlay.className = 'popup-overlay';

        const content = document.createElement('div');
        content.className = 'popup-box';

        content.innerHTML = `
            <p>${message}</p>
            <button class="popup-close">Close</button>
        `;

        overlay.appendChild(content);
        document.body.appendChild(overlay);

        document.querySelector('.popup-close').onclick = () => overlay.remove();
    }

    // --- FORM SUBMIT ---
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            captchaInput.setCustomValidity('');

            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            if (parseInt(captchaInput.value) !== captchaTotal) {
                captchaInput.setCustomValidity('Invalid');
                document.getElementById('captchaError').style.display = 'block';
                form.classList.add('was-validated');
                return;
            }

            document.getElementById('captchaError').style.display = 'none';

            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
                .then(res => {
                    if (res.ok) {
                        showThankYouPopup("Thank you! We'll contact you soon 🚀");
                        form.reset();

                        // Reset captcha
                        num1 = Math.floor(Math.random() * 10) + 1;
                        num2 = Math.floor(Math.random() * 10) + 1;
                        captchaTotal = num1 + num2;
                        captchaQuestion.innerText = `Math Captcha: What is ${num1} + ${num2}?`;

                        form.classList.remove('was-validated');
                    } else {
                        showThankYouPopup("Something went wrong. Try again.");
                    }
                })
                .catch(() => {
                    showThankYouPopup("Network error. Check connection.");
                });
        });
    }

    // --- EXIT INTENT (DESKTOP) ---
    let exitShown = false;

    document.addEventListener("mouseout", function (e) {
        if (!exitShown && e.clientY < 10) {
            exitShown = true;
            showThankYouPopup("Wait! Get your website at just ₹4999 🚀");
        }
    });

    // --- MOBILE EXIT (TIME BASED) ---
    if (window.innerWidth < 768) {
        setTimeout(() => {
            showThankYouPopup("Limited Offer! Book your website today 🚀");
        }, 15000);
    }

    // --- WHATSAPP AUTO MESSAGE ---
    const whatsappBtns = document.querySelectorAll('.float-whatsapp, a[href*="wa.me"]');

    whatsappBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const phone = "919958958838";
            const message = encodeURIComponent(
                "Hi, I want to build a website for my business."
            );
            this.setAttribute("href", `https://wa.me/${phone}?text=${message}`);
        });
    });

    // --- SMART SCROLL (DEBOUNCED) ---
    let scrollTimeout;

    window.addEventListener("scroll", function () {
        clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            const scrollPercent =
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

            const btn = document.querySelector('.float-whatsapp');
            if (btn && scrollPercent > 50) {
                btn.style.transform = "scale(1.1)";
            }
        }, 100);
    });

    // --- CLICK TRACKING ---
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('click', () => {
            console.log("Clicked:", el.innerText || el.href);
        });
    });

    // --- SCROLL ANIMATION (FADE-UP) ---
    const elements = document.querySelectorAll('.fade-up');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
            }
        });
    });

    elements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = "translateY(20px)";
        observer.observe(el);
    });

});