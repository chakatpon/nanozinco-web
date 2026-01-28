export type Language = 'th' | 'en' | 'zh';

export interface User {
  id: string;
  address?: string;
  phone: string;
  name: string;
  email?: string;
  profilePicture?: string;
  isAdmin?: boolean;
  createdAt?: string;
}

export interface Product {
  imageUrl: string | Blob | undefined;
  id: string;
  name: string;
  nameEn?: string;
  nameZh?: string;
  description: string;
  descriptionEn?: string;
  descriptionZh?: string;
  price: number;
  image?: string;
  stock: number;
  category?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  deliveryAddress?: string;
  notes?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  titleEn?: string;
  titleZh?: string;
  content: string;
  contentEn?: string;
  contentZh?: string;
  author: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  image?: string;
  tags?: string[];
}

export interface Discount {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
}

export interface Tutorial {
  id: string;
  title: string;
  titleEn?: string;
  titleZh?: string;
  description: string;
  descriptionEn?: string;
  descriptionZh?: string;
  videoUrl?: string;
  content: string;
  contentEn?: string;
  contentZh?: string;
  order: number;
}
