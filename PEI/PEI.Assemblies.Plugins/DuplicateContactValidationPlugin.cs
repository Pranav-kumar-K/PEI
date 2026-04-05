using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace PEI.Assemblies.Plugins
{
    public class DuplicateContactValidationPlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            // Services
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);

            // Check Target
            if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
            {
                Entity target = (Entity)context.InputParameters["Target"];

                if (target.LogicalName != "contact")
                    return;

                // Check if email exists
                if (!target.Attributes.Contains("emailaddress1"))
                    return;

                string email = target.GetAttributeValue<string>("emailaddress1");

                if (string.IsNullOrWhiteSpace(email))
                    return;
                    
                // Query for duplicate
                QueryExpression query = new QueryExpression("contact")
                {
                    ColumnSet = new ColumnSet("contactid"),
                    TopCount = 1
                };

                query.Criteria.AddCondition("emailaddress1", ConditionOperator.Equal, email);

                // Ignore current record in Update
                if (context.MessageName == "Update")
                {
                    query.Criteria.AddCondition("contactid", ConditionOperator.NotEqual, context.PrimaryEntityId);
                }

                EntityCollection results = service.RetrieveMultiple(query);

                if (results.Entities.Count > 0)
                {
                    throw new InvalidPluginExecutionException("A contact with this email address already exists.");
                }
            }
        }
    }
}