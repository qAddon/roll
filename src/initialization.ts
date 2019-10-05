import { QRoll } from "./QRoll";

const eventFrame = CreateFrame("Frame");
eventFrame.RegisterEvent("ADDON_LOADED");
eventFrame.SetScript("OnEvent", (_, event, addonName) => {

    // correct addon loaded?
    if (addonName === "qRoll") {

        // clear events
        eventFrame.UnregisterAllEvents();

        // clear scripts
        eventFrame.SetScript("OnEvent", null);

        // start addon logic
        new QRoll(eventFrame);
    }
});
