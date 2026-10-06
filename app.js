/**
 * Naturals Salon & Skincare - Interactive Application Logic
 * Kottakkal, Kerala
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Header Scroll Effect ---
  const header = document.getElementById('siteHeader');
  const brandLogo = document.getElementById('brandLogo');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Drawer Menu ---
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });

    closeDrawerBtn?.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

    // --- Client & Clinic Reviews Slider ---
  const reviewsTrack = document.getElementById('reviewsTrack');
  const reviewsPrevBtn = document.getElementById('reviewsPrevBtn');
  const reviewsNextBtn = document.getElementById('reviewsNextBtn');
  const reviewsPagination = document.getElementById('reviewsPagination');
  const reviewCards = document.querySelectorAll('.review-card');

  if (reviewsTrack && reviewCards.length > 0) {
    let currentReviewIndex = 0;

    function getVisibleCardsCount() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getMaxIndex() {
      const visible = getVisibleCardsCount();
      return Math.max(0, reviewCards.length - visible);
    }

    function updateReviewsSlider() {
      const visible = getVisibleCardsCount();
      const maxIdx = getMaxIndex();
      if (currentReviewIndex > maxIdx) currentReviewIndex = maxIdx;
      if (currentReviewIndex < 0) currentReviewIndex = 0;

      const firstCard = reviewCards[0];
      if (!firstCard) return;

      const cardStyle = window.getComputedStyle(reviewsTrack);
      const gap = parseFloat(cardStyle.gap) || 24;
      const cardWidth = firstCard.getBoundingClientRect().width;
      const moveDistance = (cardWidth + gap) * currentReviewIndex;

      reviewsTrack.style.transform = `translateX(-${moveDistance}px)`;

      // Update dots
      if (reviewsPagination) {
        const dots = reviewsPagination.querySelectorAll('.review-dot');
        dots.forEach((dot, idx) => {
          if (idx === currentReviewIndex) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });
      }
    }

    function renderDots() {
      if (!reviewsPagination) return;
      reviewsPagination.innerHTML = '';
      const maxIdx = getMaxIndex();
      const dotCount = maxIdx + 1;

      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.className = `review-dot ${i === currentReviewIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to review ${i + 1}`);
        dot.addEventListener('click', () => {
          currentReviewIndex = i;
          updateReviewsSlider();
        });
        reviewsPagination.appendChild(dot);
      }
    }

    if (reviewsNextBtn) {
      reviewsNextBtn.addEventListener('click', () => {
        const maxIdx = getMaxIndex();
        if (currentReviewIndex >= maxIdx) {
          currentReviewIndex = 0;
        } else {
          currentReviewIndex++;
        }
        updateReviewsSlider();
      });
    }

    if (reviewsPrevBtn) {
      reviewsPrevBtn.addEventListener('click', () => {
        const maxIdx = getMaxIndex();
        if (currentReviewIndex <= 0) {
          currentReviewIndex = maxIdx;
        } else {
          currentReviewIndex--;
        }
        updateReviewsSlider();
      });
    }

    // Touch Swipe Support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    reviewsTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    reviewsTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 40;
      const maxIdx = getMaxIndex();
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swiped Left -> Next
        if (currentReviewIndex < maxIdx) {
          currentReviewIndex++;
          updateReviewsSlider();
        }
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swiped Right -> Prev
        if (currentReviewIndex > 0) {
          currentReviewIndex--;
          updateReviewsSlider();
        }
      }
    }

    window.addEventListener('resize', () => {
      renderDots();
      updateReviewsSlider();
    });

    renderDots();
    updateReviewsSlider();
  }

  // --- Consultation Modal Dialog ---
  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const treatmentSelect = document.getElementById('treatmentSelect');
  const consultationForm = document.getElementById('consultationForm');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const treatmentData = btn.getAttribute('data-treatment');
      if (treatmentData && treatmentSelect) {
        // Select corresponding treatment if clicked from card
        for (let i = 0; i < treatmentSelect.options.length; i++) {
          if (treatmentSelect.options[i].text.toLowerCase().includes(treatmentData.toLowerCase())) {
            treatmentSelect.selectedIndex = i;
            break;
          }
        }
      }
      bookingModal.classList.add('open');
      if (mobileDrawer.classList.contains('open')) {
        mobileDrawer.classList.remove('open');
      }
    });
  });

  closeModalBtn?.addEventListener('click', () => {
    bookingModal.classList.remove('open');
  });

  bookingModal?.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      bookingModal.classList.remove('open');
    }
  });

  // Set default appointment date to tomorrow
  const dateInput = document.getElementById('appointmentDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }

  // Handle Form Submission
  consultationForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const treatment = treatmentSelect.value;
    const date = dateInput.value;

    alert(`Thank you, ${name}!\n\nYour consultation request for ${treatment} on ${date} has been registered for Naturals Salon, Kottakkal.\n\nOur team will confirm your time slot shortly at ${phone}.`);
    consultationForm.reset();
    bookingModal.classList.remove('open');
  });

  // --- Experts Slider Navigation (Desktop 4 Cards, Mobile 1 Card - Smooth Scrollable) ---
  const expertPrevBtn = document.getElementById('expertPrevBtn');
  const expertNextBtn = document.getElementById('expertNextBtn');
  const expertsViewport = document.getElementById('expertsViewport') || document.querySelector('.experts-slider-viewport');
  const expertsTrack = document.getElementById('expertsTrack');
  const expertDotsContainer = document.getElementById('expertsDots');
  const expertCards = document.querySelectorAll('.expert-card');

  if (expertsViewport && expertsTrack && expertCards.length > 0) {
    let isMobile = window.innerWidth <= 768;

    const getCardWidth = () => {
      return expertCards[0].offsetWidth || 300;
    };

    const getGap = () => {
      return isMobile ? 16 : 24;
    };

    // Render pagination dots: 2 pages on desktop (Cards 1-4 and Cards 5-8), 8 dots on mobile (1 per card)
    const renderDots = () => {
      if (!expertDotsContainer) return;
      isMobile = window.innerWidth <= 768;
      expertDotsContainer.innerHTML = '';
      const totalDots = isMobile ? expertCards.length : 2;

      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('button');
        dot.className = 'experts-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          if (isMobile) {
            const cardTarget = expertCards[i];
            if (cardTarget) {
              cardTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
          } else {
            // Desktop: Page 0 or Page 1
            const scrollAmount = i * (expertsViewport.clientWidth);
            expertsViewport.scrollTo({ left: scrollAmount, behavior: 'smooth' });
          }
        });
        expertDotsContainer.appendChild(dot);
      }
    };

    // Update active dot on scroll
    const updateActiveDot = () => {
      const dots = expertDotsContainer?.querySelectorAll('.experts-dot');
      if (!dots || dots.length === 0) return;

      const scrollLeft = expertsViewport.scrollLeft;
      isMobile = window.innerWidth <= 768;

      if (isMobile) {
        const step = getCardWidth() + getGap();
        const activeIdx = Math.max(0, Math.min(Math.round(scrollLeft / step), expertCards.length - 1));
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIdx);
        });
      } else {
        const maxScroll = expertsViewport.scrollWidth - expertsViewport.clientWidth;
        const pageIdx = scrollLeft > maxScroll * 0.4 ? 1 : 0;
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === pageIdx);
        });
      }
    };

    // Next button: scrolls right smoothly
    expertNextBtn?.addEventListener('click', () => {
      isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const step = getCardWidth() + getGap();
        const maxScroll = expertsViewport.scrollWidth - expertsViewport.clientWidth;
        if (expertsViewport.scrollLeft >= maxScroll - 10) {
          expertsViewport.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          expertsViewport.scrollBy({ left: step, behavior: 'smooth' });
        }
      } else {
        // Desktop: scroll right by full viewport width (reveals remaining 4 cards smoothly)
        const maxScroll = expertsViewport.scrollWidth - expertsViewport.clientWidth;
        if (expertsViewport.scrollLeft >= maxScroll - 20) {
          expertsViewport.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          expertsViewport.scrollBy({ left: expertsViewport.clientWidth, behavior: 'smooth' });
        }
      }
    });

    // Prev button: scrolls left smoothly
    expertPrevBtn?.addEventListener('click', () => {
      isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const step = getCardWidth() + getGap();
        if (expertsViewport.scrollLeft <= 10) {
          expertsViewport.scrollTo({ left: expertsViewport.scrollWidth, behavior: 'smooth' });
        } else {
          expertsViewport.scrollBy({ left: -step, behavior: 'smooth' });
        }
      } else {
        // Desktop: scroll left by viewport width
        if (expertsViewport.scrollLeft <= 20) {
          expertsViewport.scrollTo({ left: expertsViewport.scrollWidth, behavior: 'smooth' });
        } else {
          expertsViewport.scrollBy({ left: -expertsViewport.clientWidth, behavior: 'smooth' });
        }
      }
    });

    // Passive scroll listener for smooth dot updates
    let scrollDebounce;
    expertsViewport.addEventListener('scroll', () => {
      cancelAnimationFrame(scrollDebounce);
      scrollDebounce = requestAnimationFrame(updateActiveDot);
    }, { passive: true });

    // Desktop Mouse Drag-to-Scroll Support
    let isDown = false;
    let startX = 0;
    let scrollStartLeft = 0;

    expertsViewport.addEventListener('mousedown', (e) => {
      if (window.innerWidth <= 768) return;
      isDown = true;
      expertsViewport.classList.add('is-dragging');
      startX = e.pageX - expertsViewport.offsetLeft;
      scrollStartLeft = expertsViewport.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      expertsViewport.classList.remove('is-dragging');
    });

    expertsViewport.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - expertsViewport.offsetLeft;
      const walk = (x - startX) * 1.5;
      expertsViewport.scrollLeft = scrollStartLeft - walk;
    });

    // Resize handling between desktop and mobile modes
    window.addEventListener('resize', () => {
      const nowMobile = window.innerWidth <= 768;
      if (nowMobile !== isMobile) {
        isMobile = nowMobile;
        renderDots();
        updateActiveDot();
      }
    });

    renderDots();
  }

  // --- Philosophy Section Crossfade Transition (Skin <-> Hair) ---
  const philosophyTitleLayers = document.querySelectorAll('.philosophy-title-layer');
  const philosophyMediaLayers = document.querySelectorAll('.philosophy-media-layer');
  const philosophyCtaLayers = document.querySelectorAll('.philosophy-cta-layer');

  if (philosophyTitleLayers.length > 1 && philosophyMediaLayers.length > 1) {
    let currentPhilosophyIndex = 0;
    const totalPhilosophyStates = 2;
    const displayDuration = 3000; // Display each slide for ~3s before transitioning
    const transitionDuration = 1350; // 1.35s smooth crossfade duration
    let philosophyTimeout = null;

    // Preload both images in memory so there is no flashing or blank image
    ['assets/images/philosophy-skin.jpg', 'assets/images/hero-haircare.jpg'].forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const transitionPhilosophy = (targetIndex) => {
      if (targetIndex === currentPhilosophyIndex) return;

      // Heading, image, and button fade together synchronously
      if (philosophyTitleLayers[currentPhilosophyIndex]) {
        philosophyTitleLayers[currentPhilosophyIndex].classList.remove('active');
      }
      if (philosophyMediaLayers[currentPhilosophyIndex]) {
        philosophyMediaLayers[currentPhilosophyIndex].classList.remove('active');
      }
      if (philosophyCtaLayers[currentPhilosophyIndex]) {
        philosophyCtaLayers[currentPhilosophyIndex].classList.remove('active');
      }

      currentPhilosophyIndex = targetIndex;

      if (philosophyTitleLayers[currentPhilosophyIndex]) {
        philosophyTitleLayers[currentPhilosophyIndex].classList.add('active');
      }
      if (philosophyMediaLayers[currentPhilosophyIndex]) {
        philosophyMediaLayers[currentPhilosophyIndex].classList.add('active');
      }
      if (philosophyCtaLayers[currentPhilosophyIndex]) {
        philosophyCtaLayers[currentPhilosophyIndex].classList.add('active');
      }
    };

    const scheduleNextTransition = (delay) => {
      if (philosophyTimeout) clearTimeout(philosophyTimeout);
      philosophyTimeout = setTimeout(() => {
        const nextIndex = (currentPhilosophyIndex + 1) % totalPhilosophyStates;
        transitionPhilosophy(nextIndex);
        scheduleNextTransition(displayDuration + transitionDuration);
      }, delay);
    };

    // Initial slide displays for ~3 seconds before transitioning
    scheduleNextTransition(displayDuration);

    // Pause timer when page is hidden to prevent drift
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (philosophyTimeout) clearTimeout(philosophyTimeout);
      } else {
        scheduleNextTransition(displayDuration);
      }
    });
  }
});
