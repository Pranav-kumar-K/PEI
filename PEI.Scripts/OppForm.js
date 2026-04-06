var PEI = PEI || {};
PEI.Opportunity = PEI.Opportunity || {};

PEI.Opportunity.onFormLoad = function (executionContext) {
    var formContext = executionContext.getFormContext();

    formContext.getAttribute("pei_opportunitytype")
        ?.addOnChange(PEI.Opportunity.handleOpportunityType);

    formContext.getAttribute("pei_totalunits")
        ?.addOnChange(PEI.Opportunity.calculateRevenue);

    formContext.getAttribute("pei_unitprice")
        ?.addOnChange(PEI.Opportunity.calculateRevenue);

    formContext.getAttribute("pei_discount")
        ?.addOnChange(PEI.Opportunity.calculateRevenue);

    PEI.Opportunity.handleOpportunityType(executionContext);
};

PEI.Opportunity.handleOpportunityType = function (executionContext) {
    var formContext = executionContext.getFormContext();
    var oppType = formContext.getAttribute("pei_opportunitytype")?.getValue();
    var estRevenueCtrl = formContext.getControl("pei_estimatedrevenue");

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

    if (oppType !== 890920001) return;

    var units = formContext.getAttribute("pei_totalunits")?.getValue() || 0;
    var price = formContext.getAttribute("pei_unitprice")?.getValue() || 0;
    var discount = formContext.getAttribute("pei_discount")?.getValue() || 0;

    var calculatedValue = (units * price) * (discount*0.01);

    formContext.getAttribute("pei_estimatedrevenue")?.setValue(calculatedValue);
    formContext.getAttribute("pei_estimatedrevenue")?.setSubmitMode("always");
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = PEI.Opportunity;
}