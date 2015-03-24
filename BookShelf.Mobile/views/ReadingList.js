BookShelf.ReadingList = function(params) {

    return BookShelf.BookList($.extend(params, {
        status: BookShelf.db.bookStatus.reading,
        filter: function(book) {
            return !!book.startDate && !book.finishDate;
        }
    }));

};