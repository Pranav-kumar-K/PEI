const { XrmMockGenerator } = require("xrm-mock");
const Contact = require("./ContactForm");

describe("PEI.Opportunity Tests", () => {

    beforeEach(() => {
        XrmMockGenerator.initialise();
    });

    test("should check and set the Field Phonecall field as required onLoad of form if Contact Method is PhoneCall", () => {
        XrmMockGenerator.Attribute.createOptionSet("preferredcontactmethodcode", 3);
        XrmMockGenerator.Attribute.createString("emailaddress1", null);
        XrmMockGenerator.Attribute.createString("telephone1", "9910192948");
        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };
        Contact.onFormLoad(executionContext);
        expect(
            formContext.getAttribute("telephone1").getValue()
        ).not.toBeNull();
        expect(
            formContext.getAttribute("telephone1").getRequiredLevel()
        ).toBe("required");
    });

    test("should check and set the Field EmailAddress field as required onLoad of form if Contact Method is Email", () => {
        XrmMockGenerator.Attribute.createOptionSet("preferredcontactmethodcode", 2);
        XrmMockGenerator.Attribute.createString("emailaddress1", "pranav@gmail.com");
        XrmMockGenerator.Attribute.createString("telephone1", null);
        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };
        Contact.onFormLoad(executionContext);
        expect(
            formContext.getAttribute("emailaddress1").getValue()
        ).not.toBeNull();
        expect(
            formContext.getAttribute("emailaddress1").getRequiredLevel()
        ).toBe("required");
    });

    test("should disable estimatedvalue for Fixed Price (1)", () => {
        XrmMockGenerator.Attribute.createOptionSet("preferredcontactmethodcode", 2);
        XrmMockGenerator.Attribute.createString("emailaddress1", null);
        XrmMockGenerator.Attribute.createString("telephone1", null);
        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };
        Contact.setFieldRequirements(executionContext);
        expect(
            formContext.getAttribute("emailaddress1").getRequiredLevel()
        ).toBe("required");
    });

    test("should set both email and phone as not required when no preferred contact method is selected", () => {
        XrmMockGenerator.Attribute.createOptionSet("preferredcontactmethodcode", null);
        XrmMockGenerator.Attribute.createString("emailaddress1", null);
        XrmMockGenerator.Attribute.createString("telephone1", null);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        Contact.setFieldRequirements(executionContext);

        expect(formContext.getAttribute("emailaddress1").getRequiredLevel()).toBe("none");
        expect(formContext.getAttribute("telephone1").getRequiredLevel()).toBe("none");
    });

    test("should switch requirement from email to phone when preferred method changes", () => {
        XrmMockGenerator.Attribute.createOptionSet("preferredcontactmethodcode", 2);
        XrmMockGenerator.Attribute.createString("emailaddress1", "test@test.com");
        XrmMockGenerator.Attribute.createString("telephone1", null);

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };

        Contact.setFieldRequirements(executionContext);

        formContext.getAttribute("preferredcontactmethodcode").setValue(3);
        Contact.setFieldRequirements(executionContext);

        expect(formContext.getAttribute("emailaddress1").getRequiredLevel()).toBe("none");
        expect(formContext.getAttribute("telephone1").getRequiredLevel()).toBe("required");
    });

    test("should check and set the Field Phonecall field as required onLoad of form if Contact Method is PhoneCall", () => {
        XrmMockGenerator.Attribute.createOptionSet("preferredcontactmethodcode", 3);
        XrmMockGenerator.Attribute.createString("emailaddress1", null);
        XrmMockGenerator.Attribute.createString("telephone1", "9910192948");
        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };
        Contact.onFormLoad(executionContext);
        expect(
            formContext.getAttribute("telephone1").getValue()
        ).not.toBeNull();
        expect(
            formContext.getAttribute("telephone1").getRequiredLevel()
        ).toBe("required");
    });

    test("should switch requirement from phone to email when preferred method changes", () => {
        XrmMockGenerator.Attribute.createOptionSet("preferredcontactmethodcode", 3);
        XrmMockGenerator.Attribute.createString("emailaddress1", null);
        XrmMockGenerator.Attribute.createString("telephone1", "9999999999");

        const formContext = XrmMockGenerator.getFormContext();
        const executionContext = { getFormContext: () => formContext };
        
        Contact.setFieldRequirements(executionContext);

        formContext.getAttribute("preferredcontactmethodcode").setValue(2);
        Contact.setFieldRequirements(executionContext);

        expect(formContext.getAttribute("emailaddress1").getRequiredLevel()).toBe("required");
        expect(formContext.getAttribute("telephone1").getRequiredLevel()).toBe("none");
    });

    test("should prevent save and show alert when both email and phone are empty", () => {

    XrmMockGenerator.Attribute.createString("emailaddress1", null);
    XrmMockGenerator.Attribute.createString("telephone1", null);

    const formContext = XrmMockGenerator.getFormContext();

    const preventDefaultMock = jest.fn();

    const executionContext = {
        getFormContext: () => formContext,
        getEventArgs: () => ({
            preventDefault: preventDefaultMock
        })
    };

    Xrm.Navigation = {
        openAlertDialog: jest.fn()
    };

    Contact.onSave(executionContext);

    expect(preventDefaultMock).toHaveBeenCalled();

    expect(Xrm.Navigation.openAlertDialog).toHaveBeenCalledWith(
        expect.objectContaining({
            text: expect.stringContaining("Please provide at least")
        }),
        expect.any(Object)
    );
    });

    test("should allow save when email is provided and phone is empty", () => {
        XrmMockGenerator.Attribute.createString("emailaddress1", "test@test.com");
        XrmMockGenerator.Attribute.createString("telephone1", null);

        const formContext = XrmMockGenerator.getFormContext();

        const preventDefaultMock = jest.fn();

        const executionContext = {
            getFormContext: () => formContext,
            getEventArgs: () => ({
                preventDefault: preventDefaultMock
            })
        };

        Xrm.Navigation = {
            openAlertDialog: jest.fn()
        };

        Contact.onSave(executionContext);

        expect(preventDefaultMock).not.toHaveBeenCalled();
        expect(Xrm.Navigation.openAlertDialog).not.toHaveBeenCalled();
    });

    test("should allow save when phone is provided and email is empty", () => {
        XrmMockGenerator.Attribute.createString("emailaddress1", null);
        XrmMockGenerator.Attribute.createString("telephone1", "9999999999");

        const formContext = XrmMockGenerator.getFormContext();

        const preventDefaultMock = jest.fn();

        const executionContext = {
            getFormContext: () => formContext,
            getEventArgs: () => ({
                preventDefault: preventDefaultMock
            })
        };

        Xrm.Navigation = {
            openAlertDialog: jest.fn()
        };

        Contact.onSave(executionContext);

        expect(preventDefaultMock).not.toHaveBeenCalled();
        expect(Xrm.Navigation.openAlertDialog).not.toHaveBeenCalled();
    });

    //Edge Cases Pranav - 01-04-2026
    test("should treat empty string as missing value and prevent save", () => {
        XrmMockGenerator.Attribute.createString("emailaddress1", "");
        XrmMockGenerator.Attribute.createString("telephone1", "");

        const formContext = XrmMockGenerator.getFormContext();

        const preventDefaultMock = jest.fn();

        const executionContext = {
            getFormContext: () => formContext,
            getEventArgs: () => ({
                preventDefault: preventDefaultMock
            })
        };

        Xrm.Navigation = {
            openAlertDialog: jest.fn()
        };

        Contact.onSave(executionContext);

        expect(preventDefaultMock).toHaveBeenCalled();
    });

    test("should not throw error if attributes are missing", () => {
        const formContext = XrmMockGenerator.getFormContext();

        const executionContext = { getFormContext: () => formContext };

        expect(() => {
            Contact.setFieldRequirements(executionContext);
        }).not.toThrow();
    });
    //Edge Cases End
});