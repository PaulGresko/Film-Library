// const database = await buildShema();

// fillData();

// await printAllGenre();
// await printAllFilm();
// await printAllAuthor();


// function buildShema() {
//   const schemaBuilder = lf.schema.create("library", 14);
//   schemaBuilder
//     .createTable("genre")
//     .addColumn("id", lf.Type.INTEGER)
//     .addColumn("name", lf.Type.STRING)
//     .addPrimaryKey(["id"]);

//   schemaBuilder
//     .createTable("author")
//     .addColumn("name", lf.Type.STRING)
//     .addColumn("birthday", lf.Type.DATE_TIME)
//     .addColumn("birthplace", lf.Type.STRING)
//     .addPrimaryKey(["name"]);

//   schemaBuilder
//     .createTable("film")
//     .addColumn("id", lf.Type.INTEGER)
//     .addColumn("genre_id", lf.Type.INTEGER)
//     .addColumn("author", lf.Type.STRING)
//     .addColumn("year", lf.Type.INTEGER)
//     .addColumn("price", lf.Type.INTEGER)

//     .addPrimaryKey(["id"])
//     .addForeignKey("fk_genre", {
//       local: "genre_id",
//       ref: "genre.id",
//       action: lf.ConstraintAction.RESTRICT
//     })
//     .addForeignKey("fk_author", {
//       local: "author",
//       ref: "author.name",
//       action: lf.ConstraintAction.RESTRICT
//     });

//   return schemaBuilder.connect();
// }


// async function fillData() {
//   await saveGenre({ id: 1, name: 'Comedy' });
//   await saveGenre({ id: 2, name: 'Horror' });
//   await saveGenre({ id: 3, name: 'Action' });

//   await saveAuthor({ name: "Name1", birthday: new Date("1900-05-06"), birthplace: "Samara" })

//   await saveFilm({ id: 1, genre_id: 1, author: "Name1", year: 2010, price: 1000 });
//   await saveFilm({ id: 2, genre_id: 1, author: "Name1", year: 1990, price: 1000 });
//   await saveFilm({ id: 3, genre_id: 2, author: "Name1", year: 2000, price: 1000 });
//   await saveFilm({ id: 4, genre_id: 3, author: "Name1", year: 2005, price: 1000 });
//   await saveFilm({ id: 5, genre_id: 3, author: "Name1", year: 2000, price: 1000 });


// }


// function saveGenre(genre) {
//   const genreTable = database.getSchema().table("genre");
//   const row = genreTable.createRow(genre)
//   return database.insertOrReplace().into(genreTable).values([row]).exec();
// }


// function saveFilm(film) {
//   const filmTable = database.getSchema().table("film");
//   const row = filmTable.createRow(film);
//   return database.insertOrReplace().into(filmTable).values([row]).exec();
// }


// function saveAuthor(author) {
//   const authorTable = database.getSchema().table("author");
//   const row = authorTable.createRow(author);
//   return database.insertOrReplace().into(authorTable).values([row]).exec();
// }

// async function printAllGenre() {
//   const genreTable = database.getSchema().table("genre");
//   const tabularData = await database.select().from(genreTable).exec();
//   return console.table(tabularData);
// }

// async function printAllFilm() {
//   const filmTable = database.getSchema().table("film");
//   const tabularData = await database.select().from(filmTable).exec();
//   return console.table(tabularData);
// }
// async function printAllAuthor() {
//   const authorTable = database.getSchema().table("author");
//   const tabularData = await database.select().from(authorTable).exec();
//   return console.table(tabularData);
// }




// var genreBtn = document.getElementById('genreBtn');
// var filmBtn = document.getElementById('filmBtn');
// var authorBtn = document.getElementById('authorBtn');
// var genreForm = document.getElementById('genreForm');
// var filmForm = document.getElementById('filmForm');
// var authorForm = document.getElementById('authorForm');
// // Получение ссылки на элемент таблицы данных
// var dataTableView = document.getElementById('dataTableView');

// // Обработчики событий клика на кнопки навигационной панели
// genreBtn.addEventListener('click', function () {
//   genreForm.style.display = 'block';
//   filmForm.style.display = 'none';
//   authorForm.style.display = 'none';
//   // Очистка содержимого таблицы
//   clearTable();
//   // Отображение данных таблицы "genre"
//   displayTableData('genre');
// });

// filmBtn.addEventListener('click', function () {
//   genreForm.style.display = 'none';
//   filmForm.style.display = 'block';
//   authorForm.style.display = 'none';
//   // Очистка содержимого таблицы
//   clearTable();
//   // Отображение данных таблицы "film"
//   displayTableData('film');
// });

// authorBtn.addEventListener('click', function () {
//   genreForm.style.display = 'none';
//   filmForm.style.display = 'none';
//   authorForm.style.display = 'block';
//   // Очистка содержимого таблицы
//   clearTable();
//   // Отображение данных таблицы "author"
//   displayTableData('author');
// });




// // Функция для очистки содержимого таблицы
// function clearTable() {
//   var tableBody = dataTableView.querySelector('tbody');
//   tableBody.innerHTML = '';
// }



// // Функция для отображения данных выбранной таблицы
// function displayTableData(tableName) {
//   // Получение данных из базы данных и отображение их в таблице
//   var table = database.getSchema().table(tableName);

//   // Запрос для чтения данных из выбранной таблицы
//   var select = database.select().from(table);

//   // Выполнение запроса
//   select.exec().then(function (rows) {
//     // Получение ссылки на thead таблицы
//     var tableHeader = dataTableView.querySelector('thead');

//     // Очистка заголовков столбцов
//     tableHeader.querySelectorAll('tr').forEach(function (headerRow) {
//       headerRow.style.display = 'none';
//     });

//     // Показ заголовков столбцов для выбранной таблицы
//     var selectedHeader = tableHeader.querySelector('#' + tableName + 'Header');
//     selectedHeader.style.display = '';

//     // Получение ссылки на tbody таблицы
//     var tableBody = dataTableView.querySelector('tbody');

//     // Обработка полученных данных
//     rows.forEach(function (row) {
//       // Создание строки таблицы
//       var dataRow = document.createElement('tr');

//       // Создание ячеек с данными
//       for (var column in row) {
//         var cell = document.createElement('td');
//         var cellValue = row[column];
//         // Проверка, является ли значение датой
//         if (cellValue instanceof Date) {
//           cell.textContent = formatDate(cellValue);
//         } else {
//           cell.textContent = cellValue;
//         }
//         dataRow.appendChild(cell);
//       }


//       // Добавление столбца с кнопками "Удалить" и "Изменить"
//       var actionColumn = document.createElement('td');
//       var deleteButton = document.createElement('button');
//       deleteButton.textContent = 'Удалить';
//       actionColumn.appendChild(deleteButton);
//       deleteButton.addEventListener('click', function () {
//         // Обработчик события для кнопки "Удалить"
//         // Получаем идентификатор строки
//         var rowId = row.id;

//         // Удаляем запись из базы данных по идентификатору
//         var genreTable = database.getSchema().table('genre');
//         database.delete().from(genreTable).where(genreTable.id.eq(rowId)).exec()
//           .then(function () {
//             // Успешное удаление записи из базы данных
//             // Удаляем строку из таблицы в DOM
//             dataRow.remove();
//           })
//           .catch(function (error) {
//             // Обработка ошибок при удалении записи
//             console.error('Ошибка при удалении записи:', error);
//           });
//       });

//       var editButton = document.createElement('button');
//       editButton.textContent = 'Изменить';
//       actionColumn.appendChild(editButton);

//       dataRow.appendChild(actionColumn);

//       // Добавление строки в таблицу
//       tableBody.appendChild(dataRow);

//       if (tableName === 'film') {
//         // Вызов функций для загрузки опций выбора при загрузке страницы
//         loadGenreOptions();
//         loadAuthorOptions();
//       }
//     });
//   });
// }


// //Функция для форматирования даты
// function formatDate(date) {
//   var year = date.getFullYear();
//   var month = ('0' + (date.getMonth() + 1)).slice(-2);
//   var day = ('0' + date.getDate()).slice(-2);

//   return year + '-' + month + '-' + day;
// }






// var genreForm = document.getElementById('genreForm');
// genreForm.addEventListener('submit', function (event) {
//   event.preventDefault();

//   // Получение значения поля "name"
//   var name = document.getElementById('nameInput').value;


//   var genreTable = database.getSchema().table('genre');
//   var select = database.select(lf.fn.max(genreTable['id'])).from(genreTable);
//   select.exec().then(function (result) {
//     var maxId = result[0]["MAX(id)"] + 1;


//     // Создание объекта для вставки в таблицу "genre"
//     var genre = {
//       id: parseInt(maxId),
//       name: name
//     };
//     saveGenre(genre);
//   });
// });
// // Обработчик события отправки формы
// var authorForm = document.getElementById('authorForm');
// authorForm.addEventListener('submit', function (event) {
//   event.preventDefault();

//   // Получение значений полей формы
//   var name = document.getElementById('nameInput').value;
//   var birthday = document.getElementById('birthdayInput').value;
//   var birthplace = document.getElementById('birthplaceInput').value;

//   // Создание объекта для вставки в таблицу "author"
//   var author = {
//     name: name,
//     birthday: new Date(birthday),
//     birthplace: birthplace
//   };

//   // Вставка объекта в таблицу "author"

//   saveAuthor(author);
// });



// // Загрузка опций выбора для поля "genre_id" из столбца "id" таблицы "genre"
// function loadGenreOptions() {

//   var genreTable = database.getSchema().table('genre');
//   var select = database.select(genreTable['id']).from(genreTable);
//   select.exec().then(function (rows) {
//     var genreIdSelect = document.getElementById('genreIdInput');
//     genreIdSelect.innerHTML = '';

//     rows.forEach(function (row) {
//       var option = document.createElement('option');
//       option.value = row['id'];
//       option.textContent = row['id'];
//       genreIdSelect.appendChild(option);
//     });
//   });
// }

// // Загрузка опций выбора для поля "author" из столбца "name" таблицы "author"
// function loadAuthorOptions() {

//   var authorTable = database.getSchema().table('author');
//   var select = database.select(authorTable['name']).from(authorTable);
//   select.exec().then(function (rows) {
//     var authorSelect = document.getElementById('authorInput');
//     authorSelect.innerHTML = '';

//     rows.forEach(function (row) {
//       var option = document.createElement('option');
//       option.value = row['name'];
//       option.textContent = row['name'];
//       authorSelect.appendChild(option);
//     });
//   });
// }

// // Вызов функций для загрузки опций выбора при загрузке страницы
// // loadGenreOptions();
// // loadAuthorOptions();

// // Обработчик события отправки формы
// var filmForm = document.getElementById('filmForm');
// filmForm.addEventListener('submit', function (event) {
//   event.preventDefault();

//   // Получение значений полей формы
//   var genreId = document.getElementById('genreIdInput').value;
//   var author = document.getElementById('authorInput').value;
//   var year = document.getElementById('yearInput').value;
//   var price = document.getElementById('priceInput').value;

//   //Получения наибольшего ID
//   var filmTable = database.getSchema().table('film');
//   var select = database.select(lf.fn.max(filmTable['id'])).from(filmTable);

//   select.exec().then(function (result) {
//     var maxId = result[0]["MAX(id)"] + 1;

//     // Создание объекта для вставки в таблицу "film"
//     var film = {
//       id: parseInt(maxId),
//       genre_id: parseInt(genreId),
//       author: author,
//       year: new Date(year),
//       price: parseInt(price)
//     };

//     // Вставка объекта в таблицу "film"
//     saveFilm(film);
//   });
// });

