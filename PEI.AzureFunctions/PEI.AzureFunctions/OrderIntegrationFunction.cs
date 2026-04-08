using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace PEI.AzureFunctions
{
    public class OrderIntegrationFunction
    {
        private readonly ILogger _logger;
        private static readonly HttpClient _httpClient = new();

        public OrderIntegrationFunction(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<OrderIntegrationFunction>();
        }

        [Function("OrderIntegrationFunction")]
        public async Task<HttpResponseData> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
        {
            _logger.LogInformation("Function triggered");

            string body;
            using (var reader = new StreamReader(req.Body))
            {
                body = await reader.ReadToEndAsync();
            }

            JObject json = JObject.Parse(body);
            var attributes = json["InputParameters"]?[0]?["value"]?["Attributes"] as JArray;

            string orderName = attributes?
                .FirstOrDefault(a => (string)a["key"] == "name")?["value"]?.ToString();

            string totalAmountStr = attributes?
                .FirstOrDefault(a => (string)a["key"] == "totalamount")?["value"]?["Value"]?.ToString();
            decimal orderTotal = 0m;
            decimal.TryParse(totalAmountStr, out orderTotal);

            _logger.LogInformation($"ORDER RECEIVED : Name={orderName}, Total={orderTotal}");

            var payload = new
            {
                OrderName = orderName,
                OrderTotal = orderTotal
            };

            string jsonPayload = JsonConvert.SerializeObject(payload);
            string mockApiUrl = "https://webhook.site/efa732e6-0f96-4f0f-92ec-277b9f4d94f2";

            try
            {
                using var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(mockApiUrl, content);
                if (response.IsSuccessStatusCode)
                    _logger.LogInformation("Sent successfully to external API!");
                else
                    _logger.LogError($"API error. Status={response.StatusCode}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Exception calling external API: {ex.Message}");
            }

            var res = req.CreateResponse(HttpStatusCode.OK);
            res.WriteStringAsync("Processed");
            return res;
        }
    }
}
