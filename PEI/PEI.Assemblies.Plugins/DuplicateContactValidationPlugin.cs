using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace PEI.Assemblies.Plugins
{
    public class DuplicateContactValidationPlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {

            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            IOrganizationServiceFactory factory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = factory.CreateOrganizationService(context.UserId);

            if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
            {
                Entity target = (Entity)context.InputParameters["Target"];

                if (target.LogicalName != "contact")
                    return;

                if (!target.Attributes.Contains("emailaddress1"))
                    return;

                string email = target.GetAttributeValue<string>("emailaddress1");

                if (string.IsNullOrWhiteSpace(email))
                    return;
                    
                
                QueryExpression query = new QueryExpression("contact")
                {
                    ColumnSet = new ColumnSet("contactid"),
                    TopCount = 1
                };

                query.Criteria.AddCondition("emailaddress1", ConditionOperator.Equal, email);

                EntityCollection results = service.RetrieveMultiple(query);

                if (results.Entities.Count > 0)
                {
                    throw new InvalidPluginExecutionException("A contact with this email address already exists.");
                }
            }
        }
    }
}