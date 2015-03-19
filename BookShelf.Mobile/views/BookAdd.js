BookShelf.BookAdd = function(params) {

    var title = ko.observable();
    var author = ko.observable();

    var viewModel = {
        book: {
            title: title,
            author: author
        },
        
        invalid: ko.computed(function() {
            return !title();
        }),

        save: function() {
            BookShelf.db.books.push({
                title: title(),
                author: author()
            });

            BookShelf.app.navigate("BookList", { root: true });
        },

        cancel: function() {
            BookShelf.app.back();
        }
    };

    return viewModel;
};