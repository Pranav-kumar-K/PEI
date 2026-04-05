using System;
using Microsoft.Xrm.Sdk;

namespace PEI.Assemblies.Plugins
{
    public class AccountCreatePlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);
            ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
            {
                Entity account = (Entity)context.InputParameters["Target"];

                if (account.LogicalName != "account")
                    return;

                try
                {
                    string accountName = account.GetAttributeValue<string>("name");

                    Entity contact = new Entity("contact");
                    contact["firstname"] = "Default";
                    contact["lastname"] = accountName;
                    contact["parentcustomerid"] = account.ToEntityReference();

                    service.Create(contact);

                    tracingService.Trace("Child contact created successfully.");
                }
                catch (Exception ex)
                {
                    tracingService.Trace("Error: " + ex.Message);
                    throw;
                }
            }
        }
    }
}