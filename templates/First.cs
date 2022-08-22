using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ManagementApi.Clients
{
    /// <summary>
    /// Contains methods to access the {{&resourcePath}} endpoints.
    /// </summary>
    public partial class {{MakeName resourcePath}}Client : BaseClient
    {
        /// <summary>
        /// Initializes a new instance of <see cref="{{MakeName resourcePath}}Client"/>.
        /// </summary>
        /// <param name="connection"><see cref="IManagementConnection"/> used to make all API calls.</param>
        /// <param name="baseUri"><see cref="Uri"/> of the endpoint to use in making API calls.</param>
        /// <param name="defaultHeaders">Dictionary containing default headers included with every request this client makes.</param>
        public {{MakeName resourcePath}}Client(IManagementConnection connection, Uri baseUri, IDictionary<string, string> defaultHeaders)
            : base(connection, baseUri, defaultHeaders)
        {
        }

        {{#apis}}
        {{#operations}}
        /// <summary>
        /// {{&HtmlEncode summary}}
        /// </summary>
        {{#parameters}}
        /// <param name="{{name}}">{{&HtmlEncode description}}</param>
        {{/parameters}}
        /// <returns>A <see cref="Task"/> representing the asynchronous operation and potential return value.</returns>
        /// <remarks>
        /// Maps to the "{{nickname}}" endpoint
        /// <remarks>
        public Task<{{&PascalCase type}}> {{PascalCase nickname}}Async({{#parameters}}{{&PascalCase type}} {{name}}{{#if @last}}{{else}}, {{/if}}{{/parameters}})
        {
            return Connection.
                SendAsync{{&PascalCase type}}(HttpMethods.{{PascalCase method}},
                BuildUri($"{{&../path}}"{{#if parameters}},
                    new Dictionary<string, string>() { {{#parameters}}
                        { "{{name}}", FormatQueryParam({{name}}) },{{/parameters}}
                    }{{/if}}),
                DefaultHeaders
            );
        }

        {{/operations}}
        {{/apis}}
    }
}
