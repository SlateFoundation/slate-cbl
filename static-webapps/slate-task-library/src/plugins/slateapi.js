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

const methods = {
  async fetch() {
    const me = this;

    me.loading = true;

    await axios
      .get(me.getRequestUrl(me.path), me.getRequestHeaders())
      .then(({ data: res }) => {
        me.data = me.transformData(res.data);
        me.total = res.total;
        me.loading = false;
      })
      .catch((error) => {
        console.log(error);

        me.loading = false;
        return error;
      });
  },
  async create(item) {
    const me = this,
      payload = Object.assign(me.blankRecord, item);

    me.loading = true;

    await axios
      .post(
        me.getRequestUrl(`${me.path}/save`),
        {
          data: [payload],
        },
        me.getRequestHeaders()
      )
      .then(({ data: res }) => {
        me.loading = false;
        me.data.unshift(res.data[0]);
        return { success: res.success, data: res.data };
      })
      .catch((error) => {
        console.log(error);
        me.loading = false;
        return error;
      });
  },
  async update(payload) {
    const me = this;

    me.loading = true;

    await axios
      .post(
        me.getRequestUrl(`${me.path}/save`),
        {
          data: [payload],
        },
        me.getRequestHeaders()
      )
      .then(({ data: res }) => {
        me.loading = false;
        const record = me.data.filter((item) => item.ID === res.data[0].ID)[0];

        Object.assign(record, res.data[0]);
        return { success: res.success, data: res.data };
      })
      .catch((error) => {
        console.log(error);
        me.loading = false;
        return error;
      });
  },
  async destroy(itemID) {
    const me = this;

    me.loading = true;

    await axios
      .post(
        me.getRequestUrl(`${me.path}/destroy`),
        { data: [{ ID: itemID }] },
        me.getRequestHeaders()
      )
      .then(({ data: res }) => {
        me.loading = false;
        me.data = me.data.filter((rec) => rec.ID !== itemID);
        return { success: res.success };
      })
      .catch((error) => {
        console.log(error);
        me.loading = false;
        return error;
      });
  },
  transformData(data) {
    return data;
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
  getRequestUrl: function (resource) {
    const me = this,
      protocol = me.api.useSSL ? "https://" : "http://",
      host = me.getHost() || "",
      url = `${protocol}${host}${resource}?`;

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
