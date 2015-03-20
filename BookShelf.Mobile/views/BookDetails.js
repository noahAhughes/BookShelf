BookShelf.BookDetails = function(params, viewInfo) {

    var book = BookShelf.db.findBook(params.id);

    var viewModel = {
        book: {
            title: ko.observable(book.title),
            author: ko.observable(book.author)
        },

        title: book.title
    };

    return viewModel;
};