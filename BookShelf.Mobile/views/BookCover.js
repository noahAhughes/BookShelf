BookShelf.BookCover = function (params) {

    var book = BookShelf.db.books.get(params.id) || {};
    
    var coverUrl = ko.observable();
    var covers = ko.observableArray();

    var viewModel = {
        coverUrl: coverUrl,
        covers: covers,

        loadCovers: function() {
            BookShelf.db.books.loadCovers(book.id).done(function(result) {
                viewModel.indicator.element().hide();
                covers(result);
            });
        },

        indicatorInit: function(args) {
            viewModel.indicator = args.component;
        },

        feedbackOn: function(_, e) {
            $(e.currentTarget).addClass("active");
        },

        feedbackOff: function(_, e) {
            $(e.currentTarget).removeClass("active");
        },

        setCover: function() {
            coverUrl(this.url);
            book.cover = this;
            BookShelf.db.books.update(book);
        },

        viewShowing: function() {
            coverUrl(book.cover.url);
            this.loadCovers();
        }
    };

    return viewModel;
};