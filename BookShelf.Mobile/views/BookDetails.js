BookShelf.BookDetails = function(params) {
    var viewModel = BookShelf.BookForm(params);

    viewModel.title = viewModel.book.title;
    viewModel.dateFormatter = function(date) {
        return Globalize.format(date, 'MM/dd/yyyy');
    }

    return viewModel;
};