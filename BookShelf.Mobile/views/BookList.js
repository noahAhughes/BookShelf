BookShelf.BookList = function (params) {

    var viewModel = {
        dataSource: {
            store: BookShelf.db.books
        }
    };

    return viewModel;
};