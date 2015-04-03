BookShelf.FinishedList = function(params) {

    return BookShelf.BookList($.extend(params, {
        status: BookShelf.db.bookStatus.finished,
        filter: function(book) {
            return !!book.finishDate;
        },
        sort: { getter: "finishDate", desc: true }
    }));

};