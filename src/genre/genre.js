// genre.js
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
  displayTableData();
  // Выполнение операций с базой данных, используя объект database
}).catch(function (error) {
  console.error('Error connecting to database:', error);
});

var dataTableView = $('#genreTable');

// Функция для отображения данных выбранной таблицы
function displayTableData() {
  // Получение данных из базы данных и отображение их в таблице
  var table = database.getSchema().table("genre");

  // Запрос для чтения данных из выбранной таблицы
  var select = database.select().from(table);

  // Выполнение запроса
  select.exec().then(function (rows) {
    // Получение ссылки на thead таблицы
    var tableHead = dataTableView.find('thead');

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
        var cellValue = row[column];
        // Проверка, является ли значение датой
        if (cellValue instanceof Date) {
          cell.text(formatDate(cellValue));
        } else {
          cell.text(cellValue);
        }
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

var genreForm = $('#genreForm');
genreForm.on('submit', function (event) {
  event.preventDefault();

  // Получение значения поля "name"
  var name = $('#genreNameInput').val();

  var genreTable = database.getSchema().table('genre');
  var select = database.select(lf.fn.max(genreTable['id'])).from(genreTable);
  select.exec().then(function (result) {
    var maxId = result[0]["MAX(id)"] + 1;

    // Создание объекта для вставки в таблицу "genre"
    var genre = {
      id: parseInt(maxId),
      name: name
    };
    const genreTable = database.getSchema().table("genre");
    const row = genreTable.createRow(genre);

    var tableBody = dataTableView.find('tbody');
    var dataRow = $('<tr></tr>');
    // Создание ячеек с данными
    for (var column in genre) {
      var cell = $('<td></td>');
      var cellValue = genre[column];
      // Проверка, является ли значение датой
      if (cellValue instanceof Date) {
        cell.text(formatDate(cellValue));
      } else {
        cell.text(cellValue);
      }
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
    return database.insertOrReplace().into(genreTable).values([row]).exec();
  });
});

// Добавляем обработчик события на кнопку "Удалить"
function deleteRow(event) {
  var confirmed = confirm("Действительно ли вы хотите удалить запись?");
  if (confirmed) {
    var row = $(event.target).closest('tr'); // Найти ближайшую строку (родительский элемент кнопки)
    var id = row.find('td:first-child').text(); // Получить значение id из первой ячейки

    // Удаление строки из базы данных
    var genreTable = database.getSchema().table('genre');
    database.delete().from(genreTable).where(genreTable['id'].eq(id)).exec().then(function () {
      // Удаление строки из HTML-таблицы
      row.remove();
    }).catch(function () {
      alert("Этот жанр нельзя удалить");
    });
  }
}

function updateRow(event) {
  selectedRow = $(event.target).closest('tr');
  var cells = selectedRow.find('td');

  $('#genreNameInput').val(cells.eq(1).text());

  $('#cancelGenreBtn').show();
  $('#updateGenreBtn').show();
  $('#submitGenre').hide();
}

function cancel() {
  $('#genreNameInput').val('');
  $('#cancelGenreBtn').hide();
  $('#updateGenreBtn').hide();
  $('#submitGenre').show();
}

function update() {
  var genreTable = database.getSchema().table('genre');
  var id = selectedRow.find('td').eq(0).text();
  var updatedName = $('#genreNameInput').val();

  database.update(genreTable)
    .set(genreTable['name'], updatedName)
    .where(genreTable['id'].eq(id))
    .exec()
    .then(function () {
      console.log('Строка в таблице "genre" успешно обновлена.');
    })
    .catch(function (error) {
      console.error('Ошибка при обновлении строки в таблице "genre":', error);
    });

  selectedRow.find('td').eq(1).text(updatedName);

  cancel();
}
