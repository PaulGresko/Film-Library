var schemaBuilder = lf.schema.create('library', 14);
var selectedRow;
schemaBuilder
    .createTable("genre")
    .addColumn("id", lf.Type.INTEGER)
    .addColumn("name", lf.Type.STRING)
    .addPrimaryKey(["id"]);

schemaBuilder
    .createTable("author")
    .addColumn("name", lf.Type.STRING)
    .addColumn("birthday", lf.Type.DATE_TIME)
    .addColumn("birthplace", lf.Type.STRING)
    .addPrimaryKey(["name"]);

schemaBuilder
    .createTable("film")
    .addColumn("id", lf.Type.INTEGER)
    .addColumn("genre_id", lf.Type.INTEGER)
    .addColumn("author", lf.Type.STRING)
    .addColumn("year", lf.Type.INTEGER)
    .addColumn("price", lf.Type.INTEGER)
    .addPrimaryKey(["id"])
    .addForeignKey("fk_genre", {
        local: "genre_id",
        ref: "genre.id",
        action: lf.ConstraintAction.RESTRICT
    })
    .addForeignKey("fk_author", {
        local: "author",
        ref: "author.name",
        action: lf.ConstraintAction.RESTRICT
    });




schemaBuilder.connect().then(function (db) {

    window.database = db;
    loadAuthorOptions();
    loadGenreOptions();
    displayTableData();
    // Выполнение операций с базой данных, используя объект database
}).catch(function (error) {
    console.error('Error connecting to database:', error);
});
var dataTableView = $('#filmTable');

// Функция для отображения данных выбранной таблицы
function displayTableData() {
  // Получение данных из базы данных и отображение их в таблице
  var table = database.getSchema().table("film");

  // Запрос для чтения данных из выбранной таблицы
  var select = database.select().from(table);

  // Выполнение запроса
  select.exec().then(function (rows) {
    // Получение ссылки на tbody таблицы
    var tableBody = dataTableView.find('tbody');

    // Очистка таблицы перед отображением новых данных
    tableBody.empty();

    // Обработка полученных данных
    rows.forEach(function (row) {
      // Создание строки таблицы
      var dataRow = $('<tr></tr>');

      // Создание ячеек с данными
      for (var column in row) {
        var cell = $('<td></td>');
        cell.text(row[column]);
        dataRow.append(cell);
      }

      // Добавление столбца с кнопками "Удалить" и "Изменить"
      var actionColumn = $('<td></td>');
      var deleteButton = $('<button>Удалить</button>');
      deleteButton.attr('id', 'btn-delete');
      deleteButton.on('click', deleteRow);
      actionColumn.append(deleteButton);

      var editButton = $('<button>Изменить</button>');
      editButton.attr('id', 'btn-edit');
      editButton.on('click', updateRow);
      actionColumn.append(editButton);

      dataRow.append(actionColumn);

      // Добавление строки в таблицу
      tableBody.append(dataRow);
    });
  });
}

// Загрузка опций выбора для поля "genre_id" из столбца "id" таблицы "genre"
function loadGenreOptions() {
  var genreTable = database.getSchema().table('genre');
  var select = database.select(genreTable['id']).from(genreTable);
  select.exec().then(function (rows) {
    var genreIdSelect = $('#genreIdInput');
    genreIdSelect.empty();

    rows.forEach(function (row) {
      var option = $('<option></option>');
      option.val(row['id']);
      option.text(row['id']);
      genreIdSelect.append(option);
    });
  });
}

// Загрузка опций выбора для поля "author" из столбца "name" таблицы "author"
function loadAuthorOptions() {
  var authorTable = database.getSchema().table('author');
  var select = database.select(authorTable['name']).from(authorTable);
  select.exec().then(function (rows) {
    var authorSelect = $('#authorInput');
    authorSelect.empty();

    rows.forEach(function (row) {
      var option = $('<option></option>');
      option.val(row['name']);
      option.text(row['name']);
      authorSelect.append(option);
    });
  });
}


var filmForm = $('#filmForm');
filmForm.on('submit', function (event) {
  event.preventDefault();

  // Получение значений полей формы
  var genreId = $('#genreIdInput').val();
  var author = $('#authorInput').val();
  var year = $('#yearInput').val();
  var price = $('#priceInput').val();

  //Получения наибольшего ID
  var filmTable = database.getSchema().table('film');
  var select = database.select(lf.fn.max(filmTable['id'])).from(filmTable);

  select.exec().then(function (result) {
    var maxId = result[0]["MAX(id)"] + 1;

    // Создание объекта для вставки в таблицу "film"
    var film = {
      id: parseInt(maxId),
      genre_id: parseInt(genreId),
      author: author,
      year: year,
      price: parseInt(price)
    };

    // Вставка объекта в таблицу "film"
    const filmTable = database.getSchema().table("film");
    const row = filmTable.createRow(film);

    var tableBody = dataTableView.find('tbody');
    var dataRow = $('<tr></tr>');

    // Создание ячеек с данными
    for (var column in film) {
      var cell = $('<td></td>');
      cell.text(film[column]);
      dataRow.append(cell);
    }

    // Добавление столбца с кнопками "Удалить" и "Изменить"
    var actionColumn = $('<td></td>');
    var deleteButton = $('<button>Удалить</button>');
    deleteButton.attr('id', 'btn-delete');
    deleteButton.on('click', deleteRow);
    actionColumn.append(deleteButton);

    var editButton = $('<button>Изменить</button>');
    editButton.attr('id', 'btn-edit');
    editButton.on('click', updateRow);
    actionColumn.append(editButton);

    dataRow.append(actionColumn);

    // Добавление строки в таблицу
    tableBody.append(dataRow);
    cancel();
    return database.insertOrReplace().into(filmTable).values([row]).exec();
  });
});

// Добавляем обработчик события на кнопку "Удалить"
function deleteRow(event) {
  var confirmed = confirm("Действительно ли вы хотите удалить запись?");
  if (confirmed) {
    var row = $(event.target).closest('tr'); // Найти ближайшую строку (родительский элемент кнопки)
    var id = row.find('td:first-child').text(); // Получить значение id из первой ячейки

    // Удаление строки из базы данных
    var filmTable = database.getSchema().table('film');
    database.delete().from(filmTable).where(filmTable['id'].eq(id)).exec().then(function () {
      // Удаление строки из HTML-таблицы
      row.remove();
    });
  }
}

function updateRow(event) {
  selectedRow = $(event.target).closest('tr');
  var cells = selectedRow.find('td');

  $('#genreIdInput').val(cells.eq(1).text());
  $('#authorInput').val(cells.eq(2).text());
  $('#yearInput').val(cells.eq(3).text());
  $('#priceInput').val(cells.eq(4).text());

  $('#cancelFilmBtn').show();
  $('#updateFilmBtn').show();
  $('#submitFilm').hide();
}

function cancel() {
  $('#genreIdInput').val('');
  $('#authorInput').val('');
  $('#yearInput').val('');
  $('#priceInput').val('');
  $('#cancelFilmBtn').hide();
  $('#updateFilmBtn').hide();
  $('#submitFilm').show();
}

function update() {
  var filmTable = database.getSchema().table('film');
  var id = selectedRow.find('td').eq(0).text();
  var genreId = $('#genreIdInput').val();
  var author = $('#authorInput').val();
  var year = $('#yearInput').val();
  var price = $('#priceInput').val();

  database.update(filmTable)
    .set(filmTable['genre_id'], genreId)
    .set(filmTable['author'], author)
    .set(filmTable['year'], year)
    .set(filmTable['price'], price)
    .where(filmTable['id'].eq(id))
    .exec();

  selectedRow.find('td').eq(1).text(genreId);
  selectedRow.find('td').eq(2).text(author);
  selectedRow.find('td').eq(3).text(year);
  selectedRow.find('td').eq(4).text(price);

  cancel();
}
