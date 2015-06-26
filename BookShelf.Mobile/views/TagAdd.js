BookShelf.TagAdd = function(params) {
        
    return $.extend(BookShelf.TagForm(params), {

        save: function() {
            BookShelf.db.tags.add(this.getTag());
            BookShelf.app.back();
        },

        cancel: function() {
            BookShelf.app.back();
        },

        resetTag: function() {
            this.tag.title("");
        },

        viewShowing: function() {
            this.resetTag();
        }

    });

};