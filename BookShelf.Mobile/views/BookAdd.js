BookShelf.BookAdd = function (params) {

    var title = ko.observable();
    var author = ko.observable();

    var viewModel = {
        book: {
            title: title,
            author: author
        },
        save: function() {
            BookShelf.db.books.push({
                title: title(),
                author: author()
            });

            BookShelf.app.navigate("BookList", { target: "back" });
        },
        invalid: ko.computed(function() {
            return !title();
        })
    };

    return viewModel;
};