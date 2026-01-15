
import { createClient } from '@supabase/supabase-js';

/**
 * CONFIGURAÇÃO OFICIAL SUPABASE - BIRIBAR DRINK'S
 */
const SUPABASE_URL = 'https://lhxxpiktgtbeowflqzzj.supabase.co'; 
const SUPABASE_ANON_KEY: string = 'sb_publishable_rIZn2texoXNYTd1X4Z0aWw_HykPoBCb';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface PricingConfig {
  baseAlcohol: number;
  baseNonAlcohol: number;
  baseMisto: number;
  extraHourMultiplier: number;
  specialDrinkFee: number;
  premiumLabelFee: number;
  counterFixedFee: number;
  glasswareFixedFee: number;
  staffHourlyRate: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: 'un' | 'kg' | 'l';
  packageSize: number;
  cost: number;
}

export interface DrinkIngredient {
  inventoryItemId: string;
  amount: number;
}

export type DrinkCategory = 'Drink Especial' | 'Caipi Frutas' | 'Frozen';

export interface Drink {
  id: string;
  name: string;
  category: DrinkCategory;
  ingredients: DrinkIngredient[];
  isSpecial?: boolean;
  canBeNonAlcoholic?: boolean;
  image?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
}

export interface Service {
  id: string;
  iconName: string;
  title: string;
  description: string;
  image: string;
}

export interface AboutContent {
  history: string;
  mission: string;
  vision: string;
  values: string[];
}

export interface Lead {
  id: number;
  name: string;
  phone: string;
  guests: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  planType: string;
  total: number;
  status: 'Pendente' | 'Aprovado' | 'Arquivado';
  caipiFlavors: string[];
  frozenFlavors: string[];
  specialDrinks: any[];
  cupType: 'standard' | 'glass';
  glassQuantity?: number;
}

export interface AppData {
  pricing: PricingConfig;
  inventory: InventoryItem[];
  drinks: Drink[];
  leads: Lead[];
  caipiFlavors: string[];
  frozenFlavors: string[];
  gallery: string[];
  testimonials: Testimonial[];
  services: Service[];
  about: AboutContent;
  instagramHandle?: string;
  lastIgSync?: string;
}

export const db = {
  async signIn(email: string, pass: string) {
    return await supabase.auth.signInWithPassword({ email: email, password: pass });
  },

  async signOut() {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    } catch (e) {
      console.error("Erro no signOut:", e);
    }
  },

  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  async get(): Promise<AppData> {
    try {
      const [settingsRes, leadsRes, inventoryRes, drinksRes] = await Promise.all([
        supabase.from('site_settings').select('*'),
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('inventory').select('*'),
        supabase.from('drinks').select('*')
      ]);

      const settings = settingsRes.data;
      const getSetting = (key: string) => settings?.find(s => s.key === key)?.value;

      return {
        pricing: getSetting('pricing') || { baseAlcohol: 65, baseNonAlcohol: 45, baseMisto: 55, extraHourMultiplier: 0.15, specialDrinkFee: 5, premiumLabelFee: 18, counterFixedFee: 100, glasswareFixedFee: 2.5, staffHourlyRate: 35 },
        about: getSetting('about') || { history: '', mission: '', vision: '', values: [] },
        gallery: getSetting('gallery') || [],
        caipiFlavors: getSetting('caipi_flavors') || [],
        frozenFlavors: getSetting('frozen_flavors') || [],
        testimonials: getSetting('testimonials') || [],
        services: getSetting('services') || [],
        instagramHandle: getSetting('instagram_handle') || 'biribardrinks',
        lastIgSync: getSetting('last_ig_sync') || '',
        leads: leadsRes.data || [],
        inventory: inventoryRes.data || [],
        drinks: drinksRes.data || []
      };
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      return { pricing: { baseAlcohol: 65, baseNonAlcohol: 45, baseMisto: 55, extraHourMultiplier: 0.15, specialDrinkFee: 5, premiumLabelFee: 18, counterFixedFee: 100, glasswareFixedFee: 2.5, staffHourlyRate: 35 }, about: { history: '', mission: '', vision: '', values: [] }, gallery: [], caipiFlavors: [], frozenFlavors: [], testimonials: [], services: [], leads: [], inventory: [], drinks: [] };
    }
  },

  async updatePricing(newPricing: PricingConfig) {
    await supabase.from('site_settings').upsert({ key: 'pricing', value: newPricing });
  },

  async updateQuoteConfig(updates: Partial<Pick<AppData, 'caipiFlavors' | 'frozenFlavors'>>) {
    for (const [key, value] of Object.entries(updates)) {
      const dbKey = key === 'caipiFlavors' ? 'caipi_flavors' : 'frozen_flavors';
      await supabase.from('site_settings').upsert({ key: dbKey, value });
    }
  },

  async updateDrinks(newDrinks: Drink[]) {
    for (const drink of newDrinks) {
      await supabase.from('drinks').upsert(drink);
    }
  },

  async deleteDrink(id: string) {
    await supabase.from('drinks').delete().eq('id', id);
  },

  async addInventoryItem(item: InventoryItem) {
    await supabase.from('inventory').insert(item);
  },

  async updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
    await supabase.from('inventory').update(updates).eq('id', id);
  },

  async deleteInventoryItem(id: string) {
    await supabase.from('inventory').delete().eq('id', id);
  },

  async addLead(lead: any) {
    const dbLead = {
      name: lead.name,
      phone: lead.phone,
      guests: parseInt(lead.guests),
      location: lead.location,
      event_date: lead.date,
      event_time: lead.time,
      duration: parseInt(lead.duration),
      plan_type: lead.planType,
      total: lead.total,
      status: 'Pendente',
      caipi_flavors: lead.caipiFlavors,
      frozen_flavors: lead.frozenFlavors,
      special_drinks: lead.specialDrinks,
      cup_type: lead.cupType,
      glass_quantity: parseInt(lead.glassQuantity) || null
    };
    await supabase.from('leads').insert(dbLead);
  },

  async updateLeadStatus(id: number, status: Lead['status']) {
    await supabase.from('leads').update({ status }).eq('id', id);
  },

  async deleteLead(id: number) {
    await supabase.from('leads').delete().eq('id', id);
  },

  async updateGallery(images: string[]) {
    await supabase.from('site_settings').upsert({ key: 'gallery', value: images });
  },

  async updateInstagramSettings(handle: string, lastSync?: string) {
    await supabase.from('site_settings').upsert({ key: 'instagram_handle', value: handle });
    if (lastSync) {
      await supabase.from('site_settings').upsert({ key: 'last_ig_sync', value: lastSync });
    }
  },

  async updateTestimonials(testimonials: Testimonial[]) {
    await supabase.from('site_settings').upsert({ key: 'testimonials', value: testimonials });
  },

  async updateServices(services: Service[]) {
    await supabase.from('site_settings').upsert({ key: 'services', value: services });
  },

  async updateAbout(about: AboutContent) {
    await supabase.from('site_settings').upsert({ key: 'about', value: about });
  }
};
