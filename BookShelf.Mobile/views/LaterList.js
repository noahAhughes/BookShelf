BookShelf.LaterList = function(params) {

    return BookShelf.BookList($.extend(params, {
        noBooksMessage: "No books to read found",
        status: BookShelf.db.bookStatus.later,
        filter: function(book) {
            return !book.finishDate;
        },
        sort: [
            function(book) {
                return BookShelf.db.getBookStatus(book);
            },
            { getter: "startDate", desc: true },
            { getter: "title" }
        ],
        title: "Books To Read"
    }));

};