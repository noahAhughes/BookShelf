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

    var Store = function(name, defaultItems) {
        var storage = window.localStorage;

        var read = function() {
            return JSON.parse(storage.getItem(name), JSON.dateParser);
        };
        var save = function() {
            storage.setItem(name, JSON.stringify(items));
        };

        var items = read() || defaultItems;

        return {
            getAll: function() {
                return items;
            },
            get: function(id) {
                return $.grep(items, function(item) {
                    return item.id == id;
                })[0];
            },
            add: function(item) {
                var newid = items[items.length - 1].id + 1;
                items.push($.extend({}, item, { id: newid }));
                save();
            },
            update: function(item) {
                $.extend(this.get(item.id), item);
                save();
            },
            remove: function(id) {
                items.splice($.inArray(this.get(id), items), 1);
                save();
            }
        };
    };

    var demoBooks = [{
        id: 1,
        title: "War and Peace",
        author: "Lev Tolstoy",
        startDate: new Date(2010, 1, 1),
        finishDate: new Date(2012, 1, 1)
    }, {
        id: 2,
        title: "Crime and Punishment",
        author: "Fyodor Dostoyevsky",
        startDate: new Date(2011, 1, 1)
    }, {
        id: 3,
        title: "Quiet Flows the Don",
        author: "Mikhail Sholohov"
    }];

    BookShelf.db = {
        books: Store("books", demoBooks),
        bookStatus: {
            reading: "Reading",
            later: "To Read",
            finished: "Finished"
        }
    };

}());
