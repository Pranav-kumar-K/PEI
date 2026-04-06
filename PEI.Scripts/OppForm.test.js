const { XrmMockGenerator } = require("xrm-mock");
const Opportunity = require("./OppForm");

describe("PEI.Opportunity Tests", () => {

    beforeEach(() => {
        XrmMockGenerator.initialise();
    });

    test("should disable pei_estimatedrevenue for Fixed Price", () => {

        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920000);
        XrmMockGenerator.Attribute.createNumber("pei_estimatedrevenue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        Opportunity.handleOpportunityType(executionContext);

        const control = formContext.getControl("pei_estimatedrevenue");
        expect(control.getDisabled()).toBe(true);
    });

    test("should enable pei_estimatedrevenue for Variable Price", () => {

        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920001);
        XrmMockGenerator.Attribute.createNumber("pei_estimatedrevenue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        Opportunity.handleOpportunityType(executionContext);

        const control = formContext.getControl("pei_estimatedrevenue");
        expect(control.getDisabled()).toBe(false);
    });

    test("should not fail if pei_estimatedrevenue control is null", () => {

        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920000);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        expect(() => {
            Opportunity.handleOpportunityType(executionContext);
        }).not.toThrow();
    });

    test("should calculate revenue correctly for variable price", () => {
       
        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920001);
        XrmMockGenerator.Attribute.createNumber("pei_totalunits", 10);
        XrmMockGenerator.Attribute.createNumber("pei_unitprice", 100);
        XrmMockGenerator.Attribute.createNumber("pei_discount", 50);
        XrmMockGenerator.Attribute.createNumber("pei_estimatedrevenue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        Opportunity.calculateRevenue(executionContext);

        const value = formContext.getAttribute("pei_estimatedrevenue").getValue();
        expect(value).toBe(950);
    });

    test("should not calculate revenue for fixed price", () => {
       
        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920000);
        XrmMockGenerator.Attribute.createNumber("pei_estimatedrevenue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        Opportunity.calculateRevenue(executionContext);

        const value = formContext.getAttribute("pei_estimatedrevenue").getValue();
        expect(value).toBe(0);
    });

    test("should handle null values safely", () => {
    
        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920001);
        XrmMockGenerator.Attribute.createNumber("pei_totalunits", null);
        XrmMockGenerator.Attribute.createNumber("pei_unitprice", null);
        XrmMockGenerator.Attribute.createNumber("pei_discount", null);
        XrmMockGenerator.Attribute.createNumber("pei_estimatedrevenue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        Opportunity.calculateRevenue(executionContext);

        const value = formContext.getAttribute("pei_estimatedrevenue").getValue();
        expect(value).toBe(0);
    });

    test("should set submit mode to always after calculation", () => {
        
        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920001);
        XrmMockGenerator.Attribute.createNumber("pei_totalunits", 5);
        XrmMockGenerator.Attribute.createNumber("pei_unitprice", 100);
        XrmMockGenerator.Attribute.createNumber("pei_discount", 0);
        XrmMockGenerator.Attribute.createNumber("pei_estimatedrevenue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        Opportunity.calculateRevenue(executionContext);

        const attr = formContext.getAttribute("pei_estimatedrevenue");
        expect(attr.getSubmitMode()).toBe("always");
    });

   
    test("onFormLoad should execute without errors", () => {
      
        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920000);
        XrmMockGenerator.Attribute.createNumber("pei_totalunits", 0);
        XrmMockGenerator.Attribute.createNumber("pei_unitprice", 0);
        XrmMockGenerator.Attribute.createNumber("pei_discount", 0);
        XrmMockGenerator.Attribute.createNumber("pei_estimatedrevenue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        expect(() => {
            Opportunity.onFormLoad(executionContext);
        }).not.toThrow();
    });

    test("onFormLoad should call handleOpportunityType", () => {
      
        XrmMockGenerator.Attribute.createOptionSet("pei_opportunitytype", 890920000);
        XrmMockGenerator.Attribute.createNumber("pei_estimatedrevenue", 0);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        const spy = jest.spyOn(Opportunity, "handleOpportunityType");

        Opportunity.onFormLoad(executionContext);

        expect(spy).toHaveBeenCalled();

        spy.mockRestore();
    });

});