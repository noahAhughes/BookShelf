BookShelf.BookList = function(params) {

    var source = new DevExpress.data.DataSource({
        store: BookShelf.db.books.getAll(),
        filter: params.filter,
        map: function(book) {
            return {
                id: book.id,
                title: book.title,
                author: book.author,
                showChevron: true
            }
        }
    });

    var viewModel = {

        source: source,

        deleteBook: function(args) {
            BookShelf.db.books.remove(args.itemData.id);
        },

        viewShowing: function() {
            source.reload();
        }

    };

    return viewModel;
};