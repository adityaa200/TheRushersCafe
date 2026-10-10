'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Flame, Leaf, Star, Plus, SlidersHorizontal } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/whatsapp';
import type { MenuItem, MenuCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MenuSectionProps {
  items: MenuItem[];
  categories: MenuCategory[];
}

type SortOption = 'popular' | 'price-asc' | 'price-desc';

export function MenuSection({ items, categories }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const { addItem } = useCart();

  const filteredItems = useMemo(() => {
    let result = items;
    if (activeCategory !== 'ALL') {
      result = result.filter((item) => item.category_name === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else {
      result = [...result].sort((a, b) => Number(b.is_bestseller) - Number(a.is_bestseller));
    }
    return result;
  }, [items, activeCategory, searchQuery, sortBy]);

  const allCategories = ['ALL', ...categories.map((c) => c.name)];

  const handleAdd = (item: MenuItem) => {
    addItem(item);
    toast.success(`${item.name} added to order`);
  };

  return (
    <section id="menu" className="relative bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-xs font-medium tracking-[0.3em] text-gold">OUR MENU</p>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            A SYMPHONY OF FLAVORS
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Every dish is crafted with the finest ingredients and a touch of soul.
          </p>
        </motion.div>

        {/* Search + Sort */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-none border border-border bg-secondary/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-none border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
            >
              <option value="popular">Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-10 flex flex-wrap gap-2">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-none border px-4 py-2 text-xs font-medium tracking-widest transition-all',
                activeCategory === cat
                  ? 'border-gold bg-gold text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-gold hover:text-gold'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredItems.map((item) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative flex flex-col overflow-hidden border border-border bg-card transition-colors hover:border-gold/50"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                  {/* Badges */}
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    {item.is_bestseller && (
                      <span className="flex items-center gap-1 bg-gold px-2 py-1 text-[10px] font-bold tracking-wider text-primary-foreground">
                        <Star className="h-3 w-3 fill-current" /> BESTSELLER
                      </span>
                    )}
                    {item.is_spicy && (
                      <span className="flex items-center gap-1 bg-destructive/90 px-2 py-1 text-[10px] font-bold tracking-wider text-destructive-foreground">
                        <Flame className="h-3 w-3" /> SPICY
                      </span>
                    )}
                  </div>
                  {/* Veg indicator */}
                  <div className="absolute right-3 top-3">
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center border-2',
                        item.is_vegetarian
                          ? 'border-green-600'
                          : 'border-red-600'
                      )}
                    >
                      {item.is_vegetarian ? (
                        <Leaf className="h-3 w-3 text-green-600" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-red-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {item.name}
                  </h3>
                  <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-serif text-xl font-bold text-gold">
                      {formatPrice(item.price)}
                    </span>
                    <button
                      onClick={() => handleAdd(item)}
                      className="flex items-center gap-1.5 border border-border px-3 py-2 text-xs font-semibold tracking-wider text-foreground transition-all hover:border-gold hover:bg-gold hover:text-primary-foreground"
                    >
                      <Plus className="h-3.5 w-3.5" /> ADD
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-serif text-xl text-muted-foreground">No dishes found</p>
            <p className="mt-2 text-sm text-muted-foreground">Try a different category or search term.</p>
          </div>
        )}
      </div>
    </section>
  );
}
