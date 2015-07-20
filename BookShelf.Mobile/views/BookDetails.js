BookShelf.BookDetails = function(params) {
    var bookStatus = BookShelf.db.bookStatus;
    var viewModel = BookShelf.BookForm($.extend(params, { readOnly: true }));
    var book = viewModel.book;

    var formatDate = BookShelf.db.formatDate;

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
            return "reading since " + formatDate(book.startDate()) + ", " + book.progress() + "% completed";
        if(book.status() === bookStatus.finished)
            return "read on " + formatDate(book.startDate());
    });

    var showProgress = ko.computed(function() {
        return book.status() === bookStatus.reading;
    });

    var rating = ko.computed(function() {
        return BookShelf.db.getBookRating(book.rating());
    });

    var ratingText = ko.computed(function() {
        return rating() && rating().title;
    });

    var ratingColor = ko.computed(function() {
        return rating() && rating().color;
    });

    var coverUrl = ko.observable();
    var coverHeight = ko.observable();
   
    var baseViewShowing = viewModel.viewShowing;

    $.extend(true, viewModel, {
        title: book.title,

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
            ratingText: ratingText,
            ratingColor: ratingColor,
            isNotFinished: isNotFinished,
            changeStatusText: changeStatusText,
            progressState: progressState,
            coverUrl: coverUrl,
            coverHeight: coverHeight,
            showProgress: showProgress
        },
        
        back: function() {
            BookShelf.app.bookListShowing.fire({ reloadBook: this.getBook().id });
            BookShelf.app.backToList(this.book.status());
        },

        feedbackOn: function(_, e) {
            $(e.currentTarget).addClass("notes-active");
        },

        feedbackOff: function(_, e) {
            $(e.currentTarget).removeClass("notes-active");
        },

        viewShowing: function() {
            baseViewShowing.call(this);

            BookShelf.db.books.loadCover(this.getBook().id).done(function(cover) {
                coverHeight(cover.ratio * 100 + "%");
                coverUrl(cover.url);
            });

            ko.computed(function() {
                BookShelf.db.books.update(viewModel.getBook());
            }).extend({ throttle: 400 });
        }
    });

    return viewModel;
};