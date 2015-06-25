BookShelf.BookDetails = function(params) {
    var bookStatus = BookShelf.db.bookStatus;
    var viewModel = BookShelf.BookForm($.extend(params, { readOnly: true }));
    var book = viewModel.book;

    var dateFormatter = function(date) {
        return Globalize.format(date, 'MM/dd/yyyy');
    };

    var authorText = ko.computed(function() {
        return book.author() ? "by " + book.author() : "";
    });

    var statusText = ko.computed(function() {
        return "Is in " + book.status() + " list";
    });

    var isNotFinished = ko.computed(function() {
        return book.status() !== bookStatus.finished;
    });

    var changeStatusText = ko.computed(function() {
        if(book.status() === bookStatus.later)
            return "Mark as Reading";
        if(book.status() === bookStatus.reading)
            return "Mark as Read";
    });

    var progressState = ko.computed(function() {
        if(book.status() === bookStatus.reading)
            return "reading since " + dateFormatter(book.startDate());
        if(book.status() === bookStatus.finished)
            return "read on " + dateFormatter(book.startDate());
    });

    $.extend(true, viewModel, {
        title: book.title,
        dateFormatter: dateFormatter,

        changeStatus: function() {
            if(book.status() === bookStatus.later) {
                book.status(bookStatus.reading);
                book.startDate(new Date());
            } else if(book.status() === bookStatus.reading) {
                book.status(bookStatus.finished);
                book.finishDate(new Date());
            }   

            BookShelf.db.books.update(this.getBook());
        },

        book: {
            authorText: authorText,
            statusText: statusText,
            isNotFinished: isNotFinished,
            changeStatusText: changeStatusText,
            progressState: progressState
        }
    });

    return viewModel;
};