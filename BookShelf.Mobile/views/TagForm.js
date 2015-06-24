BookShelf.TagForm = function (params) {

    var tag = BookShelf.db.tags.get(params.id) || {};

    var title = ko.observable();

    var viewModel = {

        tag: {
            id: tag.id,
            title: title
        },
        
        invalid: ko.computed(function() {
            return !title();
        }),

        getTag: function() {
            return {
                id: tag.id,
                title: title()
            };
        },

        prepareTag: function() {
            this.tag.title(tag.title);
        },

        viewShowing: function() {
            this.prepareTag();
        }

    };

    return viewModel;
};