BookShelf.BookDetail = function(params, viewInfo) {

    var book = $.grep(BookShelf.db.books, function(book) {
        return book.id == params.id;
    })[0];

    var viewModel = {
        book: {
            title: ko.observable(book.title),
            author: ko.observable(book.author)
        },

        title: book.title
    };

    return viewModel;
};