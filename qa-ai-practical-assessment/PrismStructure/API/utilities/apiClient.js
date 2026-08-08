const API_BASE =
  process.env.API_BASE_URL || "https://api.practicesoftwaretesting.com";

class ApiClient {
  constructor(request) {
    this.request = request;
    this.token = null;
  }

  authHeaders() {
    const headers = { Accept: "application/json", "Content-Type": "application/json" };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    return headers;
  }

  async register(user) {
    return this.request.post(`${API_BASE}/users/register`, {
      data: user,
      headers: this.authHeaders(),
    });
  }

  async login(email, password) {
    const response = await this.request.post(`${API_BASE}/users/login`, {
      data: { email, password },
      headers: this.authHeaders(),
    });
    if (response.ok()) {
      const body = await response.json();
      this.token = body.access_token;
    }
    return response;
  }

  async createCart() {
    return this.request.post(`${API_BASE}/carts`, {
      headers: this.authHeaders(),
    });
  }

  async getProducts(page = 1) {
    return this.request.get(`${API_BASE}/products?page=${page}`, {
      headers: this.authHeaders(),
    });
  }

  async addToCart(cartId, productId, quantity = 1) {
    return this.request.post(`${API_BASE}/carts/${cartId}`, {
      data: { product_id: productId, quantity },
      headers: this.authHeaders(),
    });
  }

  async getCart(cartId) {
    return this.request.get(`${API_BASE}/carts/${cartId}`, {
      headers: this.authHeaders(),
    });
  }

  async createInvoice(payload) {
    return this.request.post(`${API_BASE}/invoices`, {
      data: payload,
      headers: this.authHeaders(),
    });
  }

  async listInvoices(page = 1) {
    return this.request.get(`${API_BASE}/invoices?page=${page}`, {
      headers: this.authHeaders(),
    });
  }

  async firstInStockProduct() {
    const response = await this.getProducts(1);
    const body = await response.json();
    const product = (body.data || []).find((p) => p.in_stock) || body.data?.[0];
    return product;
  }
}

module.exports = { ApiClient, API_BASE };
