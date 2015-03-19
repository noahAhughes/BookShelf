BookShelf.BookList = function (params) {

    var source = new DevExpress.data.DataSource({
        store: BookShelf.db.books,
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
        showDetail: function(args) {
            var book = args.itemData;

            BookShelf.app.navigate({
                view: "BookDetail",
                id: book.id
            });
        },
        
        viewShown: function() {
            source.reload();
        }
    };

    return viewModel;
};