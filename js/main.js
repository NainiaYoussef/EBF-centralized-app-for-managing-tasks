(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').css('top', '0px');
        } else {
            $('.sticky-top').css('top', '-100px');
        }
    });


    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";

    $(window).on("load resize", function () {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
                function () {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function () {
                    const $this = $(this);
                    $this.removeClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "false");
                    $this.find($dropdownMenu).removeClass(showClass);
                }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

    // Counter Animation for Statistics Section (robust version)
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            counter.innerText = '0';
            const updateCounter = () => {
                const target = +counter.getAttribute('data-target');
                const current = +counter.innerText;
                const increment = Math.ceil(target / 100);
                if (current < target) {
                    counter.innerText = `${Math.min(current + increment, target)}`;
                    setTimeout(updateCounter, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    }

    // Use IntersectionObserver for robust triggering
    let countersAnimated = false;
    function observeCounters() {
        const counters = document.querySelectorAll('.counter');
        if (!counters.length) return;
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                    observer.disconnect();
                }
            });
        }, { threshold: 0.2 });
        counters.forEach(counter => observer.observe(counter));
    }
    observeCounters();

    // --- EBF Booking AJAX Submission ---
    function showBookingAlert(msg, type = 'success') {
      let alert = document.createElement('div');
      alert.className = `alert alert-${type} text-center`;
      alert.style.position = 'fixed';
      alert.style.top = '0';
      alert.style.left = '0';
      alert.style.right = '0';
      alert.style.zIndex = '9999';
      alert.innerText = msg;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3500);
    }

    // Conference Booking Form (pricing.html)
    const confForm = document.querySelector('#conference-booking-form form');
    if (confForm) {
      confForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(confForm);
        try {
          const res = await fetch('http://localhost:3002/api/booking', {
            method: 'POST',
            body: formData
          });
          const result = await res.json().catch(() => ({}));
          if (res.ok && result.success) {
            showBookingAlert('Booking submitted successfully!');
            confForm.reset();
          } else {
            showBookingAlert(result.message || 'Failed to submit booking.', 'danger');
          }
          console.log('Booking form response:', result);
        } catch (err) {
          showBookingAlert('Network error. Try again.', 'danger');
          console.error('Booking form error:', err);
        }
      });
    }

    // General Booking/Contact Form (pricing.html)
    const genForm = document.querySelector('#general-booking form');
    if (genForm) {
      genForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(genForm);
        try {
          const res = await fetch('http://localhost:3002/api/booking', {
            method: 'POST',
            body: formData
          });
          const result = await res.json().catch(() => ({}));
          if (res.ok && result.success) {
            showBookingAlert('Request sent successfully!');
            genForm.reset();
          } else {
            showBookingAlert(result.message || 'Failed to send request.', 'danger');
          }
          console.log('General booking/contact form response:', result);
        } catch (err) {
          showBookingAlert('Network error. Try again.', 'danger');
          console.error('General booking/contact form error:', err);
        }
      });
    }

    // Contact Form (contact.html)
    const contactForm = document.querySelector('form[action="#"], form[action=""]');
    if (contactForm && contactForm.querySelector('input[type="email"]')) {
      contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        try {
          const res = await fetch('http://localhost:3002/api/booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(formData.entries()))
          });
          if (res.ok) {
            showBookingAlert('Message sent successfully!');
            contactForm.reset();
          } else {
            const result = await res.json().catch(() => ({}));
            showBookingAlert(result.message || 'Failed to send message.', 'danger');
          }
        } catch (err) {
          showBookingAlert('Network error. Try again.', 'danger');
          console.error('Contact form error:', err);
        }
      });
    }

    // --- EBF Application AJAX Submission (instructor.html) ---
    function showAppAlert(msg, type = 'success') {
      let alert = document.createElement('div');
      alert.className = `alert alert-${type} text-center`;
      alert.style.position = 'fixed';
      alert.style.top = '0';
      alert.style.left = '0';
      alert.style.right = '0';
      alert.style.zIndex = '9999';
      alert.innerText = msg;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3500);
    }

    // Job Application Modal Form (instructor.html)
    const jobForm = document.querySelector('#jobModal form');
    if (jobForm) {
      jobForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(jobForm);
        try {
          const res = await fetch('http://localhost:3002/api/application', {
            method: 'POST',
            body: formData
          });
          if (res.ok) {
            showAppAlert('Application submitted successfully!');
            jobForm.reset();
            // Close modal
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('jobModal'));
            modal.hide();
          } else {
            const data = await res.json().catch(() => ({}));
            showAppAlert(data.message || 'Failed to submit application.', 'danger');
          }
        } catch (err) {
          showAppAlert('Network error. Try again.', 'danger');
          console.error('Job application form error:', err);
        }
      });
    }

    // Internship Application Modal Form (instructor.html)
    const internForm = document.querySelector('#internModal form');
    if (internForm) {
      internForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(internForm);
        try {
          const res = await fetch('http://localhost:3002/api/application', {
            method: 'POST',
            body: formData
          });
          if (res.ok) {
            showAppAlert('Application submitted successfully!');
            internForm.reset();
            // Close modal
            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('internModal'));
            modal.hide();
          } else {
            const data = await res.json().catch(() => ({}));
            showAppAlert(data.message || 'Failed to submit application.', 'danger');
          }
        } catch (err) {
          showAppAlert('Network error. Try again.', 'danger');
          console.error('Internship application form error:', err);
        }
      });
    }

})(jQuery);





