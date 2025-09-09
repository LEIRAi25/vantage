// Form handling and validation for intake form
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('intake-form');
  const submitBtn = form?.querySelector('button[type="submit"]');
  
  if (!form || !submitBtn) return;

  // Form validation
  function validateForm() {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('error');
        isValid = false;
      } else {
        field.classList.remove('error');
      }
    });
    
    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value)) {
        emailField.classList.add('error');
        isValid = false;
      }
    }
    
    // URL validation
    const websiteField = form.querySelector('input[type="url"]');
    if (websiteField && websiteField.value) {
      try {
        new URL(websiteField.value);
        websiteField.classList.remove('error');
      } catch {
        websiteField.classList.add('error');
        isValid = false;
      }
    }
    
    return isValid;
  }

  // Real-time validation
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.hasAttribute('required') && !input.value.trim()) {
        input.classList.add('error');
      } else {
        input.classList.remove('error');
      }
    });
    
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });

  // Form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fill in all required fields correctly.');
      return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
      // Simulate form submission (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      showSuccess('Thank you! Your intake form has been submitted successfully.');
      
      // Reset form
      form.reset();
      
      // Optional: Redirect after delay
      setTimeout(() => {
        window.location.href = 'confirmation.html';
      }, 2000);
      
    } catch (error) {
      showError('There was an error submitting your form. Please try again.');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  // Success/Error message functions
  function showSuccess(message) {
    const existing = form.querySelector('.form-success, .form-error');
    if (existing) existing.remove();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.textContent = message;
    form.insertBefore(successDiv, form.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }

  function showError(message) {
    const existing = form.querySelector('.form-success, .form-error');
    if (existing) existing.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    form.insertBefore(errorDiv, form.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  // Character count for textareas
  const textareas = form.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    const maxLength = textarea.getAttribute('maxlength');
    if (maxLength) {
      const charCount = document.createElement('div');
      charCount.className = 'char-count';
      textarea.parentNode.appendChild(charCount);
      
      function updateCount() {
        const remaining = maxLength - textarea.value.length;
        charCount.textContent = `${remaining} characters remaining`;
        
        if (remaining < 50) {
          charCount.className = 'char-count warning';
        } else if (remaining < 0) {
          charCount.className = 'char-count error';
        } else {
          charCount.className = 'char-count';
        }
      }
      
      textarea.addEventListener('input', updateCount);
      updateCount();
    }
  });

  // Auto-save form data to localStorage
  const formData = JSON.parse(localStorage.getItem('intakeFormData') || '{}');
  
  // Populate form with saved data
  Object.keys(formData).forEach(key => {
    const field = form.querySelector(`[name="${key}"]`);
    if (field) {
      field.value = formData[key];
    }
  });
  
  // Save form data on input
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const currentData = JSON.parse(localStorage.getItem('intakeFormData') || '{}');
      currentData[input.name] = input.value;
      localStorage.setItem('intakeFormData', JSON.stringify(currentData));
    });
  });
  
  // Clear saved data on successful submission
  form.addEventListener('submit', () => {
    localStorage.removeItem('intakeFormData');
  });
});
