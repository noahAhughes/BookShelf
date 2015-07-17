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

            this._focusTimer = setTimeout(function() {
                $(".notes-area").dxTextArea("focus");
            }, 400);
        },

        viewHiding: function() {
            clearTimeout(this._focusTimer);
        }

    });

};