BookShelf.BookList = function(params) {

    var source = new DevExpress.data.DataSource({
        store: BookShelf.db.books.getAll(),
        filter: function(book) {
            return params.filter(book) && filterTags(book);
        },
        sort: params.sort,
        map: function(book) {
            var status = BookShelf.db.getBookStatus(book);
            var ratingColor = book.rating && BookShelf.db.bookRatings[book.rating].color;
            var progress = (status === BookShelf.db.bookStatus.reading)
                ? book.progress
                : (status === BookShelf.db.bookStatus.finished) ? 100 : 0;

            return {
                id: book.id,
                title: book.title,
                author: book.author ? "by " + book.author : null,
                rating: book.rating,
                ratingColor: ratingColor,
                status: status,
                isStarted: status === BookShelf.db.bookStatus.reading,
                progress: "reading since " + BookShelf.db.formatDate(book.startDate) + ", " + book.progress + "% completed",
                progressBg: BookShelf.db.getProgressBg(progress, 100, ratingColor),
                tagsString: BookShelf.db.getTagsString(book.tags),
                showChevron: true
            }
        }
    });

    var filterTags = function(book) {
        return !BookShelf.db.booksFilter.length || !!$.grep(BookShelf.db.booksFilter, function(tagId) {
            return $.inArray(tagId, book.tags) > -1;
        }).length;
    };

    var viewModel = {

        source: source,

        filterApplied: ko.observable(false),

        clearFilter: function() {
            BookShelf.db.booksFilter = [];
            this.updateFilterState();
            source.reload();
        },

        filterBooks: function() {
            if(this.filterApplied()) {
                this.clearFilter();
                return;
            }

            BookShelf.app.navigate({
                view: "TagFilter"
            }, { modal: true });
        },

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

        openBook: function(args) {
            BookShelf.app.navigate("BookDetails/" + args.itemData.id);
        },

        updateFilterState: function() {
            this.filterApplied(!!BookShelf.db.booksFilter.length);
        },

        viewShowing: function() {
            this.updateFilterState();
        },

        viewShown: function() {
            this.viewShowing();
            source.reload();
            BookShelf.app.applyListEditFix();
        }

    };

    return viewModel;
};