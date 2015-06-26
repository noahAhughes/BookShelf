BookShelf.TagList = function(params) {

    var viewModel = BookShelf.TagListView(params);
    viewModel.viewShowing = viewModel.onShowing;
    viewModel.viewShown = viewModel.onShown;

    return viewModel;

};