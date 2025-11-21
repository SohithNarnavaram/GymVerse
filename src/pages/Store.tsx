import { useState, useEffect } from 'react';
import { TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { useToast } from '@/components/ui/Toast';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import type { Product } from '@/types';

const PRODUCT_CATEGORIES = ['supplements', 'apparel', 'equipment', 'accessories'];

export default function Store() {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const { cart, addToCart } = useAppStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  
  // Admin modals
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: '',
  });

  useEffect(() => {
    // Mock products
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Protein Powder',
        description: 'High-quality whey protein for muscle recovery',
        price: 2999,
        currency: 'INR',
        imageUrl: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=700&q=80',
        category: 'supplements',
        stock: 50,
        inStock: true,
      },
      {
        id: '2',
        name: 'Gym Tank Top',
        description: 'Breathable and comfortable workout top',
        price: 1999,
        currency: 'INR',
        imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80',
        category: 'apparel',
        stock: 30,
        inStock: true,
      },
      {
        id: '3',
        name: 'Resistance Bands Set',
        description: 'Complete set of resistance bands for home workouts',
        price: 2499,
        currency: 'INR',
        imageUrl: 'https://images.unsplash.com/photo-1521805103424-d8f8430e8933?auto=format&fit=crop&w=700&q=80',
        category: 'equipment',
        stock: 25,
        inStock: true,
      },
      {
        id: '4',
        name: 'Water Bottle',
        description: 'Insulated stainless steel water bottle',
        price: 1499,
        currency: 'INR',
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

  // Admin handlers
  const handleCreateProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: productFormData.name,
      description: productFormData.description,
      price: parseFloat(productFormData.price),
      currency: 'INR',
      category: productFormData.category as Product['category'],
      stock: parseInt(productFormData.stock) || 0,
      inStock: parseInt(productFormData.stock) > 0,
      imageUrl: productFormData.imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80',
    };

    setProducts([...products, newProduct]);
    setIsCreateProductModalOpen(false);
    setProductFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      imageUrl: '',
    });
    showToast({
      variant: 'success',
      title: 'Product added',
      description: `${newProduct.name} has been added successfully`,
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || '',
    });
    setIsEditProductModalOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      name: productFormData.name,
      description: productFormData.description,
      price: parseFloat(productFormData.price),
      category: productFormData.category as Product['category'],
      stock: parseInt(productFormData.stock) || 0,
      inStock: parseInt(productFormData.stock) > 0,
      imageUrl: productFormData.imageUrl || editingProduct.imageUrl,
    };

    setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setIsEditProductModalOpen(false);
    setEditingProduct(null);
    setProductFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      imageUrl: '',
    });
    showToast({
      variant: 'success',
      title: 'Product updated',
      description: 'Product information has been updated',
    });
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setDeletingProduct(product);
      setIsDeleteProductModalOpen(true);
    }
  };

  const confirmDeleteProduct = () => {
    if (!deletingProduct) return;
    const productName = deletingProduct.name;
    setProducts(products.filter(p => p.id !== deletingProduct.id));
    setIsDeleteProductModalOpen(false);
    setDeletingProduct(null);
    showToast({
      variant: 'success',
      title: 'Product deleted',
      description: `${productName} has been removed`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Store</h1>
          <p className="mt-2 text-gray-300 font-medium">
            {isAdmin ? 'Manage products and inventory' : 'Premium supplements, apparel, and equipment'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button
              onClick={() => setIsCreateProductModalOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Add Product
            </Button>
          )}
          {!isAdmin && (
            <>
              <div className="text-right">
                <p className="text-sm text-gray-300">Cart</p>
                <p className="text-lg font-bold text-white">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </p>
              </div>
              <Button onClick={handleCheckout} disabled={cart.length === 0}>
                Checkout
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
              <Card
            key={product.id}
                hover={!isAdmin}
                className={`${!isAdmin ? 'cursor-pointer' : ''} bg-[#0a0a0a] border border-[#252525] relative`}
            onClick={!isAdmin ? () => handleProductClick(product) : undefined}
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
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-black text-primary-400">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {!product.inStock && (
                  <span className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    Out of stock
                  </span>
                )}
                {isAdmin && product.inStock && (
                  <span className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {product.stock} in stock
                  </span>
                )}
              </div>
              
              {/* Admin controls at bottom center */}
              {isAdmin && (
                <div className="flex gap-3 justify-center pt-4 border-t border-gray-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProduct(product);
                    }}
                    className="p-2.5 bg-primary-500/20 text-primary-200 border border-primary-500 hover:bg-transparent hover:border-primary-500/50 hover:text-primary-300 rounded-lg transition-colors"
                    title="Edit product"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProduct(product.id);
                    }}
                    className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-gray-700 hover:border-red-500/30"
                    title="Delete product"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
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

      {/* Create Product Modal */}
      <Modal
        isOpen={isCreateProductModalOpen}
        onClose={() => setIsCreateProductModalOpen(false)}
        title="Add New Product"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
            <Input
              value={productFormData.name}
              onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
              placeholder="e.g., Protein Powder"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={productFormData.category}
              onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select category</option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={productFormData.description}
              onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
              placeholder="Product description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
              <Input
                type="number"
                step="0.01"
                value={productFormData.price}
                onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                placeholder="0.00"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
              <Input
                type="number"
                value={productFormData.stock}
                onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
            <Input
              value={productFormData.imageUrl}
              onChange={(e) => setProductFormData({ ...productFormData, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setIsCreateProductModalOpen(false)}
            >
              Cancel
            </Button>
            <Button fullWidth onClick={handleCreateProduct}>
              Add Product
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditProductModalOpen}
        onClose={() => {
          setIsEditProductModalOpen(false);
          setEditingProduct(null);
        }}
        title="Edit Product"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
            <Input
              value={productFormData.name}
              onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
              placeholder="e.g., Protein Powder"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={productFormData.category}
              onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={productFormData.description}
              onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
              placeholder="Product description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
              <Input
                type="number"
                step="0.01"
                value={productFormData.price}
                onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                placeholder="0.00"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Stock</label>
              <Input
                type="number"
                value={productFormData.stock}
                onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
            <Input
              value={productFormData.imageUrl}
              onChange={(e) => setProductFormData({ ...productFormData, imageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setIsEditProductModalOpen(false);
                setEditingProduct(null);
              }}
            >
              Cancel
            </Button>
            <Button fullWidth onClick={handleUpdateProduct}>
              Update Product
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Product Confirmation Modal */}
      <Modal
        isOpen={isDeleteProductModalOpen}
        onClose={() => {
          setIsDeleteProductModalOpen(false);
          setDeletingProduct(null);
        }}
        title="Delete Product"
        size="md"
      >
        {deletingProduct && (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 font-semibold mb-2">Warning: This action cannot be undone</p>
              <p className="text-gray-300 text-sm">
                Are you sure you want to delete <span className="font-semibold text-white">{deletingProduct.name}</span>?
              </p>
              {deletingProduct.stock > 0 && (
                <p className="text-yellow-400 text-sm mt-2">
                  This product has {deletingProduct.stock} {deletingProduct.stock === 1 ? 'item' : 'items'} in stock.
                </p>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setIsDeleteProductModalOpen(false);
                  setDeletingProduct(null);
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={confirmDeleteProduct}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete Product
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

