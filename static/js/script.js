const header = document.getElementById('subheader');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100)
    header.classList.add('fixed');
  else
    header.classList.remove('fixed');
});

// Бегущая строка

const defaultMoveTimeout = 25;
var moveOffset = 0, direction = 1, isMoving = false, moveTimeout = defaultMoveTimeout;

function setMargin(val) {
  Array.from(document.getElementsByClassName('movable')).forEach(elem => {
    elem.style.marginLeft = `${val}%`;
  });
}

function moveText() {
  if (!isMoving)
    return;

  if (!moveOffset)
    direction = 1;
  else if (moveOffset === 91)
    direction = -1;

  moveOffset += direction;

  setMargin(moveOffset);
  setTimeout(moveText, moveTimeout);
}

window.addEventListener('keydown', e => {
  switch (e.code) {
    case 'KeyM':
      isMoving = !isMoving;
      moveText();
      break;
    case 'KeyW':
      moveTimeout -= Math.min(5, moveTimeout);
      break;
    case 'KeyS':
      moveTimeout += 5;
      break;
    case 'KeyD':
      moveTimeout = defaultMoveTimeout;
      break;
    case 'KeyR':
      moveOffset = 0;
      setMargin(moveOffset);
      break;
  }
});

// ---

// Пустая строка в таблице

function getTableBody() {
  return document.getElementsByTagName(
    'table')[0].getElementsByTagName('tbody')[0];
}

function getTableRowCount(tbody) {
  return tbody.getElementsByTagName('tr').length;
}

var initialTableRowCount = getTableRowCount(getTableBody());

function updateTableFoot(n) {
  document.getElementsByTagName('tfoot')[0].getElementsByTagName(
    'tr')[0].getElementsByTagName('td')[0].textContent = n;
}

function appendTable() {
  let tbody = getTableBody();
  let form = document.getElementsByTagName('form')[0];
  let row = document.createElement('tr');
  Array.from(form.getElementsByTagName('input')).forEach(inp => {
    let td = document.createElement('td');
    td.textContent = inp.value;
    row.appendChild(td);
    // inp.value = '';
  });
  tbody.appendChild(row);
  updateTableFoot(getTableRowCount(tbody));
}

// Удаление добавленных строк
function clearNewTableRows() {
  let tbody = getTableBody();
  Array.from(tbody.getElementsByTagName('tr')).slice(
    initialTableRowCount).forEach(tr => { tr.remove() });
  updateTableFoot(initialTableRowCount);
}

// Изменение цвета

function randint(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

document.getElementById('first-sentence').onclick = event => {
  event.target.style.color = `rgb(${randint(0, 255)}, ${randint(0, 255)}, ${randint(0, 255)})`;
};

// ---

// Увеличение размера

const defaultQuoteSize = 5;

function increaseQuoteSize() {
  let qc = document.getElementsByClassName('quote-container')[0];
  qc.style.fontSize = parseInt(qc.style.fontSize ?
    qc.style.fontSize.split('mm')[0] : defaultQuoteSize) + 1 + 'mm';
}

// ---

function updateNestedNumbers(rootElement) {
  const counters = {};

  function traverse(element, depth = 1) {
    if (!counters[depth]) counters[depth] = 0;

    if (element.tagName === 'LI') {
      counters[depth]++;

      // Обнуляем вложенные счетчики
      for (let i = depth + 1; i in counters; i++) {
        counters[i] = 0;
      }

      // Формируем номер, пропуская нулевые уровни (убираем лидирующий 0)
      const numberParts = [];
      for (let i = 1; i <= depth; i++) {
        if (counters[i] > 0) { // Добавляем только если счетчик не нулевой
          numberParts.push(counters[i]);
        }
      }
      const number = numberParts.join('.'); // => "1.2" вместо "0.1.2"

      // Добавляем номер перед текстом пункта
      const textNode = element.firstChild;
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        element.insertBefore(document.createTextNode(number + '. '), textNode);
      } else {
        element.prepend(document.createTextNode(number + '. '));
      }
    }

    // Рекурсивно обрабатываем вложенные элементы
    Array.from(element.children).forEach(child => {
      traverse(child, depth + 1);
    });
  }

  traverse(rootElement);
}

function clearNestedNumbers(rootElement) {
  // Выбираем все элементы <li> внутри корневого элемента
  const listItems = rootElement.querySelectorAll('li');

  listItems.forEach(li => {
    // Находим первый текстовый узел (добавленный скриптом)
    const firstChild = li.firstChild;

    // Если это текстовый узел и содержит шаблон "X.Y.Z." (числа + точки)
    if (firstChild && firstChild.nodeType === Node.TEXT_NODE && /^\d+(\.\d+)*\.\s/.test(firstChild.textContent)) {
      // Удаляем этот узел
      li.removeChild(firstChild);
    }
  });
}

const list = document.getElementById('stages');
updateNestedNumbers(list);

function focusLiBtnBlock(btnBlock) {
  try {
    (btnBlock ? btnBlock : document.getElementById(
      'li-btn-block')).firstElementChild.focus();
  } catch (TypeError) {}
}

var prevEnterTarget;

function createLiInput() {
  let inp = document.createElement('input');
  inp.placeholder = 'Новый элемент';
  inp.addEventListener('keydown', event => {
    if (event.code == 'Enter') {
      prevEnterTarget = event.target;
      inp.parentNode.replaceChild(document.createTextNode(inp.value), inp);
      focusLiBtnBlock();
    }
  });
  return inp;
}

function refreshNestedNumbers() {
  clearNestedNumbers(list);
  updateNestedNumbers(list);
}

function createLi(parent, block, place = 'after') {
  let newLi = document.createElement('li');
  let inp = createLiInput(newLi);
  newLi.appendChild(inp);
  newLi.onclick = onLiClick;
  switch (place) {
    case 'after':
      parent.after(newLi);
      break;
    case 'before':
      if (parent.parentNode)
        parent.parentNode.insertBefore(newLi, parent);
      break;
    case 'child':
      parent.appendChild(newLi);
      break;
  }
  block.remove();
  refreshNestedNumbers();
  addBtnBlock(newLi, false);
  focusLiInput(newLi);
}

function traverseUpToLi(elem) {
  if (!elem)
    return;
  x = elem.parentNode;
  while (x && x.tagName !== 'LI')
    x = x.parentNode;
  return x;
}

function traverseDownToLi(elem) {
  if (!elem)
    return;
  x = elem.firstElementChild;
  while (x && x.tagName !== 'LI')
    x = x.firstElementChild;
  return x;
}

function addBtnBlock(li, focus = true) {
  let block = document.createElement('div');
  block.id = 'li-btn-block';

  let btnAppendNext = document.createElement('button');
  btnAppendNext.textContent = 'Добавить следующий';
  btnAppendNext.onclick = () => {
    if (prevEnterTarget === undefined || prevEnterTarget.tagName !== 'INPUT')
      createLi(li, block);
    prevEnterTarget = undefined;
  };

  let btnAppendChild = document.createElement('button');
  btnAppendChild.textContent = 'Добавить вложенный';
  btnAppendChild.style.marginLeft = '0.33em';
  btnAppendChild.onclick = () => {
    if (prevEnterTarget === undefined || prevEnterTarget.tagName !== 'INPUT') {
      let newOl = document.createElement('ol');
      li.appendChild(newOl);
      createLi(newOl, block, 'child');
    }
    prevEnterTarget = undefined;
  };

  let btnInsertBefore = document.createElement('button');
  btnInsertBefore.textContent = 'Добавить предыдущий';
  btnInsertBefore.style.marginLeft = '0.33em';
  btnInsertBefore.onclick = () => {
    if (prevEnterTarget === undefined || prevEnterTarget.tagName !== 'INPUT')
      createLi(li, block, 'before');
    prevEnterTarget = undefined;
  };

  let btnRemove = document.createElement('button');
  btnRemove.textContent = 'Удалить';
  btnRemove.style.marginLeft = '0.33em';
  btnRemove.onclick = () => {
    let nextFocus;
    if (li.previousSibling)
      nextFocus = li.previousSiblingElement;
    else if (li.nextSibling)
      nextFocus = li.nextSiblingElement;
    else {
      nextFocus = traverseUpToLi(li);
      if (!nextFocus) {
        nextFocus = traverseDownToLi(li);
        if (!nextFocus)
          return;
      }
    }
    li.remove();
    refreshNestedNumbers();
    addBtnBlock(nextFocus, true);
    // добавление блока с кнопками
    // сначала пред, если нет, то след, если нет, то родитель, если нет, то потомок
  };

  block.appendChild(btnAppendNext);
  block.appendChild(btnAppendChild);
  block.appendChild(btnInsertBefore);
  block.appendChild(btnRemove);

  li.appendChild(block);
  if (focus)
    focusLiBtnBlock(block);
}

function focusLiInput(li) {
  li.getElementsByTagName('input')[0].focus();
}

function onLiClick(event) {
  if (event.target.tagName !== 'LI')
    return;
  let li = event.target;
  if (prevBlock = document.getElementById('li-btn-block'))
    prevBlock.remove();
  addBtnBlock(li);
}

list.onclick = onLiClick;
list.addEventListener('keydown', event => {
  if (['F2', 'Escape'].indexOf(event.code) === -1)
    return;
  let li = event.target, found = false;
  for (let i = 0; i < 2; i++) {
    if (!(li = li.parentNode))
      return;
    if (li.tagName === 'LI') {
      found = true;
      break;
    }
  }
  if (!found)
    return;
  let inp = li.getElementsByTagName('input')[0];
  if (event.code == 'F2') {
    if (!inp) {
      let node = li.childNodes[1];
      let val = node.textContent;
      inp = createLiInput();
      inp.placeholder = inp.value = val;
      li.replaceChild(inp, node);
    }
    inp.focus();
  } else if (event.code == 'Escape' && inp) {
    li.replaceChild(document.createTextNode(inp.placeholder), inp);
    focusLiBtnBlock();
  }
});

// Array.from(list.getElementsByTagName('li')).forEach(li => {
//   li.addEventListener('click', onLiClick)});
