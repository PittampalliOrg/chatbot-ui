--------------- INTEGRATIONS ---------------

-- TABLE --

CREATE TABLE IF NOT EXISTS integrations (
    -- ID
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- REQUIRED RELATIONSHIPS
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- OPTIONAL RELATIONSHIPS
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,

    -- METADATA
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ,

    --SHARING
    sharing TEXT NOT NULL DEFAULT 'private',

    -- REQUIRED
    description TEXT NOT NULL CHECK (char_length(description) <= 500),
    name TEXT NOT NULL CHECK (char_length(name) <= 100),
    provider TEXT NOT NULL CHECK (char_length(provider) <= 100),
    config JSONB NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT false
);

-- INDEXES --

CREATE INDEX integrations_user_id_idx ON integrations(user_id);

-- RLS --

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to own integrations"
    ON integrations
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Allow view access to non-private integrations"
    ON integrations
    FOR SELECT
    USING (sharing <> 'private');

-- TRIGGERS --

CREATE TRIGGER update_integrations_updated_at
BEFORE UPDATE ON integrations
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

--------------- INTEGRATION WORKSPACES ---------------

-- TABLE --

CREATE TABLE IF NOT EXISTS integration_workspaces (
    -- REQUIRED RELATIONSHIPS
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

    PRIMARY KEY(integration_id, workspace_id),

    -- METADATA
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

-- INDEXES --

CREATE INDEX integration_workspaces_user_id_idx ON integration_workspaces(user_id);
CREATE INDEX integration_workspaces_integration_id_idx ON integration_workspaces(integration_id);
CREATE INDEX integration_workspaces_workspace_id_idx ON integration_workspaces(workspace_id);

-- RLS --

ALTER TABLE integration_workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow full access to own integration_workspaces"
    ON integration_workspaces
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- TRIGGERS --

CREATE TRIGGER update_integration_workspaces_updated_at
BEFORE UPDATE ON integration_workspaces 
FOR EACH ROW 
EXECUTE PROCEDURE update_updated_at_column();