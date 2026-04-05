var PEI = PEI || {};
PEI.Contact = PEI.Contact || {};

var formContext = null;

PEI.Contact.onFormLoad = function (executionContext) {
    formContext = executionContext.getFormContext();

    // Register OnChange event for Preferred Method of Contact
    formContext.getAttribute("preferredcontactmethodcode")
        ?.addOnChange(PEI.Contact.setFieldRequirements);

    // Run once on load
    PEI.Contact.setFieldRequirements(executionContext);
};

PEI.Contact.setFieldRequirements = function (executionContext) {
    var formContext = executionContext.getFormContext();

    var preferredMethod = formContext.getAttribute("preferredcontactmethodcode")
        ?.getValue();

    var emailAttr = formContext.getAttribute("emailaddress1");
    var phoneAttr = formContext.getAttribute("telephone1");

    // FIXED: correct variable names + proper casing
    emailAttr?.setRequiredLevel("none");
    phoneAttr?.setRequiredLevel("none");

    // Assuming D365 option values:
    // 2 = Email, 3 = Phone (you used 3, so leaving your logic)
    if (preferredMethod === 2) {
        emailAttr?.setRequiredLevel("required");
    }
    else if (preferredMethod === 3) {
        phoneAttr?.setRequiredLevel("required");
    }
};

PEI.Contact.onSave = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var eventArgs = executionContext.getEventArgs();

    var email = formContext.getAttribute("emailaddress1")?.getValue();
    var phone = formContext.getAttribute("telephone1")?.getValue();

    if (!email && !phone) {
        eventArgs.preventDefault();

        var alertStrings = {
            confirmButtonLabel: "OK",
            text: "Please provide at least an Email Address or Phone Number before saving.",
            title: "Validation Required"
        };

        var alertOptions = {
            height: 120,
            width: 400
        };

        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
    }
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = PEI.Contact;
}