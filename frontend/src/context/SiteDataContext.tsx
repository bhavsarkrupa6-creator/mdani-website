import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';
import { ContactInfo, SiteContent, Category } from '../types';

interface SiteDataContextType {
  contactInfo: ContactInfo | null;
  siteContent: SiteContent | null;
  categories: Category[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export const SiteDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    try {
      const [contactRes, contentRes, categoriesRes] = await Promise.all([
        api.get('/site/contact-info'),
        api.get('/site/content'),
        api.get('/categories'),
      ]);
      setContactInfo(contactRes.data.contactInfo);
      setSiteContent(contentRes.data.content);
      setCategories(categoriesRes.data.categories || []);
    } catch (err) {
      console.error('Failed to load site data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <SiteDataContext.Provider value={{ contactInfo, siteContent, categories, loading, refresh: fetchAll }}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = (): SiteDataContextType => {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error('useSiteData must be used within SiteDataProvider');
  return ctx;
};
