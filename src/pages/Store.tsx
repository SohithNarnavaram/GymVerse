import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { useToast } from '@/components/ui/Toast';
import { useAppStore } from '@/store/appStore';
import type { Product } from '@/types';

export default function Store() {
  const { showToast } = useToast();
  const { cart, addToCart } = useAppStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  useEffect(() => {
    // Mock products
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Protein Powder',
        description: 'High-quality whey protein for muscle recovery',
        price: 49.99,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=700&q=80',
        category: 'supplements',
        stock: 50,
        inStock: true,
      },
      {
        id: '2',
        name: 'Gym Tank Top',
        description: 'Breathable and comfortable workout top',
        price: 29.99,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80',
        category: 'apparel',
        stock: 30,
        inStock: true,
      },
      {
        id: '3',
        name: 'Resistance Bands Set',
        description: 'Complete set of resistance bands for home workouts',
        price: 39.99,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1521805103424-d8f8430e8933?auto=format&fit=crop&w=700&q=80',
        category: 'equipment',
        stock: 25,
        inStock: true,
      },
      {
        id: '4',
        name: 'Water Bottle',
        description: 'Insulated stainless steel water bottle',
        price: 24.99,
        currency: 'USD',
        imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=700&q=80',
        category: 'accessories',
        stock: 0,
        inStock: false,
      },
    ];
    setProducts(mockProducts);
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showToast({
      variant: 'success',
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
    });
    setIsProductModalOpen(false);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast({
        variant: 'error',
        title: 'Cart is empty',
        description: 'Add some products to your cart first',
      });
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const confirmCheckout = () => {
    showToast({
      variant: 'success',
      title: 'Order placed!',
      description: 'Your order has been confirmed. You\'ll receive a confirmation email shortly.',
    });
    setIsCheckoutModalOpen(false);
  };

  const total = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Store</h1>
          <p className="mt-2 text-gray-300 font-medium">Premium supplements, apparel, and equipment</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-300">Cart</p>
            <p className="text-lg font-bold text-white">
              {cart.length} {cart.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <Button onClick={handleCheckout} disabled={cart.length === 0}>
            Checkout
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card
            key={product.id}
            hover
            className="cursor-pointer bg-[#171717] border border-[#252525]"
            onClick={() => handleProductClick(product)}
          >
            <div className="text-center">
              <ImageWithFallback
                src={product.imageUrl}
                alt={product.name}
                wrapperClassName="mb-4 w-full h-40 rounded-2xl border border-white/10 shadow-lg shadow-black/40"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-black text-primary-400">
                  ${product.price.toFixed(2)}
                </span>
                {!product.inStock && (
                  <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    Out of stock
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Product Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={selectedProduct?.name}
        size="md"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <ImageWithFallback
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              wrapperClassName="w-full h-64 rounded-2xl border border-white/10 shadow-lg shadow-black/40"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-sm text-gray-300 mb-1">Description</p>
              <p className="text-white">{selectedProduct.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-1">Price</p>
              <p className="text-2xl font-black text-primary-400">
                ${selectedProduct.price.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-1">Stock</p>
              <p className="text-white">
                {selectedProduct.inStock ? `${selectedProduct.stock} available` : 'Out of stock'}
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setIsProductModalOpen(false)}
              >
                Close
              </Button>
              <Button
                fullWidth
                onClick={() => handleAddToCart(selectedProduct)}
                disabled={!selectedProduct.inStock}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Checkout Modal */}
      <Modal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        title="Checkout"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-black text-white mb-3 tracking-tight">Order Summary</h3>
            <div className="space-y-2">
              {cart.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                return (
                  <div key={item.productId} className="flex items-center justify-between p-2 bg-gray-900 rounded-lg border border-gray-800">
                    <span className="text-sm text-white">
                      {product.name} × {item.quantity}
                    </span>
                    <span className="text-sm font-bold text-white">
                      ${(product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-t border-gray-800 pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-black text-white">Total</span>
              <span className="text-2xl font-black text-primary-400">${total.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setIsCheckoutModalOpen(false)}
              >
                Cancel
              </Button>
              <Button fullWidth onClick={confirmCheckout}>
                Confirm Order
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

