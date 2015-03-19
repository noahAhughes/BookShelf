BookShelf.BookDetail = function(params, viewInfo) {

    var book = $.grep(BookShelf.db.books, function(book) {
        return book.id == params.id;
    })[0];

    var viewModel = {
        title: ko.observable(book.title),
        author: ko.observable(book.author),

        back: function() {
            BookShelf.app.viewCache.removeView(viewInfo.key);
            BookShelf.app.back();
        }
    };

    return viewModel;
};