BookShelf.BookForm = function(params) {

    var book = BookShelf.db.books.get(params.id) || {};

    var title = ko.observable(),
        author = ko.observable(),
        status = ko.observable(),
        startDate = ko.observable(),
        finishDate = ko.observable(),
        progress = ko.observable(),
        rating = ko.observable(),
        notes = ko.observable(),
        tags = ko.observableArray(),
        allTags = ko.observableArray();

    var chooseTagsVisible = ko.observable();

    var showStartDate = ko.computed(function() {
        return status() === BookShelf.db.bookStatus.reading || status() === BookShelf.db.bookStatus.finished;
    });

    var showFinishDate = ko.computed(function() {
        return status() === BookShelf.db.bookStatus.finished;
    });

    var hasNotes = ko.computed(function() {
        return !!notes();
    });

    var notesHtml = ko.computed(function() {
        if(hasNotes()) {
            var converter = new Showdown.converter();
            return converter.makeHtml(notes() || "");
        }
        return "Tap to add notes...";
    });

    var tagsString = ko.computed(function() {
        return BookShelf.db.getTagsString(tags());
    });
    
    var tagListViewModel = BookShelf.TagListView({
        selectionEnabled: true
    });

    var ratings = BookShelf.db.bookRatings;

    var viewModel = {

        statuses: [BookShelf.db.bookStatus.later, BookShelf.db.bookStatus.reading, BookShelf.db.bookStatus.finished],
        tags: allTags,
        ratings: ratings,
        chooseTagsVisible: chooseTagsVisible,

        book: {
            id: book.id,
            title: title,
            author: author,
            status: status,
            progress: progress,
            showStartDate: showStartDate,
            startDate: startDate,
            showFinishDate: showFinishDate,
            finishDate: finishDate,
            rating: rating,
            notes: notes,
            hasNotes: hasNotes,
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
                progress: progress(),
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
            viewModel.refreshAllTags();
            tags($.map(tagListViewModel.selected(), function(tag) {
                return tag.id;
            }));
            chooseTagsVisible(false);
        },

        prepareBook: function() {
            this.book.title(book.title);
            this.book.author(book.author);
            this.book.status(BookShelf.db.getBookStatus(book));
            this.book.progress(book.progress);
            this.book.startDate(book.startDate || new Date());
            this.book.finishDate(book.finishDate || new Date());
            this.book.rating(book.rating);
            this.book.notes(book.notes);
            this.book.tags(book.tags);
        },

        tagsControlInit: function(args) {
            viewModel.tagsControl = args.component;
        },

        fixNativeFocus: function(_, e) {
            e.preventDefault();
        },
        
        viewShowing: function() {
            this.refreshAllTags();
            this.prepareBook();
        },

        viewShown: function() {
            viewModel.tagsControl && viewModel.tagsControl.element()
                .off("dxactive.tagsControlBetterActiveState dxinactive.tagsControlBetterActiveState")
                .on("dxactive.tagsControlBetterActiveState", { timeout: 30 }, function(e) {
                    $(e.currentTarget).addClass("dx-state-active");
                })
                .on("dxinactive.tagsControlBetterActiveState", { timeout: 400 }, function(e) {
                    $(e.currentTarget).removeClass("dx-state-active");
                });
        },

        refreshAllTags: function() {
            allTags(BookShelf.db.tags.getAll());
            viewModel.tagsControl && viewModel.tagsControl.repaint();
        },

        ratingInit: function(args) {
            rating.subscribe(function(ratingId) {
                if(!ratingId)
                    return;

                setTimeout(function() {
                    var ratingObj = BookShelf.db.getBookRating(ratingId);

                    args.element.find(".dx-lookup-field")
                        .empty()
                        .append($("<div class='bsicon-circle book-rating-badge'>").css("color", ratingObj.color))
                        .append($("<div class='rating-choose-field-content'>").text(ratingObj.title));
                });
            });
        }

    };

    return $.extend(viewModel, tagListViewModel);

};