BookShelf.BookEdit = function(params) {

    var book = BookShelf.db.books.get(params.id);

    var title = ko.observable(book.title),
        author = ko.observable(book.author);
    
    var viewModel = {

        book: {
            title: title,
            author: author
        },

        invalid: ko.computed(function() {
            return !title();
        }),

        save: function() {
            book.title = title();
            book.author = author();
            BookShelf.db.books.update(book);

            BookShelf.app.back();
        }

    };

    return viewModel;
};