using Microsoft.VisualStudio.TestTools.UnitTesting;
using FakeXrmEasy;
using Microsoft.Xrm.Sdk;
using System;
using PEI.Assemblies.Plugins;

namespace PEI.Assemblies.Plugins.Tests
{
    [TestClass]
    public class DuplicateContactValidationPluginTest
    {
        [TestMethod]
        public void Should_Throw_Error_When_Duplicate_Email_Exists()
        {
            // Arrange
            var context = new XrmFakedContext();

            var existingContact = new Entity("contact")
            {
                Id = Guid.NewGuid()
            };
            existingContact["emailaddress1"] = "test@mail.com";

            context.Initialize(new[] { existingContact });

            var newContact = new Entity("contact");
            newContact["emailaddress1"] = "test@mail.com";

            var pluginContext = context.GetDefaultPluginContext();
            pluginContext.InputParameters["Target"] = newContact;
            pluginContext.MessageName = "Create";

            // Act & Assert
            Assert.ThrowsException<InvalidPluginExecutionException>(() =>
                context.ExecutePluginWith<DuplicateContactValidationPlugin>(pluginContext)
            );
        }

        [TestMethod]
        public void Should_Allow_When_Email_Is_Unique()
        {
            // Arrange
            var context = new XrmFakedContext();

            var contact = new Entity("contact");
            contact["emailaddress1"] = "unique@mail.com";

            var pluginContext = context.GetDefaultPluginContext();
            pluginContext.InputParameters["Target"] = contact;
            pluginContext.MessageName = "Create";

            // Act
            context.ExecutePluginWith<DuplicateContactValidationPlugin>(pluginContext);

            // Assert
            Assert.IsTrue(true); // No exception = success
        }

        [TestMethod]
        public void Should_Skip_When_Email_Is_Empty()
        {
            // Arrange
            var context = new XrmFakedContext();

            var contact = new Entity("contact");

            var pluginContext = context.GetDefaultPluginContext();
            pluginContext.InputParameters["Target"] = contact;
            pluginContext.MessageName = "Create";

            // Act
            context.ExecutePluginWith<DuplicateContactValidationPlugin>(pluginContext);

            // Assert
            Assert.IsTrue(true); // Plugin should not fail
        }
    }
}