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
        
        viewShown: function() {
            source.reload();
        }
    };

    return viewModel;
};