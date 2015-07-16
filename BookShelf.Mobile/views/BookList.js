BookShelf.BookList = function(params) {

    var source = new DevExpress.data.DataSource({
        store: BookShelf.db.books.getAll(),
        filter: function(book) {
            return params.filter(book) && filterTags(book) && filterRatings(book);
        },
        sort: params.sort,
        map: function(book) {
            var status = BookShelf.db.getBookStatus(book);
            var ratingColor = book.rating && BookShelf.db.getBookRating(book.rating).color;
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
        return !BookShelf.db.booksFilter.tags.length || !!$.grep(BookShelf.db.booksFilter.tags, function(tagId) {
            return $.inArray(tagId, book.tags) > -1;
        }).length;
    };

    var filterRatings = function(book) {
        return !BookShelf.db.booksFilter.ratings.length || $.inArray(book.rating, BookShelf.db.booksFilter.ratings) > -1;
    };

    var booksCount = ko.observable();
    var title = ko.computed(function() {
        return params.title + (booksCount() ? " (" + booksCount() + ")" : "");
    });

    var viewModel = {
        title: title,

        noBooksText: params.noBooksMessage,

        source: source,

        reloadSource: function() {
            source.requireTotalCount(true);
            source.pageIndex(0);
            source.load();
            booksCount(source.totalCount());
        },

        filterApplied: ko.observable(false),

        clearFilter: function() {
            BookShelf.db.clearBooksFilter();
            this.updateFilterState();
            this.reloadSource();
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

        bookRendered: function(args) {
            args.itemElement.addClass("book-" + args.itemData.status.toLowerCase());
        },

        deleteBook: function(args) {
            BookShelf.db.books.remove(args.itemData.id);
        },

        openBook: function(args) {
            BookShelf.app.navigate("BookDetails/" + args.itemData.id);
        },

        updateFilterState: function() {
            this.filterApplied(BookShelf.db.isBooksFilterApplied());
        },

        viewShowing: function() {
            this.updateFilterState();
            this.reloadSource();
        },

        viewRendered: function() {
            this._viewShowingHandler = $.proxy(this.viewShowing, this);
            BookShelf.app.bookListShowing.add(this._viewShowingHandler);
        },

        viewDisposing: function() {
            BookShelf.app.bookListShowing.remove(this._viewShowingHandler);
        }

    };

    return viewModel;
};