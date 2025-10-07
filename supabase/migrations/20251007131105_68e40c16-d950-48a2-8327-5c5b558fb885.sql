-- Create storage bucket for fashion images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'fashion-uploads',
  'fashion-uploads',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Storage policies for fashion uploads
CREATE POLICY "Anyone can view fashion uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'fashion-uploads');

CREATE POLICY "Authenticated users can upload fashion images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'fashion-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own uploads"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'fashion-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own uploads"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'fashion-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create uploaded_images table
CREATE TABLE public.uploaded_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  analysis_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.uploaded_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own uploads"
ON public.uploaded_images FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own uploads"
ON public.uploaded_images FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploads"
ON public.uploaded_images FOR DELETE
USING (auth.uid() = user_id);

-- Create identified_items table (AI analysis results)
CREATE TABLE public.identified_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID NOT NULL REFERENCES public.uploaded_images(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  item_name TEXT,
  category TEXT,
  description TEXT,
  color TEXT,
  style TEXT,
  ai_confidence DECIMAL,
  product_matches JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.identified_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their identified items"
ON public.identified_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert identified items"
ON public.identified_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create custom_designs table
CREATE TABLE public.custom_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  original_item_id UUID REFERENCES public.identified_items(id) ON DELETE SET NULL,
  customization_prompt TEXT NOT NULL,
  custom_image_url TEXT,
  modifications JSONB,
  fabric_preference TEXT,
  measurements JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.custom_designs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their custom designs"
ON public.custom_designs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create custom designs"
ON public.custom_designs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their custom designs"
ON public.custom_designs FOR UPDATE
USING (auth.uid() = user_id);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  item_id UUID REFERENCES public.identified_items(id) ON DELETE SET NULL,
  custom_design_id UUID REFERENCES public.custom_designs(id) ON DELETE SET NULL,
  order_type TEXT NOT NULL,
  measurements JSONB,
  fabric_preference TEXT,
  shipping_address JSONB,
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders"
ON public.orders FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create update trigger for profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();