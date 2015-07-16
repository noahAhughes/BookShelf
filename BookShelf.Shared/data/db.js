/// <reference path="../js/jquery-1.11.2.min.js" />
/// <reference path="../js/knockout-3.3.0.js" />
/// <reference path="../js/dx.all.js" />

(function() {
    // Enable partial CORS support for IE < 10    
    $.support.cors = true;

    if(window.JSON && !window.JSON.dateParser) {
        var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;

        JSON.dateParser = function(key, value) {
            if(typeof value === 'string') {
                var matched = reISO.exec(value);
                if(matched)
                    return new Date(value);
            }
            return value;
        };
    }

    var Store = function(name, config) {
        var storage = window.localStorage;

        var importData = function(data) {
            items = JSON.parse(data, JSON.dateParser) || config.defaultItems;
            save();
        };
        var read = function() {
            importData(storage.getItem(name));
        };
        var exportData = function() {
            return JSON.stringify(items);
        };
        var save = function() {
            storage.setItem(name, exportData());
        };

        var onAdd = $.Callbacks().add(config.onAdd);
        var onUpdate = $.Callbacks().add(config.onUpdate);
        var onRemove = $.Callbacks().add(config.onRemove);

        var items = [];
        read();

        return {
            onAdd: onAdd,
            onUpdate: onUpdate,
            onRemove: onRemove,

            getAll: function() {
                return items;
            },
            get: function(id) {
                return $.grep(items, function(item) {
                    return item.id == id;
                })[0];
            },
            add: function(item) {
                var lastId = items.length ? items[items.length - 1].id : 0;
                var newId = lastId + 1;
                items.push($.extend({}, item, { id: newId }));
                onAdd.fire(newId);
                save();
                return newId;
            },
            update: function(item) {
                $.extend(this.get(item.id), item);
                onUpdate.fire(item.id);
                save();
            },
            remove: function(id) {
                items.splice($.inArray(this.get(id), items), 1);
                onRemove.fire(id);
                save();
            },
            importData: importData,
            exportData: exportData
        };
    };


    var demoBooks = [{
        id: 1,
        title: "War and Peace",
        author: "Lev Tolstoy",
        startDate: new Date(2010, 1, 1),
        finishDate: new Date(2012, 1, 1),
        progress: 100,
        notes: "#Header\n * point1\n * point2",
        tags: [1]
    }, {
        id: 2,
        title: "Crime and Punishment",
        author: "Fyodor Dostoyevsky",
        startDate: new Date(2011, 1, 1),
        progress: 50,
        tags: []
    }, {
        id: 3,
        title: "Quiet Flows the Don",
        author: "Mikhail Sholohov",
        progress: 0,
        tags: [1, 2]
    }];

    var loadCover = function(bookId) {
        var book = bookStore.get(bookId);
        var coverKey = book.title + " " + (book.author || "");

        if(book.cover && book.cover.key === coverKey)
            return $.when(book.cover).promise();

        var deferred = $.Deferred();

        $.ajax({
            type: "GET",
            url: "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=" + encodeURIComponent(coverKey + " book cover"),
            dataType: "jsonp"
        }).done(function(result) {
            result = result.responseData;

            if(!result || !result.results || !result.results.length)
                return;

            var loadImage = function() {
                var imageResult = result.results.shift();

                if(!imageResult)
                    return;

                var onImageLoaded = function() {
                    book.cover = {
                        key: coverKey,
                        url: imageResult.url,
                        ratio: imageResult.height / (imageResult.width || 1)
                    };
                    bookStore.update(book);

                    deferred.resolve(book.cover);
                };

                var image = new Image();
                image.src = imageResult.url;

                if(image.complete) {
                    onImageLoaded();
                    return;
                }

                image.onload = onImageLoaded;
                image.onerror = loadImage;
            };

            loadImage();
        });

        return deferred.promise();
    };

    var bookStore = Store("books", {
        defaultItems: demoBooks,
        onAdd: loadCover,
        onUpdate: loadCover
    });
    bookStore.loadCover = loadCover;
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

    var demoTags = [{
        id: 1,
        title: "Programming"
    }, {
        id: 2,
        title: "Design"
    }];

    var tagStore = Store("tags", {
        defaultItems: demoTags,
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
