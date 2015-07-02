BookShelf.TagListView = function(params) {

    var items = ko.observableArray();
    var selected = ko.observableArray();

    var id = ko.observable();
    var title = ko.observable();
    var editing = ko.observable();

    var viewModel = {

        items: items,
        selectionEnabled: params.selectionEnabled,
        editingEnabled: (params.editingEnabled === undefined) ? true : params.editingEnabled,
        selected: selected,

        editing: editing,

        tag: {
            id: id,
            title: title,
            invalid: ko.computed(function() {
                return !title();
            })
        },

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

            var currentSelected = selected();
            if(editing()) {
                BookShelf.db.tags.update(tag);
                items(BookShelf.db.tags.getAll());
            } else {
                var newTag = BookShelf.db.tags.get(BookShelf.db.tags.add(tag));
                items.unshift(newTag);
                currentSelected.push(newTag);
            }
            selected(currentSelected);

            this.resetTag();
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

            var currentSelected = selected();
            items(BookShelf.db.tags.getAll().slice().sort(function(a, b) { return b.title < a.title }));
            selected(currentSelected);
        },

        onShown: function() {
            BookShelf.app.applyListEditFix();

            var $list = $(".dx-list");
            $list.off("dxactive.listBetterActiveState dxinactive.listBetterActiveState");
            if(params.selectionEnabled) {
                $list
                    .on("dxactive.listBetterActiveState", ".dx-list-item", { timeout: 30 }, function(e) {
                        $(e.currentTarget).addClass("dx-state-active");
                    })
                    .on("dxinactive.listBetterActiveState", ".dx-list-item", { timeout: 400 }, function(e) {
                        $(e.currentTarget).removeClass("dx-state-active");
                    });
            }
        }

    };

    return viewModel;
};