BookShelf.BookAdd = function(params) {

    var title = ko.observable(),
        author = ko.observable(),
        status = ko.observable(params.status),
        startDate = ko.observable(new Date()),
        finishDate = ko.observable(new Date());

    var showStartDate = ko.computed(function() {
        return status() === BookShelf.db.bookStatus.reading || status() === BookShelf.db.bookStatus.finished;
    });

    var showFinishDate = ko.computed(function() {
        return status() === BookShelf.db.bookStatus.finished;
    });

    var viewModel = {

        statuses: [BookShelf.db.bookStatus.later, BookShelf.db.bookStatus.reading, BookShelf.db.bookStatus.finished],

        book: {
            title: title,
            author: author,
            status: status,
            showStartDate: showStartDate,
            startDate: startDate,
            showFinishDate: showFinishDate,
            finishDate: finishDate
        },

        resetBook: function() {
            title("");
            author("");
        },

        invalid: ko.computed(function() {
            return !title() || (showStartDate() && !startDate()) || (showFinishDate() && !finishDate());
        }),

        save: function() {
            BookShelf.db.books.add({
                title: title(),
                author: author(),
                startDate: showStartDate() ? startDate() : null,
                finishDate: showFinishDate() ? finishDate() : null
            });

            BookShelf.app.back();
        },

        cancel: function() {
            BookShelf.app.back();
        },

        viewShowing: function() {
            this.resetBook();
        }

    };

    return viewModel;
};