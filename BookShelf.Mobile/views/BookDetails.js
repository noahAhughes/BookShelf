BookShelf.BookDetails = function(params) {
    var viewModel = BookShelf.BookForm($.extend(params, { readOnly: true }));

    viewModel.title = viewModel.book.title;
    viewModel.dateFormatter = function(date) {
        return Globalize.format(date, 'MM/dd/yyyy');
    }

    return viewModel;
};