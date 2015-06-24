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

    var viewModel = {

        source: source,

        addTag: function() {
            BookShelf.app.navigate({
                view: "TagAdd"
            }, { modal: true });
        },

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
        }

    };

    return viewModel;
};