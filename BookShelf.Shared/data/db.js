/// <reference path="../js/jquery-1.11.2.min.js" />
/// <reference path="../js/knockout-3.3.0.js" />
/// <reference path="../js/dx.all.js" />

(function() {
    // Enable partial CORS support for IE < 10    
    $.support.cors = true;

    var loadCover = function(bookId) {
        var book = bookStore.get(bookId);
        var coverKey = bookStore.getCoverKey(book);

        if(book.cover && book.cover.key === coverKey)
            return $.when(book.cover).promise();

        var d = $.Deferred();

        BookShelf.coverFinder.loadCover(coverKey).done(function(cover) {
            book.cover = cover;
            bookStore.update(book);
            d.resolve(cover);
        });

        return d.promise();
    };

    var loadCovers = function(bookId) {
        var book = bookStore.get(bookId);
        var coverKey = bookStore.getCoverKey(book);
        return BookShelf.coverFinder.loadCovers(coverKey);
    };

    var bookStore = BookShelf.Store("books", {
        onAdd: loadCover,
        onUpdate: loadCover
    });
    bookStore.loadCover = loadCover;
    bookStore.loadCovers = loadCovers;
    bookStore.getByTag = function(tagId) {
        return $.grep(bookStore.getAll(), function(book) {
            return $.inArray(tagId, book.tags) > -1;
        });
    };
    bookStore.getReadingCount = function() {
        return $.grep(bookStore.getAll(), function(book) {
            return BookShelf.db.getBookStatus(book) === BookShelf.db.bookStatus.reading;
        }).length;
    };
    bookStore.getCoverKey = function(book) {
        return book.title + " " + (book.author || "book cover");
    };

    var tagStore = BookShelf.Store("tags", {
        onRemove: function(id) {
            $.each(bookStore.getAll(), function(_, book) {
                book.tags = $.grep(book.tags, function(tagId) {
                    return tagId !== id;
                });
                bookStore.update(book);
            });
        }
    });

    var emptyBookFilter = {
        ratings: [],
        tags: []
    };


    BookShelf.db = {
        books: bookStore,

        formatDate: function(date, format) {
            return Globalize.format(date, format || "d MMM yyyy");
        },

        getBookStatus: function(book) {
            return (!!book.startDate && !!book.finishDate)
                ? this.bookStatus.finished
                : (!!book.startDate ? this.bookStatus.reading : this.bookStatus.later);
        },

        bookStatus: {
            reading: "Reading",
            later: "To Read",
            finished: "Finished"
        },

        getProgressBg: function(progress, total, color) {
            var angle = Math.round((progress / total) * 360);

            return (angle <= 180)
                ? "linear-gradient(" + (angle + 90) + "deg, transparent 50%, white 50%), linear-gradient(90deg, white 50%, transparent 50%)"
                : "linear-gradient(90deg, transparent 50%, " + color + " 50%), linear-gradient(" + (angle - 90) + "deg, white 50%, transparent 50%)";
        },

        bookRatings: [
            { value: 5, title: "Must read", color: "#0bda0b" },
            { value: 4, title: "Good read", color: "#a0da0b" },
            { value: 3, title: "So-so", color: "#f4d525" },
            { value: 2, title: "Boring", color: "#f48c25" },
            { value: 1, title: "Waste of time", color: "#f42525" }
        ],

        getBookRating: function(rating) {
            return $.grep(this.bookRatings, function(r) {
                return r.value === rating;
            })[0];
        },

        getTagsString: function(tagIds) {
            return $.map(tagIds, function(tagId) {
                return BookShelf.db.tags.get(tagId).title;
            }).join(", ");
        },

        tags: tagStore,

        booksFilter: emptyBookFilter,

        isBooksFilterApplied: function() {
            return !!this.booksFilter.ratings.length || !!this.booksFilter.tags.length
        },

        clearBooksFilter: function() {
            this.booksFilter = emptyBookFilter;
        },

        importData: function(data) {
            data = JSON.parse(data);
            this.books.importData(data.books);
            this.tags.importData(data.tags);
        },

        exportData: function() {
            return JSON.stringify({
                books: this.books.exportData(),
                tags: this.tags.exportData()
            });
        }

    };

}());
