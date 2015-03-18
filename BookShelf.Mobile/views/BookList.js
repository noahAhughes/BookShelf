BookShelf.BookList = function (params) {

    var booksSource = new DevExpress.data.DataSource({
        store: BookShelf.db.books
    });

    var viewModel = {
        booksSource: booksSource,
        viewShown: function() {
            booksSource.reload();
        }
    };

    return viewModel;
};