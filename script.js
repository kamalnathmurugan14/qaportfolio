(function () {
  // Form delivery: FormSubmit.co forwards submissions to this address.
  // The first submission triggers a one-time activation email to the inbox.
  var TO = 'kamalnath.qatesting@gmail.com';
  var ENDPOINT = 'https://formsubmit.co/ajax/' + TO;

  var skills = {
    'Testing & Automation': ['Java Selenium', 'Playwright', 'Postman', 'Karate', 'Cucumber', 'Manual Testing', 'Automation Testing', 'API Testing', 'UI Testing', 'Integration Testing', 'Performance Testing', 'Claude AI'],
    'Programming': ['Java', 'JavaScript', 'Python'],
    'SharePoint': ['SharePoint Online', 'SharePoint SPFx', 'Application Testing', 'Document Management Testing'],
    'Frameworks & Methods': ['BDD', 'TestNG', 'JUnit', 'STLC', 'Agile', 'UAT', 'Regression', 'End-to-End'],
    'Databases': ['SQL', 'MongoDB', 'Microsoft SQL Server'],
    'Tools & Platforms': ['JIRA', 'GitHub', 'Maven', 'Eclipse', 'VS Code', 'Figma', 'Ubuntu', 'Windows']
  };
  var grid = document.getElementById('skill-grid');
  Object.keys(skills).forEach(function (k) {
    var d = document.createElement('div');
    d.className = 'card';
    var h = document.createElement('h3'); h.textContent = k; d.appendChild(h);
    var p = document.createElement('div'); p.className = 'pills';
    skills[k].forEach(function (s) { var i = document.createElement('span'); i.className = 'pill'; i.textContent = s; p.appendChild(i); });
    d.appendChild(p); grid.appendChild(d);
  });

  document.getElementById('yr').textContent = new Date().getFullYear();

  // Theme
  var root = document.documentElement, tbtn = document.getElementById('theme');
  try { var saved = localStorage.getItem('theme'); if (saved) root.dataset.theme = saved; else if (matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'dark'; } catch (e) {}
  tbtn.addEventListener('click', function () {
    var n = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = n; try { localStorage.setItem('theme', n); } catch (e) {}
  });

  // Mobile menu
  var mb = document.querySelector('.menu-btn'), links = document.getElementById('links');
  mb.addEventListener('click', function () { var o = links.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') { links.classList.remove('open'); mb.setAttribute('aria-expanded', false); } });

  // Scroll reveal
  var els = document.querySelectorAll('.sec .card, .timeline>li, h2');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: .1 });
    els.forEach(function (e) { e.classList.add('reveal'); io.observe(e); });
  }

  // Contact form
  var form = document.getElementById('contact-form'), status = document.getElementById('status'), btn = document.getElementById('send');
  function setErr(name, msg) {
    form.querySelector('[data-for="' + name + '"]').textContent = msg || '';
    form.elements[name].classList.toggle('bad', !!msg);
  }
  function validate() {
    var f = form.elements, ok = true;
    var n = f.name.value.trim(), e = f.email.value.trim(), m = f.message.value.trim();
    setErr('name', n.length < 2 ? 'Please enter your name.' : ''); if (n.length < 2) ok = false;
    var eok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    setErr('email', eok ? '' : 'Please enter a valid email.'); if (!eok) ok = false;
    setErr('message', m.length < 10 ? 'Message should be at least 10 characters.' : ''); if (m.length < 10) ok = false;
    return ok;
  }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    status.className = 'status'; status.textContent = '';
    if (!validate()) return;
    if (form.elements._honey.value) return; // bot
    btn.disabled = true; btn.textContent = 'Sending…';
    var f = form.elements;
    var data = { name: f.name.value.trim(), email: f.email.value.trim(), subject: f.subject.value, message: f.message.value.trim(), _subject: 'Portfolio: ' + f.subject.value + ' from ' + f.name.value.trim(), _replyto: f.email.value.trim(), _template: 'table', _captcha: 'false' };
    fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok || j.success === 'false' || j.success === false) throw new Error(j.message || 'failed'); }); })
      .then(function () { status.className = 'status ok'; status.textContent = 'Thanks! Your message was sent. I will reply soon.'; form.reset(); })
      .catch(function () {
        status.className = 'status fail';
        var body = encodeURIComponent('Name: ' + data.name + '\nEmail: ' + data.email + '\n\n' + data.message);
        status.innerHTML = 'Could not send automatically. ';
        var a = document.createElement('a'); a.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(data.subject) + '&body=' + body; a.textContent = 'Click here to send via your email app.';
        status.appendChild(a);
      })
      .finally(function () { btn.disabled = false; btn.textContent = 'Send message'; });
  });
  ['name', 'email', 'message'].forEach(function (n) { form.elements[n].addEventListener('input', function () { if (this.classList.contains('bad')) validate(); }); });
})();
