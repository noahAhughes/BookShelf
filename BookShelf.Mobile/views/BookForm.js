BookShelf.BookForm = function (params) {

    var book = BookShelf.db.books.get(params.id) || {};

    var getStatus = function(book) {
        return (!!book.startDate && !!book.finishDate)
            ? BookShelf.db.bookStatus.finished
            : (!!book.startDate ? BookShelf.db.bookStatus.reading : BookShelf.db.bookStatus.later);
    };

    var title = ko.observable(book.title),
        author = ko.observable(book.author),
        status = ko.observable(params.status || getStatus(book)),
        startDate = ko.observable(book.startDate || new Date()),
        finishDate = ko.observable(book.finishDate || new Date());

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

        invalid: ko.computed(function() {
            return !title() || (showStartDate() && !startDate()) || (showFinishDate() && !finishDate());
        }),

        getBook: function() {
            return {
                id: book.id,
                title: title(),
                author: author(),
                startDate: showStartDate() ? startDate() : null,
                finishDate: showFinishDate() ? finishDate() : null
            };
        }

    };

    return viewModel;

};