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

    var chooseTagsVisible = ko.observable();

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
        return BookShelf.db.getTagsString(tags());
    });
    
    var tagListViewModel = BookShelf.TagListView({
        select: true
    });
    
    var ratings = $.map(BookShelf.db.bookRatings, function(title, value) {
        return { value: value, title: title };
    }).sort(function(r1, r2) {
        return r2.value - r1.value;
    });

    var viewModel = {

        statuses: [BookShelf.db.bookStatus.later, BookShelf.db.bookStatus.reading, BookShelf.db.bookStatus.finished],
        tags: BookShelf.db.tags.getAll(),
        ratings: ratings,
        chooseTagsVisible: chooseTagsVisible,

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

        chooseTags: function() {
            tagListViewModel.selected($.map(tags(), function(tagId) {
                return BookShelf.db.tags.get(tagId);
            }));
            chooseTagsVisible(true);
        },

        cancelChooseTags: function() {
            chooseTagsVisible(false);
        },

        doneChooseTags: function() {
            tags($.map(tagListViewModel.selected(), function(tag) {
                return tag.id;
            }));
            chooseTagsVisible(false);
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

        fixNativeFocus: function(_, e) {
            e.preventDefault();
        },

        viewShowing: function() {
            this.prepareBook();
        },

        viewShown: function() {
            $(".tags-choose-control")
                .off("dxactive.tagsControlBetterActiveState dxinactive.tagsControlBetterActiveState")
                .on("dxactive.tagsControlBetterActiveState", { timeout: 30 }, function(e) {
                    $(e.currentTarget).addClass("dx-state-active");
                })
                .on("dxinactive.tagsControlBetterActiveState", { timeout: 400 }, function(e) {
                    $(e.currentTarget).removeClass("dx-state-active");
                });
        }

    };

    var tagListViewModel = BookShelf.TagListView({
        selectionEnabled: true
    });

    return $.extend(viewModel, tagListViewModel);

};