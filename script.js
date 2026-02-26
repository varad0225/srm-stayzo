// ========== Supabase Initialization ==========
const SUPABASE_URL = 'https://morswjkqqdfikucvuxur.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vcnN3amtxcWRmaWt1Y3Z1eHVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjk2MDYsImV4cCI6MjA4NzcwNTYwNn0.BWC91vw0nXSTMap05j0tQAtXTUAsUZVmiwGbxlbs6fA';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeBtn = document.querySelector('.close-btn');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    hamburger.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Sticky Navbar on Scroll
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Navigation Link Update
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // Like Button Interaction
    const likeBtns = document.querySelectorAll('.like-btn');
    likeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const icon = btn.querySelector('i');
            if (icon.classList.contains('fa-regular')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                icon.style.color = '#ff4757'; // Red heart
                btn.style.borderColor = '#ff4757';
            } else {
                icon.classList.add('fa-regular');
                icon.classList.remove('fa-solid');
                icon.style.color = 'white';
                btn.style.borderColor = 'var(--glass-border)';
            }
        });
    });
});
// Append this to the END of script.js

// ========== Auth Page Logic ==========
if (document.querySelector('.auth-page')) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form-container');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            authForms.forEach(f => f.classList.remove('active-form'));

            // Add active class to clicked tab and target form
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active-form');
        });
    });
}

// ========== Booking & Payment Flow Logic ==========
if (document.querySelector('.booking-page')) {
    const termsCheck = document.getElementById('termsCheck');
    const payTokenBtn = document.getElementById('payTokenBtn');
    const paymentModal = document.getElementById('paymentModal');
    const successModal = document.getElementById('successModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
    const paymentMethods = document.querySelectorAll('.method');

    // Enable/Disable Pay Button based on Terms Checkbox
    termsCheck.addEventListener('change', () => {
        payTokenBtn.disabled = !termsCheck.checked;
    });

    // Open Payment Modal
    payTokenBtn.addEventListener('click', () => {
        // Simple validation check (can be expanded)
        const form = document.getElementById('bookingForm');
        if (form.checkValidity()) {
            paymentModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        } else {
            form.reportValidity(); // Show native HTML5 validation errors
        }
    });

    // Close Modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            paymentModal.classList.remove('active');
            successModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close on overlay click
    window.addEventListener('click', (e) => {
        if (e.target === paymentModal || e.target === successModal) {
            paymentModal.classList.remove('active');
            successModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Payment Method Selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
        });
    });

    // Simulate Payment Success
    confirmPaymentBtn.addEventListener('click', async () => {
        const upiInput = document.querySelector('.upi-form input').value;
        if (upiInput.length > 3) {
            confirmPaymentBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
            confirmPaymentBtn.disabled = true;

            const bookingData = {
                student_name: document.querySelectorAll('.form-grid input')[0].value,
                gender: document.querySelector('select').value,
                student_email: document.querySelectorAll('.form-grid input')[1].value,
                student_phone: document.querySelectorAll('.form-grid input')[2].value,
                course: document.querySelectorAll('.form-grid input')[3].value,
                year_of_study: document.querySelectorAll('select')[1].value,
                parent_email: document.querySelectorAll('.form-grid input')[4].value,
                parent_phone: document.querySelectorAll('.form-grid input')[5].value,
                aadhaar_number: document.querySelectorAll('.form-grid input')[6].value,
                srm_id: document.querySelectorAll('.form-grid input')[7].value,
                property_name: "Sunrise Valley Penthouse",
                token_amount: 5000,
                payment_method: "UPI",
                status: "Token Paid"
            };

            try {
                // Insert into Supabase
                const { data, error } = await supabase
                    .from('bookings')
                    .insert([bookingData]);

                if (error) throw error;

                // Move to success state
                paymentModal.classList.remove('active');
                successModal.classList.add('active');
            } catch (err) {
                console.error("Booking Error:", err);
                alert("Payment simulated, but failed to save to Database. Did you create the 'bookings' table in Supabase?");
                paymentModal.classList.remove('active');
                successModal.classList.add('active');
            } finally {
                setTimeout(() => {
                    confirmPaymentBtn.innerHTML = 'Verify & Pay';
                    confirmPaymentBtn.disabled = false;
                }, 1000);
            }
        } else {
            alert('Please enter a valid UPI ID to proceed with the mock payment.');
        }
    });
}
