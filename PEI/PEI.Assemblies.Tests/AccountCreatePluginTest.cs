using Microsoft.VisualStudio.TestTools.UnitTesting;
using FakeXrmEasy;
using Microsoft.Xrm.Sdk;
using System.Linq;
using PEI.Assemblies.Plugins;

namespace PEI.Assemblies.Plugins.Tests
{
    [TestClass]
    public class AccountCreatePluginTest
    {
        [TestMethod]
        public void Should_Create_Contact_On_Account_Create()
        {
            // Arrange
            var context = new XrmFakedContext();
            var service = context.GetOrganizationService();

            var account = new Entity("account")
            {
                Id = System.Guid.NewGuid()
            };
            account["name"] = "Test Account";

            var pluginContext = context.GetDefaultPluginContext();
            pluginContext.InputParameters["Target"] = account;
            pluginContext.MessageName = "Create";

            // Act
            context.ExecutePluginWith<AccountCreatePlugin>(pluginContext);

            // Assert
            var contacts = context.CreateQuery("contact").ToList();

            Assert.AreEqual(1, contacts.Count);
            Assert.AreEqual("Default", contacts[0]["firstname"]);
            Assert.AreEqual("Test Account", contacts[0]["lastname"]);
        }

        [TestMethod]
        public void Should_Not_Create_Contact_If_Not_Account()
        {
            // Arrange
            var context = new XrmFakedContext();

            var lead = new Entity("lead")
            {
                Id = System.Guid.NewGuid()
            };

            var pluginContext = context.GetDefaultPluginContext();
            pluginContext.InputParameters["Target"] = lead;
            pluginContext.MessageName = "Create";

            // Act
            context.ExecutePluginWith<AccountCreatePlugin>(pluginContext);

            // Assert
            var contacts = context.CreateQuery("contact").ToList();
            Assert.AreEqual(0, contacts.Count);
        }

        [TestMethod]
        public void Should_Handle_Account_With_No_Name()
        {
            // Arrange
            var context = new XrmFakedContext();

            var account = new Entity("account")
            {
                Id = System.Guid.NewGuid()
            };

            var pluginContext = context.GetDefaultPluginContext();
            pluginContext.InputParameters["Target"] = account;
            pluginContext.MessageName = "Create";

            // Act
            context.ExecutePluginWith<AccountCreatePlugin>(pluginContext);

            // Assert
            var contacts = context.CreateQuery("contact").ToList();

            Assert.AreEqual(1, contacts.Count);
            Assert.AreEqual("Default", contacts[0]["firstname"]);
            Assert.IsTrue(contacts[0].Contains("lastname") == false || contacts[0]["lastname"] == null);
        }
    }
}