const { XrmMockGenerator } = require("xrm-mock");
const Opportunity = require("./OppForm");

describe("PEI.Opportunity Tests", () => {

    beforeEach(() => {
        XrmMockGenerator.initialise();
    });

    test("should disable estimatedvalue for Fixed Price", () => {

        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920000);
        XrmMockGenerator.Attribute.createNumber("estimatedvalue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        Opportunity.handleOpportunityType(executionContext);

        const control = formContext.getControl("estimatedvalue");
        expect(control.getDisabled()).toBe(true);
    });

    test("should enable estimatedvalue for Variable Price", () => {

        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920001);
        XrmMockGenerator.Attribute.createNumber("estimatedvalue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        Opportunity.handleOpportunityType(executionContext);

        const control = formContext.getControl("estimatedvalue");
        expect(control.getDisabled()).toBe(false);
    });

    test("should not fail if estimatedvalue control is null", () => {

        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920000);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        expect(() => {
            Opportunity.handleOpportunityType(executionContext);
        }).not.toThrow();
    });

    test("should calculate revenue correctly for variable price", () => {
       
        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920001);
        XrmMockGenerator.Attribute.createNumber("totalunits", 10);
        XrmMockGenerator.Attribute.createNumber("unitprice", 100);
        XrmMockGenerator.Attribute.createNumber("discountamount", 50);
        XrmMockGenerator.Attribute.createNumber("estimatedvalue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        Opportunity.calculateRevenue(executionContext);

        const value = formContext.getAttribute("estimatedvalue").getValue();
        expect(value).toBe(950);
    });

    test("should not calculate revenue for fixed price", () => {
       
        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920000);
        XrmMockGenerator.Attribute.createNumber("estimatedvalue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        Opportunity.calculateRevenue(executionContext);

        const value = formContext.getAttribute("estimatedvalue").getValue();
        expect(value).toBe(0);
    });

    test("should handle null values safely", () => {
    
        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920001);
        XrmMockGenerator.Attribute.createNumber("totalunits", null);
        XrmMockGenerator.Attribute.createNumber("unitprice", null);
        XrmMockGenerator.Attribute.createNumber("discountamount", null);
        XrmMockGenerator.Attribute.createNumber("estimatedvalue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        Opportunity.calculateRevenue(executionContext);

        const value = formContext.getAttribute("estimatedvalue").getValue();
        expect(value).toBe(0);
    });

    test("should set submit mode to always after calculation", () => {
        
        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920001);
        XrmMockGenerator.Attribute.createNumber("totalunits", 5);
        XrmMockGenerator.Attribute.createNumber("unitprice", 100);
        XrmMockGenerator.Attribute.createNumber("discountamount", 0);
        XrmMockGenerator.Attribute.createNumber("estimatedvalue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        Opportunity.calculateRevenue(executionContext);

        const attr = formContext.getAttribute("estimatedvalue");
        expect(attr.getSubmitMode()).toBe("always");
    });

   
    test("onFormLoad should execute without errors", () => {
      
        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920000);
        XrmMockGenerator.Attribute.createNumber("totalunits", 0);
        XrmMockGenerator.Attribute.createNumber("unitprice", 0);
        XrmMockGenerator.Attribute.createNumber("discountamount", 0);
        XrmMockGenerator.Attribute.createNumber("estimatedvalue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        expect(() => {
            Opportunity.onFormLoad(executionContext);
        }).not.toThrow();
    });

    test("onFormLoad should call handleOpportunityType", () => {
      
        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920000);
        XrmMockGenerator.Attribute.createNumber("estimatedvalue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        const spy = jest.spyOn(Opportunity, "handleOpportunityType");

        Opportunity.onFormLoad(executionContext);

        expect(spy).toHaveBeenCalled();

        spy.mockRestore();
    });

});