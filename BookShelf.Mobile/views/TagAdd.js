BookShelf.TagAdd = function(params) {

    var title = ko.observable();

    var viewModel = {

        tag: {
            title: title
        },

        resetTag: function() {
            title("");
        },

        invalid: ko.computed(function() {
            return !title();
        }),

        getTag: function() {
            return {
                title: title()
            };
        },

        save: function() {
            BookShelf.db.tags.add(this.getTag());
            BookShelf.app.back();
        },

        cancel: function() {
            BookShelf.app.back();
        },

        viewShowing: function() {
            this.resetTag();
        }

    };

    return viewModel;
};