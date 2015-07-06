BookShelf.FinishedList = function(params) {

    return BookShelf.BookList($.extend(params, {
        noBooksMessage: "No finished books found",
        status: BookShelf.db.bookStatus.finished,
        filter: function(book) {
            return !!book.finishDate;
        },
        sort: { getter: "title" }
    }));

};