function testPassword() {
    const password = document.getElementById('password').value;
  
    const reqLength = document.getElementById('reqLength');
    const reqUpper = document.getElementById('reqUpper');
    const reqLower = document.getElementById('reqLower');
    const reqNumber = document.getElementById('reqNumber');
    const reqSpecial = document.getElementById('reqSpecial');
  
    reqLength.className = password.length >= 8 ? 'valid' : 'invalid';
    reqUpper.className = /[A-Z]/.test(password) ? 'valid' : 'invalid';
    reqLower.className = /[a-z]/.test(password) ? 'valid' : 'invalid';
    reqNumber.className = /[0-9]/.test(password) ? 'valid' : 'invalid';
    reqSpecial.className = /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'valid' : 'invalid';
  
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
  
    const percent = (strength / 5) * 100;
    const fill = document.getElementById('strengthFill');
    fill.style.width = percent + '%';
  
    if (percent <= 40) 
        fill.style.background = 'red';
    else if (percent <= 80) 
        fill.style.background = 'orange';
    else {
        fill.style.background = 'green';
        fill.textContent = percent + '%';
    }
  }
  
  function clearPassword() {
    document.getElementById('password').value = '';
    testPassword();
  }