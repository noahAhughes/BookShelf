BookShelf.BookNotes = function (params) {

    return $.extend(BookShelf.BookForm(params), {

        setNotesPlaceholder: function(args) {
            setTimeout(function() {
                args.element.find(".dx-placeholder")
                    .attr({
                        "data-firstline": "Add your notes here...",
                        "data-secondline": "Markdown syntax supported"
                    });
            });
        },

        save: function() {
            BookShelf.db.books.update(this.getBook());
            BookShelf.app.back();
        },

        viewShown: function() {
            $(".notes-area textarea").on("dxpointermove", function(e) {
                e.isScrollingEvent = true;
            });

            $(".notes-area").dxTextArea("focus");
        }

    });

};