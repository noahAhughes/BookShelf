BookShelf.TagFilter = function(params) {

    var tagListViewModel = BookShelf.TagListView({
        selectionEnabled: true,
        scrollingEnabled: false,
        editingEnabled: false
    });

    var selectedRatings = ko.observableArray();

    var viewModel = {

        ratings: BookShelf.db.bookRatings,
        selectedRatings: selectedRatings,

        clearFilter: function() {
            selectedRatings([]);
            tagListViewModel.selected([]);
        },

        applyFilter: function() {
            BookShelf.db.booksFilter = {
                ratings: $.map(this.selectedRatings(), function(rating) {
                    return rating.value;
                }),
                tags: $.map(tagListViewModel.selected(), function(tag) {
                    return tag.id;
                })
            }

            BookShelf.app.bookListShowing.fire({ reload: true });
            BookShelf.app.back();
        },
        
        viewShowing: function() {
            this.clearFilter();
            tagListViewModel.onShowing();

            $(".dx-scrollview").dxScrollView("option", "pushBackValue", 0);
        },

        invalidFilter: ko.computed(function() {
            return !selectedRatings().length && !tagListViewModel.selected().length;
        }),

        viewShown: tagListViewModel.onShown

    };

    return $.extend(viewModel, tagListViewModel);
};