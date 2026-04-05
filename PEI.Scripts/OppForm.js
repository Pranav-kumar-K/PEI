var PEI = PEI || {};
PEI.Opportunity = PEI.Opportunity || {};

PEI.Opportunity.onFormLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();

    // Register onchange events
    formContext.getAttribute("pei_opportunitytype")
        ?.addOnChange(PEI.Opportunity.handleOpportunityType);

    formContext.getAttribute("totalunits")
        ?.addOnChange(PEI.Opportunity.calculateRevenue);

    formContext.getAttribute("unitprice")
        ?.addOnChange(PEI.Opportunity.calculateRevenue);

    formContext.getAttribute("discountamount")
        ?.addOnChange(PEI.Opportunity.calculateRevenue);

    // Run logic on load as well
    PEI.Opportunity.handleOpportunityType(executionContext);
};

PEI.Opportunity.handleOpportunityType = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var oppType = formContext.getAttribute("pei_opportunitytype")?.getValue();
    var estRevenueCtrl = formContext.getControl("estimatedvalue");

    if (!estRevenueCtrl) return;


    if (oppType === 890920000) {
        estRevenueCtrl.setDisabled(true);
    }
    else if (oppType === 890920001) {
        estRevenueCtrl.setDisabled(false);
        PEI.Opportunity.calculateRevenue(executionContext);
    }
    else {
        estRevenueCtrl.setDisabled(false);
    }
};

PEI.Opportunity.calculateRevenue = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var oppType = formContext.getAttribute("pei_opportunitytype")?.getValue();

    // Only calculate for variable price
    if (oppType !== 890920001) return;

    var units = formContext.getAttribute("totalunits")?.getValue() || 0;
    var price = formContext.getAttribute("unitprice")?.getValue() || 0;
    var discount = formContext.getAttribute("discountamount")?.getValue() || 0;

    var calculatedValue = (units * price) - discount;

    formContext.getAttribute("estimatedvalue")?.setValue(calculatedValue);
    formContext.getAttribute("estimatedvalue")?.setSubmitMode("always");
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = PEI.Opportunity;
}