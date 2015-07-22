BookShelf.BookEdit = function(params) {

    return $.extend(BookShelf.BookForm(params), {
                
        save: function() {
            var bookStatus = BookShelf.db.getBookStatus(BookShelf.db.books.get(this.getBook().id));
            BookShelf.db.books.update(this.getBook());
            if(BookShelf.db.getBookStatus(this.getBook()) === bookStatus) {
                BookShelf.app.bookListShowing.fire({ reloadBook: this.getBook().id });
            } else {
                BookShelf.app.bookListShowing.fire({ reload: true });
            }
            BookShelf.app.back();
        }

    });

};