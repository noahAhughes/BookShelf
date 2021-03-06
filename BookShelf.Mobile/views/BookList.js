﻿BookShelf.BookList = function(params) {

    var mapBook = function(book) {
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
            tags: book.tags,
            tagsString: BookShelf.db.getTagsString(book.tags),
            showChevron: true
        }
    };

    var source = new DevExpress.data.DataSource({
        store: BookShelf.db.books.getAll(),
        filter: function(book) {
            return params.filter(book) && filterTags(book) && filterRatings(book);
        },
        searchExpr: ["title", "author"],
        sort: params.sort,
        map: mapBook
    });
    source.requireTotalCount(true);

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
            viewModel.list.reload();
            viewModel.list._scrollView._savedScrollOffset = null;
            booksCount(source.totalCount());
        },

        listInit: function(args) {
            var list = viewModel.list = args.component;

            var $searchbar = $("<div>").addClass("dx-searchbar").append($("<div>").dxTextBox({
                value: source.searchValue(),
                valueChangeEvent: "keyup",
                placeholder: "Search",
                onValueChanged: function(args) {
                    clearTimeout(viewModel._searchTimer);
                    viewModel._searchTimer = setTimeout(function() {
                        source.searchValue(args.value);
                        viewModel.reloadSource();
                    }, 400);
                },
                mode: "search"
            }));
            list.itemsContainer().append($searchbar);
            setTimeout(function() {
                list._scrollView.scrollTo($searchbar.outerHeight());
            });

            var $newContainer = $("<div>");
            list.itemsContainer().append($newContainer);
            list._$container = $newContainer;
        },

        filterApplied: ko.observable(false),

        clearFilter: function() {
            BookShelf.db.clearBooksFilter();
            BookShelf.app.bookListShowing.fire({ reload: true });
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

        viewShowing: function(options) {
            this.updateFilterState();

            if(options.reload !== undefined) {
                this.reloadSource();
            }

            if(options.reloadBook !== undefined) {
                $.each(viewModel.list.option("items"), $.proxy(function(index, mappedBook) {
                    if(mappedBook.id !== options.reloadBook)
                        return;
                    this.updateBook(mappedBook.id, index);
                    return false;
                }, this));
            }

            if(options.reloadTag !== undefined) {
                $.each(viewModel.list.option("items"), $.proxy(function(index, mappedBook) {
                    if($.inArray(options.reloadTag, mappedBook.tags) === -1)
                        return;
                    this.updateBook(mappedBook.id, index);
                }, this));
            }
        },

        updateBook: function(bookId, bookIndexInList) {
            var updatedBook = mapBook(BookShelf.db.books.get(bookId));
            var books = viewModel.list.option("items");
            books.splice(bookIndexInList, 1, updatedBook);
            var $bookElement = viewModel.list._renderItem(bookIndexInList, updatedBook, viewModel.list.itemsContainer());
            viewModel.list.itemElements().eq(bookIndexInList).replaceWith($bookElement);
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