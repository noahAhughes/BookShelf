BookShelf.ReadingList = function(params) {

    return BookShelf.BookList($.extend(params, {
        filter: function(book) {
            return !!book.startDate && !book.finishDate;
        }
    }));

};