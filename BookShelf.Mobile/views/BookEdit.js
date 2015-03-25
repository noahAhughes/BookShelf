BookShelf.BookEdit = function(params) {

    return $.extend(BookShelf.BookForm(params), {
                
        save: function() {
            BookShelf.db.books.update(this.getBook());
            BookShelf.app.back();
        }

    });
};