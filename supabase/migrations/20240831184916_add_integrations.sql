-- Create integrations table
CREATE TABLE public.integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    version VARCHAR(50) NOT NULL,
    is_installed BOOLEAN DEFAULT false,
    documentation_url TEXT,
    provider VARCHAR(50) NOT NULL,
    client_id TEXT,
    client_secret TEXT,
    tenant_id TEXT,
    scopes TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Create index on user_id for faster queries
CREATE INDEX idx_integrations_user_id ON public.integrations(user_id);

-- Create index on provider for faster queries
CREATE INDEX idx_integrations_provider ON public.integrations(provider);

-- Add RLS (Row Level Security) policy
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own integrations
CREATE POLICY "Users can view own integrations" ON public.integrations
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policy to allow users to insert their own integrations
CREATE POLICY "Users can insert own integrations" ON public.integrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own integrations
CREATE POLICY "Users can update own integrations" ON public.integrations
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own integrations
CREATE POLICY "Users can delete own integrations" ON public.integrations
    FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.integrations TO authenticated;

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before each update
CREATE TRIGGER update_integrations_updated_at
BEFORE UPDATE ON public.integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default integrations
INSERT INTO public.integrations (user_id, name, description, type, version, is_installed, documentation_url, provider, scopes)
VALUES 
    (NULL, 'Google', 'Integrate with Google for email, profile, and calendar access', 'Authentication', '1.0.0', false, 'https://developers.google.com/identity/protocols/oauth2', 'google', ARRAY['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/calendar']),
    (NULL, 'Microsoft Entra ID', 'Connect with Microsoft Entra ID for user authentication and calendar access', 'Authentication', '1.0.0', false, 'https://docs.microsoft.com/en-us/azure/active-directory/develop/', 'azure-ad', ARRAY['openid', 'profile', 'email', 'User.Read', 'Calendars.ReadWrite']);

-- Create a function to copy default integrations for new users
CREATE OR REPLACE FUNCTION public.copy_default_integrations_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.integrations (user_id, name, description, type, version, is_installed, documentation_url, provider, scopes)
    SELECT NEW.id, name, description, type, version, is_installed, documentation_url, provider, scopes
    FROM public.integrations
    WHERE user_id IS NULL;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function when a new user is created
CREATE TRIGGER copy_default_integrations_for_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.copy_default_integrations_for_new_user();