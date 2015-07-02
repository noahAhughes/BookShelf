BookShelf.TagFilter = function(params) {

    var tagListViewModel = BookShelf.TagListView({
        selectionEnabled: true,
        editingEnabled: false
    });

    var viewModel = {

        refreshFilter: function() {
            tagListViewModel.selected($.map(BookShelf.db.booksFilter, function(tagId) {
                return BookShelf.db.tags.get(tagId);
            }));
        },

        applyFilter: function() {
            BookShelf.db.booksFilter = $.map(tagListViewModel.selected(), function(tag) {
                return tag.id;
            });
            BookShelf.app.back();
        },

        viewShowing: function() {
            this.refreshFilter();
            tagListViewModel.onShowing();
        },

        viewShown: tagListViewModel.onShown

    };

    return $.extend(viewModel, tagListViewModel);
};