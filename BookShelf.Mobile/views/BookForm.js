BookShelf.BookForm = function(params) {

    var book = BookShelf.db.books.get(params.id) || {};

    var title = ko.observable(),
        author = ko.observable(),
        status = ko.observable(),
        startDate = ko.observable(),
        finishDate = ko.observable(),
        rating = ko.observable(),
        notes = ko.observable(),
        tags = ko.observableArray();

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

    var tagsString = ko.computed(function() {
        return $.map(tags(), function(tagId) {
            return BookShelf.db.tags.get(tagId).title;
        }).join(", ");
    });

    var ratingClass = ko.computed(function() {
        var value = rating();
        if(!value)
            return;
        if(value < 4)
            return "book-rating-low";
        if(value > 7)
            return "book-rating-high";
        return "book-rating-normal";
    });

    var viewModel = {

        statuses: [BookShelf.db.bookStatus.later, BookShelf.db.bookStatus.reading, BookShelf.db.bookStatus.finished],
        tags: BookShelf.db.tags.getAll(),

        book: {
            id: book.id,
            title: title,
            author: author,
            status: status,
            showStartDate: showStartDate,
            startDate: startDate,
            showFinishDate: showFinishDate,
            finishDate: finishDate,
            rating: rating,
            ratingClass: ratingClass,
            notes: notes,
            notesHtml: notesHtml,
            tags: tags,
            tagsString: tagsString
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
                rating: rating(),
                notes: notes(),
                tags: tags()
            };
        },

        prepareBook: function() {
            this.book.title(book.title);
            this.book.author(book.author);
            this.book.status(BookShelf.db.getBookStatus(book));
            this.book.startDate(book.startDate);
            this.book.finishDate(book.finishDate);
            this.book.rating(book.rating);
            this.book.notes(book.notes);
            this.book.tags(book.tags);
        },

        viewShowing: function() {
            this.prepareBook();
        },

        viewShown: function() {
            var ratingControl = $("#book-rating").raty({
                starType: "i",
                number: 10,
                score: rating(),
                readOnly: params.readOnly,
                click: function(score) {
                    rating(score);
                }
            });
            rating.subscribe(function(value) {
                ratingControl.raty("score", value);
            });
        }

    };

    return viewModel;

};