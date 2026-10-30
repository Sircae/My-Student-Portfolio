// Mobile menu
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
menuBtn.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});

// Academic planner
if (document.body.dataset.page === 'planner') {
  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const error = document.getElementById('task-error');
  const stats = document.getElementById('stats');
  let tasks = [];
  try { tasks = JSON.parse(localStorage.getItem('tasks')) || []; } catch (e) { tasks = []; }

  function save() { try { localStorage.setItem('tasks', JSON.stringify(tasks)); } catch (e) {} }

  function render() {
    list.innerHTML = '';
    if (tasks.length === 0) {
      list.innerHTML = '<li class="empty">No tasks yet. Add your first assignment above.</li>';
    }
    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      if (task.done) li.classList.add('done');
      const box = document.createElement('input');
      box.type = 'checkbox'; box.checked = task.done; box.style.width = 'auto';
      box.setAttribute('aria-label', 'Mark "' + task.text + '" as completed');
      box.addEventListener('change', () => toggleTask(index));
      const span = document.createElement('span');
      span.textContent = task.text;
      const del = document.createElement('button');
      del.className = 'del'; del.textContent = 'Delete';
      del.addEventListener('click', () => deleteTask(index));
      li.append(box, span, del);
      list.appendChild(li);
    });
    const doneCount = tasks.filter(t => t.done).length;
    stats.textContent = tasks.length + ' task(s), ' + doneCount + ' completed';
  }

  function addTask(text) { tasks.push({ text: text, done: false }); save(); render(); }
  function toggleTask(i) { tasks[i].done = !tasks[i].done; save(); render(); }
  function deleteTask(i) { tasks.splice(i, 1); save(); render(); }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) { error.textContent = 'Type a task before adding it.'; input.classList.add('invalid'); return; }
    error.textContent = ''; input.classList.remove('invalid');
    addTask(text); input.value = ''; input.focus();
  });
  render();
}

// Contact form validation
if (document.body.dataset.page === 'contact') {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('success');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const digitsOnly = /^[0-9]+$/;

  function setError(id, msg) {
    document.getElementById(id + '-error').textContent = msg;
    document.getElementById(id).classList.toggle('invalid', msg !== '');
    return msg === '';
  }

  function validate() {
    const v = id => document.getElementById(id).value.trim();
    let ok = true;
    ok = setError('name', v('name') ? '' : 'Enter your name.') && ok;
    let emailMsg = '';
    if (!v('email')) emailMsg = 'Enter your email address.';
    else if (!emailPattern.test(v('email'))) emailMsg = 'Enter a valid email, like name@example.com.';
    ok = setError('email', emailMsg) && ok;
    let phoneMsg = '';
    if (!v('phone')) phoneMsg = 'Enter your phone number.';
    else if (!digitsOnly.test(v('phone'))) phoneMsg = 'Use digits only, with no spaces, + or dashes.';
    ok = setError('phone', phoneMsg) && ok;
    ok = setError('message', v('message') ? '' : 'Write a message.') && ok;
    return ok;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (validate()) { success.style.display = 'block'; form.reset(); }
    else { success.style.display = 'none'; }
  });
}
