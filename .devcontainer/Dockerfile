FROM mcr.microsoft.com/devcontainers/javascript-node:1-18-bookworm

# Install necessary tools
RUN apt-get update && apt-get install -y curl gnupg lsb-release

# Install GitHub CLI
RUN curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
    && apt-get update \
    && apt-get install -y gh

# Download and install Supabase CLI
RUN curl -L -o supabase.deb "https://github.com/supabase/cli/releases/download/v1.191.3/supabase_1.191.3_linux_amd64.deb" \
    && dpkg -i supabase.deb \
    && rm supabase.deb

# Install Deno
ENV DENO_INSTALL=/deno
RUN mkdir -p /deno \
    && curl -fsSL https://deno.land/x/install/install.sh | sh \
    && chown -R node:node /deno

ENV PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=${DENO_INSTALL}/.cache/deno

# Clean up
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Switch to non-root user
USER node

# Set up workspace directory
WORKDIR /workspace/supabase-project

# Expose ports for Next.js and Supabase
EXPOSE 3000 54321

# The command will be overridden by docker-compose
CMD ["sleep", "infinity"]