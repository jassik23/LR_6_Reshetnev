// Эта функция сортирует входной массив, по полученнным параметрам
function sortDataByName(data, headers, opt_mass, opt_bool_mass) {
  data.sort((a, b) => {
    for(let i = 0; i < opt_mass.length; i++) {

      let outpInd = opt_mass[i] - 1;
      outpInd = parseInt(outpInd);

      if((outpInd >= 0) && (outpInd < 5)) {
        let navOpt = headers[outpInd];
        //console.log('navOpt = ' + navOpt);

        let nameA = a[navOpt].toLowerCase();
        let nameB = b[navOpt].toLowerCase();

        if((!(isNaN(parseInt(nameA)) || !isFinite(nameA))) &&
           (!(isNaN(parseInt(nameB)) || !isFinite(nameB))) ) {

          nameA = parseFloat(nameA);
          nameB = parseFloat(nameB);
        }

        let bool = opt_bool_mass[i];
  
        if (nameA < nameB) {
          if (bool == true) { return 1 } else { return -1 }
        }
        else if (nameA > nameB) {
          if (bool == true) { return -1 } else { return 1 }
        }
      }      
    }
    return 0;
  });
}

function createTable(data) {
  // Создаем элемент таблицы
  var table = document.createElement("table");
  table.id = 'my-table';

  // Создаем заголовок таблицы
  var headerRow = document.createElement("tr");
  var headerNames = ["Название", "Год выхода", "Жанр", "Рейтинг", "Разработчик"];
  for (var i = 0; i < headerNames.length; i++) {
    var headerCell = document.createElement("th");
    headerCell.textContent = headerNames[i];
    //headerCell.className = 'title';
    headerRow.appendChild(headerCell);    
    headerRow.className = 'title';
  }
  table.appendChild(headerRow);

  // Создаем строки таблицы
  for (var j = 0; j < data.length; j++) {
    var row = document.createElement("tr");
    var item = data[j];
    var keys = Object.keys(item);
    for (var k = 0; k < keys.length; k++) {
      var cell = document.createElement("td");
      cell.textContent = item[keys[k]];
      row.appendChild(cell);
    }
    table.appendChild(row);
  }

  // Возвращаем таблицу
  return table;
}

// --------------------
// Вот тут начало программы

// Получаем ссылку на таблицу
let table = document.getElementById("my-table");

// И на кнопочки, по нажатиям которых мы будем обновлять таблицу
let butt_sort = document.getElementById("butt-sort");
let butt_filter = document.getElementById("butt-filter");

if(table == undefined) { 
  alert('Ошибка! На странице не обнаружена требуемая таблица!');
}

// Получаем список заголовков столбцов
const headers = [];
for (let i = 0; i < table.rows[0].cells.length; i++) {
  headers[i] = table.rows[0].cells[i].textContent;
}

console.log(headers);

// Проходим по каждой строке таблицы и сохраняем ее содержимое в массив словарей
let data = [];

for (let i = 1; i < table.rows.length; i++) {
  const tableRow = table.rows[i];
  const rowData = {};

  // Проходим по каждой ячейке в строке и сохраняем ее содержимое в соответствующий заголовок столбца
  for (let j = 0; j < tableRow.cells.length; j++) {
    rowData[headers[j]] = tableRow.cells[j].textContent;
  }

  data.push(rowData);
}

console.log(data);
let data_1 = data;

// Массив того, какие опции выбраны в каждом из 3х уровней сортировки 
// (значения от 0 до 5)
let opt_mass = [];

opt_mass[0] = 0;
opt_mass[1] = 0;
opt_mass[2] = 0;

// Массив галочек, которые называются "по убыванию?"
let opt_bool_mass = [];

opt_bool_mass[0] = false;
opt_bool_mass[1] = false;
opt_bool_mass[2] = false;

// Пересобираем таблицу (сортировка)
function ReqSort() {
  sortDataByName(data, headers, opt_mass, opt_bool_mass);
  data_1 = data;

  //console.log(data);
  
  table.remove(); // Дропаю таблицу со страницы
  
  var newTable = createTable(data); // И собираю новую, с нужными данными
  
  var container = document.getElementById("table-container"); // Нахожу контейнер для таблицы
  container.insertBefore(newTable, container.firstChild); // И вставляю новую таблицу в этот контейнер

  table = document.getElementById("my-table"); // Это также нужно
}

butt_sort.addEventListener('click', () => {
  //console.log('Кнопка сортировки нажата!');
  check_checkboxes_1();

  // Тут мы одновременно сортируем и фильтруем данные таблицы
  ReqSort();
  ReqFilter();
});

// Это массив значений всех 6 полей фильтра
let strMass = ["", "", "", 0, 0, 0];

function setSortTable(date, strMass) {
  //console.log('date = ' + date);

  let outDate = [];

  for(let j = 3; j < strMass.length; j++) {
    if(strMass[j] == "") strMass[j] = 0;
    else strMass[j] = parseFloat(strMass[j]);
  }

  //console.log('strMass = ' + strMass);

  // Прохожу по всем записям в массиве date
  // Если запись соответствует всем условиям, то я добавляю её в выходной массив
  for(let i = 0; i < date.length; i++) {
    let bool = true;

    if(strMass[0] != "") {
      //console.log('strMass[0] = ' + strMass[0] );
      if (date[i].Название.indexOf(strMass[0]) === -1) {
        bool = false;
      }
    }
    if(strMass[1] != "") {
      //console.log('strMass[1] = ' + strMass[1] );
      if (date[i].Жанр.indexOf(strMass[1]) === -1) {
        bool = false;
      }
    }
    if(strMass[2] != "") {
      //console.log('strMass[1] = ' + strMass[1] );
      if (date[i].Разработчик.indexOf(strMass[2]) === -1) {
        bool = false;
      }
    }
    if(strMass[3] != 0) {
      if(date[i]['Год выхода'] < strMass[3]) {
        bool = false;
      }
    }
    if(strMass[4] != 0) {
      if(date[i]['Год выхода'] > strMass[4]) {
        bool = false;
      }
    }
    if(strMass[5] != 0) {
      if(date[i]['Рейтинг'] < strMass[5]) {
        bool = false;
      }
    }
    if(strMass[6] != 0) {
      if(date[i]['Рейтинг'] > strMass[6]) {
        bool = false;
      }
    }

    if(bool == true) {
      outDate.push(date[i]);
    }
  }

  return outDate;
}

// Это надпись "Записей по данному запросу не найдено"
bad_news = document.getElementById('bad-news'); 
bad_news.style.display = "none"; // Сначала скрываю её

// Пересобираем таблицу (фильтрация)
function ReqFilter() {

  // Получаю значения всех 6 полей со страницы, и записываю их в массив strMass
  const inputs = document.querySelectorAll('.block-02 .right-edge-1 input[type="text"]');
  strMass = [];
  for (let i = 0; i < inputs.length; i++) {
    strMass.push(inputs[i].value);
  }

  console.log('strMass = ' + strMass);

  let inDate = setSortTable(data_1, strMass); // Фильтрую

  //console.log(data);
  
  table.remove(); // Тем-же методом пересобираю таблицу
  
  var newTable;

  if(inDate.length > 0) { 
    bad_news.style.display = "none"; // Скрываем элемент bad_news

    newTable = createTable(inDate);
    var container = document.getElementById("table-container");
    container.insertBefore(newTable, container.firstChild);
  
    table = document.getElementById("my-table");
  }
  else { 
    // Если после фильтрации записей нет - показываю грустное сообщение
    bad_news.style.display = "block"; 
  }
}

butt_filter.addEventListener('click', () => {
  console.log('Кнопка фильтра нажата!');
  check_checkboxes_1();
  ReqSort();
  ReqFilter();
});

// Массив, в котором хранятся все строки значений списка
let allElemMass = [];

allElemMass[0] = 'Нет';
allElemMass[1] = 'Название';
allElemMass[2] = 'Год выхода';
allElemMass[3] = 'Жанр';
allElemMass[4] = 'Рейтинг';
allElemMass[5] = 'Разработчик';

// Возвращает нужный элемент option
function getNumElem(name) {
  // Получаем элемент с id = "sort-opt"
  let sortOpt = document.getElementById("sort-opt");
  // Получаем элемент с классом l1 внутри sortOpt
  let l1 = sortOpt.getElementsByClassName(name)[0];
  // Получаем элемент select внутри l1
  let select = l1.getElementsByTagName("select")[0];
  return select;
}

// Перелопачивает 3 input-элемента выбора сортировки
// Так, что бы если в первом опуия выбрана, то
// В других - её уже не было
function reqInputElements(indDesel) {
  // Жесть конечно. Её было сложно написать

  console.log('itsElementFree = ' + itsElementFree);

  if(opt_mass[0] == 0 && opt_mass[1] == 0 && opt_mass[2] == 0) {
    itsElementFree = [0, 0, 0, 0, 0];
    // Иногда всё ломается, но эта строчка обратно всё чинит

    // P.S.: [Скорее всего] Всё ломается из-за того, что пользователь слишком быстро
    // переключает элементы в выпадающих списках, и программа не успевает
    // отлавливать и обрабатывать изменения
  }

  // Получаю элементы
  let a = getNumElem('l1');
  let b = getNumElem('l2');
  let c = getNumElem('l3');

  // Прохожу по каждому из 3х
  for(let j = 0; j < 3; j++) {
    // Удаляю их содержимое
    if(j == 0) a.innerHTML = '';
    if(j == 1) b.innerHTML = '';
    if(j == 2) c.innerHTML = '';

    for(let i = 0; i < 6; i++) {
      if ((itsElementFree[i] != 1) || (opt_mass[j] == i)) {
        // Если i-я опция ни в одном не выбрана
        // Или, если эта опция выбрана конкретно в этом элементе,
        // я добавляю эту опцию в этот элемент

        let option = document.createElement("option");
        option.value = i;
        option.text = allElemMass[i];

        if(opt_mass[j] == i) {
          // Если эта опция выбрана конкретно в этом элементе,
          // то ставлю её selected.
          option.selected = true;
          console.log('opt_mass[' + j + '] = ' + i);
        }
  
        if(j == 0) a.appendChild(option);
        if(j == 1) b.appendChild(option);
        if(j == 2) c.appendChild(option);
      }
    }   
  }
}

// Для получения значения выбранного переключателя:

/*
const radioButtons = document.querySelector('.block-03 .center-edge-2 select');
console.log(radioButtons[0].value);
*/

let itsElementFree = [0, 0, 0, 0, 0];
// Это массив, который говорит нам, выбрана ли где-то i-я опция
// Например, если только в 1м уровне сортировки выбрать "Название",
// то данный массив будет выглядеть так: itsElementFree = [0, 1, 0, 0, 0]

let bufMass = [0, 0, 0];
// Массив буферных значений
// Он нам понадобится, когда пользователь удалит свой выбор из какого-то уровня сортировки,
// и нам нужно будет поставить нужный элемент массива itsElementFree в значение 0

// Дальше, я для каждого списка уровня сортировки добавляю функцию, 
// вызывающуюся при изменении его значения

const selectElement1 = document.querySelector('.block-03 .l1 select');

selectElement1.addEventListener('change', function() {
  let selectedValue = selectElement1.value;  
  //console.log('selectElement1.value = ' + selectElement1.value);
  opt_mass[0] = selectedValue;

  if(selectedValue != 0) {
    itsElementFree[selectedValue] = 1;
  } else {
    itsElementFree[bufMass[0]] = 0;
  }

  bufMass[0] = selectedValue;
  reqInputElements(1); // Пересобираю все 3 элемента, в зависимости от выбора пользователя
});

const selectElement2 = document.querySelector('.block-03 .l2 select');

selectElement2.addEventListener('change', function() {
  let selectedValue = selectElement2.value;  
  console.log('opt_mass[1] = ' + selectedValue);
  opt_mass[1] = selectedValue;

  if(selectedValue != 0) {
    itsElementFree[selectedValue] = 1;
  } else {
    itsElementFree[bufMass[1]] = 0;
  }

  bufMass[1] = selectedValue;
  reqInputElements(2);
});

const selectElement3 = document.querySelector('.block-03 .l3 select');

selectElement3.addEventListener('change', function() {
  let selectedValue = selectElement3.value;  
  console.log('opt_mass[2] = ' + selectedValue);
  opt_mass[2] = selectedValue;

  if(selectedValue != 0) {
    itsElementFree[selectedValue] = 1;
  } else {
    itsElementFree[bufMass[2]] = 0;
  }

  bufMass[2] = selectedValue;
  reqInputElements(3);
});

//Для получения значений выбранных флажков:

const checkboxes = document.querySelectorAll('.block-03 input[type="checkbox"]');
let checkedValues = [];

check_checkboxes_1();

function check_checkboxes_1() {
  checkedValues = [];
  checkboxes.forEach(checkbox => {
    checkedValues.push(checkbox.checked);
  });
  
  //console.log(checkedValues);
  opt_bool_mass = checkedValues;
}