$(function() {

    DevExpress.devices.current({ platform: "ios", version: [7], deviceType: "phone" });

    var activateHairlines = function() {
        if(window.devicePixelRatio && devicePixelRatio < 2)
            return;
        var $tester = $("<div>");
        $tester.css("border", ".5px solid transparent");
        $("body").append($tester);
        if($tester.outerHeight() == 1) {
            $("html").addClass("hairlines");
        }
        $tester.remove();
    };
    activateHairlines();

    if(DevExpress.devices.real().platform === "win8") {
        $("body").css("background-color", "#000");
    }

    $(document).on("deviceready", function() {
        navigator.splashscreen.hide();
        if(window.devextremeaddon) {
            window.devextremeaddon.setup();
        }
        $(document).on("backbutton", function() {
            DevExpress.processHardwareBackButton();
        });
    });

    function onNavigatingBack(e) {
        if(e.isHardwareButton && !BookShelf.app.canBack()) {
            e.cancel = true;
            exitApp();
        }
    }

    function exitApp() {
        switch(DevExpress.devices.real().platform) {
            case "android":
                navigator.app.exitApp();
                break;
            case "win8":
                window.external.Notify("DevExpress.ExitApp");
                break;
        }
    }

    var updateReadingCount = function() {
        readingCount(BookShelf.db.books.getReadingCount());
    };

    var readingCount = ko.observable();
    updateReadingCount();
    BookShelf.db.books.onAdd.add(updateReadingCount);
    BookShelf.db.books.onUpdate.add(updateReadingCount);
    BookShelf.db.books.onRemove.add(updateReadingCount);

    BookShelf.app = new DevExpress.framework.html.HtmlApplication({
        namespace: BookShelf,
        layoutSet: DevExpress.framework.html.layoutSets[BookShelf.config.layoutSet],
        animationSet: DevExpress.framework.html.animationSets['native'],
        navigation: BookShelf.config.navigation,
        commandMapping: BookShelf.config.commandMapping,
        useViewTitleAsBackText: true
    });

    $(window).unload(function() {
        BookShelf.app.saveState();
    });

    DevExpress.framework.dxCommand.defaultOptions({ options: { renderStage: "onViewRendering" } });

    var startupView = "LaterList";
    BookShelf.app.router.register(":view/:id", { view: startupView, id: undefined });
    BookShelf.app.on("navigatingBack", onNavigatingBack);
    BookShelf.app.navigate();
    

    BookShelf.app.backToList = function(bookStatus) {
        BookShelf.app.navigate({
            view: (bookStatus === BookShelf.db.bookStatus.finished) ? "FinishedList" : "LaterList"
        }, {
            root: true,
            direction: "backward"
        });
    };

    BookShelf.app.bookListShowing = $.Callbacks();
    
});