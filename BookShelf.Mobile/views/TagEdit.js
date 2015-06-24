BookShelf.TagEdit = function (params) {

    return $.extend(BookShelf.TagForm(params), {

        save: function() {
            BookShelf.db.tags.update(this.getTag());
            BookShelf.app.back();
        }

    });

};