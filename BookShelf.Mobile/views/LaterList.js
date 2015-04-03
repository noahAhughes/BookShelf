BookShelf.LaterList = function(params) {

    return BookShelf.BookList($.extend(params, {
        status: BookShelf.db.bookStatus.later,
        filter: function(book) {
            return !book.finishDate;
        },
        sort: [
            function(book) {
                return BookShelf.db.getBookStatus(book);
            },
            { getter: "startDate" }
        ]
    }));

};