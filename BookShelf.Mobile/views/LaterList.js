BookShelf.LaterList = function(params) {

    return BookShelf.BookList($.extend(params, {
        status: BookShelf.db.bookStatus.later,
        filter: function(book) {
            return !book.startDate && !book.finishDate;
        }
    }));

};