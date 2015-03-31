BookShelf.BookAdd = function(params) {

    return $.extend(BookShelf.BookForm(params), {

        resetBook: function() {
            this.book.title("");
            this.book.author("");
            this.book.status(params.status);
            this.book.startDate(new Date());
            this.book.finishDate(new Date());
            this.book.rating(undefined);
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