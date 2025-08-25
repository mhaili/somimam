document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map only if #map exists and Leaflet is available
    try {
        const mapEl = document.getElementById('map');
        if (mapEl && typeof L !== 'undefined') {
            initMap();
        }
    } catch (err) {
        // Ignore map initialization errors to avoid blocking other features
        console.warn('Map initialization skipped:', err);
    }
    
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    
    // Show/hide back to top button on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
    
    // Form validation and submission
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;

            fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    showAlert('Votre message a été envoyé avec succès ! Nous vous contacterons bientôt.', 'success');
                    form.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            const errorMessage = data["errors"].map(error => error["message"]).join(", ");
                            showAlert(`Erreur: ${errorMessage}`, 'error');
                        } else {
                            showAlert('Une erreur est survenue lors de l\'envoi du message.', 'error');
                        }
                    })
                }
            }).catch(error => {
                showAlert('Une erreur est survenue lors de l\'envoi du message.', 'error');
            }).finally(() => {
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // Show alert message
    function showAlert(message, type = 'success') {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.form-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        const alert = document.createElement('div');
        alert.className = `form-alert ${type}`;
        alert.textContent = message;
        
        // Insert after the form title
        const formTitle = document.querySelector('.contact-form h2');
        if (formTitle) {
            formTitle.parentNode.insertBefore(alert, formTitle.nextSibling);
        } else {
            contactForm.prepend(alert);
        }
        
        // Auto-remove alert after 5 seconds
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 5000);
    }
    
});

// Initialize and display the map
function initMap() {
    // Coordinates for Casablanca, Morocco
    const casablanca = { lat: 33.5731, lng: -7.5898 };
    
    // Create map
    const map = L.map('map').setView(casablanca, 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add custom marker
    const customIcon = L.divIcon({
        html: '<i class="fas fa-map-marker-alt"></i>',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
        className: 'map-marker'
    });
    
    // Add marker to the map
    L.marker(casablanca, { icon: customIcon })
        .addTo(map)
        .bindPopup('SOMIMAM<br>Quartier des Affaires, Casablanca')
        .openPopup();
    
    // Add custom style for the marker
    const style = document.createElement('style');
    style.textContent = `
        .map-marker {
            color: #e74c3c;
            font-size: 2rem;
            text-shadow: 0 0 10px rgba(0,0,0,0.2);
            transform: translateY(-100%);
        }
    `;
    document.head.appendChild(style);
}
