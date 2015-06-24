BookShelf.BookAdd = function(params) {

    return $.extend(BookShelf.BookForm(params), {

        save: function() {
            BookShelf.db.books.add(this.getBook());
            BookShelf.app.back();
            this.resetBook();
        },

        cancel: function() {
            BookShelf.app.back();
        },

        resetBook: function() {
            this.book.title("");
            this.book.author("");
            this.book.status(params.status);
            this.book.startDate(new Date());
            this.book.finishDate(new Date());
            this.book.rating(undefined);
            this.book.tags([]);
        }

    });

    return viewModel;
};