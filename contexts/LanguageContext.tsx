'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'th' | 'en' | 'zh';

interface Translations {
  [key: string]: {
    th: string;
    en: string;
    zh: string;
  };
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Translations;
}

const translations: Translations = {
  // Auth
  'login.title': {
    th: 'เข้าสู่ระบบ',
    en: 'Login',
    zh: '登录',
  },
  'login.phone': {
    th: 'หมายเลขโทรศัพท์',
    en: 'Phone Number',
    zh: '电话号码',
  },
  'login.send_otp': {
    th: 'ส่งรหัส OTP',
    en: 'Send OTP',
    zh: '发送验证码',
  },
  'otp.title': {
    th: 'ยืนยันรหัส OTP',
    en: 'Verify OTP',
    zh: '验证码确认',
  },
  'otp.enter_code': {
    th: 'กรุณากรอกรหัส 6 หลักที่ส่งไปยัง',
    en: 'Enter the 6-digit code sent to',
    zh: '请输入发送至的6位验证码',
  },
  'otp.verify': {
    th: 'ยืนยัน',
    en: 'Verify',
    zh: '确认',
  },
  'otp.resend': {
    th: 'ส่งรหัสใหม่',
    en: 'Resend Code',
    zh: '重新发送',
  },
  'pin.set_title': {
    th: 'ตั้งรหัส PIN',
    en: 'Set PIN',
    zh: '设置PIN码',
  },
  'pin.enter_title': {
    th: 'กรอกรหัส PIN',
    en: 'Enter PIN',
    zh: '输入PIN码',
  },
  // Products
  'products.title': {
    th: 'ผลิตภัณฑ์',
    en: 'Products',
    zh: '产品',
  },
  'products.add_to_cart': {
    th: 'เพิ่มลงตะกร้า',
    en: 'Add to Cart',
    zh: '加入购物车',
  },
  'products.out_of_stock': {
    th: 'สินค้าหมด',
    en: 'Out of Stock',
    zh: '缺货',
  },
  // Cart
  'cart.title': {
    th: 'ตะกร้าสินค้า',
    en: 'Shopping Cart',
    zh: '购物车',
  },
  'cart.checkout': {
    th: 'ชำระเงิน',
    en: 'Checkout',
    zh: '结账',
  },
  'cart.empty': {
    th: 'ตะกร้าสินค้าว่างเปล่า',
    en: 'Cart is empty',
    zh: '购物车是空的',
  },
  // Orders
  'orders.title': {
    th: 'คำสั่งซื้อ',
    en: 'Orders',
    zh: '订单',
  },
  'orders.pending': {
    th: 'รอดำเนินการ',
    en: 'Pending',
    zh: '待处理',
  },
  'orders.processing': {
    th: 'กำลังดำเนินการ',
    en: 'Processing',
    zh: '处理中',
  },
  'orders.completed': {
    th: 'เสร็จสิ้น',
    en: 'Completed',
    zh: '已完成',
  },
  // Profile
  'profile.title': {
    th: 'โปรไฟล์',
    en: 'Profile',
    zh: '个人资料',
  },
  'profile.logout': {
    th: 'ออกจากระบบ',
    en: 'Logout',
    zh: '退出登录',
  },
  // Common
  'common.cancel': {
    th: 'ยกเลิก',
    en: 'Cancel',
    zh: '取消',
  },
  'common.save': {
    th: 'บันทึก',
    en: 'Save',
    zh: '保存',
  },
  'common.delete': {
    th: 'ลบ',
    en: 'Delete',
    zh: '删除',
  },
  'common.edit': {
    th: 'แก้ไข',
    en: 'Edit',
    zh: '编辑',
  },
  'common.search': {
    th: 'ค้นหา',
    en: 'Search',
    zh: '搜索',
  },
  'common.loading': {
    th: 'กำลังโหลด...',
    en: 'Loading...',
    zh: '加载中...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'zinco_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('th');

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    if (stored && ['th', 'en', 'zh'].includes(stored)) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
