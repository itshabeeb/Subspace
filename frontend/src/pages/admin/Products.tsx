
import { useEffect, useState } from "react";
import api from "../../services/api";

interface ProductVariant {
  id: number;
  brand_name: string;
  extra_price: string;
}

interface Product {
  id: number;
  name: string;
  product_type: string;
  sales_price: string;
  cost_price: string;
  notes: string;
  variants: ProductVariant[];
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("products/");

        const data = response.data;

        setProducts(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error("Products API error:", err);
        setError("Unable to load products. Please check the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div style={{ padding: 30 }}>Loading products...</div>;
  }

  if (error) {
    return <div style={{ padding: 30, color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: 30, color: "#ffffff" }}>
      <h1>Products</h1>

      <p style={{ color: "#9ca3af" }}>
        Manage products available in Subspace.
      </p>

      <h3>Total products: {products.length}</h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: 20,
        marginTop: 25
      }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              background: "#151827",
              border: "1px solid #303449",
              borderRadius: 12,
              padding: 20
            }}
          >
            <h2>{product.name}</h2>

            <p style={{ color: "#a5a9bd" }}>
              {product.product_type}
            </p>

            <p>
              Sales price: ₹{product.sales_price}
            </p>

            <p>
              Cost price: ₹{product.cost_price}
            </p>

            <p style={{ color: "#a5a9bd" }}>
              {product.notes}
            </p>

            <p>
              Variants: {product.variants?.length || 0}
            </p>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p>No products found.</p>
      )}
    </div>
  );
}
