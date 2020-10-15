document.addEventListener('DOMContentLoaded', function() {

  if (localStorage.getItem('displayName')) {
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/dashboard';
    document.body.appendChild(form);
    form.submit();
  }

  document.querySelector('.login__form').onsubmit = function() {
    var displayName = document.querySelector('.login__form .input__field').value;
    localStorage.setItem('displayName', displayName);
  };

});
