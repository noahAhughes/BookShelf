BookShelf.BookAdd = function(params) {

    var title = ko.observable(),
        author = ko.observable();

    var viewModel = {

        book: {
            title: title,
            author: author
        },

        resetBook: function() {
            title("");
            author("");
        },
        
        invalid: ko.computed(function() {
            return !title();
        }),

        save: function() {
            BookShelf.db.books.push({
                title: title(),
                author: author()
            });

            BookShelf.app.back();
        },

        cancel: function() {
            BookShelf.app.back();
        },

        viewShowing: function() {
            this.resetBook();
        }
    };

    return viewModel;
};