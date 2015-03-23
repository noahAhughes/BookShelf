
$(function() {
    DevExpress.devices.current({ platform: "ios", version: [7] });

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
            case "tizen":
                tizen.application.getCurrentApplication().exit();
                break;
            case "android":
                navigator.app.exitApp();
                break;
            case "win8":
                window.external.Notify("DevExpress.ExitApp");
                break;
        }
    }

    BookShelf.app = new DevExpress.framework.html.HtmlApplication({
        namespace: BookShelf,
        layoutSet: DevExpress.framework.html.layoutSets[BookShelf.config.layoutSet],
        navigation: BookShelf.config.navigation,
        commandMapping: BookShelf.config.commandMapping
    });

    $(window).unload(function() {
        //BookShelf.app.saveState();
    });

    var startupView = "ReadingList";
    BookShelf.app.router.register(":view/:id", { view: startupView, id: undefined });
    BookShelf.app.on("navigatingBack", onNavigatingBack);
    BookShelf.app.navigate();
});