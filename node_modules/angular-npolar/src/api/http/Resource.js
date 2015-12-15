'use strict';
var angular = require('angular');

/**
 * @ngInject
 */
var Resource = function($resource, $location, $routeParams, $cacheFactory, npolarApiConfig, NpolarApiSecurity) {
  let resourceCache = $cacheFactory('resourceCache');
  let bust = function(response) {
    resourceCache.removeAll();
    return response;
  };
  let bustInterceptor = {
    response: bust,
    responseError: bust
  };

  // @return Array of path segments "under" the current request URI
  let pathSegments = function() {
    // Split request URI into parts and remove hostname & appname from array [via the slice(2)]
    let segments = $location.absUrl().split("//")[1].split("?")[0].split("/");
    segments = segments.filter(s => {
      return (s !== '' && s !== 'show');
    });
    return segments.slice(2); // Removes hostname and /base
  };

  // Get href for id [warn:] relative to current application /path/
  // @return href
  this.href = function(id) {
    // Add .json if id contains dots, otherwise the API barfs
    //if ((/[.]/).test(id)) {
    //  id += ".json";
    //}
    let segments = pathSegments().filter(s => s !== 'show');

    // For apps at /something, we just need to link to the id
    if (segments.length === 0) {
      return id.replace(/show\//, '');

      // For /cat app with children like /cat/lynx we need to link to `lynx/${id}`
    } else {
      segments = segments.filter(s => {
        return (s !== 'edit');
      });
      segments = segments.filter(s => {
        return (s !== 'show');
      });
      segments = segments.filter(s => {
        return (s !== id);
      });
      return segments.join("/") + '/' + id;
    }
  };

  this.editHref = function(id) {
    let segments = pathSegments();
    if (segments.length === 0) {
      return `${$routeParams.id}/edit`;
    } else {
      return segments.join('/') + '/edit';
    }

  };

  // Path to new, relative to /base/ defined in index.html
  this.newHref = function() {

    let base = pathSegments().join('/');
    if ('' === base) {
      base = '.';
    }
    return base + '/__new/edit';
  };

  this.base = function(service) {
    return (angular.isString(service.base)) ? service.base : npolarApiConfig.base;
  };

  // NpolarApiResource factory
  // @param service e.g. { path: '/dataset', 'resource': 'Dataset'}
  // @return NpolarApiResource - extended ngResource
  // @todo service.get == null|GET|JSONP
  // @todo make extending ngResource optional
  // @todo Support user-supplied extending
  // @todo Support non-search engine query/array/fetch
  this.resource = function(service) {

    var base = this.base(service);
    var cache = service.cache || resourceCache;

    // Default parameters
    var params = {
      id: null,
      limit: 100,
      format: 'json',
      q: '',
      variant: 'atom'
    };

    //var fields_feed = (angular.isString(service.fields)) ? service.fields : null ;
    var fields_query = (angular.isString(service.fields)) ? service.fields : 'id,title,name,code,titles,links,created,updated';

    //var params_feed = angular.extend({}, params, { fields: fields_feed });
    var params_query = angular.extend({}, params, {
      variant: 'array',
      limit: 1000,
      fields: fields_query
    });

    const TIMEOUT = 20000;

    var resource = $resource(base + service.path + '/:id', {}, {
      feed: {
        method: 'GET',
        params: params,
        headers: {
          Accept: 'application/json, application/vnd.geo+json'
        },
        cache,
        timeout: TIMEOUT
      },
      query: {
        method: 'GET',
        params: params_query,
        isArray: true,
        cache,
        timeout: TIMEOUT
      },
      array: {
        method: 'GET',
        params: params_query,
        isArray: true,
        cache,
        timeout: TIMEOUT
      },
      fetch: {
        method: 'GET',
        params: {},
        headers: {
          Accept: 'application/json'
        },
        cache,
        timeout: TIMEOUT
      },
      remove: {
        method: 'DELETE',
        timeout: TIMEOUT,
        interceptor: bustInterceptor
      },
      delete: {
        method: 'DELETE',
        timeout: TIMEOUT,
        interceptor: bustInterceptor
      },
      update: {
        method: 'PUT',
        params: {
          id: '@id'
        },
        headers: {
          Accept: 'application/json'
        },
        timeout: TIMEOUT,
        interceptor: bustInterceptor
      }
    });

    resource.path = base + service.path;

    resource.href = this.href;
    resource.newHref = this.newHref;
    resource.editHref = this.editHref;

    return resource;

  };
};

module.exports = Resource;
