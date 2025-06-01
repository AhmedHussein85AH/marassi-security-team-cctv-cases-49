import { useState, useEffect } from 'react';
import { lostAndFoundService, LostAndFoundItem } from '@/services/lostAndFoundService';
import { toast } from 'sonner';

export const useLostAndFound = () => {
  const [items, setItems] = useState<LostAndFoundItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const fetchItems = async (status?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = status 
        ? await lostAndFoundService.getItemsByStatus(status)
        : await lostAndFoundService.getAllItems();
      setItems(data);
    } catch (err) {
      setError('حدث خطأ أثناء جلب البيانات');
      toast.error('حدث خطأ أثناء جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<LostAndFoundItem, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newItem = await lostAndFoundService.addItem(item);
      setItems(prev => [...prev, newItem]);
      toast.success('تمت إضافة العنصر بنجاح');
      return newItem;
    } catch (err) {
      setError('حدث خطأ أثناء إضافة العنصر');
      toast.error('حدث خطأ أثناء إضافة العنصر');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: string, item: Partial<LostAndFoundItem>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedItem = await lostAndFoundService.updateItem(id, item);
      setItems(prev => prev.map(i => i.id === id ? updatedItem : i));
      toast.success('تم تحديث العنصر بنجاح');
      return updatedItem;
    } catch (err) {
      setError('حدث خطأ أثناء تحديث العنصر');
      toast.error('حدث خطأ أثناء تحديث العنصر');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItems = async (ids: string[]) => {
    try {
      setLoading(true);
      setError(null);
      await lostAndFoundService.deleteItems(ids);
      setItems(prev => prev.filter(item => !ids.includes(item.id)));
      setSelectedItems([]);
      toast.success('تم حذف العناصر بنجاح');
    } catch (err) {
      setError('حدث خطأ أثناء حذف العناصر');
      toast.error('حدث خطأ أثناء حذف العناصر');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportItems = async (status?: string) => {
    try {
      setLoading(true);
      setError(null);
      const blob = await lostAndFoundService.exportItems(status);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lost-and-found-${status || 'all'}-${new Date().toISOString()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('تم تصدير البيانات بنجاح');
    } catch (err) {
      setError('حدث خطأ أثناء تصدير البيانات');
      toast.error('حدث خطأ أثناء تصدير البيانات');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(items.map(item => item.id));
  };

  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    error,
    selectedItems,
    fetchItems,
    addItem,
    updateItem,
    deleteItems,
    exportItems,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
  };
}; 