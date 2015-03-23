BookShelf.FinishedList = function(params) {

    return BookShelf.BookList($.extend(params, {
        filter: function(book) {
            return !!book.finishDate;
        }
    }));

};