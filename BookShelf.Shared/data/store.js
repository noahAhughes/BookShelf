
(function() {

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

    BookShelf.Store = function(name, config) {
        var storage = window.localStorage;

        var importData = function(data) {
            parseData(data);
            $.each(items, function(_, item) {
                onAdd.fire(item.id);
            });
        };
        var parseData = function(data) {
            items = JSON.parse(data, JSON.dateParser) || config.defaultItems || [];
            save();
        };
        var read = function() {
            parseData(storage.getItem(name));
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

}());