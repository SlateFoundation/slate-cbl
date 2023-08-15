/* eslint-disable no-invalid-this */
/* eslint-disable one-var */
/**
 * plugins/slateapi.js
 *
 */
import axios from "axios";
import { toRef, ref } from "vue";

const props = {
  data: [],
  limit: 0,
  offset: 0,
  total: 0,
  sortBy: null,
  loading: false,
  error: false,
  extraParams: null,
  blankRecord: {},
};

axios.defaults.withCredentials = true;

const methods = {
  load() {
    const me = this;

    return new Promise((resolve, reject) => {
      axios
        .get(me.getRequestUrl(me.path), me.getRequestHeaders())
        .then((response) => {
          if (response.data?.success) {
            me.data = me.transformData(response.data.data);
            me.total = parseInt(response.data.total, 10);
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  create(item) {
    const me = this;

    const payload = me.prepareRecord(item);

    return new Promise((resolve, reject) => {
      axios
        .post(
          me.getRequestUrl(`${me.path}/save`),
          {
            data: [payload],
          },
          me.getRequestHeaders()
        )
        .then((response) => {
          if (response.data?.success) {
            if (response.data.data?.length === 1) {
              me.data.unshift(response.data.data[0]);
              me.total--;
            }
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  update(updates) {
    const me = this,
      payload = me.prepareRecord(updates);

    return new Promise((resolve, reject) => {
      axios
        .post(
          me.getRequestUrl(`${me.path}/save`),
          {
            data: [payload],
          },
          me.getRequestHeaders()
        )
        .then((response) => {
          if (response.data?.success === true) {
            // retrieve the updated record from the response
            if (response.data?.data?.length === 1) {
              const updatedRecord = response.data.data[0];

              // find index of returned record in current data array
              const idx = me.data.findIndex(
                (rec) => rec.ID === updatedRecord.ID
              );

              // update the record in the current data array
              if (idx > -1 && updatedRecord.Class === me.data[idx].Class) {
                me.data[idx] = updatedRecord;
              }
            }
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  destroy(ID) {
    const me = this;

    return new Promise((resolve, reject) => {
      axios
        .post(
          me.getRequestUrl(`${me.path}/destroy`),
          { data: [{ ID }] },
          me.getRequestHeaders()
        )
        .then((response) => {
          if (response.data?.success) {
            me.data = me.data.filter((rec) => rec.ID !== ID);
            me.total--;
          }
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  login(credentials) {
    const me = this;

    credentials["_LOGIN[returnMethod]"] = "POST";

    return new Promise((resolve, reject) => {
      axios
        .post(
          `${me.getResourceUrl("/login")}format=json`,
          new URLSearchParams(credentials),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  transformData(data) {
    return data;
  },
  prepareRecord(record) {
    return record;
  },
  setSortBy: function (sortBy) {
    this.sortBy = sortBy;
  },
  setOffset: function (offset) {
    this.offset = offset;
  },
  setLimit: function (limit) {
    this.limit = limit;
  },
  setExtraParams: function (extraParams) {
    this.extraParams = extraParams;
  },
  findByID: function (id) {
    return this.data.find((item) => item.ID === id);
  },
  getResourceUrl: function (resource) {
    const me = this,
      protocol = me.api.useSSL ? "https://" : "http://",
      host = me.getHost() || null;

    return host ? `${protocol}${host}${resource}?` : `${resource}?`;
  },
  getRequestUrl: function (resource) {
    const me = this,
      url = me.getResourceUrl(resource);

    let query = "";

    // Add includes if provided.
    if (me.includes && me.includes.length > 0) {
      query += `include=${encodeURIComponent(me.includes.join(","))}`;
    }

    // Add limit and offset if limit has been set above 0
    if (me.limit > 0) {
      query += query.length > 0 ? "&" : "";
      query += `limit=${me.limit}&offset=${me.offset}`;
    }

    // Add sort if applicable
    if (me.sortBy) {
      query += query.length > 0 ? "&" : "";
      query += `&sort=${me.sortBy.key}&dir=${me.sortBy.order.toUpperCase()}`;
    }

    // Add any extra parameters
    if (me.extraParams && typeof me.extraParams === "object") {
      Object.keys(me.extraParams).forEach(function (key) {
        query += query.length > 0 ? "&" : "";
        query += `${key}=${me.extraParams[key]}`;
      });
    }

    return url + query;
  },
  getRequestHeaders: function () {
    return {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  },
  getHost() {
    const me = this,
      urlParams = new URLSearchParams(window.location.search);

    // allow API host to be overridden via apiHost param
    let urlMatch;

    if (me.api.host === true) {
      if (
        urlParams.has("apiHost") &&
        (urlMatch = urlParams
          .get("apiHost")
          .match(/(^([a-zA-Z]+):\/\/)?([^/]+).*/))
      ) {
        me.api.host = urlMatch[3];
        me.api.useSSL = urlParams.has("apiSSL")
          ? Boolean(urlParams.get("apiSSL"))
          : urlMatch[2] == "https";
        return urlMatch[3];
      }
      me.api.host = null;
      me.api.useSSL = location.protocol === "https:";
      return null;
    }
    return me.api.host;
  },
  getErrorMessage(res) {
    if (res.name === "AxiosError" && res.message) {
      return res.message;
    }

    if (res.message && res.message.length > 0) {
      return res.message;
    }

    if (res.data?.message && res.data.message.length > 0) {
      return res.data.message;
    }

    if (res.errors) {
      if (typeof res.errors === "string") {
        return res.errors;
      }
      if (Array.isArray(res.errors)) {
        return res.errors.join(", ");
      }
    }

    // Added for potential errors in destroy operation
    if (res.data?.failed && Array.isArray(res.data.failed)) {
      return res.data.failed.map(({ errors }) => errors).join(", ");
    }
    return "An unexpected error has occurred";
  },
};

export const slateApiPlugin = (context) => {
  const store = context.store;

  if (!Object.prototype.hasOwnProperty.call(store, "api")) {
    store.api = {
      host: true,
      useSSL: false,
    };
  }

  // Attach state props to pinia stores' state
  for (const key in props) {
    // guard-for-in: filter results of for...in loop
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      if (!Object.prototype.hasOwnProperty.call(store.$state, key)) {
        store.$state[key] = ref(props[key]);
      }
      store[key] = toRef(store.$state, key);
    }
  }

  // Attach methods to pinia stores
  for (const key in methods) {
    // guard-for-in: filter results of for...in loop
    if (Object.prototype.hasOwnProperty.call(methods, key)) {
      if (!Object.prototype.hasOwnProperty.call(store, key)) {
        store[key] = methods[key];
      }
    }
  }
};
