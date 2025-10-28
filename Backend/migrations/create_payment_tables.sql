-- ============================================
-- Payment Tables Migration
-- ============================================

-- Create payment_orders table (stores Razorpay orders)
CREATE TABLE IF NOT EXISTS payment_orders (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(255) UNIQUE NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  funding_type VARCHAR(50) NOT NULL CHECK (funding_type IN ('donation', 'reward', 'equity', 'debt')),
  payment_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create transactions table (stores successful payments)
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campaign_id INTEGER NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_id VARCHAR(255) NOT NULL,
  order_id VARCHAR(255) NOT NULL,
  funding_type VARCHAR(50) NOT NULL CHECK (funding_type IN ('donation', 'reward', 'equity', 'debt')),
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payment_orders_user_id ON payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_campaign_id ON payment_orders(campaign_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_order_id ON payment_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_campaign_id ON transactions(campaign_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_id ON transactions(payment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

-- Add backers_count column to campaigns if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='campaigns' AND column_name='backers_count') THEN
        ALTER TABLE campaigns ADD COLUMN backers_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create view for campaign statistics
CREATE OR REPLACE VIEW campaign_stats AS
SELECT 
  c.id as campaign_id,
  c.title,
  c.goal_amount,
  c.raised_amount,
  COALESCE(COUNT(DISTINCT t.user_id), 0) as total_backers,
  COALESCE(SUM(t.amount), 0) as total_raised,
  ROUND((COALESCE(SUM(t.amount), 0) / NULLIF(c.goal_amount, 0)) * 100, 2) as funding_percentage
FROM campaigns c
LEFT JOIN transactions t ON c.id = t.campaign_id AND t.status = 'completed'
GROUP BY c.id, c.title, c.goal_amount, c.raised_amount;

-- Success message
SELECT 'Payment tables created successfully!' as message;

