BookShelf.BookEdit = function(params) {

    var book = BookShelf.db.findBook(params.id);

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

            BookShelf.app.back();
        }

    };

    return viewModel;
};