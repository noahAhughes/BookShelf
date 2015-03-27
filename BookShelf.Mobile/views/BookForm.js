BookShelf.BookForm = function(params) {

    var book = BookShelf.db.books.get(params.id) || {};

    var getStatus = function(book) {
        return (!!book.startDate && !!book.finishDate)
            ? BookShelf.db.bookStatus.finished
            : (!!book.startDate ? BookShelf.db.bookStatus.reading : BookShelf.db.bookStatus.later);
    };

    var title = ko.observable(),
        author = ko.observable(),
        status = ko.observable(),
        startDate = ko.observable(),
        finishDate = ko.observable(),
        notes = ko.observable();

    var showStartDate = ko.computed(function() {
        return status() === BookShelf.db.bookStatus.reading || status() === BookShelf.db.bookStatus.finished;
    });

    var showFinishDate = ko.computed(function() {
        return status() === BookShelf.db.bookStatus.finished;
    });

    var notesHtml = ko.computed(function() {
        var converter = new Showdown.converter();
        return converter.makeHtml(notes() || "");
    });

    var viewModel = {

        statuses: [BookShelf.db.bookStatus.later, BookShelf.db.bookStatus.reading, BookShelf.db.bookStatus.finished],

        book: {
            id: book.id,
            title: title,
            author: author,
            status: status,
            showStartDate: showStartDate,
            startDate: startDate,
            showFinishDate: showFinishDate,
            finishDate: finishDate,
            notes: notes,
            notesHtml: notesHtml
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
                finishDate: showFinishDate() ? finishDate() : null,
                notes: notes()
            };
        },

        prepareBook: function() {
            this.book.title(book.title);
            this.book.author(book.author);
            this.book.status(getStatus(book));
            this.book.startDate(book.startDate);
            this.book.finishDate(book.finishDate);
            this.book.notes(book.notes);
        },

        viewShowing: function() {
            this.prepareBook();
        }

    };

    return viewModel;

};