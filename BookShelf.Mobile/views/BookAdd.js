BookShelf.BookAdd = function(params) {

    return $.extend(BookShelf.BookForm(params), {

        resetBook: function() {
            this.book.title("");
            this.book.author("");
        },

        save: function() {
            BookShelf.db.books.add(this.getBook());
            BookShelf.app.back();
        },

        cancel: function() {
            BookShelf.app.back();
        },

        viewShowing: function() {
            this.resetBook();
        }

    });

    return viewModel;
};