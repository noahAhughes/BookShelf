BookShelf.BookAdd = function(params, viewInfo) {

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

            BookShelf.app.viewCache.removeView(viewInfo.key);
            BookShelf.app.back();
        },
        cancel: function() {
            BookShelf.app.viewCache.removeView(viewInfo.key);
            BookShelf.app.back();
        }
    };

    return viewModel;
};