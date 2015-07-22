
(function() {

    var requestCovers = function(query) {
        var d = $.Deferred();

        $.ajax({
            type: "GET",
            url: "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&rsz=8&q=" + encodeURIComponent(query),
            dataType: "jsonp"
        }).done(function(result) {
            result = result.responseData;

            if(!result || !result.results || !result.results.length)
                return d.resolve([]);
                
            d.resolve(result.results);

        }).fail(function() {
            d.resolve([]);
        });

        return d.promise();
    };

    var loadImage = function(imageUrl) {
        var d = $.Deferred();

        var image = new Image();
        image.src = imageUrl;

        if(image.complete) {
            d.resolve();
        } else {
            image.onload = function() { d.resolve(); };
            image.onerror = function() { d.reject(); };
        }
        
        return d.promise();
    };
    

    var loadCover = function(query) {
        var d = $.Deferred();

        requestCovers(query).done(function(images) {

            var loadSingleCover = function() {
                var image = images.shift();

                if(!image)
                    return;
                
                var imageLoadedHandler = function() {
                    d.resolve({
                        key: query,
                        url: image.url,
                        ratio: image.height / (image.width || 1)
                    });
                };

                loadImage(image.url)
                    .done(imageLoadedHandler)
                    .fail(loadSingleCover);
            };

            loadSingleCover();
        });

        return d.promise();
    };

    var loadCovers = function(query) {
        var d = $.Deferred();

        requestCovers(query).done(function(images) {
            $.when.apply($, $.map(images, function(image) {
                var d = $.Deferred();

                loadImage(image.url)
                    .done(function() {
                        d.resolve({
                            key: query,
                            url: image.url,
                            ratio: image.height / (image.width || 1)
                        });
                    })
                    .fail(function() {
                        d.resolve(null);
                    });

                return d.promise();

            })).done(function() {
                var loadedCovers = $.makeArray(arguments);
                d.resolve($.grep(loadedCovers, function(cover) {
                    return cover !== null;
                }));
            });
        });

        return d.promise();
    };

    BookShelf.coverFinder = {
        loadCover: loadCover,
        loadCovers : loadCovers
    };

}());