export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  subscription: {
    plan: 'basic' | 'pro' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled';
    startDate: Date;
    endDate: Date;
  };
}

export interface ProcessedDocument {
  _id?: string;
  userId: string;
  name: string;
  content: string;
  status: 'pending' | 'processing' | 'completed';
  createdAt: Date;
  processedAt?: Date;
  result?: {
    summary?: string;
    entities?: string[];
    sentiment?: string;
  };
}

export interface SubscriptionPlan {
  name: string;
  price: number;
  priceId: string;
  features: string[];
  description: string;
} 