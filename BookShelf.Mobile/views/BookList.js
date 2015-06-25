BookShelf.BookList = function(params) {

    var source = new DevExpress.data.DataSource({
        store: BookShelf.db.books.getAll(),
        filter: params.filter,
        sort: params.sort,
        map: function(book) {
            return {
                id: book.id,
                title: book.title,
                author: book.author ? "by " + book.author : null,
                rating: book.rating,
                ratingStatus: BookShelf.db.getBookRatingStatus(book.rating),
                status: BookShelf.db.getBookStatus(book).toLowerCase(),
                tagsString: BookShelf.db.getTagsString(book.tags),
                showChevron: true
            }
        }
    });

    var viewModel = {

        source: source,

        addBook: function() {
            BookShelf.app.navigate({
                view: "BookAdd",
                status: params.status || BookShelf.db.bookStatus.later
            }, { modal: true });
        },

        deleteBookConfirmation: function(args) {
            return DevExpress.ui.dialog.confirm("Are you sure you want to delete book \"" + args.itemData.title + "\"?", "Delete book");
        },

        deleteBook: function(args) {
            BookShelf.db.books.remove(args.itemData.id);
        },

        viewShown: function() {
            source.reload();
        }

    };

    return viewModel;
};