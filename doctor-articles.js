/*
  MindNext Technologies - Medical Research Articles & Doctor Intelligence Portal
  Interactive Multi-Step Orchestrator: Service Terms, Doctor Profile, Plans & WhatsApp Access
*/

(function () {
  'use strict';

  /* ============ STATE STORE ============ */
  var portalState = {
    currentStep: 1,
    agreedToTerms: false,
    doctorProfile: {
      name: '',
      specialty: 'Cardiology & Vascular',
      customSpecialty: '',
      city: '',
      state: 'Gujarat',
      email: '',
      whatsapp: ''
    },
    subscription: {
      planId: 'annual',
      planName: 'Annual Clinical Membership',
      price: 2499,
      duration: '1 Year (365 Days)'
    },
    memberId: ''
  };

  /* ============ DOM ELEMENTS ============ */
  // Steps & Panels
  var stepPanels = {
    1: document.getElementById('stepPanel1'),
    2: document.getElementById('stepPanel2'),
    3: document.getElementById('stepPanel3'),
    4: document.getElementById('stepPanel4')
  };



  // Step 1 Elements
  var agreementCheckbox = document.getElementById('agreementCheckbox');
  var agreementCard = document.getElementById('agreementCheckCard');
  var btnStep1Next = document.getElementById('btnStep1Next');

  // Step 2 Elements
  var docNameInput = document.getElementById('docName');
  var docSpecialtySelect = document.getElementById('docSpecialty');
  var customSpecialtyRow = document.getElementById('customSpecialtyRow');
  var docCustomSpecialtyInput = document.getElementById('docCustomSpecialty');
  var docCityInput = document.getElementById('docCity');
  var docStateSelect = document.getElementById('docState');
  var docEmailInput = document.getElementById('docEmail');
  var docWhatsappInput = document.getElementById('docWhatsapp');

  var btnStep2Prev = document.getElementById('btnStep2Prev');
  var btnStep2Next = document.getElementById('btnStep2Next');

  // Step 3 Elements
  var planCards = document.querySelectorAll('.plan-card');
  var summaryDocName = document.getElementById('summaryDocName');
  var summaryDocSpecialty = document.getElementById('summaryDocSpecialty');
  var summaryPlanName = document.getElementById('summaryPlanName');
  var summaryTotalAmount = document.getElementById('summaryTotalAmount');
  var btnStep3Pay = document.getElementById('btnStep3Pay');
  var btnStep3Prev = document.getElementById('btnStep3Prev');

  var paymentModal = document.getElementById('paymentModal');
  var paymentModalText = document.getElementById('paymentModalText');

  // Step 4 Elements
  var memberDocName = document.getElementById('memberDocName');
  var memberDocSpecialty = document.getElementById('memberDocSpecialty');
  var memberDocId = document.getElementById('memberDocId');
  var memberDocPhone = document.getElementById('memberDocPhone');
  var memberValidUntil = document.getElementById('memberValidUntil');
  var templateCodePreview = document.getElementById('templateCodePreview');
  var btnCopyTemplate = document.getElementById('btnCopyTemplate');
  var btnSendWhatsAppRequest = document.getElementById('btnSendWhatsAppRequest');
  var portalToast = document.getElementById('portalToast');

  // Mobile Menu Elements
  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');

  /* ============ 1. STEP NAVIGATION CONTROLLER ============ */
  function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > 4) return;

    // Hide all panels
    for (var i = 1; i <= 4; i++) {
      if (stepPanels[i]) {
        stepPanels[i].classList.remove('active');
      }
    }

    // Show target panel
    if (stepPanels[stepNumber]) {
      stepPanels[stepNumber].classList.add('active');
    }

    portalState.currentStep = stepNumber;



    // Scroll smoothly to top of portal container
    var portalTop = document.querySelector('.portal-main-wrap');
    if (portalTop) {
      var headerOffset = 80;
      var elementPosition = portalTop.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }



  /* ============ 2. STEP 1: AGREEMENT & COPYRIGHT ============ */
  if (agreementCheckbox && btnStep1Next) {
    agreementCheckbox.addEventListener('change', function () {
      portalState.agreedToTerms = this.checked;
      if (agreementCard) {
        if (this.checked) {
          agreementCard.classList.add('checked');
        } else {
          agreementCard.classList.remove('checked');
        }
      }
      btnStep1Next.disabled = !this.checked;
    });

    if (agreementCard) {
      agreementCard.addEventListener('click', function (e) {
        if (e.target === agreementCheckbox || (e.target && e.target.closest && e.target.closest('label'))) {
          return;
        }
        agreementCheckbox.checked = !agreementCheckbox.checked;
        agreementCheckbox.dispatchEvent(new Event('change'));
      });
    }

    btnStep1Next.addEventListener('click', function () {
      if (portalState.agreedToTerms) {
        goToStep(2);
      }
    });
  }

  /* ============ 3. STEP 2: DOCTOR DETAILS FORM ============ */
  // Toggle Custom Specialty Input
  if (docSpecialtySelect) {
    docSpecialtySelect.addEventListener('change', function () {
      if (this.value === 'Other Clinical Specialty') {
        if (customSpecialtyRow) customSpecialtyRow.classList.add('show');
        if (docCustomSpecialtyInput) docCustomSpecialtyInput.focus();
      } else {
        if (customSpecialtyRow) customSpecialtyRow.classList.remove('show');
      }
    });
  }

  // Doctor Name automatic "Dr. " prefix helper
  if (docNameInput) {
    docNameInput.addEventListener('blur', function () {
      var val = this.value.trim();
      if (val && !val.toLowerCase().startsWith('dr')) {
        this.value = 'Dr. ' + val;
      }
    });
  }

  // Prev Button (Back to Step 1)
  if (btnStep2Prev) {
    btnStep2Prev.addEventListener('click', function () {
      goToStep(1);
    });
  }

  // Validate and proceed to Step 3
  if (btnStep2Next) {
    btnStep2Next.addEventListener('click', function () {
      var isValid = true;

      // Validate Doctor Name
      var nameVal = docNameInput ? docNameInput.value.trim() : '';
      var nameError = document.getElementById('nameError');
      if (!nameVal || nameVal.replace(/^dr\.?\s*/i, '').trim().length < 2) {
        if (docNameInput) docNameInput.classList.add('has-error');
        if (nameError) nameError.classList.add('visible');
        isValid = false;
      } else {
        if (!nameVal.toLowerCase().startsWith('dr')) {
          nameVal = 'Dr. ' + nameVal;
          if (docNameInput) docNameInput.value = nameVal;
        }
        if (docNameInput) docNameInput.classList.remove('has-error');
        if (nameError) nameError.classList.remove('visible');
        portalState.doctorProfile.name = nameVal;
      }

      // Validate Specialty
      var specVal = docSpecialtySelect ? docSpecialtySelect.value : '';
      if (specVal === 'Other Clinical Specialty' && docCustomSpecialtyInput) {
        var customVal = docCustomSpecialtyInput.value.trim();
        if (!customVal) {
          docCustomSpecialtyInput.classList.add('has-error');
          isValid = false;
        } else {
          docCustomSpecialtyInput.classList.remove('has-error');
          specVal = customVal;
        }
      }
      portalState.doctorProfile.specialty = specVal;

      // Validate City
      var cityVal = docCityInput ? docCityInput.value.trim() : '';
      var cityError = document.getElementById('cityError');
      if (!cityVal) {
        if (docCityInput) docCityInput.classList.add('has-error');
        if (cityError) cityError.classList.add('visible');
        isValid = false;
      } else {
        if (docCityInput) docCityInput.classList.remove('has-error');
        if (cityError) cityError.classList.remove('visible');
        portalState.doctorProfile.city = cityVal;
      }

      // State
      if (docStateSelect) {
        portalState.doctorProfile.state = docStateSelect.value;
      }

      // Validate Professional Email
      var emailVal = docEmailInput ? docEmailInput.value.trim() : '';
      var emailError = document.getElementById('emailError');
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailVal || !emailRegex.test(emailVal)) {
        if (docEmailInput) docEmailInput.classList.add('has-error');
        if (emailError) emailError.classList.add('visible');
        isValid = false;
      } else {
        if (docEmailInput) docEmailInput.classList.remove('has-error');
        if (emailError) emailError.classList.remove('visible');
        portalState.doctorProfile.email = emailVal;
      }

      // Validate Mobile Number (WhatsApp Active)
      var phoneVal = docWhatsappInput ? docWhatsappInput.value.trim() : '';
      var phoneClean = phoneVal.replace(/[^0-9]/g, '');
      var phoneError = document.getElementById('whatsappError');
      if (!phoneClean || phoneClean.length < 10) {
        if (docWhatsappInput) docWhatsappInput.classList.add('has-error');
        if (phoneError) phoneError.classList.add('visible');
        isValid = false;
      } else {
        if (docWhatsappInput) docWhatsappInput.classList.remove('has-error');
        if (phoneError) phoneError.classList.remove('visible');
        portalState.doctorProfile.whatsapp = phoneClean.slice(-10);
      }

      if (isValid) {
        updateStep3Summary();
        goToStep(3);
      }
    });
  }

  /* ============ 4. STEP 3: SUBSCRIPTION PLANS & CHECKOUT ============ */
  var planPricingData = {
    quarterly: {
      name: 'Quarterly Fellowship Plan',
      price: 999,
      duration: '3 Months (90 Days)'
    },
    annual: {
      name: 'Annual Clinical Membership',
      price: 2499,
      duration: '1 Year (365 Days)'
    },
    biennial: {
      name: '2-Year Institutional Fellowship',
      price: 4499,
      duration: '2 Years (730 Days)'
    }
  };

  planCards.forEach(function (card) {
    card.addEventListener('click', function () {
      planCards.forEach(function (c) { c.classList.remove('selected'); });
      this.classList.add('selected');

      var planKey = this.getAttribute('data-plan-id');
      if (planPricingData[planKey]) {
        portalState.subscription.planId = planKey;
        portalState.subscription.planName = planPricingData[planKey].name;
        portalState.subscription.price = planPricingData[planKey].price;
        portalState.subscription.duration = planPricingData[planKey].duration;
        updateStep3Summary();
      }
    });
  });

  function updateStep3Summary() {
    if (summaryDocName) summaryDocName.innerText = portalState.doctorProfile.name || 'Dr. Doctor';
    if (summaryDocSpecialty) summaryDocSpecialty.innerText = portalState.doctorProfile.specialty || 'General Medicine';
    if (summaryPlanName) summaryPlanName.innerText = portalState.subscription.planName;
    if (summaryTotalAmount) summaryTotalAmount.innerText = '₹' + portalState.subscription.price.toLocaleString('en-IN');
    if (btnStep3Pay) {
      btnStep3Pay.innerHTML = 'Pay ₹' + portalState.subscription.price.toLocaleString('en-IN') + ' &amp; Activate Membership 🔒';
    }
  }

  // Payment method tabs
  var paymentTabs = document.querySelectorAll('.payment-tab-btn');
  paymentTabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      paymentTabs.forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.payment-tab-pane').forEach(function (p) { p.classList.remove('active'); });

      this.classList.add('active');
      var targetId = this.getAttribute('data-target-tab');
      var targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Prev Button (Back to Step 2)
  if (btnStep3Prev) {
    btnStep3Prev.addEventListener('click', function () {
      goToStep(2);
    });
  }

  // Payment Execution & Simulation
  if (btnStep3Pay) {
    btnStep3Pay.addEventListener('click', function () {
      if (paymentModal) paymentModal.classList.add('active');
      if (paymentModalText) {
        paymentModalText.innerText = 'Connecting to Secure Banking Gateway for ' + portalState.doctorProfile.name + '...';
      }

      setTimeout(function () {
        if (paymentModalText) {
          paymentModalText.innerText = 'Verifying UPI / Card Transaction (₹' + portalState.subscription.price.toLocaleString('en-IN') + ')...';
        }
      }, 900);

      setTimeout(function () {
        if (paymentModalText) {
          paymentModalText.innerText = 'Payment Authorized! Generating Verified Doctor Credentials...';
        }
      }, 1800);

      setTimeout(function () {
        if (paymentModal) paymentModal.classList.remove('active');
        setupStep4Onboarding();
        goToStep(4);
      }, 2600);
    });
  }

  /* ============ 5. STEP 4: ONBOARDING & WHATSAPP ACCESS ============ */
  function setupStep4Onboarding() {
    // Generate Random Doctor Member ID
    var randNum = Math.floor(1000 + Math.random() * 9000);
    portalState.memberId = 'MN-DOC-' + randNum;

    if (memberDocName) memberDocName.innerText = portalState.doctorProfile.name;
    if (memberDocSpecialty) memberDocSpecialty.innerText = portalState.doctorProfile.specialty;
    if (memberDocId) memberDocId.innerText = portalState.memberId;
    if (memberDocPhone) memberDocPhone.innerText = '+91 ' + portalState.doctorProfile.whatsapp;

    // Calculate Expiry Date
    var validDate = new Date();
    if (portalState.subscription.planId === 'quarterly') {
      validDate.setMonth(validDate.getMonth() + 3);
    } else if (portalState.subscription.planId === 'annual') {
      validDate.setFullYear(validDate.getFullYear() + 1);
    } else {
      validDate.setFullYear(validDate.getFullYear() + 2);
    }
    var options = { year: 'numeric', month: 'short', day: 'numeric' };
    if (memberValidUntil) memberValidUntil.innerText = validDate.toLocaleDateString('en-US', options);

    // Prepare WhatsApp Message Request Template
    var formattedMsg =
      'Hello MindNext Research Desk,\n' +
      'I am an active enrolled doctor. Please provide the full research paper & clinical summary for:\n\n' +
      '• Doctor Name: ' + portalState.doctorProfile.name + '\n' +
      '• Member ID: ' + portalState.memberId + '\n' +
      '• Speciality: ' + portalState.doctorProfile.specialty + '\n' +
      '• DOI / Article Link: [Paste DOI or Journal Link here]\n' +
      '• Picture: [Attaching screenshot / photo of paper abstract]\n\n' +
      'Thank you!';

    if (templateCodePreview) {
      templateCodePreview.innerText = formattedMsg;
    }

    // Direct WhatsApp send button URL
    if (btnSendWhatsAppRequest) {
      var encodedMsg = encodeURIComponent(formattedMsg);
      btnSendWhatsAppRequest.href = 'https://wa.me/917984919956?text=' + encodedMsg;
    }
  }

  // Copy Template to Clipboard
  if (btnCopyTemplate) {
    btnCopyTemplate.addEventListener('click', function () {
      if (!templateCodePreview) return;
      var textToCopy = templateCodePreview.innerText;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(showToast);
      } else {
        // Fallback for older browsers
        var textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          showToast();
        } catch (err) {
          alert('Template text ready to copy.');
        }
        document.body.removeChild(textarea);
      }
    });
  }

  function showToast() {
    if (portalToast) {
      portalToast.classList.add('show');
      setTimeout(function () {
        portalToast.classList.remove('show');
      }, 2600);
    }
  }

  /* ============ 6. MOBILE NAVIGATION TOGGLE ============ */
  function closeMenu() {
    if (menuToggle && mobileNav) {
      menuToggle.classList.remove('open');
      mobileNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  function openMenu() {
    if (menuToggle && mobileNav) {
      menuToggle.classList.add('open');
      mobileNav.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menuToggle.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  document.addEventListener('click', function (e) {
    if (mobileNav && mobileNav.classList.contains('open')) {
      if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // Footer Year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.innerText = new Date().getFullYear();
  }

  // Initialize Step 1
  goToStep(1);

})();
