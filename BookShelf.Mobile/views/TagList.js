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

        deleteTag: function(args) {
            BookShelf.db.tags.remove(args.itemData.id);
        },

        viewShowing: function() {
            source.reload();
        }

    };

    return viewModel;
};