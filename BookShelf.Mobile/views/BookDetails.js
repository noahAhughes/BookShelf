BookShelf.BookDetails = function(params, viewInfo) {

    var book = BookShelf.db.findBook(params.id);

    var viewModel = {

        book: {
            id: book.id,
            title: ko.observable(),
            author: ko.observable()
        },

        title: ko.observable(),
        
        viewShowing: function() {
            this.book.title(book.title);
            this.book.author(book.author);

            this.title(book.title);
        }

    };

    return viewModel;
};