BookShelf.TagList = function(params) {

    var source = new DevExpress.data.DataSource({
        store: BookShelf.db.tags.getAll(),
        sort: "title",
        map: function(tag) {
            return {
                id: tag.id,
                title: tag.title
            }
        }
    });

    var title = ko.observable();

    var viewModel = {

        tag: {
            title: title
        },

        invalid: ko.computed(function() {
            return !title();
        }),

        getTag: function() {
            return {
                title: title()
            };
        },

        addTag: function() {
            BookShelf.db.tags.add(this.getTag());
            this.resetTag();
            source.reload();
        },

        resetTag: function() {
            this.tag.title("");
        },

        viewShowing: function() {
            this.resetTag();
        },


        source: source,

        deleteTagConfirmation: function(args) {
            var booksByTag = BookShelf.db.books.getByTag(args.itemData.id);

            if(!booksByTag.length)
                return;

            return DevExpress.ui.dialog.confirm("Are you sure you want to delete category \"" + args.itemData.title + "\"? There are books associated with this category.", "Delete category");
        },

        deleteTag: function(args) {
            BookShelf.db.tags.remove(args.itemData.id);
        },
        
        viewShown: function() {
            source.reload();
            BookShelf.app.applyListEditFix();
        }

    };

    return viewModel;
};