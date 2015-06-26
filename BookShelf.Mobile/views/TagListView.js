BookShelf.TagListView = function(params) {

    var source = new DevExpress.data.DataSource({
        store: BookShelf.db.tags.getAll(),
        sort: "title"
    });

    var id = ko.observable();
    var title = ko.observable();
    var editing = ko.observable();

    var viewModel = {

        source: source,
        editing: editing,

        tag: {
            id: id,
            title: title
        },

        invalid: ko.computed(function() {
            return !title();
        }),

        getTag: function() {
            return {
                id: id(),
                title: title()
            };
        },

        prepareTag: function(tag) {
            id(tag.id);
            title(tag.title);
        },

        resetTag: function() {
            editing(false);
            this.prepareTag({});
        },

        saveTag: function() {
            var tag = this.getTag();
            tag.id ? BookShelf.db.tags.update(tag) : BookShelf.db.tags.add(tag);

            this.resetTag();
            source.reload();
        },

        cancelEditTag: function() {
            this.resetTag();
        },

        editTag: function(args) {
            this.prepareTag(args.itemData);
            editing(true);

            setTimeout(function() {
                $(".tag-form-field").dxTextBox("focus");
            }, 400);
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

        onShowing: function() {
            this.resetTag();
        },

        onShown: function() {
            source.reload();
            BookShelf.app.applyListEditFix();
        }

    };

    return viewModel;
};