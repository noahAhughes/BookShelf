BookShelf.TagAdd = function(params) {
        
    return $.extend(BookShelf.TagForm(params), {

        save: function() {
            BookShelf.db.tags.add(this.getTag());
            BookShelf.app.back();
            this.resetTag();
        },

        cancel: function() {
            BookShelf.app.back();
        },

        resetTag: function() {
            this.tag.title("");
        }

    });

};