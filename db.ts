
// Serviço de Banco de Dados Local (LocalStorage Wrapper)

const DB_KEY = 'biribar_db_v1';

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
}

const initialData: AppData = {
  pricing: {
    baseAlcohol: 65,
    baseNonAlcohol: 45,
    baseMisto: 55,
    extraHourMultiplier: 0.15,
    specialDrinkFee: 5,
    premiumLabelFee: 18,
    counterFixedFee: 100,
    glasswareFixedFee: 2.50,
    staffHourlyRate: 35
  },
  inventory: [
    { id: 'v-absolut', name: 'Vodca Absolut', category: 'Destilado', unit: 'l', packageSize: 1, cost: 130 },
    { id: 'v-skyy', name: 'Vodka Skyy', category: 'Destilado', unit: 'l', packageSize: 1, cost: 70 },
    { id: 'v-roskoff', name: 'Vodca Roskoff', category: 'Destilado', unit: 'l', packageSize: 1, cost: 14.50 },
    { id: 'g-tanqueray', name: 'Gin Tanqueray', category: 'Destilado', unit: 'l', packageSize: 0.75, cost: 130 },
    { id: 'g-beefeater', name: 'Gin Beefeater', category: 'Destilado', unit: 'l', packageSize: 0.75, cost: 110 },
    { id: 'g-rocks', name: "Gin Rock's", category: 'Destilado', unit: 'l', packageSize: 1, cost: 40 },
    { id: 'c-sagatiba', name: 'Cachaça Sagatiba', category: 'Destilado', unit: 'l', packageSize: 0.75, cost: 65 },
    { id: 'c-tatuzinho', name: 'Cachaça Tatuzinho', category: 'Destilado', unit: 'l', packageSize: 0.6, cost: 9 },
    { id: 'r-bacardi', name: 'Rum Bacardi Prata', category: 'Destilado', unit: 'l', packageSize: 1, cost: 70 },
    { id: 'f-limao', name: 'Limão', category: 'Insumo', unit: 'kg', packageSize: 1, cost: 7 },
    { id: 'f-morango', name: 'Morango', category: 'Insumo', unit: 'kg', packageSize: 0.225, cost: 22 },
    { id: 'f-abacaxi', name: 'Abacaxi', category: 'Insumo', unit: 'un', packageSize: 1, cost: 10 },
    { id: 'i-acucar', name: 'Açúcar', category: 'Insumo', unit: 'kg', packageSize: 1, cost: 5 },
  ],
  drinks: [
    { 
      id: 'd-moscow', 
      name: 'Moscow Mule', 
      category: 'Drink Especial', 
      isSpecial: true,
      canBeNonAlcoholic: true,
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400',
      ingredients: [
        { inventoryItemId: 'v-skyy', amount: 0.05 },
        { inventoryItemId: 'f-limao', amount: 0.02 },
        { inventoryItemId: 'i-acucar', amount: 0.015 }
      ]
    },
    { 
      id: 'd-gin-tonica', 
      name: 'Gin e Tônica', 
      category: 'Drink Especial', 
      isSpecial: true,
      canBeNonAlcoholic: false,
      image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=400',
      ingredients: [
        { inventoryItemId: 'g-rocks', amount: 0.06 },
        { inventoryItemId: 'f-limao', amount: 0.02 }
      ]
    }
  ],
  leads: [],
  caipiFlavors: ['Limão', 'Morango', 'Abacaxi', 'Pitaya', 'Maracujá', 'Kiwi', 'Tangerina', 'Uva Black'],
  frozenFlavors: ['Morango', 'Abacaxi', 'Maracujá', 'Menta', 'Chiclete'],
  gallery: [
    "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&q=80&w=800",
  ],
  testimonials: [
    {
      id: 't-1',
      name: "Juliana Mendes",
      role: "Noiva",
      content: "O BiriBar superou todas as expectativas. O atendimento foi impecável e os drinks foram o comentário principal da festa. Equipe extremamente elegante!",
      image: "https://picsum.photos/seed/juli/100/100"
    },
    {
      id: 't-2',
      name: "Ricardo Santos",
      role: "Diretor de Eventos (TechCorp)",
      content: "Contratamos para o lançamento de um produto e o profissionalismo foi exemplar. Agilidade e coquetéis de altíssimo nível. Recomendo fortemente.",
      image: "https://picsum.photos/seed/rick/100/100"
    },
    {
      id: 't-3',
      name: "Beatriz Oliveira",
      role: "Aniversariante (15 anos)",
      content: "Minha festa de 15 anos foi mágica! O bar sem álcool era tão incrível quanto o tradicional. Todos os meus amigos amaram as apresentações dos bartenders.",
      image: "https://picsum.photos/seed/bea/100/100"
    }
  ],
  services: [
    {
      id: 's-1',
      iconName: 'Martini',
      title: "Cocktails Clássicos & Autorais",
      description: "Uma seleção rigorosa de ingredientes premium para criar drinks que são verdadeiras obras de arte visuais e sensoriais.",
      image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 's-2',
      iconName: 'PartyPopper',
      title: "Casamentos & Debutantes",
      description: "Serviço personalizado para momentos únicos. Estrutura elegante que se integra perfeitamente à decoração da sua festa.",
      image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 's-3',
      iconName: 'Users',
      title: "Eventos Corporativos",
      description: "Profissionalismo e agilidade para lançamentos, confraternizações e congressos. O impacto positivo que sua marca merece.",
      image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 's-4',
      iconName: 'Coffee',
      title: "Coffee & Non-Alcoholic Bar",
      description: "Drinks sofisticados sem álcool, cafés gourmets e chás gelados artesanais para garantir inclusividade e frescor.",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800"
    }
  ],
  about: {
    history: "Nascida em Breves, no coração do Marajó, a BiriBar Drink's surgiu da paixão por transformar momentos comuns em celebrações extraordinárias. O que começou como um projeto familiar focado em caipirinhas artesanais, rapidamente evoluiu para uma referência regional em mixologia premium. Com anos de estrada, consolidamos nossa identidade através do equilíbrio perfeito entre hospitalidade amazônica e técnicas internacionais de coquetelaria.",
    mission: "Proporcionar experiências sensoriais inesquecíveis através da arte da mixologia, unindo sofisticação, ingredientes de alta qualidade e um serviço de bar impecável que eleva o padrão de cada evento.",
    vision: "Ser reconhecida como a principal autoridade em serviços de Open Bar premium no Norte do país, expandindo nossas fronteiras através da inovação constante e excelência operacional.",
    values: ["Qualidade Premium", "Inovação Constante", "Sofisticação Visual", "Ética Profissional", "Satisfação do Cliente"]
  }
};

export const db = {
  get(): AppData {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      this.save(initialData);
      return initialData;
    }
    return JSON.parse(data);
  },

  save(data: AppData) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  },

  updatePricing(newPricing: PricingConfig) {
    const data = this.get();
    data.pricing = newPricing;
    this.save(data);
  },

  updateQuoteConfig(updates: Partial<Pick<AppData, 'caipiFlavors' | 'frozenFlavors'>>) {
    const data = this.get();
    Object.assign(data, updates);
    this.save(data);
  },

  updateDrinks(newDrinks: Drink[]) {
    const data = this.get();
    data.drinks = newDrinks;
    this.save(data);
  },

  deleteDrink(id: string) {
    const data = this.get();
    data.drinks = data.drinks.filter(d => d.id !== id);
    this.save(data);
  },

  addInventoryItem(item: InventoryItem) {
    const data = this.get();
    data.inventory.push(item);
    this.save(data);
  },

  updateInventoryItem(id: string, updates: Partial<InventoryItem>) {
    const data = this.get();
    data.inventory = data.inventory.map(item => item.id === id ? { ...item, ...updates } : item);
    this.save(data);
  },

  deleteInventoryItem(id: string) {
    const data = this.get();
    data.inventory = data.inventory.filter(item => item.id !== id);
    this.save(data);
  },

  addLead(lead: any) {
    const data = this.get();
    data.leads.unshift({ ...lead, id: Date.now(), status: 'Pendente' });
    this.save(data);
  },

  updateLeadStatus(id: number, status: Lead['status']) {
    const data = this.get();
    data.leads = data.leads.map(l => l.id === id ? { ...l, status } : l);
    this.save(data);
  },

  deleteLead(id: number) {
    const data = this.get();
    data.leads = data.leads.filter(l => l.id !== id);
    this.save(data);
  },

  updateGallery(images: string[]) {
    const data = this.get();
    data.gallery = images;
    this.save(data);
  },

  updateTestimonials(testimonials: Testimonial[]) {
    const data = this.get();
    data.testimonials = testimonials;
    this.save(data);
  },

  updateServices(services: Service[]) {
    const data = this.get();
    data.services = services;
    this.save(data);
  },

  updateAbout(about: AboutContent) {
    const data = this.get();
    data.about = about;
    this.save(data);
  }
};
