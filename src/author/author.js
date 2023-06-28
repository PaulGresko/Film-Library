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

schemaBuilder.connect().then(function(db) {
  window.database = db;
  displayTableData();
  // Выполнение операций с базой данных, используя объект database
}).catch(function(error) {
  console.error('Error connecting to database:', error);
});

var dataTableView = $('#authorTable');

// Функция для отображения данных выбранной таблицы
function displayTableData() {
  // Получение данных из базы данных и отображение их в таблице
  var table = database.getSchema().table("author");

  // Запрос для чтения данных из выбранной таблицы
  var select = database.select().from(table);

  // Выполнение запроса
  select.exec().then(function (rows) {
    // Получение ссылки на tbody таблицы
    var tableBody = dataTableView.find('tbody');

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
      deleteButton.click(deleteRow);
      actionColumn.append(deleteButton);

      var editButton = $('<button>Изменить</button>');
      editButton.attr('id', 'btn-edit');
      editButton.click(updateRow);
      actionColumn.append(editButton);

      dataRow.append(actionColumn);

      // Добавление строки в таблицу
      tableBody.append(dataRow);
    });
  });
}

var authorForm = $('#authorForm');
authorForm.on('submit', function (event) {
  event.preventDefault();

  // Получение значений полей формы
  var name = $('#nameInput').val();
  var birthday = $('#birthdayInput').val();
  var birthplace = $('#birthplaceInput').val();

  // Создание объекта для вставки в таблицу "author"
  var author = {
    name: name,
    birthday: new Date(birthday),
    birthplace: birthplace
  };

  // Вставка объекта в таблицу "author"
  const authorTable = database.getSchema().table("author");
  const row = authorTable.createRow(author);

  var tableBody = $('#authorTable tbody');
  var dataRow = $('<tr></tr>');
  // Создание ячеек с данными
  for (var column in author) {
    var cell = $('<td></td>');
    var cellValue = author[column];
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
  return database.insertOrReplace().into(authorTable).values([row]).exec().catch(function (error) {
    $('#authorError').text('Ошибка добавления!');
  });
});

function formatDate(date) {
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);

  return year + '-' + month + '-' + day;
}

// Добавляем обработчик события на кнопку "Удалить"
function deleteRow(event) {
  var confirmed = confirm("Действительно ли вы хотите удалить запись");
  if (confirmed) {
    var row = $(event.target).closest('tr'); // Найти ближайшую строку (родительский элемент кнопки)
    var id = row.find('td:first-child').text(); // Получить значение id из первой ячейки

    // Удаление строки из базы данных
    var authorTable = database.getSchema().table('author');
    database.delete().from(authorTable).where(authorTable['name'].eq(id)).exec().then(function () {
      // Удаление строки из HTML-таблицы
      row.remove();
    }).catch(function () {
      alert("Этого Автора нельзя удалить");
    });
  }
}

function updateRow(event) {
  selectedRow = $(event.target).closest('tr');
  var cells = selectedRow.find('td');
  $('#nameInputLabel').hide();
  $('#nameInput').hide();
  $('#birthdayInput').val(cells.eq(1).text());
  $('#birthplaceInput').val(cells.eq(2).text());
  $('#cancelAuthorBtn').show();
  $('#updateAuthorBtn').show();
  $('#submitAuthor').hide();
}

function cancel() {
  $('#nameInputLabel').show();
  $('#nameInput').show();
  $('#birthdayInput').val('');
  $('#birthplaceInput').val('');
  $('#cancelAuthorBtn').hide();
  $('#updateAuthorBtn').hide();
  $('#submitAuthor').show();
}

function update() {
  var authorTable = database.getSchema().table('author');
  var id = selectedRow.find('td').eq(0).text();
  var birthdayInput = $('#birthdayInput').val();
  var birthplaceInput = $('#birthplaceInput').val();

  database.update(authorTable)
    .set(authorTable['birthday'], new Date(birthdayInput))
    .set(authorTable['birthplace'], birthplaceInput)
    .where(authorTable['name'].eq(id))
    .exec();

  selectedRow.find('td').eq(1).text(birthdayInput);
  selectedRow.find('td').eq(2).text(birthplaceInput);

  cancel();
}
