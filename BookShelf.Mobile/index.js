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
        if(cordova && cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
            StatusBar.backgroundColorByHexString("#60433d");
        }
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
    

    var needExport = ko.observable(BookShelf.db.needExport);
    BookShelf.db.onNeedExportChanged.add(function(value) {
        needExport(value);
    });
    

    BookShelf.app = new DevExpress.framework.html.HtmlApplication({
        namespace: BookShelf,
        layoutSet: DevExpress.framework.html.layoutSets[BookShelf.config.layoutSet],
        animationSet: DevExpress.framework.html.animationSets['native'],
        navigation: BookShelf.config.navigation,
        commandMapping: BookShelf.config.commandMapping,
        useViewTitleAsBackText: true
    });

    BookShelf.app.needExport = needExport;

    var hideSplashscreen = function() {
        if(navigator.splashscreen) {
            navigator.splashscreen.hide();
        }
        BookShelf.app.off(hideSplashscreen);
    };
    BookShelf.app.on("viewShown", hideSplashscreen);

    $(window).unload(function() {
        BookShelf.app.saveState();
    });

    DevExpress.ui.dxScrollView.defaultOptions({ options: { pushBackValue: 0 } });
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