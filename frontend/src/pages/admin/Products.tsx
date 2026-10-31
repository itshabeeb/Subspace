
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import type { Product } from "../../services/productService";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Product API error:", err);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Products</h1>
      <p>Products retrieved from the Subspace database.</p>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
              }}
            >
              <h2>{product.name}</h2>

              <p>Category: {product.product_type}</p>

              <h3>₹{Number(product.sales_price).toLocaleString("en-IN")}</h3>

              <p>{product.notes}</p>

              <hr />

              <h4>Variants</h4>

              {product.variants?.length > 0 ? (
                product.variants.map((variant) => (
                  <p key={variant.id}>
                    {variant.brand_name} — Extra ₹
                    {Number(variant.extra_price).toLocaleString("en-IN")}
                  </p>
                ))
              ) : (
                <p>No variants available.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
