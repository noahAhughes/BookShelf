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

        var importData = function(data) {
            items = JSON.parse(data, JSON.dateParser) || defaultItems;
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

        var items = [];
        read();

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
                var lastId = items.length ? items[items.length - 1].id : 0;
                var newId = lastId + 1;
                items.push($.extend({}, item, { id: newId }));
                save();
            },
            update: function(item) {
                $.extend(this.get(item.id), item);
                save();
            },
            remove: function(id) {
                items.splice($.inArray(this.get(id), items), 1);
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
        notes: "#Header\n * point1\n * point2"
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
